// Seeds the database with the website's starter content (prisma/seed-data.json).
// Safe to re-run: every record is upserted by slug, so nothing is duplicated.
//   npm run db:seed

import { readFileSync } from 'node:fs';
import { prisma } from '../src/lib/prisma.js';

const data = JSON.parse(readFileSync(new URL('./seed-data.json', import.meta.url), 'utf8'));

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function upsertBySlug(model, { slug, ...fields }) {
  return prisma[model].upsert({ where: { slug }, create: { slug, ...fields }, update: fields, select: { id: true, slug: true } });
}

async function main() {
  const ids = { destination: {}, region: {}, activity: {} };

  for (const [i, { slug, name, tagline, description, image, metaTitle, metaDescription }] of data.destinations.entries()) {
    const row = await upsertBySlug('destination', { slug, name, tagline, description, image, metaTitle, metaDescription, sortOrder: i });
    ids.destination[slug] = row.id;
  }

  for (const [i, { slug, name, destination, description, image, metaTitle, metaDescription }] of data.regions.entries()) {
    const row = await upsertBySlug('region', {
      slug, name, description, image, metaTitle, metaDescription, sortOrder: i,
      destinationId: ids.destination[destination],
    });
    ids.region[slug] = row.id;
  }

  for (const [i, { slug, name, icon, description, image, metaTitle, metaDescription }] of data.activities.entries()) {
    const row = await upsertBySlug('activity', { slug, name, icon, description, image, metaTitle, metaDescription, sortOrder: i });
    ids.activity[slug] = row.id;
  }

  for (const [i, t] of data.trips.entries()) {
    const trip = await upsertBySlug('trip', {
      slug: t.slug,
      title: t.title,
      destinationId: ids.destination[t.destination],
      regionId: t.region ? ids.region[t.region] : null,
      activityId: ids.activity[t.activity],
      featured: t.featured,
      durationDays: t.durationDays,
      difficulty: t.difficulty,
      maxAltitude: t.maxAltitude,
      price: t.price,
      groupSize: t.groupSize,
      bestSeason: t.bestSeason,
      startEnd: t.startEnd,
      accommodation: t.accommodation,
      image: t.image,
      summary: t.summary,
      overview: t.overview,
      highlights: t.highlights,
      includes: t.includes,
      excludes: t.excludes,
      sortOrder: i,
    });

    // Child rows are replaced wholesale so the seed stays the source of truth
    await prisma.$transaction([
      prisma.itineraryDay.deleteMany({ where: { tripId: trip.id } }),
      prisma.tripFaq.deleteMany({ where: { tripId: trip.id } }),
      prisma.itineraryDay.createMany({ data: t.itinerary.map((d) => ({ ...d, tripId: trip.id })) }),
      prisma.tripFaq.createMany({ data: t.faqs.map((f, sortOrder) => ({ ...f, sortOrder, tripId: trip.id })) }),
    ]);
  }

  for (const p of data.posts) {
    const tags = p.tags.map((name) => ({ where: { slug: slugify(name) }, create: { slug: slugify(name), name } }));
    await prisma.post.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, title: p.title, excerpt: p.excerpt, image: p.image, author: p.author, sections: p.sections, publishedAt: new Date(p.publishedAt), tags: { connectOrCreate: tags } },
      update: { title: p.title, excerpt: p.excerpt, image: p.image, author: p.author, sections: p.sections, publishedAt: new Date(p.publishedAt), tags: { set: [], connectOrCreate: tags } },
    });
  }

  // Testimonials have no natural key: only seed them into an empty table
  if ((await prisma.testimonial.count()) === 0) {
    const tripIdByTitle = Object.fromEntries(
      (await prisma.trip.findMany({ select: { id: true, title: true } })).map((t) => [t.title, t.id])
    );
    await prisma.testimonial.createMany({
      data: data.testimonials.map((t, sortOrder) => ({
        name: t.name, country: t.country, rating: t.rating, quote: t.quote, sortOrder,
        tripName: t.trip, tripId: tripIdByTitle[t.trip] ?? null,
      })),
    });
  }

  // Settings are only created if missing, so edits made in the admin are never overwritten
  for (const [key, value] of Object.entries(data.settings)) {
    await prisma.setting.upsert({ where: { key }, create: { key, value }, update: {} });
  }

  const counts = await Promise.all(['destination', 'region', 'activity', 'trip', 'post', 'testimonial'].map((m) => prisma[m].count()));
  console.log('Seeded: %d destinations, %d regions, %d activities, %d trips, %d posts, %d testimonials', ...counts);
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
