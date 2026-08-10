/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Autoriza qualquer projeto do Supabase (para as fotos dos pratos)
      },
    ],
  },
};

module.exports = nextConfig;