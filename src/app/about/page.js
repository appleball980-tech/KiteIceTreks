import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { images } from '@/lib/images';
import Container from '@/components/ui/Container';
import PageHero from '@/components/ui/PageHero';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CtaBanner from '@/components/home/CtaBanner';

export const metadata = buildMetadata({
  title: 'About Us – Local Trekking Agency in Kathmandu',
  description: `Learn about ${siteConfig.legalName}, a locally owned trekking and tour operator in Kathmandu, Nepal, with licensed guides and a passion for responsible travel.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Kiteice Travel and Treks"
        subtitle="A locally owned Himalayan travel company based in Kathmandu."
        image={images.patanTemple}
        breadcrumbs={[{ name: 'About Us', href: '/about' }]}
      />

      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2">
        {/* TODO: replace this text with your own company story */}
        <div className="prose-content text-lg">
          <h2 className="mt-0! text-3xl">Our Story</h2>
          <p>
            {siteConfig.legalName} is a Kathmandu-based trekking and tour operator. Our team of local guides and porters
            share a love for the mountains, culture and people of the Himalayas.
          </p>
          <p>
            We organise treks, peak climbing and cultural tours in Nepal, Tibet and Bhutan – from classic routes like
            Everest Base Camp to quiet valleys off the beaten path. Every trip is planned with safety, fair treatment of
            our staff and respect for local communities in mind.
          </p>
          <p>
            Whether you are a first-time trekker or an experienced mountaineer, we will tailor your journey to your
            dates, budget and interests.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
          <Image src={images.trekkerHimalaya} alt="Trekker overlooking Himalayan peaks" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </Container>

      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
