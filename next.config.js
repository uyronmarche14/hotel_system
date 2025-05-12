/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  // Add experimental flags to improve build stability
  experimental: {
    // Help with potential module resolution issues
    optimizeCss: true,
    // Ensure vendor chunks are properly created
    optimizePackageImports: ['react-icons'],
  },
};

module.exports = nextConfig;
