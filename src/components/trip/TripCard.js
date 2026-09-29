import Image from 'next/image';
import Link from 'next/link';
import { formatAltitude, formatPrice } from '@/lib/utils';
import DifficultyBadge from './DifficultyBadge';

export default function TripCard({ trip }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/trips/${trip.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={trip.image}
          alt={trip.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink">
          {trip.durationDays} Days
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand">
          {trip.regionName || trip.destinationName} · {trip.activityName}
        </p>
        <h3 className="mb-2 text-lg leading-snug">
          <Link href={`/trips/${trip.slug}`} className="hover:text-brand">
            {trip.title}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted">{trip.summary}</p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <DifficultyBadge level={trip.difficulty} />
            <span>▲ {formatAltitude(trip.maxAltitude)}</span>
          </div>
          <p className="text-right">
            <span className="block text-xs text-muted">From</span>
            <span className="text-lg font-bold text-ink">{formatPrice(trip.price)}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
