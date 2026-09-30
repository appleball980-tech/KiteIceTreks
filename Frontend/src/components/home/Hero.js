import Image from 'next/image';
import { images } from '@/lib/images';
import Container from '@/components/ui/Container';

// Homepage banner with a trip search (plain GET form → /trips?q=…, works without JavaScript)
export default function Hero({ activities, destinations }) {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      <Image
        src={images.amaDablam}
        alt="Ama Dablam peak in the Everest region of Nepal"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/45 to-black/75" />

      <Container className="py-24 text-center text-white">
        <p className="mb-4 font-semibold uppercase tracking-[0.25em] text-brand">Nepal · Tibet · Bhutan</p>
        <h1 className="mx-auto max-w-4xl text-4xl leading-tight text-white md:text-6xl">
          Trekking &amp; Tours in the Himalayas with Local Experts
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
          From Everest Base Camp to hidden valleys, Kiteice Travel and Treks crafts safe, authentic and unforgettable
          adventures.
        </p>

        <form
          action="/trips"
          role="search"
          className="mx-auto mt-10 grid max-w-4xl gap-3 rounded-2xl bg-white/95 p-3 text-left shadow-2xl sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_auto]"
        >
          <label className="sr-only" htmlFor="hero-q">Search trips</label>
          <input
            id="hero-q"
            name="q"
            type="search"
            placeholder="Where do you want to go? e.g. Everest"
            className="rounded-xl border border-slate-200 px-4 py-3 text-ink outline-none focus:border-brand sm:col-span-2 md:col-span-1"
          />
          <label className="sr-only" htmlFor="hero-destination">Destination</label>
          <select id="hero-destination" name="destination" defaultValue="" className="rounded-xl border border-slate-200 px-4 py-3 text-ink">
            <option value="">All destinations</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="hero-activity">Activity</label>
          <select id="hero-activity" name="activity" defaultValue="" className="rounded-xl border border-slate-200 px-4 py-3 text-ink">
            <option value="">All activities</option>
            {activities.map((a) => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
          <button type="submit" className="rounded-xl bg-brand px-8 py-3 font-semibold text-white hover:bg-brand-dark sm:col-span-2 md:col-span-1">
            Search
          </button>
        </form>
      </Container>
    </section>
  );
}
