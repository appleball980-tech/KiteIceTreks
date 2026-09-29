import { siteConfig } from '@/config/site';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function BookingCard({ trip }) {
  const whatsappText = encodeURIComponent(`Hi, I'm interested in the ${trip.title}.`);
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
      <p className="text-sm text-muted">Price from</p>
      <p className="mb-1 text-4xl font-bold text-ink">
        {formatPrice(trip.price)} <span className="text-base font-normal text-muted">/ person</span>
      </p>
      <p className="mb-6 text-sm text-muted">Private and group departures available.</p>

      <div className="space-y-3">
        <Button href={`/contact?trip=${trip.slug}`} className="w-full">
          Book This Trip
        </Button>
        <Button href={`/contact?trip=${trip.slug}&type=inquiry`} variant="ghost" className="w-full">
          Send an Enquiry
        </Button>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp.replace('+', '')}?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          💬 Chat on WhatsApp
        </a>
      </div>

      <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm">
        <li>✓ Licensed local guides</li>
        <li>✓ Tailor-made itineraries on request</li>
        <li>✓ Airport pick-up included</li>
      </ul>
    </div>
  );
}
