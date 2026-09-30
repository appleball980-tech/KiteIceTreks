// Backend origin, e.g. http://localhost:4000 (derived from the API URL)
const apiOrigin = new URL(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').origin;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow optimized images from Unsplash (placeholder photos). If you add a host here,
    // also add it to IMAGE_HOSTS in backend/.env and src/lib/admin/images.js.
    // Uploaded images are served from this site's own /uploads path (see rewrites below).
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  experimental: {
    // Admin image uploads go through a Server Action (backend limit is MAX_UPLOAD_MB=10)
    serverActions: { bodySizeLimit: '11mb' },
  },
  // Images uploaded in the admin live on the backend at /uploads/...; proxying them
  // through the website keeps image URLs on your own domain and lets next/image optimize them.
  async rewrites() {
    return [{ source: '/uploads/:path*', destination: `${apiOrigin}/uploads/:path*` }];
  },
};

export default nextConfig;
