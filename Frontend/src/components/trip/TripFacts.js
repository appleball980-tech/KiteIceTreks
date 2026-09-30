import { capitalize, formatAltitude } from '@/lib/utils';

export default function TripFacts({ trip }) {
  const facts = [
    { icon: '🗓️', label: 'Duration', value: `${trip.durationDays} Days` },
    { icon: '⛰️', label: 'Max Altitude', value: formatAltitude(trip.maxAltitude) },
    { icon: '💪', label: 'Difficulty', value: capitalize(trip.difficulty) },
    { icon: '👥', label: 'Group Size', value: trip.groupSize },
    { icon: '🌤️', label: 'Best Season', value: trip.bestSeason },
    { icon: '📍', label: 'Start / End', value: trip.startEnd },
    { icon: '🏠', label: 'Accommodation', value: trip.accommodation },
    { icon: '🧭', label: 'Activity', value: trip.activityName },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-ice p-5 md:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="flex gap-3">
          <span aria-hidden="true" className="text-2xl">{fact.icon}</span>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">{fact.label}</dt>
            <dd className="font-semibold text-ink">{fact.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
