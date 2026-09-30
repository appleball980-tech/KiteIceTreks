import { prisma } from '../lib/prisma.js';

/* ---------- Blog ---------- */

const postCardSelect = {
  slug: true,
  title: true,
  excerpt: true,
  image: true,
  author: true,
  publishedAt: true,
  updatedAt: true,
  tags: { select: { name: true } },
};

const postDetailSelect = { ...postCardSelect, sections: true, metaTitle: true, metaDescription: true };

// Published and not scheduled for the future
const livePost = () => ({ isPublished: true, publishedAt: { lte: new Date() } });

const toPost = ({ tags, ...post }) => ({ ...post, tags: tags.map((t) => t.name) });

export async function listPosts({ page, limit, tag }) {
  const where = { ...livePost(), ...(tag && { tags: { some: { slug: tag } } }) };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: postCardSelect,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.post.count({ where }),
  ]);
  return { posts: posts.map(toPost), total };
}

export async function getPost(slug) {
  const post = await prisma.post.findFirst({ where: { slug, ...livePost() }, select: postDetailSelect });
  return post && toPost(post);
}

/* ---------- Testimonials ---------- */

export async function listTestimonials({ limit }) {
  const rows = await prisma.testimonial.findMany({
    where: { isPublished: true },
    select: { id: true, name: true, country: true, tripName: true, rating: true, quote: true, trip: { select: { slug: true, title: true } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit,
  });
  return rows.map(({ tripName, trip, ...t }) => ({ ...t, trip: tripName || trip?.title || null, tripSlug: trip?.slug ?? null }));
}
