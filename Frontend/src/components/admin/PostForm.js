'use client';

import { CheckboxField, DeleteButton, FormActions, LinesField, Repeater, TextField, useResourceForm, withKeys } from './form';
import ImageField from './ImageField';
import SeoFields from './SeoFields';
import { Card } from './ui';

const today = () => new Date().toISOString().slice(0, 10);
const nestedError = (errors, prefix) => Object.entries(errors).find(([f]) => f === prefix || f.startsWith(`${prefix}.`))?.[1];

function initialValues(post) {
  return {
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    author: post?.author ?? 'Kiteice Team',
    image: post?.image ?? '',
    publishedAt: post?.publishedAt ? post.publishedAt.slice(0, 10) : today(),
    tags: (post?.tags ?? []).map((t) => t.name).join(', '),
    sections: withKeys(post?.sections ?? [{ heading: '', paragraphs: [] }]),
    metaTitle: post?.metaTitle ?? '',
    metaDescription: post?.metaDescription ?? '',
    isPublished: post?.isPublished ?? true,
  };
}

const toPayload = (v) => ({
  ...v,
  slug: v.slug.trim() || undefined,
  tags: v.tags.split(',').map((t) => t.trim()).filter(Boolean),
  sections: v.sections.map(({ heading, paragraphs }) => ({ heading, paragraphs })),
});

export default function PostForm({ post }) {
  const form = useResourceForm({ resource: 'posts', id: post?.id, initial: initialValues(post), toPayload });
  const { values, set, field, errors } = form;
  const scheduled = values.publishedAt > today();

  return (
    <form onSubmit={form.submit} noValidate>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <TextField label="Title" required error={errors.title} {...field('title')} />
              <TextField label="URL slug" error={errors.slug} hint={`Leave empty to create it from the title. Page address: /blog/${values.slug || '…'}`} {...field('slug')} />
              <TextField label="Excerpt" required multiline rows={3} hint="Short intro shown on blog cards and in search results." error={errors.excerpt} {...field('excerpt')} />
            </div>
          </Card>

          <Card title="Article" description="Each section has an optional heading and one or more paragraphs.">
            <Repeater
              items={values.sections}
              onChange={(v) => set('sections', v)}
              newItem={() => ({ heading: '', paragraphs: [] })}
              addLabel="Add section"
              itemLabel={(s, i) => s.heading || `Section ${i + 1}`}
              error={nestedError(errors, 'sections')}
              renderItem={(section, update) => (
                <div className="space-y-3">
                  <TextField label="Heading" value={section.heading} onChange={(e) => update({ heading: e.target.value })} />
                  <LinesField label="Paragraphs" hint="One paragraph per line" rows={6} value={section.paragraphs} onChange={(paragraphs) => update({ paragraphs })} />
                </div>
              )}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publishing">
            <div className="space-y-3">
              <CheckboxField label="Published" hint="Unpublished posts are hidden from the website." {...field('isPublished', { type: 'checkbox' })} />
              <TextField label="Publish date" type="date" required error={errors.publishedAt} hint={scheduled ? 'Scheduled: appears on the website on this date.' : undefined} {...field('publishedAt')} />
              <TextField label="Author" required error={errors.author} {...field('author')} />
              <TextField label="Tags" hint="Separate with commas, e.g. Planning, Everest" error={nestedError(errors, 'tags')} {...field('tags')} />
              {post && (
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-brand hover:underline">
                  View on website ↗
                </a>
              )}
            </div>
          </Card>

          <Card title="Cover image">
            <ImageField label="Image" required value={values.image} onChange={(v) => set('image', v)} error={errors.image} />
          </Card>

          <SeoFields form={form} fallbackTitle={values.title} fallbackDescription={values.excerpt} />
        </div>
      </div>

      <FormActions form={form} submitLabel={post ? 'Save changes' : 'Create post'}>
        {post && <DeleteButton resource="posts" id={post.id} redirectTo="/admin/posts" label="Delete post" />}
      </FormActions>
    </form>
  );
}
