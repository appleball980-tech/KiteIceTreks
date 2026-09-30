import { CategoryEditPage } from '@/components/admin/CategoryPages';

export const metadata = { title: 'Edit' };

export default function Page({ params, searchParams }) {
  return <CategoryEditPage resource="destinations" params={params} searchParams={searchParams} />;
}
