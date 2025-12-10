import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',               // localhost dùng http
        hostname: 'localhost',          // cho phép load ảnh từ localhost backend
        port: '5000',                   // cổng backend
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
        hostname: 'api.qrserver.com',  // cho phép load QR code từ QR Server API
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',  // cho phép load ảnh từ jsDelivr CDN
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',  // cho phép load logo từ Wikimedia
        port: '',
        pathname: '/**',
      },
      // Các domain cho logo thương hiệu và hình ảnh sản phẩm
      {
        protocol: 'https',
        hostname: 'banoca.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pisee.com.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vareno.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'phuongnamvina.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'noithatvietjsc.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'toanphu.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'inchi.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gurudesign.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mangoay.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.beeart.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'beeart.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mythuat247.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'other.atpsoftware.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bizweb.dktcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'smlife.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ychi.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ychi.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dongkhoi.vn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; // xuất cấu hình để Next.js sử dụng
