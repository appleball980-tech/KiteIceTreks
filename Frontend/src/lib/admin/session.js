import { cookies } from 'next/headers';

// The admin login token lives in an httpOnly cookie: page scripts can't read it
// (protects against XSS), and it's only sent to /admin routes.
const COOKIE = 'kiteice_admin';
const MAX_AGE = 8 * 60 * 60; // match the backend's JWT_EXPIRES_IN

export async function getToken() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

export async function setToken(token) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: MAX_AGE,
  });
}

export async function clearToken() {
  (await cookies()).delete({ name: COOKIE, path: '/admin' });
}
