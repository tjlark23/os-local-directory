/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    // CRITICAL: Disable optimization in dev for speed, enable in production
    unoptimized: process.env.NODE_ENV === 'development',

    // AVIF first for 20-30% better compression than WebP
    formats: ['image/avif', 'image/webp'],

    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 1 year (aggressive caching)
    minimumCacheTTL: 31536000,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Enable compression for better performance
  compress: true,

  // Disable X-Powered-By header for security
  poweredByHeader: false,

  // Enable React Strict Mode
  reactStrictMode: true,

  // Production compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
