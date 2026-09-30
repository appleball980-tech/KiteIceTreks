import Link from 'next/link';
import { adminFetch } from '@/lib/admin/api';
import { Badge, EmptyState, FilterBar, LinkButton, PageHeader, Pagination, PublishedBadge, Table, Thumb, filterInput, formatDay } from '@/components/admin/ui';

export const metadata = { title: 'Blog posts' };

export default async function PostsPage({ searchParams }) {
  const { q = '', published = '', page = '1' } = await searchParams;
  const { data: posts, meta } = await adminFetch('/admin/posts', { query: { q, published, page } });
  const now = new Date();

  return (
    <>
      <PageHeader title="Blog posts" description="Travel guides and news. Great for bringing visitors from Google." actions={<LinkButton href="/admin/posts/new">+ New post</LinkButton>} />
      <FilterBar>
        <input type="search" name="q" defaultValue={q} placeholder="Search posts…" aria-label="Search" className={`${filterInput} min-w-48 flex-1`} />
        <select name="published" defaultValue={published} aria-label="Visibility" className={filterInput}>
          <option value="">Published & hidden</option>
          <option value="true">Published</option>
          <option value="false">Hidden</option>
        </select>
      </FilterBar>
      <Table head={['', 'Title', 'Tags', 'Date', 'Status']} empty={posts.length === 0 && <EmptyState>No posts found.</EmptyState>}>
        {posts.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50">
            <td className="w-20 px-4 py-2"><Thumb src={p.image} /></td>
            <td className="px-4 py-3">
              <Link href={`/admin/posts/${p.id}`} className="font-medium hover:text-brand">{p.title}</Link>
              <p className="text-xs text-muted">by {p.author}</p>
            </td>
            <td className="px-4 py-3 text-muted">{p.tags.map((t) => t.name).join(', ') || '—'}</td>
            <td className="whitespace-nowrap px-4 py-3">{formatDay(p.publishedAt)}</td>
            <td className="px-4 py-3">
              {p.isPublished && new Date(p.publishedAt) > now ? <Badge tone="blue">Scheduled</Badge> : <PublishedBadge published={p.isPublished} />}
            </td>
          </tr>
        ))}
      </Table>
      <Pagination meta={meta} basePath="/admin/posts" params={{ q, published }} />
    </>
  );
}
