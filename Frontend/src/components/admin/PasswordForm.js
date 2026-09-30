'use client';

import { changePassword } from '@/lib/admin/actions';
import { StatusMessage, TextField, useResourceForm } from './form';
import { Card, buttonClass } from './ui';

export default function PasswordForm() {
  const form = useResourceForm({
    initial: { currentPassword: '', newPassword: '', confirm: '' },
    toPayload: ({ currentPassword, newPassword }) => ({ currentPassword, newPassword }),
    save: async (payload) => changePassword(payload),
    onSaved: () => {},
  });
  const mismatch = form.values.confirm && form.values.confirm !== form.values.newPassword;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!mismatch) form.submit();
      }}
    >
      <Card title="Change password" description="You’ll stay logged in here; other devices are logged out.">
        <div className="space-y-3">
          <TextField label="Current password" type="password" required autoComplete="current-password" error={form.errors.currentPassword} {...form.field('currentPassword')} />
          <TextField label="New password" type="password" required autoComplete="new-password" hint="At least 10 characters" error={form.errors.newPassword} {...form.field('newPassword')} />
          <TextField label="Repeat new password" type="password" required autoComplete="new-password" error={mismatch ? 'Passwords don’t match' : undefined} {...form.field('confirm')} />
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={form.pending || mismatch} className={buttonClass('primary')}>{form.pending ? 'Saving…' : 'Change password'}</button>
            <StatusMessage status={form.status?.type === 'success' ? { ...form.status, message: 'Password changed.' } : form.status} />
          </div>
        </div>
      </Card>
    </form>
  );
}
