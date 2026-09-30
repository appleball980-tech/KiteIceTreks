import Image from 'next/image';
import { images } from '@/lib/images';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function CtaBanner() {
  return (
    <section className="relative isolate overflow-hidden py-24">
      <Image src={images.seaOfClouds} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/75" />
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl text-3xl text-white md:text-4xl">Ready for your Himalayan adventure?</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/85">
          Tell us your dates and interests – our team will design the perfect trip for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/contact">Plan Your Trip</Button>
          <Button href="/trips" variant="outline">Browse All Trips</Button>
        </div>
      </Container>
    </section>
  );
}
