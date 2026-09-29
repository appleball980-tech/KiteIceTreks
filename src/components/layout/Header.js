'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { mainNav } from '@/config/site';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Logo from './Logo';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo />

        {/* Desktop navigation – dropdowns open on hover and keyboard focus */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 font-medium transition-colors hover:text-brand ${
                    isActive(item.href) ? 'text-brand' : 'text-ink'
                  }`}
                >
                  {item.label}
                  {item.children && <span aria-hidden="true" className="text-xs">▾</span>}
                </Link>
                {item.children && (
                  <ul className="invisible absolute left-0 top-full min-w-56 translate-y-2 rounded-lg border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block rounded-md px-3 py-2 text-ink hover:bg-ice hover:text-brand">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button href="/contact" className="px-5 py-2.5">Plan Your Trip</Button>
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-2xl text-ink lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </Container>

      {/* Mobile navigation */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          // Close the menu when any link inside it is clicked
          onClick={(e) => e.target.closest('a') && setMobileOpen(false)}
          className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-slate-100 bg-white lg:hidden">
          <Container as="ul" className="py-4">
            {mainNav.map((item) => (
              <li key={item.label} className="border-b border-slate-100 last:border-0">
                {item.children ? (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-medium text-ink">
                      {item.label}
                      <span aria-hidden="true" className="transition-transform group-open:rotate-180">▾</span>
                    </summary>
                    <ul className="pb-3 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block py-2 text-muted hover:text-brand">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={item.href} className="block py-3 font-medium text-ink">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-4">
              <Button href="/contact" className="w-full">Plan Your Trip</Button>
            </li>
          </Container>
        </nav>
      )}
    </header>
  );
}
