import { NextResponse } from 'next/server';

export async function GET() {
  // Fake data - sản phẩm giảm giá
  const discountProducts = [
    {
      id: 1,
      name: 'Giường Roche 1m8 Vải Rust 2117B-2G',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
      discount: 15,
      price: 11815000,
      originalPrice: 13900000,
    },
    {
      id: 2,
      name: 'Giường Jose 1M8 hộc kéo vải Stone 015-1A',
      image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
      discount: 15,
      price: 13515000,
      originalPrice: 15900000,
    },
    {
      id: 3,
      name: 'Armchair Nancy (Màu Blush Pink VACT 10500)',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      discount: 20,
      price: 13600000,
      originalPrice: 17000000,
    },
    {
      id: 4,
      name: 'Sofa Nancy 2 chỗ 1m8 (Vải VACT 10500)',
      image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
      discount: 20,
      price: 23120000,
      originalPrice: 28900000,
    },
    {
      id: 5,
      name: 'Giường Roche 1m8 Vải Rust 2117B-2G',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
      discount: 15,
      price: 11815000,
      originalPrice: 13900000,
    },
    {
      id: 6,
      name: 'Giường Jose 1M8 hộc kéo vải Stone 015-1A',
      image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
      discount: 15,
      price: 13515000,
      originalPrice: 15900000,
    },
  ];

  return NextResponse.json(discountProducts);
}

