// Central company + SEO settings. Change details here and they update everywhere
// (header, footer, meta tags, structured data, sitemap).

export const siteConfig = {
  name: 'Kiteice Travel and Treks',
  legalName: 'Kiteice Travel and Treks (P). Ltd',
  shortName: 'Kiteice Treks',
  tagline: 'Trekking, Tours & Adventures in the Himalayas',
  description:
    'Kiteice Travel and Treks is a Kathmandu-based trekking and tour operator offering Everest, Annapurna, Langtang and Manaslu treks, peak climbing and cultural tours in Nepal, Tibet and Bhutan.',
  // Set NEXT_PUBLIC_SITE_URL to your real domain in production (e.g. https://www.kiteicetreks.com)
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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

export const mainNav = [
  {
    label: 'Destinations',
    href: '/destinations/nepal',
    children: [
      { label: 'Nepal', href: '/destinations/nepal' },
      { label: 'Tibet', href: '/destinations/tibet' },
      { label: 'Bhutan', href: '/destinations/bhutan' },
    ],
  },
  {
    label: 'Trekking Regions',
    href: '/activities/trekking',
    children: [
      { label: 'Everest Region', href: '/regions/everest' },
      { label: 'Annapurna Region', href: '/regions/annapurna' },
      { label: 'Langtang Region', href: '/regions/langtang' },
      { label: 'Manaslu Region', href: '/regions/manaslu' },
    ],
  },
  {
    label: 'Activities',
    href: '/trips',
    children: [
      { label: 'Trekking', href: '/activities/trekking' },
      { label: 'Peak Climbing', href: '/activities/peak-climbing' },
      { label: 'Tours', href: '/activities/tours' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
