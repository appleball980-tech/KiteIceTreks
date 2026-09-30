import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getDestinationBySlug, getDestinations, getRegions, getTrips } from '@/lib/api';
import CategoryTripsPage from '@/components/trip/CategoryTripsPage';

export const dynamicParams = false; // unknown destinations → 404

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  return buildMetadata({
    title: destination.metaTitle,
    description: destination.metaDescription,
    path: `/destinations/${slug}`,
    image: destination.image,
  });
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const [trips, allRegions] = await Promise.all([getTrips({ destination: slug }), getRegions()]);
  const regions = allRegions.filter((r) => r.destination === slug);

  return (
    <CategoryTripsPage
      category={destination}
      trips={trips}
      breadcrumbs={[{ name: destination.name, href: `/destinations/${slug}` }]}
    >
      {regions.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-xl">Trekking regions in {destination.name}</h2>
          <ul className="flex flex-wrap gap-3">
            {regions.map((r) => (
              <li key={r.slug}>
                <Link href={`/regions/${r.slug}`} className="inline-block rounded-full bg-ice px-5 py-2 font-medium text-ink hover:bg-brand hover:text-white">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CategoryTripsPage>
  );
}
