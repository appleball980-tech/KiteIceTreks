# Kiteice Treks API

REST API for the Kiteice website, built with **Express 5**, **Prisma 7** and **MySQL 8+**.
The Next.js frontend (repo root) reads all trips, destinations, regions, activities, blog posts and
testimonials from here, and posts the booking/enquiry form to it.

## Getting started

Needs Node.js 22.18+ and MySQL 8+.

```bash
cd backend
cp .env.example .env          # then set DATABASE_URL
npm install                   # also generates the Prisma client
npm run db:deploy             # create the tables
npm run db:seed               # load the starter content
npm run admin:create -- --email you@example.com --name "Your Name"   # asks for a password
npm run dev                   # http://localhost:4000 (restarts on file changes)
```

Then in the repo root, set `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1` and the same
`REVALIDATE_SECRET` as the backend in `.env.local` (see `/.env.example`), and run `npm run dev` for the website.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `npm start` | Run the API (dev mode watches files) |
| `npm run db:migrate` | After editing `prisma/schema.prisma`: create + apply a new migration |
| `npm run db:deploy` | Apply pending migrations (use this in production) |
| `npm run db:seed` | Upsert starter content from `prisma/seed-data.json` (safe to re-run) |
| `npm run db:reset` | Drop everything, re-migrate and re-seed (dev only!) |
| `npm run db:studio` | Open Prisma Studio, a browser UI to edit the data |
| `npm run admin:create -- --email … --name … [--role editor]` | Create a dashboard user, or reset their password |

## Endpoints

All responses are JSON shaped as `{ "data": ... }` (lists that paginate also include `meta`).
Errors are `{ "error": { "message", "details?" } }`.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | Liveness + database check |
| GET | `/api/v1/destinations` · `/destinations/:slug` | |
| GET | `/api/v1/regions?destination=` · `/regions/:slug` | |
| GET | `/api/v1/activities` · `/activities/:slug` | |
| GET | `/api/v1/trips` | Filters: `destination`, `region`, `activity`, `difficulty`, `featured`, `q`, `page`, `limit` (≤100) |
| GET | `/api/v1/trips/:slug` | Full trip incl. itinerary and FAQs |
| GET | `/api/v1/trips/:slug/related?limit=3` | Same region or activity |
| GET | `/api/v1/posts?limit=&page=&tag=` · `/posts/:slug` | Only published posts whose `publishedAt` has passed |
| GET | `/api/v1/testimonials?limit=` | |
| GET | `/api/v1/settings` | Company, contact and social details |
| POST | `/api/v1/inquiries` | Booking/enquiry form. Rate limited to 10 per 15 min per IP |

### Admin API (login required)

Log in with `POST /api/v1/auth/login` `{ email, password }`. The response has a `token`; send it as
`Authorization: Bearer <token>` on every admin request. Tokens last `JWT_EXPIRES_IN` (default 8h).

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/v1/auth/login` | 10 failed attempts per 15 min per IP |
| GET | `/api/v1/auth/me` | Current user |
| PATCH | `/api/v1/auth/me/password` | `{ currentPassword, newPassword }`, returns a new token and logs out other sessions |
| GET | `/api/v1/admin/dashboard` | Counts + latest enquiries |
| GET · POST | `/api/v1/admin/{trips,posts,destinations,regions,activities,testimonials}` | List (`?page&limit&q&published`) / create |
| GET · PATCH · DELETE | `/api/v1/admin/{…}/:id` | Read / partial update / delete |
| GET · PATCH · DELETE | `/api/v1/admin/inquiries[/:id]` | Filter `?status&type&q`; PATCH `{ status, notes }` |
| GET · PUT | `/api/v1/admin/settings[/:key]` | Keys: `company`, `contact`, `social` |
| GET · POST | `/api/v1/admin/media` | Upload: `multipart/form-data` with `file` (+ optional `alt`) |
| PATCH · DELETE | `/api/v1/admin/media/:id` | Delete refuses images still in use unless `?force=true` |
| GET · POST · PATCH · DELETE | `/api/v1/admin/users[/:id]` | **admin role only** |

Notes:
- **Roles.** `admin` can do everything; `editor` can do everything except manage users.
  Deactivating a user or changing their password or role logs them out immediately.
- **Slugs.** When creating, `slug` is optional and is generated from the name/title.
- **Trips.** Send `itinerary: [{ day, title, description }]` and `faqs: [{ question, answer }]` with the trip.
  When included in a PATCH, they replace the existing list; when left out, they are unchanged.
  `destinationId`, `regionId` and `activityId` come from the admin list endpoints.
- **Posts.** `tags` is a list of names (created automatically). A future `publishedAt` schedules the post.
- **Images.** Upload first, then put the returned `url` (e.g. `/uploads/2026/09/everest-3f9a1c2b.webp`)
  in any `image` field. Uploads are auto-rotated, stripped of metadata (incl. GPS), resized to max 2400px
  and converted to WebP. `https://` URLs are also accepted from the hosts in `IMAGE_HOSTS`
  (default `images.unsplash.com`; each host must also be allowed in the website's `next.config.mjs`).
- **Deleting** a destination/activity that still has trips returns `409`.
- **Instant updates.** Every successful content write clears the API cache and calls the website's
  `POST /api/revalidate` *before* responding, so when the dashboard says "Saved" the website already
  shows the change. If the website can't be reached, the save still succeeds and pages refresh within 5 minutes.

## Performance

- **Response cache.** Public GET responses are cached in memory, already serialized and with an ETag,
  for `CACHE_TTL_SECONDS`. Repeat requests skip the database and JSON serialization, and
  `If-None-Match` requests get `304 Not Modified`. Measured locally: ~24k req/s at ~1 ms average latency
  on `/api/v1/trips`.
- **HTTP caching.** `Cache-Control` with `s-maxage` + `stale-while-revalidate` lets a CDN or reverse proxy cache responses too.
- **Lean queries.** List endpoints `select` only the fields a card needs; detail endpoints add the rest.
  Filter/sort columns are indexed, and slugs are unique indexes.
- **Connection pooling** through the MariaDB driver adapter (`DB_POOL_SIZE`), gzip compression,
  and keep-alive timeouts tuned for load balancers.
- **Next.js ISR.** The website caches API data and regenerates pages in the background every 5 minutes,
  so most visitors never wait on the API.

To run several API instances behind a load balancer, move the in-memory cache
(`src/lib/cache.js`) to Redis behind the same `get/set/clear` interface.

## Project structure

```
scripts/
  create-admin.js    create/reset a dashboard user
prisma/
  schema.prisma      database models
  migrations/        SQL migrations (commit these)
  seed.js            idempotent seed script
  seed-data.json     starter content (originally the website's static data)
src/
  server.js          starts HTTP server, graceful shutdown
  app.js             Express app: security, CORS, compression, routes
  config/env.js      validated environment variables
  lib/               Prisma client, cache, errors
  middleware/        response cache, validation, error handling
  routes/            HTTP layer (zod validation, status codes)
  routes/admin/      admin CRUD, media uploads, settings, users
  services/          database queries + response shaping
  generated/prisma/  Prisma client (generated, git-ignored)
```

## Deployment notes

- Run `npm ci` (generates the client) then `npm run db:deploy` then `npm start`.
- Set `NODE_ENV=production`, `CORS_ORIGINS` to your site's (and admin dashboard's) domain(s), and `TRUST_PROXY=1` behind a proxy.
- Set a long random `JWT_SECRET`, plus `SITE_URL` and `REVALIDATE_SECRET` (the same value in the website's env).
- `UPLOAD_DIR` must be on a **persistent disk/volume** that you back up, or uploads are lost on redeploy.
  Many hosts (Render, Railway, Fly) need a mounted volume for this. To use S3/R2 instead, replace `src/lib/storage.js`.
- The website proxies `/uploads/*` to the API (see `next.config.mjs`), so image URLs stay on your domain.
- The website's `next build` prerenders pages from this API, so the API must be reachable during the frontend build.
