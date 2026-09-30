import { getCurrentUser } from '@/lib/admin/api';
import { Card, PageHeader } from '@/components/admin/ui';
import PasswordForm from '@/components/admin/PasswordForm';

export const metadata = { title: 'My account' };

export default async function AccountPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PageHeader title="My account" />
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        <Card title="Profile">
          <dl className="space-y-2 text-sm">
            <div><dt className="text-muted">Name</dt><dd className="font-medium">{user.name}</dd></div>
            <div><dt className="text-muted">Email</dt><dd className="font-medium">{user.email}</dd></div>
            <div><dt className="text-muted">Role</dt><dd className="font-medium capitalize">{user.role}</dd></div>
          </dl>
        </Card>
        <PasswordForm />
      </div>
    </>
  );
}
