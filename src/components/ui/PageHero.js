import Image from 'next/image';
import Container from './Container';
import Breadcrumbs from './Breadcrumbs';

// Banner at the top of inner pages: background photo, breadcrumbs and the page <h1>
export default function PageHero({ title, subtitle, image, breadcrumbs = [], children }) {
  return (
    <section className="relative isolate flex min-h-[340px] items-end overflow-hidden bg-ink md:min-h-[420px]">
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/35 to-black/10" />
      <Container className="pb-10 pt-24">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} light />}
        <h1 className="mt-3 max-w-4xl text-3xl text-white md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-white/90">{subtitle}</p>}
        {children}
      </Container>
    </section>
  );
}
