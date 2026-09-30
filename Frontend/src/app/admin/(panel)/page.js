import Link from 'next/link';
import { adminFetch, getCurrentUser } from '@/lib/admin/api';
import { Badge, Card, EmptyState, INQUIRY_STATUS_TONES, LinkButton, PageHeader, Table, formatDateTime } from '@/components/admin/ui';

export const metadata = { title: 'Dashboard' };

const CONTENT = [
  ['trips', 'Trips', '/admin/trips'],
  ['posts', 'Blog posts', '/admin/posts'],
  ['destinations', 'Destinations', '/admin/destinations'],
  ['regions', 'Regions', '/admin/regions'],
  ['activities', 'Activities', '/admin/activities'],
  ['testimonials', 'Testimonials', '/admin/testimonials'],
  ['media', 'Images', '/admin/media'],
];

export default async function DashboardPage() {
  const [user, { data }] = await Promise.all([getCurrentUser(), adminFetch('/admin/dashboard')]);
  const newCount = data.inquiries.new ?? 0;

  return (
    <>
      <PageHeader
        title={`Namaste, ${user.name.split(' ')[0]}`}
        description="Here’s what’s happening on your website."
        actions={
          <>
            <LinkButton href="/admin/trips/new">+ New trip</LinkButton>
            <LinkButton href="/admin/posts/new" variant="secondary">+ New post</LinkButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Link href="/admin/inquiries?status=new" className="rounded-xl border border-orange-200 bg-orange-50 p-5 shadow-sm hover:border-orange-300">
          <p className="text-sm font-medium text-orange-800">New enquiries</p>
          <p className="mt-1 text-3xl font-bold text-orange-900">{newCount}</p>
          <p className="mt-1 text-xs text-orange-800/80">{newCount ? 'Waiting for a reply →' : 'All caught up'}</p>
        </Link>
        {['contacted', 'confirmed', 'closed'].map((status) => (
          <Link key={status} href={`/admin/inquiries?status=${status}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300">
            <p className="text-sm font-medium capitalize text-muted">{status}</p>
            <p className="mt-1 text-3xl font-bold">{data.inquiries[status] ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Latest enquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-brand hover:underline">View all</Link>
          </div>
          <Table head={['Name', 'Trip', 'Status', 'Received']} empty={data.latestInquiries.length === 0 && <EmptyState>No enquiries yet.</EmptyState>}>
            {data.latestInquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/inquiries/${inq.id}`} className="font-medium hover:text-brand">{inq.fullName}</Link>
                  <p className="text-xs text-muted">{inq.email}</p>
                </td>
                <td className="px-4 py-3 text-muted">{inq.trip?.title ?? '—'}</td>
                <td className="px-4 py-3"><Badge tone={INQUIRY_STATUS_TONES[inq.status]}>{inq.status}</Badge></td>
                <td className="px-4 py-3 text-muted">{formatDateTime(inq.createdAt)}</td>
              </tr>
            ))}
          </Table>
        </div>

        <Card title="Website content">
          <ul className="divide-y divide-slate-100">
            {CONTENT.map(([key, label, href]) => (
              <li key={key}>
                <Link href={href} className="flex items-center justify-between py-2.5 hover:text-brand">
                  <span>{label}</span>
                  <span className="font-semibold">{data.counts[key]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
