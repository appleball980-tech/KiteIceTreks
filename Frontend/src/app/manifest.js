import { getSiteSettings } from '@/lib/api';

// Served at /manifest.webmanifest (lets mobile users "add to home screen")
export default async function manifest() {
  const site = await getSiteSettings();
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0b3b60',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
