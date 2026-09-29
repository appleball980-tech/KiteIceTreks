import Image from 'next/image';
import Link from 'next/link';

// Photo tiles linking to destination / region / activity pages
export default function CategoryCards({ items, basePath, columns = 'lg:grid-cols-3' }) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${columns}`}>
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`${basePath}/${item.slug}`}
          className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl sm:aspect-[4/3]"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative p-6 text-white">
            <h3 className="text-2xl text-white">{item.name}</h3>
            {item.tagline && <p className="mt-1 text-sm text-white/85">{item.tagline}</p>}
            <span className="mt-3 inline-block text-sm font-semibold text-brand group-hover:underline">
              Explore trips →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
