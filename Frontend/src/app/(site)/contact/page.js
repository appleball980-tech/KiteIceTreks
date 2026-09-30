import { buildMetadata } from '@/lib/seo';
import { images } from '@/lib/images';
import { getSiteSettings, getTrips } from '@/lib/api';
import Container from '@/components/ui/Container';
import PageHero from '@/components/ui/PageHero';
import InquiryForm from '@/components/forms/InquiryForm';

export async function generateMetadata() {
  const site = await getSiteSettings();
  return buildMetadata({
    title: 'Contact Us – Plan Your Trip',
    description: `Contact ${site.name} in Kathmandu to book a trek or tour, ask a question or plan a custom Himalayan trip. Call, WhatsApp or send us a message.`,
    path: '/contact',
  });
}

export default async function ContactPage({ searchParams }) {
  const { trip = '', type = 'booking' } = await searchParams;
  const [trips, { contact }] = await Promise.all([getTrips(), getSiteSettings()]);

  const details = [
    { icon: '📍', label: 'Office', value: `${contact.address.street}, ${contact.address.city}, ${contact.address.countryName}` },
    { icon: '📞', label: 'Phone / WhatsApp', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    { icon: '✉️', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: '🕘', label: 'Office Hours', value: contact.hours },
  ];

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Tell us about your dream trip and we will get back to you."
        image={images.swayambhunath}
        breadcrumbs={[{ name: 'Contact', href: '/contact' }]}
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="mb-6 text-2xl">Get in Touch</h2>
          <ul className="space-y-5">
            {details.map((d) => (
              <li key={d.label} className="flex gap-4">
                <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ice text-xl">{d.icon}</span>
                <div>
                  <p className="text-sm text-muted">{d.label}</p>
                  {d.href ? (
                    <a href={d.href} className="font-semibold text-ink hover:text-brand">{d.value}</a>
                  ) : (
                    <p className="font-semibold text-ink">{d.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100 md:p-8">
          <h2 className="mb-6 text-2xl">Send Us a Message</h2>
          <InquiryForm trips={trips} contact={contact} defaultTrip={trip} defaultType={type} />
        </div>
      </Container>
    </>
  );
}
