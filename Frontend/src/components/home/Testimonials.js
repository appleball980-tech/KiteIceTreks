import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Testimonials({ testimonials }) {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Reviews" title="What Our Travellers Say" />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p aria-label={`${t.rating} out of 5 stars`} className="mb-3 text-brand">
                {'★'.repeat(t.rating)}
              </p>
              <blockquote className="flex-1 italic text-slate-600">“{t.quote}”</blockquote>
              <figcaption className="mt-5 border-t border-slate-100 pt-4">
                <p className="font-semibold text-ink">{t.name}, {t.country}</p>
                <p className="text-sm text-muted">{t.trip}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
