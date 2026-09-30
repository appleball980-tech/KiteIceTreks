import { LinkButton } from '@/components/admin/ui';

export default function AdminNotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="mt-3 text-2xl">Not found</h1>
      <p className="mt-2 text-muted">This item doesn’t exist or was deleted.</p>
      <div className="mt-6"><LinkButton href="/admin">Back to dashboard</LinkButton></div>
    </div>
  );
}
