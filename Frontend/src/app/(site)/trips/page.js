import { buildMetadata } from '@/lib/seo';
import { images } from '@/lib/images';
import { getActivities, getDestinations, getTrips } from '@/lib/api';
import Container from '@/components/ui/Container';
import PageHero from '@/components/ui/PageHero';
import TripGrid from '@/components/trip/TripGrid';

export const metadata = buildMetadata({
  title: 'All Trips – Treks, Tours & Peak Climbing',
  description:
    'Browse all Kiteice trips in Nepal, Tibet and Bhutan. Filter by destination, activity and difficulty to find your perfect Himalayan adventure.',
  path: '/trips',
});

const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'strenuous'];

export default async function TripsPage({ searchParams }) {
  const { q = '', destination = '', activity = '', difficulty = '' } = await searchParams;
  const [trips, destinations, activities] = await Promise.all([
    getTrips({ q, destination, activity, difficulty }),
    getDestinations(),
    getActivities(),
  ]);

  const select = 'rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-ink';

  return (
    <>
      <PageHero
        title="All Trips"
        subtitle="Treks, tours and climbing adventures across the Himalayas."
        image={images.trekkersTrail}
        breadcrumbs={[{ name: 'Trips', href: '/trips' }]}
      />

      <Container className="py-14">
        {/* Plain GET form: filters work without JavaScript and produce shareable URLs */}
        <form role="search" className="mb-10 grid gap-3 rounded-2xl bg-ice p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <input name="q" type="search" defaultValue={q} placeholder="Search trips…" aria-label="Search trips" className={select} />
          <select name="destination" defaultValue={destination} aria-label="Destination" className={select}>
            <option value="">All destinations</option>
            {destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
          </select>
          <select name="activity" defaultValue={activity} aria-label="Activity" className={select}>
            <option value="">All activities</option>
            {activities.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
          </select>
          <select name="difficulty" defaultValue={difficulty} aria-label="Difficulty" className={`${select} capitalize`}>
            <option value="">Any difficulty</option>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="submit" className="rounded-xl bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark">
            Filter
          </button>
        </form>

        <p className="mb-6 text-muted">
          Showing <strong className="text-ink">{trips.length}</strong> {trips.length === 1 ? 'trip' : 'trips'}
        </p>
        <TripGrid trips={trips} />
      </Container>
    </>
  );
}
