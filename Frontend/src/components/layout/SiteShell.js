import { getNavigation, getSiteSettings } from '@/lib/api';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

// Public website chrome: top bar, header, footer and site-wide structured data.
// Used by the (site) layout and the global 404 page; the admin has its own layout.
export default async function SiteShell({ children }) {
  const [site, nav] = await Promise.all([getSiteSettings(), getNavigation()]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-3">
        Skip to content
      </a>
      <TopBar contact={site.contact} />
      <Header nav={nav} />
      <main id="main" className="flex-1">{children}</main>
      <Footer site={site} nav={nav} />
      <JsonLd data={organizationJsonLd(site)} />
      <JsonLd data={websiteJsonLd(site)} />
    </>
  );
}
