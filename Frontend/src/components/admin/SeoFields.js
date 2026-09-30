'use client';

import { TextField } from './form';
import { Card } from './ui';

// Search engine title/description with length counters and a Google-style preview.
// Empty fields fall back to the page's own title/summary on the website.
export default function SeoFields({ form, fallbackTitle = '', fallbackDescription = '' }) {
  const { values, field, errors } = form;
  const title = values.metaTitle || fallbackTitle;
  const description = values.metaDescription || fallbackDescription;

  return (
    <Card title="Search engines (SEO)" description="Optional. Leave empty to use the title and summary.">
      <div className="space-y-4">
        <TextField label="SEO title" maxLength={160} hint={`${(values.metaTitle ?? '').length}/60 recommended`} error={errors.metaTitle} {...field('metaTitle')} />
        <TextField label="SEO description" multiline rows={3} maxLength={320} hint={`${(values.metaDescription ?? '').length}/155 recommended`} error={errors.metaDescription} {...field('metaDescription')} />
        <div className="rounded-lg border border-slate-200 p-3" aria-label="Google preview">
          <p className="truncate text-[15px] text-[#1a0dab]">{title || 'Page title'}</p>
          <p className="line-clamp-2 text-xs text-slate-600">{description || 'Description shown in search results.'}</p>
        </div>
      </div>
    </Card>
  );
}
