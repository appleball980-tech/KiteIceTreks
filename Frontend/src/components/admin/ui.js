import Link from 'next/link';
import Image from 'next/image';

// Presentational building blocks for the admin dashboard (safe in Server Components)

export function PageHeader({ title, description, actions, back }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="mb-1 inline-block text-sm text-muted hover:text-brand">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-2xl">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {title && <h2 className="text-lg">{title}</h2>}
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className={title || description ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}

const buttonStyles = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-slate-300 bg-white text-ink hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'text-ink hover:bg-slate-100',
};

export const buttonClass = (variant = 'primary', extra = '') =>
  `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${extra}`;

export function LinkButton({ href, variant = 'primary', children }) {
  return (
    <Link href={href} className={buttonClass(variant)}>
      {children}
    </Link>
  );
}

const badgeTones = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  gray: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  purple: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

export function Badge({ tone = 'gray', children }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeTones[tone]}`}>{children}</span>;
}

export const PublishedBadge = ({ published }) => <Badge tone={published ? 'green' : 'gray'}>{published ? 'Published' : 'Hidden'}</Badge>;

export const INQUIRY_STATUS_TONES = { new: 'orange', contacted: 'blue', confirmed: 'green', closed: 'gray' };

// Table wrapper that scrolls sideways on small screens
export function Table({ head, children, empty }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

export function EmptyState({ children }) {
  return <p className="px-4 py-12 text-center text-muted">{children}</p>;
}

// Keeps the current filters when changing page
export function Pagination({ meta, basePath, params = {} }) {
  if (!meta || meta.pages <= 1) return null;
  const href = (page) => {
    const qs = new URLSearchParams(Object.entries({ ...params, page }).filter(([, v]) => v !== undefined && v !== ''));
    return `${basePath}?${qs}`;
  };
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
      <p className="text-muted">
        Page {meta.page} of {meta.pages} · {meta.total} total
      </p>
      <div className="flex gap-2">
        {meta.page > 1 && <Link href={href(meta.page - 1)} className={buttonClass('secondary')}>← Previous</Link>}
        {meta.page < meta.pages && <Link href={href(meta.page + 1)} className={buttonClass('secondary')}>Next →</Link>}
      </div>
    </nav>
  );
}

// Plain GET form: filters live in the URL, so they are shareable and survive reloads
export function FilterBar({ children, action }) {
  return (
    <form action={action} className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      {children}
      <button type="submit" className={buttonClass('secondary')}>
        Filter
      </button>
    </form>
  );
}

export const filterInput = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';

export function Thumb({ src, alt = '' }) {
  if (!src) return <div className="h-12 w-16 rounded-md bg-slate-100" />;
  return <Image src={src} alt={alt} width={64} height={48} sizes="64px" className="h-12 w-16 rounded-md object-cover" />;
}

export const formatDateTime = (iso) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
export const formatDay = (iso) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(iso));
