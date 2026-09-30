import { CategoryNewPage } from '@/components/admin/CategoryPages';

export const metadata = { title: 'New' };

export default function Page() {
  return <CategoryNewPage resource="destinations" />;
}
