import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { notFound } from '../../lib/http-error.js';
import { validate } from '../../middleware/validate.js';
import { DIFFICULTIES, adminListQuery, idParams, imageUrl, nullableText, optional, pageMeta, slug, slugify } from '../schemas.js';

const lines = z.array(z.string().trim().min(1).max(1000)).max(100);

const tripSchema = z.object({
  slug: slug.optional(),
  title: z.string().trim().min(1).max(200),
  destinationId: z.number().int().positive(),
  regionId: z.number().int().positive().nullable().optional(),
  activityId: z.number().int().positive(),
  featured: z.boolean().optional(),
  durationDays: z.number().int().min(1).max(365),
  difficulty: z.enum(DIFFICULTIES),
  maxAltitude: z.number().int().min(0).max(9000).nullable().optional(),
  price: z.number().min(0).max(1_000_000),
  currency: z.string().length(3).toUpperCase().optional(),
  groupSize: nullableText(40),
  bestSeason: nullableText(120),
  startEnd: nullableText(160),
  accommodation: nullableText(255),
  image: imageUrl,
  summary: z.string().trim().min(1).max(2000),
  overview: lines,
  highlights: lines,
  includes: lines,
  excludes: lines,
  metaTitle: nullableText(160),
  metaDescription: nullableText(320),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  // Replaced as a whole when provided
  itinerary: z
    .array(z.object({ day: z.number().int().min(1).max(365), title: z.string().trim().min(1).max(255), description: z.string().trim().max(5000) }))
    .max(365)
    .refine((days) => new Set(days.map((d) => d.day)).size === days.length, 'Each itinerary day number must be unique')
    .optional(),
  faqs: z.array(z.object({ question: z.string().trim().min(1).max(255), answer: z.string().trim().min(1).max(5000) })).max(100).optional(),
});

const include = {
  destination: { select: { id: true, slug: true, name: true } },
  region: { select: { id: true, slug: true, name: true } },
  activity: { select: { id: true, slug: true, name: true } },
  itinerary: { select: { day: true, title: true, description: true }, orderBy: { day: 'asc' } },
  faqs: { select: { question: true, answer: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
};

const toTrip = (trip) => ({ ...trip, price: Number(trip.price) });

// Creates or updates a trip and replaces its itinerary/FAQs in one transaction
function saveTrip(id, { itinerary, faqs, ...fields }) {
  return prisma.$transaction(async (tx) => {
    const trip = id
      ? await tx.trip.update({ where: { id }, data: fields, select: { id: true } })
      : await tx.trip.create({ data: { ...fields, slug: fields.slug || slugify(fields.title) }, select: { id: true } });

    if (itinerary) {
      await tx.itineraryDay.deleteMany({ where: { tripId: trip.id } });
      await tx.itineraryDay.createMany({ data: itinerary.map((d) => ({ ...d, tripId: trip.id })) });
    }
    if (faqs) {
      await tx.tripFaq.deleteMany({ where: { tripId: trip.id } });
      await tx.tripFaq.createMany({ data: faqs.map((f, sortOrder) => ({ ...f, sortOrder, tripId: trip.id })) });
    }
    return tx.trip.findUnique({ where: { id: trip.id }, include });
  });
}

const listQuery = adminListQuery.extend({
  destinationId: optional(z.coerce.number().int()),
  regionId: optional(z.coerce.number().int()),
  activityId: optional(z.coerce.number().int()),
  featured: optional(z.enum(['true', 'false']).transform((v) => v === 'true')),
});

export const adminTripsRouter = Router()
  .get('/', validate({ query: listQuery }), async (req, res) => {
    const { page, limit, q, published, featured, destinationId, regionId, activityId } = req.valid.query;
    const where = {
      ...(published !== undefined && { isPublished: published }),
      ...(featured !== undefined && { featured }),
      ...(destinationId && { destinationId }),
      ...(regionId && { regionId }),
      ...(activityId && { activityId }),
      ...(q && { OR: [{ title: { contains: q } }, { slug: { contains: q } }] }),
    };
    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        select: {
          id: true, slug: true, title: true, image: true, price: true, currency: true, durationDays: true, difficulty: true,
          featured: true, isPublished: true, sortOrder: true, updatedAt: true,
          destination: include.destination, region: include.region, activity: include.activity,
        },
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.trip.count({ where }),
    ]);
    res.json({ data: trips.map(toTrip), meta: pageMeta(page, limit, total) });
  })
  .get('/:id', validate({ params: idParams }), async (req, res) => {
    const trip = await prisma.trip.findUnique({ where: { id: req.valid.params.id }, include });
    if (!trip) throw notFound('Trip');
    res.json({ data: toTrip(trip) });
  })
  .post('/', validate({ body: tripSchema }), async (req, res) => {
    res.status(201).json({ data: toTrip(await saveTrip(null, req.valid.body)) });
  })
  .patch('/:id', validate({ params: idParams, body: tripSchema.partial() }), async (req, res) => {
    res.json({ data: toTrip(await saveTrip(req.valid.params.id, req.valid.body)) });
  })
  .delete('/:id', validate({ params: idParams }), async (req, res) => {
    await prisma.trip.delete({ where: { id: req.valid.params.id } });
    res.status(204).end();
  });
