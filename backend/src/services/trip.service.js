import { prisma } from '../lib/prisma.js';

const nameAndSlug = { select: { slug: true, name: true } };

// Fields needed for a trip card (lists, grids, related trips)
const cardSelect = {
  slug: true,
  title: true,
  featured: true,
  durationDays: true,
  difficulty: true,
  maxAltitude: true,
  price: true,
  currency: true,
  image: true,
  summary: true,
  destination: nameAndSlug,
  region: nameAndSlug,
  activity: nameAndSlug,
};

// Everything for the trip detail page
const detailSelect = {
  ...cardSelect,
  groupSize: true,
  bestSeason: true,
  startEnd: true,
  accommodation: true,
  overview: true,
  highlights: true,
  includes: true,
  excludes: true,
  metaTitle: true,
  metaDescription: true,
  updatedAt: true,
  itinerary: { select: { day: true, title: true, description: true }, orderBy: { day: 'asc' } },
  faqs: { select: { question: true, answer: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
};

const orderBy = [{ featured: 'desc' }, { sortOrder: 'asc' }, { title: 'asc' }];

// Flattens relations into the shape the frontend already renders:
// { destination: 'nepal', destinationName: 'Nepal', region: 'everest', regionName: 'Everest Region', ... }
function toTrip({ destination, region, activity, price, ...trip }) {
  return {
    ...trip,
    price: Number(price),
    destination: destination.slug,
    destinationName: destination.name,
    region: region?.slug ?? null,
    regionName: region?.name ?? null,
    activity: activity.slug,
    activityName: activity.name,
  };
}

function buildWhere({ destination, region, activity, difficulty, featured, q }) {
  return {
    isPublished: true,
    ...(destination && { destination: { slug: destination } }),
    ...(region && { region: { slug: region } }),
    ...(activity && { activity: { slug: activity } }),
    ...(difficulty && { difficulty }),
    ...(featured !== undefined && { featured }),
    // MySQL's default utf8mb4 collation makes `contains` case-insensitive
    ...(q && { OR: [{ title: { contains: q } }, { summary: { contains: q } }] }),
  };
}

export async function listTrips({ page, limit, ...filters }) {
  const where = buildWhere(filters);
  const [trips, total] = await Promise.all([
    prisma.trip.findMany({ where, select: cardSelect, orderBy, take: limit, skip: (page - 1) * limit }),
    prisma.trip.count({ where }),
  ]);
  return { trips: trips.map(toTrip), total };
}

export async function getTrip(slug) {
  const trip = await prisma.trip.findFirst({ where: { slug, isPublished: true }, select: detailSelect });
  return trip && toTrip(trip);
}

// Trips in the same region or of the same activity type
export async function listRelatedTrips(slug, limit) {
  const trip = await prisma.trip.findFirst({
    where: { slug, isPublished: true },
    select: { id: true, regionId: true, activityId: true },
  });
  if (!trip) return null;

  const related = await prisma.trip.findMany({
    where: {
      isPublished: true,
      id: { not: trip.id },
      OR: [{ regionId: trip.regionId }, { activityId: trip.activityId }],
    },
    select: cardSelect,
    orderBy,
    take: limit,
  });
  return related.map(toTrip);
}
