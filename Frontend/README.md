# Kiteice Travel and Treks

Website and admin dashboard for Kiteice Travel and Treks.

| Part | Where | Tech |
| --- | --- | --- |
| Public website | `src/app/(site)` | Next.js 16 (App Router), Tailwind CSS 4 |
| Admin dashboard | `src/app/admin` → `/admin` | Next.js Server Components + Server Actions |
| API + database | `backend/` | Express 5, Prisma 7, MySQL 8+ ([backend/README.md](backend/README.md)) |

All content (trips, blog posts, destinations, regions, activities, testimonials, images,
company/contact details and the menu) lives in MySQL and is edited in the dashboard.

## Running locally

You need Node.js 22.18+ and MySQL 8+.

1. **Backend**: follow the "Getting started" steps in [backend/README.md](backend/README.md),
   including `npm run admin:create` to create your login, then `npm run dev` in `backend/`.
2. **Website**: in this folder:

   ```bash
   cp .env.example .env.local   # set NEXT_PUBLIC_API_URL and REVALIDATE_SECRET
   npm install
   npm run dev
   ```

3. Open http://localhost:3000 for the website and http://localhost:3000/admin for the dashboard.

## Admin dashboard

| Section | What you can do |
| --- | --- |
| Dashboard | New/contacted/confirmed enquiry counts, latest enquiries, content totals |
| Trips | Create/edit trips with itinerary, FAQs, inclusions, price, difficulty, SEO; feature on home page; hide/publish |
| Blog posts | Sections + paragraphs, tags, cover image, schedule a future publish date |
| Destinations / Regions / Activities | Edit the pages and the **main menu** (new items appear in the menu automatically) |
| Testimonials | Client reviews shown on the home page |
| Media | Upload images (auto-resized, converted to WebP, location data removed), alt text, safe delete |
| Enquiries | Contact-form submissions: reply by email/WhatsApp, status (new → contacted → confirmed → closed), internal notes |
| Site settings | Company name/description, phone, WhatsApp, email, address, office hours, social links |
| Users *(admins only)* | Add editors/admins, change roles, deactivate, reset passwords |
| My account | Change your password |

Saving anything updates the public website immediately.

**Security:** the login token is kept in an httpOnly cookie (page scripts can't read it) scoped to
`/admin`. The backend checks the user and their role on every request, and deactivating a user or
changing their password logs them out at once. `/admin` is excluded from search engines.

## How the website gets its data

- Pages call the functions in `src/lib/api.js`, which fetch from the backend and cache the result
  (Incremental Static Regeneration, refreshed every 5 minutes).
- When content is changed in the dashboard, the backend calls `POST /api/revalidate` on the website
  (authenticated with `REVALIDATE_SECRET`), so the change is visible on the next page view.
- Uploaded images are served from `/uploads/...` on the website domain, proxied to the backend
  (see `next.config.mjs`).

## Project structure

```
src/
  app/(site)/        public pages (home, trips, blog, destinations, regions, activities, contact, about)
  app/admin/         dashboard: login + (panel) pages
  app/api/revalidate cache refresh endpoint called by the backend
  components/        public UI (layout, trip, blog…) and admin/ (forms, tables, media picker)
  lib/api.js         public data fetching
  lib/admin/         dashboard session, API client, Server Actions
  proxy.js           sends logged-out visitors of /admin/* to the login page
backend/             Express API, Prisma schema, migrations, seed
```

## Deploying

- Deploy the backend first (it needs MySQL and a persistent folder for uploads).
  See [backend/README.md](backend/README.md#deployment-notes).
- The website's `next build` fetches content from the API, so the API must be reachable during the build.
- Set the website's env vars: `NEXT_PUBLIC_API_URL`, `REVALIDATE_SECRET` (same as the backend), `NEXT_PUBLIC_SITE_URL`.
