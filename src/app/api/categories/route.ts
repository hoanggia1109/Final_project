import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    {
      id: 1,
      title: 'Tủ & kệ lưu trữ',
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
      link: '/category/tu-ke-luu-tru',
    },
    {
      id: 2,
      title: 'Ghế văn phòng',
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      link: '/category/ghe-van-phong',
    },
    {
      id: 3,
      title: 'Bàn làm việc',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
      link: '/category/ban-lam-viec',
    },
  ];

  return NextResponse.json(categories);
}


