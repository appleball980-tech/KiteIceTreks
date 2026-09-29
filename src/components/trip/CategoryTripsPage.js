import Container from '@/components/ui/Container';
import PageHero from '@/components/ui/PageHero';
import TripGrid from './TripGrid';

// Shared layout for /destinations/[slug], /regions/[slug] and /activities/[slug]
export default function CategoryTripsPage({ category, trips, breadcrumbs, children }) {
  return (
    <>
      <PageHero title={category.name} subtitle={category.tagline} image={category.image} breadcrumbs={breadcrumbs} />
      <Container className="py-14">
        <p className="mb-12 max-w-3xl text-lg leading-relaxed">{category.description}</p>
        {children}
        <h2 className="mb-8 text-2xl md:text-3xl">
          {category.name} Trips <span className="text-muted">({trips.length})</span>
        </h2>
        <TripGrid trips={trips} emptyMessage="New trips coming soon. Contact us for a custom itinerary." />
      </Container>
    </>
  );
}
