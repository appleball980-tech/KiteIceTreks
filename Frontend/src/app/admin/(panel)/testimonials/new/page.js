import { getTripOptions } from '@/lib/admin/trips';
import { PageHeader } from '@/components/admin/ui';
import TestimonialForm from '@/components/admin/TestimonialForm';

export const metadata = { title: 'New testimonial' };

export default async function NewTestimonialPage() {
  return (
    <>
      <PageHeader title="Add testimonial" back={{ href: '/admin/testimonials', label: 'Testimonials' }} />
      <TestimonialForm trips={await getTripOptions()} />
    </>
  );
}
