'use client';

import { useActionState } from 'react';
import { login } from '@/lib/admin/actions';
import { inputClass } from '@/components/admin/form';
import { buttonClass } from '@/components/admin/ui';

export default function LoginForm({ next }) {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" defaultValue={state?.email} className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </div>
      {state?.error && <p role="alert" className="text-sm text-rose-600">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClass('primary', 'w-full py-2.5')}>
        {pending ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}
