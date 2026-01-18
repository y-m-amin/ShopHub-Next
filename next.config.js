/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use Babel as fallback for Windows compatibility
  experimental: {
    forceSwcTransforms: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
    ],
  },
  // Environment-specific configuration
  env: {
    NEXT_PUBLIC_API_URL: '/api', // Always use relative API URLs
  },
};

export default nextConfig;
