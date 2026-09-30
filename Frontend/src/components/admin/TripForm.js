'use client';

import {
  CheckboxField,
  DeleteButton,
  FormActions,
  LinesField,
  Repeater,
  SelectField,
  TextField,
  emptyToNull,
  toInt,
  toNumber,
  useResourceForm,
  withKeys,
} from './form';
import ImageField from './ImageField';
import SeoFields from './SeoFields';
import { Card } from './ui';

const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'strenuous'].map((d) => ({ value: d, label: d[0].toUpperCase() + d.slice(1) }));

// First error whose field path starts with `prefix` (e.g. "itinerary.2.title")
const nestedError = (errors, prefix) => Object.entries(errors).find(([field]) => field === prefix || field.startsWith(`${prefix}.`))?.[1];

function initialValues(trip) {
  return {
    title: trip?.title ?? '',
    slug: trip?.slug ?? '',
    destinationId: trip?.destinationId ? String(trip.destinationId) : '',
    regionId: trip?.regionId ? String(trip.regionId) : '',
    activityId: trip?.activityId ? String(trip.activityId) : '',
    difficulty: trip?.difficulty ?? 'moderate',
    durationDays: trip?.durationDays ?? '',
    maxAltitude: trip?.maxAltitude ?? '',
    price: trip?.price ?? '',
    currency: trip?.currency ?? 'USD',
    groupSize: trip?.groupSize ?? '',
    bestSeason: trip?.bestSeason ?? '',
    startEnd: trip?.startEnd ?? '',
    accommodation: trip?.accommodation ?? '',
    image: trip?.image ?? '',
    summary: trip?.summary ?? '',
    overview: trip?.overview ?? [],
    highlights: trip?.highlights ?? [],
    includes: trip?.includes ?? [],
    excludes: trip?.excludes ?? [],
    itinerary: withKeys(trip?.itinerary),
    faqs: withKeys(trip?.faqs),
    metaTitle: trip?.metaTitle ?? '',
    metaDescription: trip?.metaDescription ?? '',
    featured: trip?.featured ?? false,
    isPublished: trip?.isPublished ?? true,
    sortOrder: trip?.sortOrder ?? 0,
  };
}

function toPayload(v) {
  return {
    ...v,
    slug: v.slug.trim() || undefined,
    destinationId: toInt(v.destinationId),
    regionId: toInt(v.regionId),
    activityId: toInt(v.activityId),
    durationDays: toInt(v.durationDays),
    maxAltitude: toInt(v.maxAltitude),
    price: toNumber(v.price),
    sortOrder: toInt(v.sortOrder) ?? 0,
    groupSize: emptyToNull(v.groupSize),
    bestSeason: emptyToNull(v.bestSeason),
    startEnd: emptyToNull(v.startEnd),
    accommodation: emptyToNull(v.accommodation),
    // Days are numbered by their position in the list
    itinerary: v.itinerary.map((d, i) => ({ day: i + 1, title: d.title, description: d.description ?? '' })),
    faqs: v.faqs.map(({ question, answer }) => ({ question, answer })),
  };
}

export default function TripForm({ trip, destinations, regions, activities }) {
  const form = useResourceForm({ resource: 'trips', id: trip?.id, initial: initialValues(trip), toPayload });
  const { values, set, field, errors } = form;
  const regionOptions = regions.filter((r) => String(r.destinationId) === values.destinationId);

  return (
    <form onSubmit={form.submit} noValidate>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Title" required className="sm:col-span-2" error={errors.title} {...field('title')} />
              <TextField label="URL slug" className="sm:col-span-2" error={errors.slug} hint={`Leave empty to create it from the title. Page address: /trips/${values.slug || '…'}`} {...field('slug')} />
              <SelectField
                label="Destination"
                required
                placeholder="Choose…"
                error={errors.destinationId}
                options={destinations.map((d) => ({ value: String(d.id), label: d.name }))}
                {...field('destinationId')}
                onChange={(e) => {
                  set('destinationId', e.target.value);
                  set('regionId', '');
                }}
              />
              <SelectField
                label="Region"
                placeholder={regionOptions.length ? 'None' : 'No regions for this destination'}
                error={errors.regionId}
                options={regionOptions.map((r) => ({ value: String(r.id), label: r.name }))}
                {...field('regionId')}
              />
              <SelectField label="Activity" required placeholder="Choose…" error={errors.activityId} options={activities.map((a) => ({ value: String(a.id), label: a.name }))} {...field('activityId')} />
              <SelectField label="Difficulty" required error={errors.difficulty} options={DIFFICULTIES} {...field('difficulty')} />
              <TextField label="Duration (days)" type="number" min="1" required error={errors.durationDays} {...field('durationDays')} />
              <TextField label="Max altitude (m)" type="number" min="0" error={errors.maxAltitude} {...field('maxAltitude')} />
              <TextField label="Price from (per person)" type="number" min="0" step="0.01" required error={errors.price} {...field('price')} />
              <TextField label="Currency" maxLength={3} error={errors.currency} {...field('currency')} />
            </div>
          </Card>

          <Card title="Trip facts">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Group size" placeholder="1–12" error={errors.groupSize} {...field('groupSize')} />
              <TextField label="Best season" placeholder="Mar–May, Sep–Nov" error={errors.bestSeason} {...field('bestSeason')} />
              <TextField label="Start / end" placeholder="Kathmandu / Kathmandu" error={errors.startEnd} {...field('startEnd')} />
              <TextField label="Accommodation" error={errors.accommodation} {...field('accommodation')} />
            </div>
          </Card>

          <Card title="Description">
            <div className="space-y-4">
              <TextField label="Summary" required multiline rows={3} hint="Shown on trip cards and search results (1–2 sentences)." error={errors.summary} {...field('summary')} />
              <LinesField label="Overview" hint="One paragraph per line" rows={6} value={values.overview} onChange={(v) => set('overview', v)} error={nestedError(errors, 'overview')} />
              <LinesField label="Highlights" value={values.highlights} onChange={(v) => set('highlights', v)} error={nestedError(errors, 'highlights')} />
            </div>
          </Card>

          <Card title="Itinerary" description="Days are numbered automatically in this order.">
            <Repeater
              items={values.itinerary}
              onChange={(v) => set('itinerary', v)}
              newItem={() => ({ title: '', description: '' })}
              addLabel="Add day"
              itemLabel={(_, i) => `Day ${i + 1}`}
              error={nestedError(errors, 'itinerary')}
              renderItem={(day, update) => (
                <div className="space-y-3">
                  <TextField label="Title" value={day.title} onChange={(e) => update({ title: e.target.value })} placeholder="Trek to Namche Bazaar (3,440 m)" />
                  <TextField label="Description" multiline rows={2} value={day.description} onChange={(e) => update({ description: e.target.value })} />
                </div>
              )}
            />
          </Card>

          <Card title="What’s included">
            <div className="grid gap-4 sm:grid-cols-2">
              <LinesField label="Included" rows={8} value={values.includes} onChange={(v) => set('includes', v)} error={nestedError(errors, 'includes')} />
              <LinesField label="Not included" rows={8} value={values.excludes} onChange={(v) => set('excludes', v)} error={nestedError(errors, 'excludes')} />
            </div>
          </Card>

          <Card title="FAQs" description="Also added to Google results as FAQ rich snippets.">
            <Repeater
              items={values.faqs}
              onChange={(v) => set('faqs', v)}
              newItem={() => ({ question: '', answer: '' })}
              addLabel="Add question"
              itemLabel={(_, i) => `Question ${i + 1}`}
              error={nestedError(errors, 'faqs')}
              renderItem={(faq, update) => (
                <div className="space-y-3">
                  <TextField label="Question" value={faq.question} onChange={(e) => update({ question: e.target.value })} />
                  <TextField label="Answer" multiline rows={3} value={faq.answer} onChange={(e) => update({ answer: e.target.value })} />
                </div>
              )}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Visibility">
            <div className="space-y-3">
              <CheckboxField label="Published" hint="Hidden trips are not shown on the website." {...field('isPublished', { type: 'checkbox' })} />
              <CheckboxField label="Featured" hint="Shown in “Popular Treks & Tours” on the home page." {...field('featured', { type: 'checkbox' })} />
              <TextField label="Sort order" type="number" hint="Lower numbers are listed first." error={errors.sortOrder} {...field('sortOrder')} />
              {trip && (
                <a href={`/trips/${trip.slug}`} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-brand hover:underline">
                  View on website ↗
                </a>
              )}
            </div>
          </Card>

          <Card title="Cover image">
            <ImageField label="Image" required value={values.image} onChange={(v) => set('image', v)} error={errors.image} />
          </Card>

          <SeoFields form={form} fallbackTitle={values.title} fallbackDescription={values.summary} />
        </div>
      </div>

      <FormActions form={form} submitLabel={trip ? 'Save changes' : 'Create trip'}>
        {trip && <DeleteButton resource="trips" id={trip.id} redirectTo="/admin/trips" label="Delete trip" />}
      </FormActions>
    </form>
  );
}
