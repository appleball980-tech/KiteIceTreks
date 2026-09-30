import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { notFound } from '../../lib/http-error.js';
import { validate } from '../../middleware/validate.js';
import { idParams, nullableText, optional, pageMeta } from '../schemas.js';

const STATUSES = ['new', 'contacted', 'confirmed', 'closed'];

const listQuery = z.object({
  page: optional(z.coerce.number().int().min(1)).default(1),
  limit: optional(z.coerce.number().int().min(1).max(100)).default(20),
  q: optional(z.string().trim().max(100)),
  status: optional(z.enum(STATUSES)),
  type: optional(z.enum(['booking', 'inquiry', 'custom'])),
});

const include = { trip: { select: { id: true, slug: true, title: true } } };

export const adminInquiriesRouter = Router()
  // GET /admin/inquiries?status=new&type=booking&q=john
  .get('/', validate({ query: listQuery }), async (req, res) => {
    const { page, limit, q, status, type } = req.valid.query;
    const where = {
      ...(status && { status }),
      ...(type && { type }),
      ...(q && { OR: [{ fullName: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }] }),
    };
    const [data, total] = await Promise.all([
      prisma.inquiry.findMany({ where, include, orderBy: { createdAt: 'desc' }, take: limit, skip: (page - 1) * limit }),
      prisma.inquiry.count({ where }),
    ]);
    res.json({ data, meta: pageMeta(page, limit, total) });
  })
  .get('/:id', validate({ params: idParams }), async (req, res) => {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.valid.params.id }, include });
    if (!inquiry) throw notFound('Inquiry');
    res.json({ data: inquiry });
  })
  .patch(
    '/:id',
    validate({ params: idParams, body: z.object({ status: z.enum(STATUSES).optional(), notes: nullableText(10000) }) }),
    async (req, res) => {
      const inquiry = await prisma.inquiry.update({ where: { id: req.valid.params.id }, data: req.valid.body, include });
      res.json({ data: inquiry });
    }
  )
  .delete('/:id', validate({ params: idParams }), async (req, res) => {
    await prisma.inquiry.delete({ where: { id: req.valid.params.id } });
    res.status(204).end();
  });
