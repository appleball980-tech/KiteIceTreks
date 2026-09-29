import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

const REASONS = [
  { icon: '🧭', title: 'Local Expert Guides', text: 'Government-licensed guides born and raised in the Himalayas, trained in first aid and altitude safety.' },
  { icon: '🗺️', title: 'Tailor-Made Trips', text: 'Every itinerary can be adjusted to your dates, pace, budget and interests – private or group.' },
  { icon: '🛡️', title: 'Safety First', text: 'Built-in acclimatization days, oximeter checks on trek and emergency evacuation support.' },
  { icon: '🌱', title: 'Responsible Travel', text: 'Fair wages and insurance for porters, small groups and eco-friendly trekking practices.' },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-ice py-20">
      <Container>
        <SectionHeading
          eyebrow="Why Kiteice"
          title="Why Travel With Us"
          description="A Kathmandu-based team dedicated to safe, authentic and well-organized Himalayan adventures."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <div key={reason.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <div aria-hidden="true" className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ice text-3xl">
                {reason.icon}
              </div>
              <h3 className="mb-2 text-lg">{reason.title}</h3>
              <p className="text-sm text-muted">{reason.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
