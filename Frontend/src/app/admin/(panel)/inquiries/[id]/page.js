import Link from 'next/link';
import { getRecord } from '@/lib/admin/api';
import { Card, PageHeader, formatDateTime } from '@/components/admin/ui';
import InquiryPanel from '@/components/admin/InquiryPanel';

export const metadata = { title: 'Enquiry' };

const TYPES = { booking: 'Booking request', inquiry: 'Question', custom: 'Custom trip request' };

export default async function InquiryPage({ params }) {
  const { id } = await params;
  const inq = await getRecord('inquiries', id);
  const phoneDigits = inq.phone?.replace(/[^\d+]/g, '');
  const subject = encodeURIComponent(`Re: your ${inq.trip?.title ?? 'trip'} enquiry – Kiteice Treks`);

  const rows = [
    ['Email', <a key="e" href={`mailto:${inq.email}?subject=${subject}`} className="text-brand hover:underline">{inq.email}</a>],
    ['Phone', inq.phone || '—'],
    ['Country', inq.country || '—'],
    ['Trip', inq.trip ? <Link key="t" href={`/admin/trips/${inq.trip.id}`} className="text-brand hover:underline">{inq.trip.title}</Link> : 'Not sure yet'],
    ['Preferred start', inq.travelDate ? inq.travelDate.slice(0, 10) : '—'],
    ['Travellers', inq.travellers ?? '—'],
    ['Received', formatDateTime(inq.createdAt)],
  ];

  return (
    <>
      <PageHeader title={inq.fullName} description={TYPES[inq.type]} back={{ href: '/admin/inquiries', label: 'Enquiries' }} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card title="Message">
            <p className="whitespace-pre-line text-ink">{inq.message || <span className="text-muted">No message.</span>}</p>
          </Card>
          <Card title="Details">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
              {rows.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Reply">
            <div className="flex flex-col gap-2">
              <a href={`mailto:${inq.email}?subject=${subject}`} className="rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-dark">✉ Reply by email</a>
              {phoneDigits && (
                <a href={`https://wa.me/${phoneDigits.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700">
                  💬 WhatsApp
                </a>
              )}
            </div>
          </Card>
          <InquiryPanel inquiry={inq} />
        </div>
      </div>
    </>
  );
}
