'use client';

import { CheckboxField, DeleteButton, FormActions, SelectField, TextField, toInt, useResourceForm } from './form';
import ImageField from './ImageField';
import SeoFields from './SeoFields';
import { Card } from './ui';

// Shared form for destinations, regions and activities (they differ by one or two fields)
export const CATEGORY_TYPES = {
  destinations: { singular: 'destination', path: '/destinations' },
  regions: { singular: 'region', path: '/regions' },
  activities: { singular: 'activity', path: '/activities' },
};

export default function CategoryForm({ resource, record, destinations = [] }) {
  const type = CATEGORY_TYPES[resource];
  const form = useResourceForm({
    resource,
    id: record?.id,
    initial: {
      name: record?.name ?? '',
      slug: record?.slug ?? '',
      tagline: record?.tagline ?? '',
      icon: record?.icon ?? '',
      destinationId: record?.destinationId ? String(record.destinationId) : '',
      description: record?.description ?? '',
      image: record?.image ?? '',
      metaTitle: record?.metaTitle ?? '',
      metaDescription: record?.metaDescription ?? '',
      sortOrder: record?.sortOrder ?? 0,
      isPublished: record?.isPublished ?? true,
    },
    toPayload: ({ tagline, icon, destinationId, ...v }) => ({
      ...v,
      slug: v.slug.trim() || undefined,
      sortOrder: toInt(v.sortOrder) ?? 0,
      ...(resource === 'destinations' && { tagline }),
      ...(resource === 'activities' && { icon }),
      ...(resource === 'regions' && { destinationId: toInt(destinationId) }),
    }),
  });
  const { values, set, field, errors } = form;
  const tripCount = record?._count?.trips ?? 0;

  return (
    <form onSubmit={form.submit} noValidate>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" required error={errors.name} {...field('name')} className={resource === 'activities' ? '' : 'sm:col-span-2'} />
              {resource === 'activities' && <TextField label="Icon (emoji)" maxLength={16} placeholder="🥾" error={errors.icon} {...field('icon')} />}
              <TextField label="URL slug" className="sm:col-span-2" error={errors.slug} hint={`Leave empty to create it from the name. Page address: ${type.path}/${values.slug || '…'}`} {...field('slug')} />
              {resource === 'regions' && (
                <SelectField label="Destination" required placeholder="Choose…" className="sm:col-span-2" error={errors.destinationId} options={destinations.map((d) => ({ value: String(d.id), label: d.name }))} {...field('destinationId')} />
              )}
              {resource === 'destinations' && <TextField label="Tagline" className="sm:col-span-2" error={errors.tagline} {...field('tagline')} />}
              <TextField label="Description" required multiline rows={5} className="sm:col-span-2" error={errors.description} {...field('description')} />
            </div>
          </Card>
          <Card title="Image">
            <ImageField label="Cover image" required value={values.image} onChange={(v) => set('image', v)} error={errors.image} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Visibility">
            <div className="space-y-3">
              <CheckboxField label="Published" hint="Hidden items disappear from the website and menu." {...field('isPublished', { type: 'checkbox' })} />
              <TextField label="Sort order" type="number" hint="Lower numbers come first in menus and lists." error={errors.sortOrder} {...field('sortOrder')} />
              {record && (
                <a href={`${type.path}/${record.slug}`} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-brand hover:underline">
                  View on website ↗
                </a>
              )}
            </div>
          </Card>
          <SeoFields form={form} fallbackTitle={values.name} fallbackDescription={values.description} />
        </div>
      </div>

      <FormActions form={form} submitLabel={record ? 'Save changes' : `Create ${type.singular}`}>
        {record &&
          (tripCount > 0 || record._count?.regions > 0 ? (
            <span className="self-center text-xs text-muted">Can’t delete: still has {tripCount} trip(s){record._count?.regions ? ` and ${record._count.regions} region(s)` : ''}.</span>
          ) : (
            <DeleteButton resource={resource} id={record.id} redirectTo={`/admin/${resource}`} />
          ))}
      </FormActions>
    </form>
  );
}
