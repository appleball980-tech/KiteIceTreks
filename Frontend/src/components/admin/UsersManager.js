'use client';

import { useState } from 'react';
import { CheckboxField, DeleteButton, SelectField, StatusMessage, TextField, useResourceForm } from './form';
import { Badge, Card, buttonClass, formatDateTime } from './ui';

const ROLES = [
  { value: 'editor', label: 'Editor – content & enquiries' },
  { value: 'admin', label: 'Admin – everything, incl. users' },
];

export default function UsersManager({ users, currentUserId }) {
  const [editing, setEditing] = useState(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {user.name} {user.id === currentUserId && <span className="text-xs text-muted">(you)</span>}
                </p>
                <p className="truncate text-sm text-muted">{user.email}</p>
              </div>
              <Badge tone={user.role === 'admin' ? 'purple' : 'blue'}>{user.role}</Badge>
              {!user.isActive && <Badge tone="red">Deactivated</Badge>}
              {user.id !== currentUserId && (
                <button type="button" onClick={() => setEditing(editing === user.id ? null : user.id)} className={buttonClass('secondary')}>
                  {editing === user.id ? 'Close' : 'Edit'}
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-muted">Last login: {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'never'}</p>
            {editing === user.id && <EditUser user={user} onDone={() => setEditing(null)} />}
          </div>
        ))}
      </div>
      <NewUser />
    </div>
  );
}

function EditUser({ user, onDone }) {
  const form = useResourceForm({
    resource: 'users',
    id: user.id,
    initial: { name: user.name, role: user.role, isActive: user.isActive, password: '' },
    // Only send a password when one was typed
    toPayload: ({ password, ...v }) => ({ ...v, ...(password && { password }) }),
  });
  return (
    <form onSubmit={form.submit} className="mt-4 space-y-3 border-t border-slate-100 pt-4">
      <TextField label="Name" error={form.errors.name} {...form.field('name')} />
      <SelectField label="Role" options={ROLES} {...form.field('role')} />
      <CheckboxField label="Active" hint="Deactivated users are logged out and can’t log in." {...form.field('isActive', { type: 'checkbox' })} />
      <TextField label="New password" type="password" autoComplete="new-password" hint="Leave empty to keep the current password (min 10 characters)." error={form.errors.password} {...form.field('password')} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={form.pending} className={buttonClass('primary')}>{form.pending ? 'Saving…' : 'Save'}</button>
        <StatusMessage status={form.status?.type === 'success' ? { ...form.status, message: 'Saved.' } : form.status} />
        <span className="ml-auto">
          <DeleteButton resource="users" id={user.id} label="Delete user" onDeleted={onDone} />
        </span>
      </div>
    </form>
  );
}

function NewUser() {
  const [formKey, setFormKey] = useState(0);
  return <NewUserForm key={formKey} onCreated={() => setFormKey((k) => k + 1)} />;
}

function NewUserForm({ onCreated }) {
  const form = useResourceForm({
    resource: 'users',
    initial: { name: '', email: '', role: 'editor', password: '' },
    onSaved: onCreated,
  });
  return (
    <form onSubmit={form.submit} noValidate className="lg:sticky lg:top-6 lg:self-start">
      <Card title="Add user" description="Share the password with them securely; they can change it under My account.">
        <div className="space-y-3">
          <TextField label="Name" required error={form.errors.name} {...form.field('name')} />
          <TextField label="Email" type="email" required autoComplete="off" error={form.errors.email} {...form.field('email')} />
          <SelectField label="Role" options={ROLES} {...form.field('role')} />
          <TextField label="Password" type="password" required autoComplete="new-password" hint="At least 10 characters" error={form.errors.password} {...form.field('password')} />
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={form.pending} className={buttonClass('primary')}>{form.pending ? 'Adding…' : 'Add user'}</button>
            <StatusMessage status={form.status} />
          </div>
        </div>
      </Card>
    </form>
  );
}
