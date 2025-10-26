import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'product.hstatic.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
