import { notFound } from 'next/navigation';
import { articleJsonLd, buildMetadata } from '@/lib/seo';
import { getFeaturedTrips, getPostBySlug, getPosts } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import JsonLd from '@/components/seo/JsonLd';
import Container from '@/components/ui/Container';
import PageHero from '@/components/ui/PageHero';
import TripCard from '@/components/trip/TripCard';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    ...buildMetadata({ title: post.title, description: post.excerpt, path: `/blog/${slug}`, image: post.image, type: 'article' }),
    authors: [{ name: post.author }],
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const suggestedTrips = await getFeaturedTrips(2);

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />
      <PageHero
        title={post.title}
        image={post.image}
        breadcrumbs={[
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${slug}` },
        ]}
      >
        <p className="mt-4 text-sm text-white/80">
          By {post.author} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
      </PageHero>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <article className="prose-content max-w-3xl text-lg">
          <p className="text-xl text-ink">{post.excerpt}</p>
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </article>

        <aside className="space-y-6">
          <h2 className="text-xl">Popular Trips</h2>
          {suggestedTrips.map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
        </aside>
      </Container>
    </>
  );
}
