import { images } from '@/lib/images';

// Trip types
export const activities = [
  {
    slug: 'trekking',
    name: 'Trekking',
    icon: '🥾',
    image: images.trekkersTrail,
    description:
      'Multi-day teahouse treks through the Himalayas, from short family-friendly walks to high passes and base camps.',
    metaTitle: 'Trekking in Nepal – Trek Packages',
    metaDescription:
      'Best trekking packages in Nepal: Everest Base Camp, Annapurna Base Camp, Langtang Valley and Manaslu Circuit with licensed local guides.',
  },
  {
    slug: 'peak-climbing',
    name: 'Peak Climbing',
    icon: '🏔️',
    image: images.snowPeak,
    description:
      'Climb your first Himalayan summit. Trekking peaks like Island Peak combine a classic trek with a guided, roped ascent above 6,000 m.',
    metaTitle: 'Peak Climbing in Nepal',
    metaDescription:
      'Guided peak climbing in Nepal, including Island Peak (6,189 m). Climbing permits, experienced climbing guides and full equipment support.',
  },
  {
    slug: 'tours',
    name: 'Tours',
    icon: '🛕',
    image: images.boudhanath,
    description:
      'Cultural and sightseeing tours across Nepal, Tibet and Bhutan: UNESCO heritage sites, monasteries, wildlife and mountain views without the long walks.',
    metaTitle: 'Nepal, Tibet & Bhutan Tours',
    metaDescription:
      'Cultural tour packages: Kathmandu Valley heritage tour, Lhasa tour in Tibet and Bhutan highlights with Tiger’s Nest.',
  },
];
