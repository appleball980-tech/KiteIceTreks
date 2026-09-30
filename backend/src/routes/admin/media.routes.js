import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import multer from 'multer';
import sharp from 'sharp';
import { prisma } from '../../lib/prisma.js';
import { HttpError, notFound } from '../../lib/http-error.js';
import { env } from '../../config/env.js';
import * as storage from '../../lib/storage.js';
import { validate } from '../../middleware/validate.js';
import { idParams, nullableText, optional, pageMeta, slugify } from '../schemas.js';

const MAX_WIDTH = 2400; // big enough for full-width hero images on retina screens

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    /^image\/(jpeg|png|webp|avif|gif|heic|heif|tiff)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(415, 'Only image files (JPEG, PNG, WebP, AVIF, GIF, HEIC, TIFF) can be uploaded')),
});

// Every column that stores an image URL. Used to stop deleting images that are still in use.
const IMAGE_COLUMNS = [
  ['trip', 'Trip', 'title'],
  ['post', 'Post', 'title'],
  ['destination', 'Destination', 'name'],
  ['region', 'Region', 'name'],
  ['activity', 'Activity', 'name'],
];

async function findUsages(url) {
  const results = await Promise.all(
    IMAGE_COLUMNS.map(([model, type, field]) =>
      prisma[model].findMany({ where: { image: url }, select: { id: true, [field]: true } }).then((rows) => rows.map((r) => ({ type, id: r.id, name: r[field] })))
    )
  );
  return results.flat();
}

export const adminMediaRouter = Router()
  .get(
    '/',
    validate({
      query: z.object({
        page: optional(z.coerce.number().int().min(1)).default(1),
        limit: optional(z.coerce.number().int().min(1).max(100)).default(40),
        q: optional(z.string().trim().max(100)),
      }),
    }),
    async (req, res) => {
      const { page, limit, q } = req.valid.query;
      const where = q ? { OR: [{ originalName: { contains: q } }, { alt: { contains: q } }] } : {};
      const [data, total] = await Promise.all([
        prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: (page - 1) * limit }),
        prisma.media.count({ where }),
      ]);
      res.json({ data, meta: pageMeta(page, limit, total) });
    }
  )
  // multipart/form-data with fields: file (required), alt (optional)
  .post('/', upload.single('file'), async (req, res) => {
    if (!req.file) throw new HttpError(400, 'Attach an image in the "file" field');

    // Auto-rotate from EXIF, strip metadata (incl. GPS), cap the size and convert to WebP:
    // typically 5–10x smaller than a camera JPEG with no visible quality loss.
    let output;
    try {
      output = await sharp(req.file.buffer, { failOn: 'error' })
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer({ resolveWithObject: true });
    } catch {
      throw new HttpError(400, 'The file could not be read as an image');
    }

    const now = new Date();
    const base = slugify(req.file.originalname.replace(/\.[^.]+$/, '')).slice(0, 60) || 'image';
    const key = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${base}-${randomBytes(4).toString('hex')}.webp`;
    const url = await storage.save(key, output.data);

    const media = await prisma.media.create({
      data: {
        url,
        originalName: req.file.originalname.slice(0, 255),
        mimeType: 'image/webp',
        width: output.info.width,
        height: output.info.height,
        size: output.info.size,
        alt: req.body.alt?.trim().slice(0, 255) || null,
        uploadedById: req.user.id,
      },
    });
    res.status(201).json({ data: media });
  })
  .patch('/:id', validate({ params: idParams, body: z.object({ alt: nullableText(255) }) }), async (req, res) => {
    res.json({ data: await prisma.media.update({ where: { id: req.valid.params.id }, data: req.valid.body }) });
  })
  // Refuses to delete an image that is still used, unless ?force=true
  .delete('/:id', validate({ params: idParams, query: z.object({ force: optional(z.enum(['true', 'false'])) }) }), async (req, res) => {
    const media = await prisma.media.findUnique({ where: { id: req.valid.params.id } });
    if (!media) throw notFound('Image');

    const usages = await findUsages(media.url);
    if (usages.length && req.valid.query.force !== 'true') {
      throw new HttpError(409, 'This image is still in use. Replace it first, or delete with ?force=true', usages);
    }
    await prisma.media.delete({ where: { id: media.id } });
    await storage.remove(media.url);
    res.status(204).end();
  });
