import { absoluteUrl } from '@/lib/seo';
import { getActivities, getDestinations, getPosts, getRegions, getTrips } from '@/lib/api';

// Served at /sitemap.xml – submit this URL in Google Search Console
export default async function sitemap() {
  const [trips, destinations, regions, activities, posts] = await Promise.all([
    getTrips(),
    getDestinations(),
    getRegions(),
    getActivities(),
    getPosts(),
  ]);

  const page = (path, priority, changeFrequency = 'weekly', lastModified = new Date()) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page('/', 1, 'daily'),
    page('/trips', 0.9, 'daily'),
    ...trips.map((t) => page(`/trips/${t.slug}`, 0.9)),
    ...destinations.map((d) => page(`/destinations/${d.slug}`, 0.8)),
    ...regions.map((r) => page(`/regions/${r.slug}`, 0.8)),
    ...activities.map((a) => page(`/activities/${a.slug}`, 0.8)),
    page('/blog', 0.7, 'weekly'),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.6, 'monthly', new Date(p.updatedAt || p.publishedAt))),
    page('/about', 0.5, 'monthly'),
    page('/contact', 0.5, 'monthly'),
  ];
}
