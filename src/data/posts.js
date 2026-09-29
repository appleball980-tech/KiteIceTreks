import { images } from '@/lib/images';

// Blog posts are great for SEO: each one targets a question travellers search for.
export const posts = [
  {
    slug: 'best-time-to-trek-in-nepal',
    title: 'Best Time to Trek in Nepal: A Season-by-Season Guide',
    excerpt:
      'Spring and autumn are the classic trekking seasons, but winter and monsoon have their own rewards. Here is how to choose the right month for your trek.',
    image: images.trekkerHimalaya,
    author: 'Kiteice Team',
    publishedAt: '2026-09-01',
    tags: ['Planning', 'Seasons'],
    sections: [
      {
        heading: 'Autumn (September–November)',
        paragraphs: [
          'Autumn is the most popular trekking season in Nepal. The monsoon rains clear the dust from the air, giving crisp mountain views and stable weather. Trails and teahouses are busiest in October.',
        ],
      },
      {
        heading: 'Spring (March–May)',
        paragraphs: [
          'Spring brings warmer temperatures and rhododendron forests in full bloom. It is also Everest expedition season, so base camp is full of climbers’ tents.',
        ],
      },
      {
        heading: 'Winter and monsoon',
        paragraphs: [
          'Winter (December–February) is cold at altitude but quiet and clear – ideal for lower treks like Langtang or Ghorepani. Monsoon (June–August) is wet in most regions, but rain-shadow areas like Upper Mustang are excellent.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-prepare-for-everest-base-camp-trek',
    title: 'How to Prepare for the Everest Base Camp Trek',
    excerpt:
      'A practical training plan, packing tips and altitude advice to help you reach Everest Base Camp feeling strong.',
    image: images.amaDablam,
    author: 'Kiteice Team',
    publishedAt: '2026-08-15',
    tags: ['Everest', 'Fitness'],
    sections: [
      {
        heading: 'Start training 8–12 weeks before',
        paragraphs: [
          'Focus on cardio endurance: hiking with a loaded backpack, stair climbing, cycling and running. Aim for at least one long hike of 5–6 hours per week in the last month.',
        ],
      },
      {
        heading: 'Pack light but smart',
        paragraphs: [
          'Porters carry up to 10–12 kg per trekker. Bring layers rather than bulky items: thermal base layers, a fleece, a down jacket, a waterproof shell and a good sleeping bag rated to –10 °C.',
        ],
      },
      {
        heading: 'Respect the altitude',
        paragraphs: [
          'Walk slowly, drink 3–4 litres of water a day and use the acclimatization days. Tell your guide about any headache, nausea or dizziness straight away.',
        ],
      },
    ],
  },
  {
    slug: 'altitude-sickness-prevention-tips',
    title: 'Altitude Sickness: Symptoms and Prevention Tips for Trekkers',
    excerpt:
      'Acute Mountain Sickness can affect anyone above 2,500 m. Learn the warning signs and the simple rules that keep you safe in the Himalayas.',
    image: images.snowPeak,
    author: 'Kiteice Team',
    publishedAt: '2026-07-20',
    tags: ['Safety', 'Health'],
    sections: [
      {
        heading: 'Know the symptoms',
        paragraphs: [
          'Common early symptoms of Acute Mountain Sickness (AMS) are headache, loss of appetite, nausea, fatigue and poor sleep. Serious forms (HAPE and HACE) cause breathlessness at rest, confusion and loss of coordination and need immediate descent.',
        ],
      },
      {
        heading: 'Golden rules',
        paragraphs: [
          'Above 3,000 m, increase your sleeping altitude by no more than 300–500 m per day, take a rest day every 3–4 days, and never go higher with symptoms. Consult your doctor before the trip about medication such as acetazolamide.',
        ],
      },
    ],
  },
];
