import { CategoryListPage } from '@/components/admin/CategoryPages';

export const metadata = { title: 'Activities' };

export default function Page({ searchParams }) {
  return <CategoryListPage resource="activities" searchParams={searchParams} />;
}
