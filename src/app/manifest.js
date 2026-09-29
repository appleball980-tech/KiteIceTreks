import { siteConfig } from '@/config/site';

// Served at /manifest.webmanifest (lets mobile users "add to home screen")
export default function manifest() {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
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
