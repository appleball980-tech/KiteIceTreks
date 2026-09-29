import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getDestinationBySlug, getRegionBySlug, getRegions, getTrips } from '@/lib/api';
import CategoryTripsPage from '@/components/trip/CategoryTripsPage';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getRegions()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  return buildMetadata({
    title: region.metaTitle,
    description: region.metaDescription,
    path: `/regions/${slug}`,
    image: region.image,
  });
}

export default async function RegionPage({ params }) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const [trips, destination] = await Promise.all([getTrips({ region: slug }), getDestinationBySlug(region.destination)]);

  return (
    <CategoryTripsPage
      category={region}
      trips={trips}
      breadcrumbs={[
        { name: destination.name, href: `/destinations/${destination.slug}` },
        { name: region.name, href: `/regions/${slug}` },
      ]}
    />
  );
}
