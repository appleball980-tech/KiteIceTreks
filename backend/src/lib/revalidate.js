import { env } from '../config/env.js';
import { responseCache } from '../middleware/cache.js';

// Called after any content change in the admin API:
// 1. drops this API's in-memory response cache
// 2. tells the Next.js website to refetch (POST /api/revalidate), so edits appear
//    on the next page view instead of after the 5-minute ISR window.
export async function revalidateContent() {
  responseCache.clear();

  if (!env.SITE_URL || !env.REVALIDATE_SECRET) return;
  try {
    const res = await fetch(new URL('/api/revalidate', env.SITE_URL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': env.REVALIDATE_SECRET },
      body: JSON.stringify({ tags: ['content'] }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.warn(`Website revalidation failed: HTTP ${res.status}`);
  } catch (err) {
    // The website still refreshes on its own within 5 minutes
    console.warn(`Website revalidation failed: ${err.message}`);
  }
}

// Router middleware: after a successful write (POST/PUT/PATCH/DELETE), refresh the
// caches *before* the response is sent, so when the admin sees "Saved" the website
// already shows the change. (revalidateContent never throws and times out after 5s.)
export function revalidateOnWrite(req, res, next) {
  if (req.method === 'GET') return next();

  const end = res.end.bind(res);
  let revalidated = false;
  res.end = (...args) => {
    if (revalidated || res.statusCode >= 400) return end(...args);
    revalidated = true;
    revalidateContent().finally(() => end(...args));
    return res;
  };
  next();
}
