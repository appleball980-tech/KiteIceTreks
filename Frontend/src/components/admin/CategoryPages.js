import Link from 'next/link';
import { adminFetch, getRecord } from '@/lib/admin/api';
import { EmptyState, FilterBar, LinkButton, PageHeader, PublishedBadge, Table, Thumb, filterInput } from './ui';
import CategoryForm from './CategoryForm';
import CreatedNotice from './CreatedNotice';

// Server components shared by the destinations, regions and activities pages

const LABELS = {
  destinations: { title: 'Destinations', singular: 'destination', description: 'Countries you operate in.' },
  regions: { title: 'Regions', singular: 'region', description: 'Trekking regions within a destination. They appear in the menu automatically.' },
  activities: { title: 'Activities', singular: 'activity', description: 'Trip types such as trekking, climbing and tours.' },
};

const getDestinations = async (resource) =>
  resource === 'regions' ? (await adminFetch('/admin/destinations', { query: { limit: 100 } })).data : [];

export async function CategoryListPage({ resource, searchParams }) {
  const label = LABELS[resource];
  const { q = '' } = await searchParams;
  const { data } = await adminFetch(`/admin/${resource}`, { query: { q, limit: 100 } });

  return (
    <>
      <PageHeader title={label.title} description={label.description} actions={<LinkButton href={`/admin/${resource}/new`}>+ New {label.singular}</LinkButton>} />
      <FilterBar>
        <input type="search" name="q" defaultValue={q} placeholder="Search…" aria-label="Search" className={`${filterInput} min-w-48 flex-1`} />
      </FilterBar>
      <Table head={['', 'Name', resource === 'regions' ? 'Destination' : 'Slug', 'Trips', 'Order', 'Status']} empty={data.length === 0 && <EmptyState>Nothing here yet.</EmptyState>}>
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50">
            <td className="w-20 px-4 py-2"><Thumb src={item.image} /></td>
            <td className="px-4 py-3">
              <Link href={`/admin/${resource}/${item.id}`} className="font-medium hover:text-brand">
                {item.icon ? `${item.icon} ` : ''}{item.name}
              </Link>
            </td>
            <td className="px-4 py-3 text-muted">{resource === 'regions' ? item.destination.name : item.slug}</td>
            <td className="px-4 py-3">{item._count.trips}</td>
            <td className="px-4 py-3 text-muted">{item.sortOrder}</td>
            <td className="px-4 py-3"><PublishedBadge published={item.isPublished} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export async function CategoryNewPage({ resource }) {
  const label = LABELS[resource];
  return (
    <>
      <PageHeader title={`New ${label.singular}`} back={{ href: `/admin/${resource}`, label: label.title }} />
      <CategoryForm resource={resource} destinations={await getDestinations(resource)} />
    </>
  );
}

export async function CategoryEditPage({ resource, params, searchParams }) {
  const label = LABELS[resource];
  const { id } = await params;
  const { created } = await searchParams;
  const [record, destinations] = await Promise.all([getRecord(resource, id), getDestinations(resource)]);
  return (
    <>
      <PageHeader title={record.name} back={{ href: `/admin/${resource}`, label: label.title }} />
      {created && <CreatedNotice>Saved.</CreatedNotice>}
      <CategoryForm key={record.id} resource={resource} record={record} destinations={destinations} />
    </>
  );
}
