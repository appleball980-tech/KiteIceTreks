import Link from 'next/link';
import Container from '@/components/ui/Container';
import Logo from './Logo';

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'All Trips', href: '/trips' },
  { label: 'Travel Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="mb-4 text-base text-white">{title}</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-brand">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ site, nav }) {
  const { contact, social } = site;
  const destinationsNav = nav.find((item) => item.label === 'Destinations')?.children ?? [];
  const regionsNav = nav.find((item) => item.label === 'Trekking Regions')?.children ?? [];
  const socialLinks = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="bg-ink text-white/75">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm">{site.description}</p>
          {socialLinks.length > 0 && (
            <ul className="mt-5 flex gap-4">
              {socialLinks.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-brand">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {destinationsNav.length > 0 && <FooterColumn title="Destinations" links={destinationsNav} />}
        {regionsNav.length > 0 && <FooterColumn title="Trekking Regions" links={regionsNav} />}

        <div>
          <h2 className="mb-4 text-base text-white">Contact Us</h2>
          <address className="space-y-2 not-italic">
            <p>
              {contact.address.street}, {contact.address.city}, {contact.address.countryName}
            </p>
            <p>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-brand">{contact.phone}</a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className="hover:text-brand">{contact.email}</a>
            </p>
          </address>
          <ul className="mt-4 space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>{contact.address.city}, {contact.address.countryName}</p>
        </Container>
      </div>
    </footer>
  );
}
