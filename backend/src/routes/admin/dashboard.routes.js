import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

// Counts for the admin dashboard home screen
export const adminDashboardRouter = Router().get('/', async (_req, res) => {
  const [trips, posts, destinations, regions, activities, testimonials, media, inquiriesByStatus, latestInquiries] = await Promise.all([
    prisma.trip.count(),
    prisma.post.count(),
    prisma.destination.count(),
    prisma.region.count(),
    prisma.activity.count(),
    prisma.testimonial.count(),
    prisma.media.count(),
    prisma.inquiry.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, type: true, status: true, fullName: true, email: true, createdAt: true, trip: { select: { title: true } } },
    }),
  ]);

  res.json({
    data: {
      counts: { trips, posts, destinations, regions, activities, testimonials, media },
      inquiries: Object.fromEntries(inquiriesByStatus.map((g) => [g.status, g._count._all])),
      latestInquiries,
    },
  });
});
