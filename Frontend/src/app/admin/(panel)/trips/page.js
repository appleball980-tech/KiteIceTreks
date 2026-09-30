import Link from 'next/link';
import { adminFetch } from '@/lib/admin/api';
import { getTripLookups } from '@/lib/admin/lookups';
import { formatPrice } from '@/lib/utils';
import { Badge, EmptyState, FilterBar, LinkButton, PageHeader, Pagination, PublishedBadge, Table, Thumb, filterInput } from '@/components/admin/ui';

export const metadata = { title: 'Trips' };

export default async function TripsPage({ searchParams }) {
  const { q = '', published = '', destinationId = '', activityId = '', page = '1' } = await searchParams;
  const [{ data: trips, meta }, { destinations, activities }] = await Promise.all([
    adminFetch('/admin/trips', { query: { q, published, destinationId, activityId, page } }),
    getTripLookups(),
  ]);

  return (
    <>
      <PageHeader title="Trips" description="Treks, tours and climbs shown on the website." actions={<LinkButton href="/admin/trips/new">+ New trip</LinkButton>} />

      <FilterBar>
        <input type="search" name="q" defaultValue={q} placeholder="Search trips…" aria-label="Search" className={`${filterInput} min-w-48 flex-1`} />
        <select name="destinationId" defaultValue={destinationId} aria-label="Destination" className={filterInput}>
          <option value="">All destinations</option>
          {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select name="activityId" defaultValue={activityId} aria-label="Activity" className={filterInput}>
          <option value="">All activities</option>
          {activities.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select name="published" defaultValue={published} aria-label="Visibility" className={filterInput}>
          <option value="">Published & hidden</option>
          <option value="true">Published</option>
          <option value="false">Hidden</option>
        </select>
      </FilterBar>

      <Table head={['', 'Trip', 'Destination', 'Days', 'Price', 'Status']} empty={trips.length === 0 && <EmptyState>No trips found.</EmptyState>}>
        {trips.map((t) => (
          <tr key={t.id} className="hover:bg-slate-50">
            <td className="w-20 px-4 py-2"><Thumb src={t.image} /></td>
            <td className="px-4 py-3">
              <Link href={`/admin/trips/${t.id}`} className="font-medium hover:text-brand">{t.title}</Link>
              <p className="text-xs text-muted">{t.activity.name}{t.region ? ` · ${t.region.name}` : ''}</p>
            </td>
            <td className="px-4 py-3 text-muted">{t.destination.name}</td>
            <td className="px-4 py-3">{t.durationDays}</td>
            <td className="px-4 py-3">{formatPrice(t.price, t.currency)}</td>
            <td className="space-x-1 px-4 py-3">
              <PublishedBadge published={t.isPublished} />
              {t.featured && <Badge tone="purple">Featured</Badge>}
            </td>
          </tr>
        ))}
      </Table>
      <Pagination meta={meta} basePath="/admin/trips" params={{ q, published, destinationId, activityId }} />
    </>
  );
}
