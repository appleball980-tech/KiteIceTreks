import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} – Home`}>
      <Image src="/logo.png" alt="" width={40} height={40} priority />
      <span className="leading-tight">
        <span className={`block font-heading text-lg font-bold ${light ? 'text-white' : 'text-ink'}`}>Kiteice</span>
        <span className={`block text-[11px] uppercase tracking-[0.2em] ${light ? 'text-white/70' : 'text-muted'}`}>
          Travel &amp; Treks
        </span>
      </span>
    </Link>
  );
}
