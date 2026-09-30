'use client';

import { CheckboxField, DeleteButton, FormActions, SelectField, TextField, toInt, useResourceForm } from './form';
import { Card } from './ui';

export default function TestimonialForm({ testimonial, trips }) {
  const form = useResourceForm({
    resource: 'testimonials',
    id: testimonial?.id,
    initial: {
      name: testimonial?.name ?? '',
      country: testimonial?.country ?? '',
      rating: String(testimonial?.rating ?? 5),
      quote: testimonial?.quote ?? '',
      tripId: testimonial?.tripId ? String(testimonial.tripId) : '',
      tripName: testimonial?.tripName ?? '',
      sortOrder: testimonial?.sortOrder ?? 0,
      isPublished: testimonial?.isPublished ?? true,
    },
    toPayload: (v) => ({ ...v, rating: toInt(v.rating), tripId: toInt(v.tripId), sortOrder: toInt(v.sortOrder) ?? 0 }),
  });
  const { field, errors } = form;

  return (
    <form onSubmit={form.submit} noValidate>
      <Card>
        <p className="mb-4 rounded-lg bg-sky-50 p-3 text-sm text-sky-800">
          Only publish genuine reviews from real clients. Made-up reviews mislead travellers and break Google’s rules.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Client name" required error={errors.name} {...field('name')} />
          <TextField label="Country" error={errors.country} {...field('country')} />
          <SelectField label="Rating" error={errors.rating} options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: '★'.repeat(n) }))} {...field('rating')} />
          <SelectField label="Trip" placeholder="Not linked to a trip" error={errors.tripId} options={trips.map((t) => ({ value: String(t.id), label: t.title }))} {...field('tripId')} />
          <TextField label="Trip label" className="sm:col-span-2" hint="Optional. Overrides the linked trip’s name on the review card." error={errors.tripName} {...field('tripName')} />
          <TextField label="Review" required multiline rows={5} className="sm:col-span-2" error={errors.quote} {...field('quote')} />
          <TextField label="Sort order" type="number" error={errors.sortOrder} {...field('sortOrder')} />
          <div className="self-end">
            <CheckboxField label="Published" {...field('isPublished', { type: 'checkbox' })} />
          </div>
        </div>
      </Card>
      <FormActions form={form} submitLabel={testimonial ? 'Save changes' : 'Add testimonial'}>
        {testimonial && <DeleteButton resource="testimonials" id={testimonial.id} redirectTo="/admin/testimonials" />}
      </FormActions>
    </form>
  );
}
