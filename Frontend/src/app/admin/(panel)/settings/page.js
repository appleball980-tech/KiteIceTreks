import { adminFetch } from '@/lib/admin/api';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/admin/ui';
import SettingsForms from '@/components/admin/SettingsForms';

export const metadata = { title: 'Site settings' };

export default async function SettingsPage() {
  const { data } = await adminFetch('/admin/settings');
  // Anything not saved yet falls back to the defaults in src/config/site.js
  const settings = {
    company: data.company ?? {
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      shortName: siteConfig.shortName,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
    },
    contact: data.contact ?? siteConfig.contact,
    social: data.social ?? siteConfig.social,
  };

  return (
    <>
      <PageHeader title="Site settings" description="Company details, contact information and social links used across the whole website." />
      <SettingsForms settings={settings} />
    </>
  );
}
