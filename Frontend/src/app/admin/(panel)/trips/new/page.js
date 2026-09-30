import { getTripLookups } from '@/lib/admin/lookups';
import { PageHeader } from '@/components/admin/ui';
import TripForm from '@/components/admin/TripForm';

export const metadata = { title: 'New trip' };

export default async function NewTripPage() {
  const lookups = await getTripLookups();
  return (
    <>
      <PageHeader title="New trip" back={{ href: '/admin/trips', label: 'Trips' }} />
      <TripForm {...lookups} />
    </>
  );
}
