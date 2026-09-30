import { prisma } from '../lib/prisma.js';

// Destinations, regions and activities. Only the columns the website renders are
// selected, so responses stay small and MySQL can serve them from indexes quickly.

const seo = { metaTitle: true, metaDescription: true };
const published = { isPublished: true };
const ordered = [{ sortOrder: 'asc' }, { name: 'asc' }];

const destinationSelect = { slug: true, name: true, tagline: true, description: true, image: true, ...seo };
const activitySelect = { slug: true, name: true, icon: true, description: true, image: true, ...seo };
const regionSelect = {
  slug: true,
  name: true,
  description: true,
  image: true,
  ...seo,
  destination: { select: { slug: true, name: true } },
};

// Keep the flat shape the frontend already uses: { destination: 'nepal', destinationName: 'Nepal' }
const toRegion = ({ destination, ...region }) => ({
  ...region,
  destination: destination.slug,
  destinationName: destination.name,
});

export const listDestinations = () =>
  prisma.destination.findMany({ where: published, select: destinationSelect, orderBy: ordered });

export const getDestination = (slug) =>
  prisma.destination.findFirst({ where: { slug, ...published }, select: destinationSelect });

export async function listRegions({ destination } = {}) {
  const regions = await prisma.region.findMany({
    where: { ...published, ...(destination && { destination: { slug: destination } }) },
    select: regionSelect,
    orderBy: ordered,
  });
  return regions.map(toRegion);
}

export async function getRegion(slug) {
  const region = await prisma.region.findFirst({ where: { slug, ...published }, select: regionSelect });
  return region && toRegion(region);
}

export const listActivities = () =>
  prisma.activity.findMany({ where: published, select: activitySelect, orderBy: ordered });

export const getActivity = (slug) =>
  prisma.activity.findFirst({ where: { slug, ...published }, select: activitySelect });
