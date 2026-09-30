'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
import { refresh } from 'next/cache';
import { AdminApiError, adminFetch } from './api';
import { clearToken, setToken } from './session';

// Server Actions used by the admin dashboard. Every call is authorized by the
// backend with the user's token, so these never trust the browser.
//
// Actions return { ok: true, data } or { ok: false, error, fieldErrors }, so forms
// can show messages next to the right inputs.

const RESOURCES = ['trips', 'posts', 'destinations', 'regions', 'activities', 'testimonials', 'inquiries', 'users', 'media'];

function assertResource(resource) {
  if (!RESOURCES.includes(resource)) throw new Error(`Unknown resource: ${resource}`);
}

// Turns the API's technical validation messages into plain language for editors
function friendly(message) {
  if (/received (null|undefined)|expected string to have >=1 characters/.test(message)) return 'This field is required';
  if (/^Invalid option/.test(message)) return 'Choose one of the options';
  if (/expected number, received NaN/.test(message)) return 'Enter a number';
  const tooBig = message.match(/Too big: expected (?:string|array) to have <=(\d+)/);
  if (tooBig) return `Too long (max ${tooBig[1]})`;
  const tooSmallNum = message.match(/Too small: expected number to be >=(\d+)/);
  if (tooSmallNum) return `Must be at least ${tooSmallNum[1]}`;
  const tooBigNum = message.match(/Too big: expected number to be <=(\d+)/);
  if (tooBigNum) return `Must be at most ${tooBigNum[1]}`;
  return message;
}

async function run(fn) {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    unstable_rethrow(err); // let redirect()/notFound() through
    if (err instanceof AdminApiError) {
      const fieldErrors = Object.fromEntries((Array.isArray(err.details) ? err.details : []).filter((d) => d.field).map((d) => [d.field, friendly(d.message)]));
      const error = err.message === 'Validation failed' ? 'Please fix the highlighted fields.' : err.message;
      return { ok: false, error, fieldErrors, details: err.details };
    }
    console.error(err);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}

/* ---------- Session ---------- */

export async function login(_prevState, formData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '');

  const result = await run(() => adminFetch('/auth/login', { method: 'POST', body: { email, password }, auth: false }));
  if (!result.ok) return { error: result.error, email };

  await setToken(result.data.data.token);
  // Only redirect inside the admin, never to another site
  redirect(next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin');
}

export async function logout() {
  await clearToken();
  redirect('/admin/login');
}

export async function changePassword(payload) {
  const result = await run(() => adminFetch('/auth/me/password', { method: 'PATCH', body: payload }));
  if (result.ok) await setToken(result.data.data.token);
  return result.ok ? { ok: true } : result;
}

/* ---------- Generic create / update / delete ---------- */

// Creates (id = null) or updates a record. After creating, goes to its edit page.
export async function saveResource(resource, id, payload) {
  assertResource(resource);
  const result = await run(() =>
    adminFetch(id ? `/admin/${resource}/${id}` : `/admin/${resource}`, { method: id ? 'PATCH' : 'POST', body: payload })
  );
  if (!result.ok) return result;
  if (!id && resource !== 'users') redirect(`/admin/${resource}/${result.data.data.id}?created=1`);
  refresh();
  return { ok: true, data: result.data.data };
}

export async function deleteResource(resource, id, { redirectTo, force } = {}) {
  assertResource(resource);
  const result = await run(() => adminFetch(`/admin/${resource}/${id}`, { method: 'DELETE', query: { force: force ? 'true' : undefined } }));
  if (!result.ok) return result;
  if (redirectTo) redirect(redirectTo);
  refresh();
  return { ok: true };
}

/* ---------- Settings ---------- */

export async function saveSettings(key, payload) {
  const result = await run(() => adminFetch(`/admin/settings/${key}`, { method: 'PUT', body: payload }));
  if (result.ok) refresh();
  return result.ok ? { ok: true } : result;
}

/* ---------- Media ---------- */

export async function listMedia({ page = 1, q = '' } = {}) {
  return run(() => adminFetch('/admin/media', { query: { page, q, limit: 40 } }));
}

export async function uploadMedia(formData) {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose an image to upload' };

  const form = new FormData();
  form.append('file', file, file.name);
  if (formData.get('alt')) form.append('alt', String(formData.get('alt')));

  const result = await run(() => adminFetch('/admin/media', { method: 'POST', form }));
  return result.ok ? { ok: true, data: result.data.data } : result;
}
