import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

// Each settings group is validated with its own schema. Add a new group here
// (e.g. "seo" or "homepage") and it becomes editable via PUT /admin/settings/:key.
const text = (max) => z.string().trim().max(max);
const url = z.union([z.url().max(300), z.literal('')]);

export const settingsSchemas = {
  company: z.object({
    name: text(120).min(1),
    legalName: text(160).min(1),
    shortName: text(60).min(1),
    tagline: text(160),
    description: text(500),
    keywords: z.array(text(80)).max(50),
  }),
  contact: z.object({
    phone: text(40),
    whatsapp: text(40),
    email: z.email().max(190),
    hours: text(120),
    address: z.object({
      street: text(120),
      city: text(80),
      region: text(80),
      postalCode: text(20),
      country: text(2).toUpperCase(),
      countryName: text(80),
    }),
  }),
  social: z.object({
    facebook: url,
    instagram: url,
    youtube: url,
    tripadvisor: url,
    tiktok: url.optional().default(''),
    x: url.optional().default(''),
  }),
};

export const SETTINGS_KEYS = Object.keys(settingsSchemas);

export async function getSettings() {
  const rows = await prisma.setting.findMany({ where: { key: { in: SETTINGS_KEYS } } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function updateSetting(key, value) {
  const row = await prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
  return row.value;
}
