// Default company + SEO settings. Company, contact and social details are edited in
// the admin (stored in the database) and override these values; see getSiteSettings()
// in src/lib/api.js. The menu is built from the database too (getNavigation()).
// url and locale are deployment settings and stay here.

export const siteConfig = {
  name: 'Kiteice Travel and Treks',
  legalName: 'Kiteice Travel and Treks (P). Ltd',
  shortName: 'Kiteice Treks',
  tagline: 'Trekking, Tours & Adventures in the Himalayas',
  description:
    'Kiteice Travel and Treks is a Kathmandu-based trekking and tour operator offering Everest, Annapurna, Langtang and Manaslu treks, peak climbing and cultural tours in Nepal, Tibet and Bhutan.',
  // Set NEXT_PUBLIC_SITE_URL to your real domain once you have one (e.g. https://www.kiteicetreks.com).
  // On Vercel it falls back to the project's production URL automatically.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'http://localhost:3000',
  locale: 'en_US',
  keywords: [
    'Nepal trekking',
    'Everest Base Camp trek',
    'Annapurna Base Camp trek',
    'Langtang trek',
    'Manaslu Circuit trek',
    'Island Peak climbing',
    'Nepal tour packages',
    'Tibet tour',
    'Bhutan tour',
    'trekking agency in Nepal',
  ],
  // TODO: replace the placeholder email and confirm the address before launch
  contact: {
    phone: '+977 9861631483',
    whatsapp: '+9779861631483',
    email: 'info@yourdomain.com',
    address: {
      street: 'Thamel',
      city: 'Kathmandu',
      region: 'Bagmati',
      postalCode: '44600',
      country: 'NP',
      countryName: 'Nepal',
    },
    hours: 'Sun–Fri, 9:00 AM – 6:00 PM (NPT)',
  },
  // Add your real profile URLs; empty ones are hidden automatically
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    tripadvisor: '',
  },
};
