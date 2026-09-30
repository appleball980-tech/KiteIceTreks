import { Router } from 'express';
import { cacheResponse } from '../middleware/cache.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { revalidateOnWrite } from '../lib/revalidate.js';
import { getSettings } from '../services/settings.service.js';
import { activitiesRouter, destinationsRouter, regionsRouter } from './catalog.routes.js';
import { tripsRouter } from './trips.routes.js';
import { postsRouter, testimonialsRouter } from './content.routes.js';
import { inquiriesRouter } from './inquiries.routes.js';
import { authRouter } from './auth.routes.js';
import { adminActivitiesRouter, adminDestinationsRouter, adminRegionsRouter, adminTestimonialsRouter } from './admin/catalog.routes.js';
import { adminTripsRouter } from './admin/trips.routes.js';
import { adminPostsRouter } from './admin/posts.routes.js';
import { adminInquiriesRouter } from './admin/inquiries.routes.js';
import { adminUsersRouter } from './admin/users.routes.js';
import { adminSettingsRouter } from './admin/settings.routes.js';
import { adminMediaRouter } from './admin/media.routes.js';
import { adminDashboardRouter } from './admin/dashboard.routes.js';

export const apiRouter = Router();

/* ---------- Public, read-only content: cached in memory + Cache-Control headers ---------- */
apiRouter.use('/destinations', cacheResponse, destinationsRouter);
apiRouter.use('/regions', cacheResponse, regionsRouter);
apiRouter.use('/activities', cacheResponse, activitiesRouter);
apiRouter.use('/trips', cacheResponse, tripsRouter);
apiRouter.use('/posts', cacheResponse, postsRouter);
apiRouter.use('/testimonials', cacheResponse, testimonialsRouter);
apiRouter.get('/settings', cacheResponse, async (_req, res) => {
  res.json({ data: await getSettings() });
});

/* ---------- Public writes ---------- */
apiRouter.use('/inquiries', inquiriesRouter);

/* ---------- Auth ---------- */
apiRouter.use('/auth', (_req, res, next) => (res.set('Cache-Control', 'no-store'), next()), authRouter);

/* ---------- Admin (login required) ---------- */
const admin = Router();
admin.use(requireAuth, (_req, res, next) => (res.set('Cache-Control', 'no-store'), next()));

admin.use('/dashboard', adminDashboardRouter);
// Content: a successful write refreshes the API cache and the website
admin.use('/destinations', revalidateOnWrite, adminDestinationsRouter);
admin.use('/regions', revalidateOnWrite, adminRegionsRouter);
admin.use('/activities', revalidateOnWrite, adminActivitiesRouter);
admin.use('/trips', revalidateOnWrite, adminTripsRouter);
admin.use('/posts', revalidateOnWrite, adminPostsRouter);
admin.use('/testimonials', revalidateOnWrite, adminTestimonialsRouter);
admin.use('/settings', revalidateOnWrite, adminSettingsRouter);
admin.use('/media', revalidateOnWrite, adminMediaRouter);
admin.use('/inquiries', adminInquiriesRouter);
// Only admins can manage dashboard users
admin.use('/users', requireRole('admin'), adminUsersRouter);

apiRouter.use('/admin', admin);
