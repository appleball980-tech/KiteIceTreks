import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { notFound } from '../../lib/http-error.js';
import { validate } from '../../middleware/validate.js';
import { adminListQuery, idParams, pageMeta, slugify } from '../schemas.js';

/**
 * Standard admin CRUD endpoints for a Prisma model:
 *   GET    /       list (paginated, ?q= search, ?published=)
 *   GET    /:id    one record
 *   POST   /       create
 *   PATCH  /:id    partial update
 *   DELETE /:id    delete
 *
 * `slugFrom` auto-generates the slug from that field when none is given.
 */
export function crudRouter({ model, createSchema, searchFields = ['name'], slugFrom, orderBy, include, label }) {
  const db = prisma[model];
  const withSlug = (data) => (slugFrom && !data.slug && data[slugFrom] ? { ...data, slug: slugify(data[slugFrom]) } : data);

  return Router()
    .get('/', validate({ query: adminListQuery }), async (req, res) => {
      const { page, limit, q, published } = req.valid.query;
      const where = {
        ...(published !== undefined && { isPublished: published }),
        ...(q && { OR: searchFields.map((field) => ({ [field]: { contains: q } })) }),
      };
      const [data, total] = await Promise.all([
        db.findMany({ where, include, orderBy, take: limit, skip: (page - 1) * limit }),
        db.count({ where }),
      ]);
      res.json({ data, meta: pageMeta(page, limit, total) });
    })
    .get('/:id', validate({ params: idParams }), async (req, res) => {
      const record = await db.findUnique({ where: { id: req.valid.params.id }, include });
      if (!record) throw notFound(label);
      res.json({ data: record });
    })
    .post('/', validate({ body: createSchema }), async (req, res) => {
      const record = await db.create({ data: withSlug(req.valid.body), include });
      res.status(201).json({ data: record });
    })
    .patch('/:id', validate({ params: idParams, body: createSchema.partial() }), async (req, res) => {
      const record = await db.update({ where: { id: req.valid.params.id }, data: req.valid.body, include });
      res.json({ data: record });
    })
    .delete('/:id', validate({ params: idParams }), async (req, res) => {
      await db.delete({ where: { id: req.valid.params.id } });
      res.status(204).end();
    });
}
