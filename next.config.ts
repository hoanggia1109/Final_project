import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',              // giao thức của ảnh (https)
        hostname: 'images.unsplash.com',// cho phép load ảnh từ Unsplash
        port: '',                       // để trống vì dùng cổng mặc định (443)
        pathname: '/**',                 // /** nghĩa là chấp nhận mọi đường dẫn trong domain
      },
      {
        protocol: 'https',              // giao thức https
        hostname: 'cdn.hstatic.net',    // cho phép ảnh từ CDN của hstatic.net
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'product.hstatic.net',// cho phép ảnh sản phẩm từ hstatic.net
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; // xuất cấu hình để Next.js sử dụng
