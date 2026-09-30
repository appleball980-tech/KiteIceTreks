import { adminFetch } from '@/lib/admin/api';
import { FilterBar, PageHeader, Pagination, filterInput } from '@/components/admin/ui';
import MediaManager from '@/components/admin/MediaManager';

export const metadata = { title: 'Media' };

export default async function MediaPage({ searchParams }) {
  const { q = '', page = '1' } = await searchParams;
  const { data, meta } = await adminFetch('/admin/media', { query: { q, page, limit: 40 } });

  return (
    <>
      <PageHeader title="Media" description="Uploaded images are resized and converted to WebP automatically, and location data is removed." />
      <FilterBar>
        <input type="search" name="q" defaultValue={q} placeholder="Search by file name or alt text…" aria-label="Search" className={`${filterInput} min-w-48 flex-1`} />
      </FilterBar>
      <MediaManager items={data} />
      <Pagination meta={meta} basePath="/admin/media" params={{ q }} />
    </>
  );
}
