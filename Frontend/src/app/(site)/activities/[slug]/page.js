import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getActivities, getActivityBySlug, getTrips } from '@/lib/api';
import CategoryTripsPage from '@/components/trip/CategoryTripsPage';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getActivities()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);
  return buildMetadata({
    title: activity.metaTitle,
    description: activity.metaDescription,
    path: `/activities/${slug}`,
    image: activity.image,
  });
}

export default async function ActivityPage({ params }) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);
  if (!activity) notFound();

  const trips = await getTrips({ activity: slug });

  return (
    <CategoryTripsPage
      category={activity}
      trips={trips}
      breadcrumbs={[
        { name: 'Trips', href: '/trips' },
        { name: activity.name, href: `/activities/${slug}` },
      ]}
    />
  );
}
