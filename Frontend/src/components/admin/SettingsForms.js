'use client';

import { saveSettings } from '@/lib/admin/actions';
import { StatusMessage, TextField, useResourceForm } from './form';
import { Card, buttonClass } from './ui';

function SaveRow({ form }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
      <button type="submit" disabled={form.pending} className={buttonClass('primary')}>
        {form.pending ? 'Saving…' : 'Save'}
      </button>
      <StatusMessage status={form.status} />
    </div>
  );
}

// Errors come back as "address.city"; show them on the matching input
const err = (errors, name) => errors[name];

function CompanyForm({ initial }) {
  const form = useResourceForm({
    initial: { ...initial, keywords: (initial.keywords ?? []).join(', ') },
    toPayload: (v) => ({ ...v, keywords: v.keywords.split(',').map((k) => k.trim()).filter(Boolean) }),
    save: (payload) => saveSettings('company', payload),
  });
  const { field, errors } = form;
  return (
    <form onSubmit={form.submit} noValidate>
      <Card title="Company" description="Your name and description appear in page titles, the footer and Google results.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Company name" required error={err(errors, 'name')} {...field('name')} />
          <TextField label="Short name" required hint="Used when space is tight (e.g. phone home screen)" error={err(errors, 'shortName')} {...field('shortName')} />
          <TextField label="Legal name" required className="sm:col-span-2" error={err(errors, 'legalName')} {...field('legalName')} />
          <TextField label="Tagline" className="sm:col-span-2" error={err(errors, 'tagline')} {...field('tagline')} />
          <TextField label="Description" multiline rows={3} className="sm:col-span-2" hint="About 150 characters is ideal for Google." error={err(errors, 'description')} {...field('description')} />
          <TextField label="SEO keywords" multiline rows={2} className="sm:col-span-2" hint="Separate with commas" error={err(errors, 'keywords')} {...field('keywords')} />
        </div>
        <SaveRow form={form} />
      </Card>
    </form>
  );
}

function ContactForm({ initial }) {
  const { address, ...rest } = initial;
  const form = useResourceForm({
    initial: { ...rest, ...Object.fromEntries(Object.entries(address ?? {}).map(([k, v]) => [`address.${k}`, v])) },
    toPayload: (v) => ({
      phone: v.phone,
      whatsapp: v.whatsapp,
      email: v.email,
      hours: v.hours,
      address: Object.fromEntries(['street', 'city', 'region', 'postalCode', 'country', 'countryName'].map((k) => [k, v[`address.${k}`] ?? ''])),
    }),
    save: (payload) => saveSettings('contact', payload),
  });
  const { field, errors } = form;
  return (
    <form onSubmit={form.submit} noValidate>
      <Card title="Contact" description="Shown in the top bar, footer, contact page and booking buttons.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Phone" error={err(errors, 'phone')} {...field('phone')} />
          <TextField label="WhatsApp number" hint="International format, e.g. +9779861631483" error={err(errors, 'whatsapp')} {...field('whatsapp')} />
          <TextField label="Email" type="email" required error={err(errors, 'email')} {...field('email')} />
          <TextField label="Office hours" error={err(errors, 'hours')} {...field('hours')} />
          <TextField label="Street" error={err(errors, 'address.street')} {...field('address.street')} />
          <TextField label="City" error={err(errors, 'address.city')} {...field('address.city')} />
          <TextField label="Province / region" error={err(errors, 'address.region')} {...field('address.region')} />
          <TextField label="Postal code" error={err(errors, 'address.postalCode')} {...field('address.postalCode')} />
          <TextField label="Country name" error={err(errors, 'address.countryName')} {...field('address.countryName')} />
          <TextField label="Country code" maxLength={2} hint="2 letters, e.g. NP" error={err(errors, 'address.country')} {...field('address.country')} />
        </div>
        <SaveRow form={form} />
      </Card>
    </form>
  );
}

const SOCIAL = [
  ['facebook', 'Facebook', 'https://facebook.com/…'],
  ['instagram', 'Instagram', 'https://instagram.com/…'],
  ['youtube', 'YouTube', 'https://youtube.com/@…'],
  ['tripadvisor', 'Tripadvisor', 'https://tripadvisor.com/…'],
  ['tiktok', 'TikTok', 'https://tiktok.com/@…'],
  ['x', 'X (Twitter)', 'https://x.com/…'],
];

function SocialForm({ initial }) {
  const form = useResourceForm({
    initial: Object.fromEntries(SOCIAL.map(([key]) => [key, initial[key] ?? ''])),
    save: (payload) => saveSettings('social', payload),
  });
  const { field, errors } = form;
  return (
    <form onSubmit={form.submit} noValidate>
      <Card title="Social media" description="Full profile URLs. Empty links are hidden on the website.">
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL.map(([key, label, placeholder]) => (
            <TextField key={key} label={label} type="url" placeholder={placeholder} error={err(errors, key)} {...field(key)} />
          ))}
        </div>
        <SaveRow form={form} />
      </Card>
    </form>
  );
}

export default function SettingsForms({ settings }) {
  return (
    <div className="space-y-6">
      <CompanyForm initial={settings.company} />
      <ContactForm initial={settings.contact} />
      <SocialForm initial={settings.social} />
    </div>
  );
}
