import { createHash } from 'node:crypto';
import { TtlCache } from '../lib/cache.js';
import { env } from '../config/env.js';

export const responseCache = new TtlCache({ ttlMs: env.CACHE_TTL_SECONDS * 1000 });

const cacheControl = `public, max-age=60, s-maxage=${env.CACHE_TTL_SECONDS}, stale-while-revalidate=${env.CACHE_TTL_SECONDS * 2}`;

// Caches successful JSON GET responses in memory (already serialized + ETagged),
// and sets Cache-Control so browsers, CDNs and Next.js can cache them too.
export function cacheResponse(req, res, next) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const hit = responseCache.get(key);
  if (hit) {
    res.set({ 'Cache-Control': cacheControl, ETag: hit.etag, 'X-Cache': 'HIT' });
    if (req.headers['if-none-match'] === hit.etag) return res.status(304).end();
    return res.type('application/json').send(hit.body);
  }

  const json = res.json.bind(res);
  res.json = (payload) => {
    if (res.statusCode === 200) {
      const body = JSON.stringify(payload);
      const etag = `W/"${createHash('sha1').update(body).digest('base64url')}"`;
      responseCache.set(key, { body, etag });
      res.set({ 'Cache-Control': cacheControl, ETag: etag, 'X-Cache': 'MISS' });
      if (req.headers['if-none-match'] === etag) return res.status(304).end();
      return res.type('application/json').send(body);
    }
    return json(payload);
  };
  next();
}
