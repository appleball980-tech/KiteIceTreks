import { buildMetadata } from '@/lib/seo';
import { getActivities, getDestinations, getFeaturedTrips, getPosts, getRegions, getSiteSettings, getTestimonials } from '@/lib/api';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import TripGrid from '@/components/trip/TripGrid';
import PostCard from '@/components/blog/PostCard';
import Hero from '@/components/home/Hero';
import CategoryCards from '@/components/home/CategoryCards';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import CtaBanner from '@/components/home/CtaBanner';

export async function generateMetadata() {
  const site = await getSiteSettings();
  return buildMetadata({
    title: `${site.name} | Nepal Trekking, Tours & Peak Climbing`,
    description: site.description,
    path: '/',
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [featuredTrips, destinations, regions, activities, posts, testimonials] = await Promise.all([
    getFeaturedTrips(6),
    getDestinations(),
    getRegions(),
    getActivities(),
    getPosts(3),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero activities={activities} destinations={destinations} />

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Top Picks"
            title="Popular Treks & Tours"
            description="Our travellers’ favourite Himalayan journeys, from classic base camp treks to cultural tours."
          />
          <TripGrid trips={featuredTrips} />
          <div className="mt-10 text-center">
            <Button href="/trips" variant="ghost">View All Trips</Button>
          </div>
        </Container>
      </section>

      <section className="bg-ice py-20">
        <Container>
          <SectionHeading eyebrow="Where We Go" title="Explore Our Destinations" />
          <CategoryCards items={destinations} basePath="/destinations" />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Trekking in Nepal"
            title="Popular Trekking Regions"
            description="Each region has its own landscapes, culture and trails. Find the one that suits you."
          />
          <CategoryCards items={regions} basePath="/regions" columns="lg:grid-cols-4" />
        </Container>
      </section>

      <WhyChooseUs />

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Adventure Styles" title="Choose Your Activity" />
          <CategoryCards items={activities} basePath="/activities" />
        </Container>
      </section>

      <CtaBanner />

      <Testimonials testimonials={testimonials} />

      <section className="bg-ice py-20">
        <Container>
          <SectionHeading eyebrow="Travel Guide" title="Latest From Our Blog" />
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
