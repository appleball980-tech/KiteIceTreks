'use client';

import { buttonClass } from '@/components/admin/ui';

// Shown when a page can't load its data (e.g. the API is down)
export default function AdminError({ error, reset }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
      <h1 className="text-xl text-rose-800">Something went wrong</h1>
      <p className="mt-2 text-rose-700">{error.message || 'The page could not be loaded.'}</p>
      <button type="button" onClick={reset} className={buttonClass('secondary', 'mt-4')}>
        Try again
      </button>
    </div>
  );
}
