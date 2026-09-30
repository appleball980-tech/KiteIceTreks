import { z } from 'zod';
import { env } from '../config/env.js';

// Treat empty strings (e.g. an unselected <select> in a GET form) as "not provided"
export const optional = (schema) => z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

export const slug = z.string().max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug');

export const slugParams = z.object({ slug });

export const pagination = {
  page: optional(z.coerce.number().int().min(1)).default(1),
  limit: optional(z.coerce.number().int().min(1).max(100)).default(100),
};

export const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'strenuous'];

export const idParams = z.object({ id: z.coerce.number().int().positive() });

export const slugify = (text) =>
  text.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 160);

// Images are either an uploaded file (/uploads/...) or an https URL on an allowed host
// (IMAGE_HOSTS). Other hosts would break the website's optimized <Image> components.
const isAllowedImageUrl = (v) => {
  if (/^\/uploads\/[\w./-]+$/.test(v) && !v.includes('..')) return true;
  try {
    const url = new URL(v);
    return url.protocol === 'https:' && env.imageHosts.includes(url.hostname);
  } catch {
    return false;
  }
};
export const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine(isAllowedImageUrl, `Upload the image, or use an https URL from: ${env.imageHosts.join(', ')}`);

export const nullableText = (max) => z.preprocess((v) => (v === '' ? null : v), z.string().trim().max(max).nullable().optional());

// Admin list query: ?page=1&limit=20&q=everest&published=true
export const adminListQuery = z.object({
  page: optional(z.coerce.number().int().min(1)).default(1),
  limit: optional(z.coerce.number().int().min(1).max(100)).default(20),
  q: optional(z.string().trim().max(100)),
  published: optional(z.enum(['true', 'false']).transform((v) => v === 'true')),
});

export const pageMeta = (page, limit, total) => ({ page, limit, total, pages: Math.ceil(total / limit) });
