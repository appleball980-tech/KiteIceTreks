import { capitalize } from '@/lib/utils';

const STYLES = {
  easy: 'bg-emerald-100 text-emerald-800',
  moderate: 'bg-sky-100 text-sky-800',
  challenging: 'bg-amber-100 text-amber-800',
  strenuous: 'bg-rose-100 text-rose-800',
};

export default function DifficultyBadge({ level }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[level]}`}>
      {capitalize(level)}
    </span>
  );
}
