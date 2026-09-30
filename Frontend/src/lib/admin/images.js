// Image hosts next/image may load. Keep in sync with images.remotePatterns in
// next.config.mjs and IMAGE_HOSTS in backend/.env.
export const IMAGE_HOSTS = ['images.unsplash.com'];

// True when next/image can render this URL (otherwise we show a placeholder)
export function isPreviewableImage(url) {
  if (!url) return false;
  if (/^\/uploads\/[\w./-]+$/.test(url)) return true;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
