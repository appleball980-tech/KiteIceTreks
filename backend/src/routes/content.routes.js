import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { notFound } from '../lib/http-error.js';
import { optional, pagination, slug, slugParams } from './schemas.js';
import * as content from '../services/content.service.js';

export const postsRouter = Router()
  // GET /posts?limit=3&page=1&tag=planning
  .get('/', validate({ query: z.object({ tag: optional(slug), ...pagination }) }), async (req, res) => {
    const { page, limit } = req.valid.query;
    const { posts, total } = await content.listPosts(req.valid.query);
    res.json({ data: posts, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
  })
  .get('/:slug', validate({ params: slugParams }), async (req, res) => {
    const post = await content.getPost(req.valid.params.slug);
    if (!post) throw notFound('Post');
    res.json({ data: post });
  });

export const testimonialsRouter = Router().get(
  '/',
  validate({ query: z.object({ limit: optional(z.coerce.number().int().min(1).max(50)).default(12) }) }),
  async (req, res) => {
    res.json({ data: await content.listTestimonials(req.valid.query) });
  }
);
