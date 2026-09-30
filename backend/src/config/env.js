import { z } from 'zod';

// Validate environment variables once at startup so a bad deploy fails fast
// with a clear message instead of crashing on the first request.
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().startsWith('mysql://', 'DATABASE_URL must be a mysql:// connection string'),
  DB_POOL_SIZE: z.coerce.number().int().min(1).max(100).default(10),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  CACHE_TTL_SECONDS: z.coerce.number().int().min(0).default(300),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  // Admin login tokens
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters (use a long random string)'),
  JWT_EXPIRES_IN: z.string().default('8h'),

  // Website to notify after content changes so pages update immediately
  SITE_URL: z.url().optional(),
  REVALIDATE_SECRET: z.string().min(16).optional(),

  // Image uploads
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_MB: z.coerce.number().positive().max(50).default(10),
  // External image hosts admins may link to (must also be in the website's next.config images.remotePatterns)
  IMAGE_HOSTS: z.string().default('images.unsplash.com'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  for (const issue of parsed.error.issues) console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  imageHosts: parsed.data.IMAGE_HOSTS.split(',').map((h) => h.trim().toLowerCase()).filter(Boolean),
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
};
