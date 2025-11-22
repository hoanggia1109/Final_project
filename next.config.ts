import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',               // localhost dùng http
        hostname: 'localhost',          // cho phép load ảnh từ localhost backend
        port: '5001',                   // cổng backend (đổi từ 5000 vì bị AirPlay chiếm)
        pathname: '/uploads/**',        // chỉ cho phép ảnh từ /uploads
      },
      {
        protocol: 'https',              // giao thức của ảnh (https)
        hostname: 'images.unsplash.com',// cho phép load ảnh từ Unsplash
        port: '',                       // để trống vì dùng cổng mặc định (443)
        pathname: '/**',                 // /** nghĩa là chấp nhận mọi đường dẫn trong domain
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',  // cho phép load ảnh từ Pexels
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'noithattoz.com',     // cho phép load ảnh từ noithattoz.com
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',              // giao thức https
        hostname: 'cdn.hstatic.net',    // cho phép ảnh từ CDN của hstatic.net
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'theme.hstatic.net',  // cho phép ảnh theme từ hstatic.net
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'product.hstatic.net',// cho phép ảnh sản phẩm từ hstatic.net
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com', // CHANGED: Cho phép load QR code từ API external
        port: '',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
};

export default nextConfig; // xuất cấu hình để Next.js sử dụng
