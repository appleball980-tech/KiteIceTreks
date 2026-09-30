import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';

// Called by the backend after content is edited in the admin, so pages show the
// change on the next visit instead of waiting for the 5-minute refresh.
//   POST /api/revalidate  { "tags": ["content"] }  with header x-revalidate-secret

const ALLOWED_TAGS = /^(content|settings|trips|destinations|regions|activities|posts|testimonials|trip:[a-z0-9-]+|post:[a-z0-9-]+)$/;

function isAuthorized(request) {
  const expected = process.env.REVALIDATE_SECRET;
  const given = request.headers.get('x-revalidate-secret') ?? '';
  if (!expected || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

export async function POST(request) {
  if (!isAuthorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { tags } = await request.json().catch(() => ({}));
  const valid = Array.isArray(tags) ? tags.filter((t) => typeof t === 'string' && ALLOWED_TAGS.test(t)) : [];
  if (!valid.length) return Response.json({ error: 'Provide tags to revalidate' }, { status: 400 });

  // expire: 0 -> the next visitor gets fresh data instead of the stale copy
  for (const tag of valid) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: valid, now: Date.now() });
}
