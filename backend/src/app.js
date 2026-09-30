import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { uploadRoot } from './lib/storage.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  if (env.TRUST_PROXY) app.set('trust proxy', env.TRUST_PROXY);

  // cross-origin resource policy lets the website (another origin) display uploaded images
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: env.corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));

  // Uploaded images. File names contain a random hash and never change, so they can be cached forever.
  app.use('/uploads', express.static(uploadRoot, { immutable: true, maxAge: '1y', index: false, redirect: false }));

  // Liveness + DB readiness check for load balancers / uptime monitors
  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.set('Cache-Control', 'no-store').json({ status: 'ok', db: 'up', uptime: Math.round(process.uptime()) });
    } catch {
      res.status(503).set('Cache-Control', 'no-store').json({ status: 'error', db: 'down' });
    }
  });

  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
