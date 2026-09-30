import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function PostCard({ post }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <time dateTime={post.publishedAt} className="text-xs font-semibold uppercase tracking-wider text-brand">
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="mt-2 text-lg leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>
      </div>
    </article>
  );
}
