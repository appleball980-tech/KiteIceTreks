import { getRecord } from '@/lib/admin/api';
import { getTripOptions } from '@/lib/admin/trips';
import { PageHeader } from '@/components/admin/ui';
import CreatedNotice from '@/components/admin/CreatedNotice';
import TestimonialForm from '@/components/admin/TestimonialForm';

export const metadata = { title: 'Edit testimonial' };

export default async function EditTestimonialPage({ params, searchParams }) {
  const { id } = await params;
  const { created } = await searchParams;
  const [testimonial, trips] = await Promise.all([getRecord('testimonials', id), getTripOptions()]);
  return (
    <>
      <PageHeader title={testimonial.name} back={{ href: '/admin/testimonials', label: 'Testimonials' }} />
      {created && <CreatedNotice>Testimonial added.</CreatedNotice>}
      <TestimonialForm key={testimonial.id} testimonial={testimonial} trips={trips} />
    </>
  );
}
