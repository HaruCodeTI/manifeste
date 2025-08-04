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
        hostname: 'lojagall.vtexassets.com',
      },
      {
        protocol: 'https',
        hostname: 'www.distribuidorasexshop.com.br',
      },
      {
        protocol: 'https',
        hostname: 'bxybenfsenafildrevew.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
