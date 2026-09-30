import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';
import { getSiteSettings } from '@/lib/api';

// Default social-share image (Facebook, WhatsApp, LinkedIn, X) for pages without their own photo
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const site = await getSiteSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #0b3b60 0%, #164f7c 60%, #f28c28 140%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, color: '#f28c28' }}>NEPAL · TIBET · BHUTAN</div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 20 }}>{site.name}</div>
        <div style={{ fontSize: 38, marginTop: 20, opacity: 0.9 }}>{site.tagline}</div>
      </div>
    ),
    size
  );
}
