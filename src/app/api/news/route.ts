import { NextResponse } from 'next/server';

// Fake data cho tin tức
const newsArticles = [
  {
    id: 1,
    title: '3 ĐIỀU CẦN BIẾT KHI LỰA CHỌN CÔNG TY THIẾT KẾ VĂN PHÒNG',
    slug: '3-dieu-can-biet-khi-lua-chon-cong-ty-thiet-ke-van-phong',
    excerpt: 'Việc lựa chọn một công ty thiết kế văn phòng uy tín là yếu tố quan trọng quyết định đến sự thành công của dự án. Dưới đây là 3 điều bạn cần lưu ý.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    category: 'Thiết kế văn phòng',
    author: 'VANTAYdecor',
    publishDate: '2024-01-15',
    views: 1250,
    featured: true
  },
  {
    id: 2,
    title: 'CÔNG TY THIẾT KẾ NỘI THẤT TẠI KHU ĐÔ THỊ VẠN PHÚC',
    slug: 'cong-ty-thiet-ke-noi-that-tai-khu-do-thi-van-phuc',
    excerpt: 'VANTAYdecor tự hào là đơn vị thiết kế nội thất hàng đầu tại khu đô thị Vạn Phúc, mang đến những giải pháp tối ưu cho không gian sống của bạn.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    category: 'Nội thất',
    author: 'VANTAYdecor',
    publishDate: '2024-01-20',
    views: 980,
    featured: true
  },
  {
    id: 3,
    title: '7 MẪU THIẾT KẾ NỘI THẤT CHUNG CƯ XU HƯỚNG VÀ GIẢI PHÁP TỐI ƯU',
    slug: '7-mau-thiet-ke-noi-that-chung-cu-xu-huong',
    excerpt: 'Khám phá 7 mẫu thiết kế nội thất chung cư đang được ưa chuộng nhất hiện nay với những giải pháp tối ưu không gian và chi phí.',
    image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
    category: 'Xu hướng',
    author: 'VANTAYdecor',
    publishDate: '2024-01-25',
    views: 1500,
    featured: true
  },
  {
    id: 4,
    title: 'XU HƯỚNG THIẾT KẾ NỘI THẤT HIỆN ĐẠI 2024',
    slug: 'xu-huong-thiet-ke-noi-that-hien-dai-2024',
    excerpt: 'Năm 2024 chứng kiến sự lên ngôi của phong cách thiết kế tối giản kết hợp với công nghệ thông minh, tạo nên những không gian sống hiện đại và tiện nghi.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    category: 'Xu hướng',
    author: 'VANTAYdecor',
    publishDate: '2024-02-01',
    views: 2100,
    featured: false
  },
  {
    id: 5,
    title: 'BÍ QUYẾT CHỌN MÀU SƠN PHÒNG KHÁCH ĐẸP VÀ HÀI HÒA',
    slug: 'bi-quyet-chon-mau-son-phong-khach-dep',
    excerpt: 'Màu sắc phòng khách đóng vai trò quan trọng trong việc tạo nên không gian ấm cúng và thu hút. Cùng tìm hiểu cách chọn màu sơn phù hợp.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
    category: 'Mẹo hay',
    author: 'VANTAYdecor',
    publishDate: '2024-02-05',
    views: 1680,
    featured: false
  },
  {
    id: 6,
    title: 'THIẾT KẾ PHÒNG NGỦ HIỆN ĐẠI CHO GIA ĐÌNH TRẺ',
    slug: 'thiet-ke-phong-ngu-hien-dai-cho-gia-dinh-tre',
    excerpt: 'Phòng ngủ là nơi nghỉ ngơi quan trọng nhất trong nhà. Khám phá những ý tưởng thiết kế phòng ngủ hiện đại phù hợp với gia đình trẻ.',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
    category: 'Phòng ngủ',
    author: 'VANTAYdecor',
    publishDate: '2024-02-10',
    views: 1420,
    featured: false
  },
  {
    id: 7,
    title: 'TỐI ƯU HÓA KHÔNG GIAN NHỎ VỚI THIẾT KẾ THÔNG MINH',
    slug: 'toi-uu-hoa-khong-gian-nho-voi-thiet-ke-thong-minh',
    excerpt: 'Căn hộ nhỏ không còn là vấn đề khi bạn biết cách tối ưu hóa không gian với những giải pháp thiết kế thông minh và sáng tạo.',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
    category: 'Mẹo hay',
    author: 'VANTAYdecor',
    publishDate: '2024-02-15',
    views: 1890,
    featured: false
  },
  {
    id: 8,
    title: 'PHONG CÁCH SCANDINAVIAN - SỰ ĐƠN GIẢN TINH TẾ',
    slug: 'phong-cach-scandinavian-su-don-gian-tinh-te',
    excerpt: 'Phong cách Scandinavian với sự tối giản, ánh sáng tự nhiên và màu sắc nhẹ nhàng đang trở thành xu hướng được nhiều người Việt yêu thích.',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
    category: 'Phong cách',
    author: 'VANTAYdecor',
    publishDate: '2024-02-20',
    views: 1750,
    featured: false
  },
  {
    id: 9,
    title: 'CÁCH BỐ TRÍ BẾP HIỆN ĐẠI TIỆN NGHI VÀ SANG TRỌNG',
    slug: 'cach-bo-tri-bep-hien-dai-tien-nghi',
    excerpt: 'Không gian bếp hiện đại không chỉ đẹp mắt mà còn phải đảm bảo tính tiện dụng. Cùng khám phá những bí quyết bố trí bếp thông minh.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    category: 'Nhà bếp',
    author: 'VANTAYdecor',
    publishDate: '2024-02-25',
    views: 1560,
    featured: false
  }
];

export async function GET() {
  // Sắp xếp theo ngày đăng mới nhất
  const sortedNews = [...newsArticles].sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return NextResponse.json(sortedNews);
}

