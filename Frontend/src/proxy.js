import { NextResponse } from 'next/server';

// Quick check before admin pages render: without a login cookie, go straight to the
// login page and remember where the user was heading (?next=). This is only a
// convenience; real authorization happens in the backend on every request.
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/admin/login' || request.cookies.has('kiteice_admin')) return NextResponse.next();

  const login = new URL('/admin/login', request.url);
  if (pathname !== '/admin') login.searchParams.set('next', pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
