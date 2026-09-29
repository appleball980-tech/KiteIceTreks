/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow optimized images from Unsplash (placeholder photos).
    // Add your CDN / backend image host here later.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
