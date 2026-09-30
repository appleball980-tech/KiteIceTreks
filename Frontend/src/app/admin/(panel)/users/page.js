import { notFound } from 'next/navigation';
import { adminFetch, getCurrentUser } from '@/lib/admin/api';
import { PageHeader } from '@/components/admin/ui';
import UsersManager from '@/components/admin/UsersManager';

export const metadata = { title: 'Users' };

export default async function UsersPage() {
  const me = await getCurrentUser();
  if (me.role !== 'admin') notFound(); // the API also refuses non-admins
  const { data: users } = await adminFetch('/admin/users');

  return (
    <>
      <PageHeader title="Users" description="People who can log in to this dashboard. Editors can manage everything except users." />
      <UsersManager users={users} currentUserId={me.id} />
    </>
  );
}
