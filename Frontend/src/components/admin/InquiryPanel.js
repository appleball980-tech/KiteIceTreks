'use client';

import { DeleteButton, SelectField, StatusMessage, TextField, useResourceForm } from './form';
import { Card, buttonClass } from './ui';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed (booked)' },
  { value: 'closed', label: 'Closed' },
];

export default function InquiryPanel({ inquiry }) {
  const form = useResourceForm({
    resource: 'inquiries',
    id: inquiry.id,
    initial: { status: inquiry.status, notes: inquiry.notes ?? '' },
  });

  return (
    <Card title="Follow-up">
      <form onSubmit={form.submit} className="space-y-4">
        <SelectField label="Status" options={STATUS_OPTIONS} {...form.field('status')} />
        <TextField label="Internal notes" multiline rows={5} hint="Only visible to your team." {...form.field('notes')} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={form.pending} className={buttonClass('primary')}>
            {form.pending ? 'Saving…' : 'Save'}
          </button>
          <StatusMessage status={form.status?.type === 'success' ? { ...form.status, message: 'Saved.' } : form.status} />
        </div>
      </form>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <DeleteButton resource="inquiries" id={inquiry.id} redirectTo="/admin/inquiries" label="Delete enquiry" />
      </div>
    </Card>
  );
}
