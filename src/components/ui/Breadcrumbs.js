import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

// Visible breadcrumb trail + BreadcrumbList structured data for Google
export default function Breadcrumbs({ items, light = false }) {
  const trail = [{ name: 'Home', href: '/' }, ...items];
  const color = light ? 'text-white/80' : 'text-muted';

  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-sm ${color}`}>
        <ol className="flex flex-wrap items-center gap-1">
          {trail.map((item, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {isLast ? (
                  <span aria-current="page" className={light ? 'text-white' : 'text-ink'}>
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-brand">
                      {item.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
