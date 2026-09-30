import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { notFound } from '../lib/http-error.js';
import { DIFFICULTIES, optional, pagination, slug, slugParams } from './schemas.js';
import * as tripService from '../services/trip.service.js';

const listQuery = z.object({
  destination: optional(slug),
  region: optional(slug),
  activity: optional(slug),
  difficulty: optional(z.enum(DIFFICULTIES)),
  featured: optional(z.enum(['true', 'false']).transform((v) => v === 'true')),
  q: optional(z.string().trim().max(100)),
  ...pagination,
});

export const tripsRouter = Router()
  // GET /trips?destination=nepal&activity=trekking&difficulty=moderate&q=everest&featured=true&page=1&limit=12
  .get('/', validate({ query: listQuery }), async (req, res) => {
    const { page, limit } = req.valid.query;
    const { trips, total } = await tripService.listTrips(req.valid.query);
    res.json({ data: trips, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
  })
  .get('/:slug', validate({ params: slugParams }), async (req, res) => {
    const trip = await tripService.getTrip(req.valid.params.slug);
    if (!trip) throw notFound('Trip');
    res.json({ data: trip });
  })
  .get(
    '/:slug/related',
    validate({ params: slugParams, query: z.object({ limit: optional(z.coerce.number().int().min(1).max(12)).default(3) }) }),
    async (req, res) => {
      const trips = await tripService.listRelatedTrips(req.valid.params.slug, req.valid.query.limit);
      if (!trips) throw notFound('Trip');
      res.json({ data: trips });
    }
  );
