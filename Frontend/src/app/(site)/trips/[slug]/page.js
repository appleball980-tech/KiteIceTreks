import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, tripJsonLd } from '@/lib/seo';
import { getRelatedTrips, getTripBySlug, getTrips } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import JsonLd from '@/components/seo/JsonLd';
import Container from '@/components/ui/Container';
import PageHero from '@/components/ui/PageHero';
import FaqList from '@/components/ui/FaqList';
import TripFacts from '@/components/trip/TripFacts';
import TripItinerary from '@/components/trip/TripItinerary';
import TripIncludes from '@/components/trip/TripIncludes';
import TripGrid from '@/components/trip/TripGrid';
import BookingCard from '@/components/trip/BookingCard';

// Pre-render every trip page at build time (fast + best for SEO)
export async function generateStaticParams() {
  return (await getTrips()).map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return {};
  return buildMetadata({
    title: `${trip.title} – ${trip.durationDays} Days`,
    description: `${trip.summary} From ${formatPrice(trip.price)} per person.`,
    path: `/trips/${trip.slug}`,
    image: trip.image,
  });
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'cost', label: 'Includes / Excludes' },
  { id: 'faqs', label: 'FAQs' },
];

export default async function TripPage({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();

  const related = await getRelatedTrips(trip);
  const sections = SECTIONS.filter((s) => s.id !== 'faqs' || trip.faqs.length);

  const breadcrumbs = [
    { name: trip.destinationName, href: `/destinations/${trip.destination}` },
    ...(trip.region ? [{ name: trip.regionName, href: `/regions/${trip.region}` }] : []),
    { name: trip.title, href: `/trips/${trip.slug}` },
  ];

  return (
    <>
      <JsonLd data={tripJsonLd(trip)} />
      <PageHero title={trip.title} subtitle={trip.summary} image={trip.image} breadcrumbs={breadcrumbs} />

      {/* Sticky in-page navigation */}
      <nav aria-label="Trip sections" className="sticky top-20 z-30 border-b border-slate-200 bg-white">
        <Container as="ul" className="flex gap-6 overflow-x-auto whitespace-nowrap">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="block border-b-2 border-transparent py-4 font-medium text-ink hover:border-brand hover:text-brand">
                {s.label}
              </a>
            </li>
          ))}
        </Container>
      </nav>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-14">
          <TripFacts trip={trip} />

          <section id="overview">
            <h2 className="mb-4 text-2xl md:text-3xl">Trip Overview</h2>
            <div className="prose-content">
              {trip.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <h3 className="mb-3 mt-8 text-xl">Trip Highlights</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {trip.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span aria-hidden="true" className="text-brand">★</span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section id="itinerary">
            <h2 className="mb-6 text-2xl md:text-3xl">Detailed Itinerary</h2>
            <TripItinerary itinerary={trip.itinerary} />
          </section>

          <section id="cost">
            <h2 className="mb-6 text-2xl md:text-3xl">What’s Included</h2>
            <TripIncludes includes={trip.includes} excludes={trip.excludes} />
          </section>

          {trip.faqs.length > 0 && (
            <section id="faqs">
              <h2 className="mb-6 text-2xl md:text-3xl">Frequently Asked Questions</h2>
              <FaqList faqs={trip.faqs} />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-40 lg:self-start">
          <BookingCard trip={trip} />
          <p className="mt-4 text-center text-sm text-muted">
            Need a custom itinerary? <Link href="/contact" className="font-semibold text-brand">Contact us</Link>
          </p>
        </aside>
      </Container>

      {related.length > 0 && (
        <section className="bg-ice py-16">
          <Container>
            <h2 className="mb-8 text-2xl md:text-3xl">You May Also Like</h2>
            <TripGrid trips={related} />
          </Container>
        </section>
      )}
    </>
  );
}
