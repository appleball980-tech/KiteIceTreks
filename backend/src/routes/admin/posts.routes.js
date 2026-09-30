import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { notFound } from '../../lib/http-error.js';
import { validate } from '../../middleware/validate.js';
import { adminListQuery, idParams, imageUrl, nullableText, pageMeta, slug, slugify } from '../schemas.js';

const postSchema = z.object({
  slug: slug.optional(),
  title: z.string().trim().min(1).max(255),
  excerpt: z.string().trim().min(1).max(1000),
  image: imageUrl,
  author: z.string().trim().min(1).max(120),
  sections: z
    .array(z.object({ heading: z.string().trim().max(255), paragraphs: z.array(z.string().trim().min(1).max(10000)).max(50) }))
    .min(1)
    .max(50),
  tags: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  metaTitle: nullableText(160),
  metaDescription: nullableText(320),
  isPublished: z.boolean().optional(),
  // A future date schedules the post
  publishedAt: z.coerce.date(),
});

const include = { tags: { select: { id: true, slug: true, name: true } } };

// Tag names -> connectOrCreate by slug; `set: []` first on update so removed tags are unlinked
const tagsData = (tags, isUpdate) =>
  tags && {
    tags: {
      ...(isUpdate && { set: [] }),
      connectOrCreate: [...new Map(tags.map((name) => [slugify(name), name])).entries()].map(([tagSlug, name]) => ({
        where: { slug: tagSlug },
        create: { slug: tagSlug, name },
      })),
    },
  };

export const adminPostsRouter = Router()
  .get('/', validate({ query: adminListQuery }), async (req, res) => {
    const { page, limit, q, published } = req.valid.query;
    const where = {
      ...(published !== undefined && { isPublished: published }),
      ...(q && { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] }),
    };
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: { id: true, slug: true, title: true, image: true, author: true, isPublished: true, publishedAt: true, updatedAt: true, ...include },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.post.count({ where }),
    ]);
    res.json({ data: posts, meta: pageMeta(page, limit, total) });
  })
  .get('/:id', validate({ params: idParams }), async (req, res) => {
    const post = await prisma.post.findUnique({ where: { id: req.valid.params.id }, include });
    if (!post) throw notFound('Post');
    res.json({ data: post });
  })
  .post('/', validate({ body: postSchema }), async (req, res) => {
    const { tags, ...fields } = req.valid.body;
    const post = await prisma.post.create({
      data: { ...fields, slug: fields.slug || slugify(fields.title), ...tagsData(tags, false) },
      include,
    });
    res.status(201).json({ data: post });
  })
  .patch('/:id', validate({ params: idParams, body: postSchema.partial() }), async (req, res) => {
    const { tags, ...fields } = req.valid.body;
    const post = await prisma.post.update({ where: { id: req.valid.params.id }, data: { ...fields, ...tagsData(tags, true) }, include });
    res.json({ data: post });
  })
  .delete('/:id', validate({ params: idParams }), async (req, res) => {
    await prisma.post.delete({ where: { id: req.valid.params.id } });
    res.status(204).end();
  });
