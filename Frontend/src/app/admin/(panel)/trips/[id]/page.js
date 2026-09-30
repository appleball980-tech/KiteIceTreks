import { getRecord } from '@/lib/admin/api';
import { getTripLookups } from '@/lib/admin/lookups';
import { PageHeader } from '@/components/admin/ui';
import CreatedNotice from '@/components/admin/CreatedNotice';
import TripForm from '@/components/admin/TripForm';

export const metadata = { title: 'Edit trip' };

export default async function EditTripPage({ params, searchParams }) {
  const { id } = await params;
  const { created } = await searchParams;
  const [trip, lookups] = await Promise.all([getRecord('trips', id), getTripLookups()]);

  return (
    <>
      <PageHeader title={trip.title} back={{ href: '/admin/trips', label: 'Trips' }} />
      {created && <CreatedNotice>Trip created.</CreatedNotice>}
      {/* key: reset the form state when switching between trips */}
      <TripForm key={trip.id} trip={trip} {...lookups} />
    </>
  );
}

