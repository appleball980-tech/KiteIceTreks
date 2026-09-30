import { prisma } from '../lib/prisma.js';

export async function createInquiry({ trip, ...data }, meta) {
  // Link to the trip when the slug is valid; an unknown slug is simply ignored
  const tripRow = trip
    ? await prisma.trip.findUnique({ where: { slug: trip }, select: { id: true } })
    : null;

  return prisma.inquiry.create({
    data: { ...data, tripId: tripRow?.id ?? null, ipAddress: meta.ip, userAgent: meta.userAgent?.slice(0, 255) },
    select: { id: true, createdAt: true },
  });
}
