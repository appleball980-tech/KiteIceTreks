'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/admin/actions';

const SECTIONS = [
  { items: [{ href: '/admin', label: 'Dashboard', icon: '▦' }] },
  {
    title: 'Content',
    items: [
      { href: '/admin/trips', label: 'Trips', icon: '🥾' },
      { href: '/admin/posts', label: 'Blog posts', icon: '✎' },
      { href: '/admin/destinations', label: 'Destinations', icon: '🌏' },
      { href: '/admin/regions', label: 'Regions', icon: '⛰' },
      { href: '/admin/activities', label: 'Activities', icon: '🧭' },
      { href: '/admin/testimonials', label: 'Testimonials', icon: '★' },
      { href: '/admin/media', label: 'Media', icon: '🖼' },
    ],
  },
  { title: 'Customers', items: [{ href: '/admin/inquiries', label: 'Enquiries', icon: '✉' }] },
  {
    title: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Site settings', icon: '⚙' },
      { href: '/admin/users', label: 'Users', icon: '👥', adminOnly: true },
      { href: '/admin/account', label: 'My account', icon: '👤' },
    ],
  },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 text-white lg:hidden">
        <Link href="/admin" className="font-heading font-semibold">Kiteice Admin</Link>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="admin-nav" className="rounded p-1 text-xl" aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      <aside
        id="admin-nav"
        className={`${open ? 'block' : 'hidden'} bg-ink text-white/80 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col`}
        onClick={(e) => e.target.closest('a') && setOpen(false)}
      >
        <Link href="/admin" className="hidden px-5 py-5 font-heading text-lg font-semibold text-white lg:block">
          Kiteice Admin
        </Link>

        <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 pb-4">
          {SECTIONS.map((section, i) => (
            <div key={i} className="mt-4 first:mt-2">
              {section.title && <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">{section.title}</p>}
              <ul>
                {section.items
                  .filter((item) => !item.adminOnly || user.role === 'admin')
                  .map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
                      >
                        <span aria-hidden="true" className="w-5 text-center">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 text-sm">
          <p className="truncate font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-white/50">
            {user.email} · {user.role}
          </p>
          <div className="mt-3 flex gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-md bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">
              View site ↗
            </a>
            <form action={logout}>
              <button type="submit" className="rounded-md bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
