import { CategoryListPage } from '@/components/admin/CategoryPages';

export const metadata = { title: 'Regions' };

export default function Page({ searchParams }) {
  return <CategoryListPage resource="regions" searchParams={searchParams} />;
}
