import { absoluteUrl } from '@/lib/seo';

// Served at /robots.txt
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
