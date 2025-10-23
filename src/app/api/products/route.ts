import { NextResponse } from 'next/server';

export async function GET() {
  // Fake data - sau thay bằng database thực
  const products = [
    {
      id: 1,
      name: 'Giường ngủ cao cấp',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
      discount: 15,
      price: 11815000,
      originalPrice: 13900000,
    },
    {
      id: 2,
      name: 'Giường ngủ hiện đại',
      image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
      discount: 15,
      price: 13515000,
      originalPrice: 15900000,
    },
    {
      id: 3,
      name: 'Giường ngủ sang trọng',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      discount: 20,
      price: 13600000,
      originalPrice: 17000000,
    },
    {
      id: 4,
      name: 'Giường ngủ đẹp',
      image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
      discount: 20,
      price: 23120000,
      originalPrice: 28900000,
    },
    {
      id: 5,
      name: 'Sofa hiện đại',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      discount: 10,
      price: 18000000,
      originalPrice: 20000000,
    },
    {
      id: 6,
      name: 'Bàn làm việc gỗ',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
      discount: 12,
      price: 8800000,
      originalPrice: 10000000,
    },
  ];

  return NextResponse.json(products);
}

