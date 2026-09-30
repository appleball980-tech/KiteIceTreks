import { z } from 'zod';
import { crudRouter } from './crud.js';
import { imageUrl, nullableText, slug } from '../schemas.js';

const common = {
  slug: slug.optional(),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(5000),
  image: imageUrl,
  metaTitle: nullableText(160),
  metaDescription: nullableText(320),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
};
const ordered = [{ sortOrder: 'asc' }, { name: 'asc' }];

export const adminDestinationsRouter = crudRouter({
  model: 'destination',
  label: 'Destination',
  slugFrom: 'name',
  orderBy: ordered,
  createSchema: z.object({ ...common, tagline: nullableText(255) }),
  include: { _count: { select: { trips: true, regions: true } } },
});

export const adminRegionsRouter = crudRouter({
  model: 'region',
  label: 'Region',
  slugFrom: 'name',
  orderBy: ordered,
  createSchema: z.object({ ...common, destinationId: z.number().int().positive() }),
  include: { destination: { select: { id: true, slug: true, name: true } }, _count: { select: { trips: true } } },
});

export const adminActivitiesRouter = crudRouter({
  model: 'activity',
  label: 'Activity',
  slugFrom: 'name',
  orderBy: ordered,
  createSchema: z.object({ ...common, icon: nullableText(16) }),
  include: { _count: { select: { trips: true } } },
});

export const adminTestimonialsRouter = crudRouter({
  model: 'testimonial',
  label: 'Testimonial',
  searchFields: ['name', 'quote', 'tripName'],
  orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  createSchema: z.object({
    name: z.string().trim().min(1).max(120),
    country: nullableText(80),
    tripName: nullableText(200),
    tripId: z.number().int().positive().nullable().optional(),
    rating: z.number().int().min(1).max(5).optional(),
    quote: z.string().trim().min(1).max(3000),
    sortOrder: z.number().int().optional(),
    isPublished: z.boolean().optional(),
  }),
  include: { trip: { select: { id: true, slug: true, title: true } } },
});
