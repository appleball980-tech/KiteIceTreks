import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getToken } from './session';

// Server-side client for the backend's admin API. Only import from Server
// Components and Server Actions: it reads the login cookie.

export const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

export class AdminApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function adminFetch(path, { method = 'GET', query, body, form, auth = true } = {}) {
  const token = auth ? await getToken() : null;
  if (auth && !token) redirect('/admin/login');

  const params = new URLSearchParams(Object.entries(query ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== ''));
  const url = `${API_URL}${path}${params.size ? `?${params}` : ''}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      cache: 'no-store',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
      },
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new AdminApiError(503, `Cannot reach the API at ${API_URL}. Is the backend running?`);
  }

  // Expired or revoked session: back to the login page
  if (res.status === 401 && auth) redirect('/admin/login?expired=1');
  if (res.status === 204) return null;

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new AdminApiError(res.status, json.error?.message ?? `Request failed (${res.status})`, json.error?.details);
  return json;
}

// The logged-in user, fetched once per request
export const getCurrentUser = cache(async () => (await adminFetch('/auth/me')).data);

// Loads one record for an edit page; unknown ids show the admin 404 page
export async function getRecord(resource, id) {
  if (!/^\d+$/.test(id)) notFound();
  try {
    return (await adminFetch(`/admin/${resource}/${id}`)).data;
  } catch (err) {
    if (err instanceof AdminApiError && err.status === 404) notFound();
    throw err;
  }
}
