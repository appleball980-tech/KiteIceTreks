import { buildMetadata } from '@/lib/seo';
import { images } from '@/lib/images';
import { getPosts } from '@/lib/api';
import Container from '@/components/ui/Container';
import PageHero from '@/components/ui/PageHero';
import PostCard from '@/components/blog/PostCard';

export const metadata = buildMetadata({
  title: 'Travel Blog – Nepal Trekking Tips & Guides',
  description:
    'Trekking guides, packing lists, altitude safety and season advice for Nepal, Tibet and Bhutan from the Kiteice team.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        title="Travel Blog"
        subtitle="Guides and tips to help you plan your Himalayan adventure."
        image={images.seaOfClouds}
        breadcrumbs={[{ name: 'Blog', href: '/blog' }]}
      />
      <Container className="grid gap-8 py-14 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </Container>
    </>
  );
}
