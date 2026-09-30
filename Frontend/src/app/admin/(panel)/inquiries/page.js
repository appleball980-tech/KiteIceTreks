import Link from 'next/link';
import { adminFetch } from '@/lib/admin/api';
import { Badge, EmptyState, FilterBar, INQUIRY_STATUS_TONES, PageHeader, Pagination, Table, filterInput, formatDateTime } from '@/components/admin/ui';

export const metadata = { title: 'Enquiries' };

const STATUSES = ['', 'new', 'contacted', 'confirmed', 'closed'];
const TYPES = { booking: 'Booking', inquiry: 'Question', custom: 'Custom trip' };

export default async function InquiriesPage({ searchParams }) {
  const { q = '', status = '', type = '', page = '1' } = await searchParams;
  const { data, meta } = await adminFetch('/admin/inquiries', { query: { q, status, type, page } });
  const tabHref = (s) => `/admin/inquiries?${new URLSearchParams(Object.entries({ status: s, type, q }).filter(([, v]) => v))}`;

  return (
    <>
      <PageHeader title="Enquiries" description="Booking requests and questions from the website’s contact form." />

      <nav aria-label="Filter by status" className="mb-3 flex flex-wrap gap-1">
        {STATUSES.map((s) => (
          <Link
            key={s || 'all'}
            href={tabHref(s)}
            aria-current={status === s ? 'page' : undefined}
            className="rounded-full px-3 py-1.5 text-sm capitalize text-muted hover:bg-white aria-[current=page]:bg-ink aria-[current=page]:text-white"
          >
            {s || 'All'}
          </Link>
        ))}
      </nav>

      <FilterBar>
        <input type="hidden" name="status" value={status} />
        <input type="search" name="q" defaultValue={q} placeholder="Name, email or phone…" aria-label="Search" className={`${filterInput} min-w-48 flex-1`} />
        <select name="type" defaultValue={type} aria-label="Type" className={filterInput}>
          <option value="">All types</option>
          {Object.entries(TYPES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </FilterBar>

      <Table head={['From', 'Type', 'Trip', 'Travel date', 'Status', 'Received']} empty={data.length === 0 && <EmptyState>No enquiries found.</EmptyState>}>
        {data.map((inq) => (
          <tr key={inq.id} className={`hover:bg-slate-50 ${inq.status === 'new' ? 'font-medium' : ''}`}>
            <td className="px-4 py-3">
              <Link href={`/admin/inquiries/${inq.id}`} className="hover:text-brand">{inq.fullName}</Link>
              <p className="text-xs font-normal text-muted">{inq.email}{inq.country ? ` · ${inq.country}` : ''}</p>
            </td>
            <td className="px-4 py-3 font-normal">{TYPES[inq.type]}</td>
            <td className="px-4 py-3 font-normal text-muted">{inq.trip?.title ?? '—'}</td>
            <td className="whitespace-nowrap px-4 py-3 font-normal text-muted">{inq.travelDate ? inq.travelDate.slice(0, 10) : '—'}</td>
            <td className="px-4 py-3"><Badge tone={INQUIRY_STATUS_TONES[inq.status]}>{inq.status}</Badge></td>
            <td className="whitespace-nowrap px-4 py-3 font-normal text-muted">{formatDateTime(inq.createdAt)}</td>
          </tr>
        ))}
      </Table>
      <Pagination meta={meta} basePath="/admin/inquiries" params={{ q, status, type }} />
    </>
  );
}
