import TripCard from './TripCard';

export default function TripGrid({ trips, emptyMessage = 'No trips found. Try a different search.' }) {
  if (!trips.length) {
    return <p className="rounded-xl bg-ice p-8 text-center text-muted">{emptyMessage}</p>;
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.slug} trip={trip} />
      ))}
    </div>
  );
}
