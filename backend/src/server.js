import { env } from './config/env.js';
import { createApp } from './app.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Kiteice API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Keep-alive must outlive the proxy/load balancer's idle timeout to avoid 502s
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

// Finish in-flight requests and close DB connections before exiting (deploys, Ctrl+C)
let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received, shutting down…`);
  const force = setTimeout(() => process.exit(1), 10_000).unref();
  server.close(async () => {
    await prisma.$disconnect();
    clearTimeout(force);
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => console.error('Unhandled rejection:', reason));
