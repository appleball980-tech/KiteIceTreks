import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { notFound } from '../lib/http-error.js';
import { optional, slug, slugParams } from './schemas.js';
import * as catalog from '../services/catalog.service.js';

export const destinationsRouter = Router()
  .get('/', async (_req, res) => {
    res.json({ data: await catalog.listDestinations() });
  })
  .get('/:slug', validate({ params: slugParams }), async (req, res) => {
    const destination = await catalog.getDestination(req.valid.params.slug);
    if (!destination) throw notFound('Destination');
    res.json({ data: destination });
  });

export const regionsRouter = Router()
  .get('/', validate({ query: z.object({ destination: optional(slug) }) }), async (req, res) => {
    res.json({ data: await catalog.listRegions(req.valid.query) });
  })
  .get('/:slug', validate({ params: slugParams }), async (req, res) => {
    const region = await catalog.getRegion(req.valid.params.slug);
    if (!region) throw notFound('Region');
    res.json({ data: region });
  });

export const activitiesRouter = Router()
  .get('/', async (_req, res) => {
    res.json({ data: await catalog.listActivities() });
  })
  .get('/:slug', validate({ params: slugParams }), async (req, res) => {
    const activity = await catalog.getActivity(req.valid.params.slug);
    if (!activity) throw notFound('Activity');
    res.json({ data: activity });
  });
