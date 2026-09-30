import { Inter, Poppins } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { getSiteSettings } from '@/lib/api';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-poppins', display: 'swap' });

// Default SEO for every page, using the company details from the admin settings.
// Each page sets its own title, description and canonical URL with buildMetadata()
// from '@/lib/seo' (a canonical here would be inherited by every page).
export async function generateMetadata() {
  const site = await getSiteSettings();
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${site.name} | ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: site.keywords,
    applicationName: site.name,
    authors: [{ name: site.legalName }],
    creator: site.legalName,
    publisher: site.legalName,
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: siteConfig.locale,
      title: site.name,
      description: site.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: site.name,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    // Paste your Google Search Console / Bing verification codes here when you have them
    verification: {},
  };
}

export const viewport = {
  themeColor: '#0b3b60',
};

// Shared by the public website ((site) route group) and the admin dashboard (/admin),
// which each add their own header/footer in their own layouts.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
