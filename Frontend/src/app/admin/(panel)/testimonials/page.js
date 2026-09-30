import Link from 'next/link';
import { adminFetch } from '@/lib/admin/api';
import { EmptyState, LinkButton, PageHeader, Pagination, PublishedBadge, Table } from '@/components/admin/ui';

export const metadata = { title: 'Testimonials' };

export default async function TestimonialsPage({ searchParams }) {
  const { page = '1' } = await searchParams;
  const { data, meta } = await adminFetch('/admin/testimonials', { query: { page } });

  return (
    <>
      <PageHeader title="Testimonials" description="Client reviews shown on the home page." actions={<LinkButton href="/admin/testimonials/new">+ Add testimonial</LinkButton>} />
      <Table head={['Client', 'Review', 'Rating', 'Status']} empty={data.length === 0 && <EmptyState>No testimonials yet.</EmptyState>}>
        {data.map((t) => (
          <tr key={t.id} className="hover:bg-slate-50">
            <td className="px-4 py-3">
              <Link href={`/admin/testimonials/${t.id}`} className="font-medium hover:text-brand">{t.name}</Link>
              <p className="text-xs text-muted">{[t.country, t.tripName || t.trip?.title].filter(Boolean).join(' · ')}</p>
            </td>
            <td className="max-w-md px-4 py-3 text-muted"><p className="line-clamp-2">{t.quote}</p></td>
            <td className="whitespace-nowrap px-4 py-3 text-brand" aria-label={`${t.rating} out of 5`}>{'★'.repeat(t.rating)}</td>
            <td className="px-4 py-3"><PublishedBadge published={t.isPublished} /></td>
          </tr>
        ))}
      </Table>
      <Pagination meta={meta} basePath="/admin/testimonials" />
    </>
  );
}
