import LoginForm from './LoginForm';

export const metadata = { title: 'Log in' };

export default async function LoginPage({ searchParams }) {
  const { next, expired } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="font-heading text-2xl font-semibold text-ink">Kiteice Admin</p>
          <p className="mt-1 text-sm text-muted">Log in to manage trips, posts and enquiries</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {expired && <p className="mb-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">Your session has expired. Please log in again.</p>}
          <LoginForm next={typeof next === 'string' ? next : '/admin'} />
        </div>
      </div>
    </main>
  );
}
