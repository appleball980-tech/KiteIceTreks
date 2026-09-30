// Data access layer. Every page gets its data through these functions, which call
// the Express + MySQL backend in /backend. Responses are cached by Next.js and
// refreshed in the background every REVALIDATE_SECONDS (Incremental Static Regeneration),
// so visitors get static-page speed while content stays editable in the database.

import { siteConfig } from '@/config/site';

const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');
const REVALIDATE_SECONDS = 300;

// GET a JSON resource from the API. Returns `data`, or null for a 404
// (so pages can call notFound()). Every response is tagged 'content', which the
// backend revalidates (via /api/revalidate) whenever something is edited in the admin.
async function apiGet(path, { params, tags = [] } = {}) {
  const query = new URLSearchParams(Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== ''));
  const url = `${API_URL}${path}${query.size ? `?${query}` : ''}`;

  let res;
  try {
    res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: ['content', ...tags] } });
  } catch (err) {
    throw new Error(`Cannot reach the API at ${API_URL}. Is the backend running? (${err.cause?.code ?? err.message})`);
  }

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} for GET ${url}`);
  return (await res.json()).data;
}

/* ---------- Trips ---------- */

export async function getTrips({ destination, region, activity, difficulty, q } = {}) {
  return apiGet('/trips', { params: { destination, region, activity, difficulty, q }, tags: ['trips'] });
}

export async function getFeaturedTrips(limit = 6) {
  return apiGet('/trips', { params: { featured: true, limit }, tags: ['trips'] });
}

export async function getTripBySlug(slug) {
  return apiGet(`/trips/${encodeURIComponent(slug)}`, { tags: ['trips', `trip:${slug}`] });
}

export async function getRelatedTrips(trip, limit = 3) {
  return (await apiGet(`/trips/${encodeURIComponent(trip.slug)}/related`, { params: { limit }, tags: ['trips'] })) ?? [];
}

/* ---------- Categories ---------- */

export async function getDestinations() {
  return apiGet('/destinations', { tags: ['destinations'] });
}
export async function getDestinationBySlug(slug) {
  return apiGet(`/destinations/${encodeURIComponent(slug)}`, { tags: ['destinations'] });
}

export async function getRegions() {
  return apiGet('/regions', { tags: ['regions'] });
}
export async function getRegionBySlug(slug) {
  return apiGet(`/regions/${encodeURIComponent(slug)}`, { tags: ['regions'] });
}

export async function getActivities() {
  return apiGet('/activities', { tags: ['activities'] });
}
export async function getActivityBySlug(slug) {
  return apiGet(`/activities/${encodeURIComponent(slug)}`, { tags: ['activities'] });
}

/* ---------- Blog & reviews ---------- */

export async function getPosts(limit) {
  return apiGet('/posts', { params: { limit }, tags: ['posts'] });
}
export async function getPostBySlug(slug) {
  return apiGet(`/posts/${encodeURIComponent(slug)}`, { tags: ['posts', `post:${slug}`] });
}

export async function getTestimonials() {
  return apiGet('/testimonials', { tags: ['testimonials'] });
}

/* ---------- Site settings & navigation ---------- */

// Company, contact and social details edited in the admin. Values from
// src/config/site.js are the fallback for anything not set in the database.
export async function getSiteSettings() {
  const settings = (await apiGet('/settings', { tags: ['settings'] })) ?? {};
  const company = { ...pick(siteConfig, ['name', 'legalName', 'shortName', 'tagline', 'description', 'keywords']), ...settings.company };
  return {
    ...siteConfig,
    ...company,
    contact: { ...siteConfig.contact, ...settings.contact, address: { ...siteConfig.contact.address, ...settings.contact?.address } },
    social: { ...siteConfig.social, ...settings.social },
  };
}

const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));

// Main menu, built from the destinations, regions and activities in the database,
// so a new destination/region/activity appears in the menu automatically.
export async function getNavigation() {
  const [destinations, regions, activities] = await Promise.all([getDestinations(), getRegions(), getActivities()]);
  const firstHref = (items, base, fallback) => (items[0] ? `${base}/${items[0].slug}` : fallback);

  return [
    {
      label: 'Destinations',
      href: firstHref(destinations, '/destinations', '/trips'),
      children: destinations.map((d) => ({ label: d.name, href: `/destinations/${d.slug}` })),
    },
    {
      label: 'Trekking Regions',
      href: activities.some((a) => a.slug === 'trekking') ? '/activities/trekking' : firstHref(regions, '/regions', '/trips'),
      children: regions.map((r) => ({ label: r.name, href: `/regions/${r.slug}` })),
    },
    {
      label: 'Activities',
      href: '/trips',
      children: activities.map((a) => ({ label: a.name, href: `/activities/${a.slug}` })),
    },
    { label: 'Blog', href: '/blog' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ].filter((item) => !item.children || item.children.length > 0);
}
