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
    {
      id: 4,
      title: 'Sofa & ghế thư giãn',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      link: '/category/sofa-ghe-thu-gian',
    },
    {
      id: 5,
      title: 'Giường & nệm',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
      link: '/category/giuong-nem',
    },
    {
      id: 6,
      title: 'Đèn trang trí',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      link: '/category/den-trang-tri',
    },
    {
      id: 7,
      title: 'Tủ bếp & phòng ăn',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      link: '/category/tu-bep-phong-an',
    },
    {
      id: 8,
      title: 'Kệ sách & tủ sách',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      link: '/category/ke-sach-tu-sach',
    },
    {
      id: 9,
      title: 'Bàn ăn & ghế ăn',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      link: '/category/ban-an-ghe-an',
    },
    {
      id: 10,
      title: 'Tủ quần áo',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      link: '/category/tu-quan-ao',
    },
    {
      id: 11,
      title: 'Phụ kiện trang trí',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
      link: '/category/phu-kien-trang-tri',
    },
    {
      id: 12,
      title: 'Bàn coffee & bàn trà',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      link: '/category/ban-coffee-ban-tra',
    },
  ];

  return NextResponse.json(categories);
}


