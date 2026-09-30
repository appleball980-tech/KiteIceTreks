import { CategoryListPage } from '@/components/admin/CategoryPages';

export const metadata = { title: 'Destinations' };

export default function Page({ searchParams }) {
  return <CategoryListPage resource="destinations" searchParams={searchParams} />;
}
