import { getCurrentUser } from '@/lib/admin/api';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Every page in (panel) requires a login: getCurrentUser() redirects to /admin/login
// when the cookie is missing or the backend rejects the token.
export default async function PanelLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <div className="lg:flex">
      <AdminSidebar user={user} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
