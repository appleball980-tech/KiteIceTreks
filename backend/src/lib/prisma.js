import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.ts';
import { env } from '../config/env.js';

// One pooled client for the whole process. Prisma 7 talks to MySQL through the
// `mariadb` driver (fully MySQL-compatible) via this adapter.
function poolConfig(connectionString) {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: env.DB_POOL_SIZE,
    // Needed for MySQL 8's default caching_sha2_password auth over non-TLS connections
    allowPublicKeyRetrieval: true,
  };
}

export const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(poolConfig(env.DATABASE_URL)),
  log: env.isProduction ? ['error'] : ['warn', 'error'],
});
