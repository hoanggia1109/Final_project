import { NextResponse } from 'next/server';

// Fake data chi tiết tin tức
const newsDetail = [
  {
    id: 1,
    title: '3 ĐIỀU CẦN BIẾT KHI LỰA CHỌN CÔNG TY THIẾT KẾ VĂN PHÒNG',
    slug: '3-dieu-can-biet-khi-lua-chon-cong-ty-thiet-ke-van-phong',
    excerpt: 'Việc lựa chọn một công ty thiết kế văn phòng uy tín là yếu tố quan trọng quyết định đến sự thành công của dự án. Dưới đây là 3 điều bạn cần lưu ý.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    category: 'Thiết kế văn phòng',
    author: 'VANTAYdecor',
    publishDate: '2024-01-15',
    views: 1250,
    content: `
      <h2>1. Kinh nghiệm và danh tiếng của công ty</h2>
      <p>Một công ty thiết kế văn phòng uy tín thường có nhiều năm kinh nghiệm trong ngành và danh mục dự án ấn tượng. Hãy tìm hiểu về các dự án mà công ty đã thực hiện, xem portfolio và đọc đánh giá từ khách hàng trước đó.</p>
      
      <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200" alt="Văn phòng hiện đại" style="width: 100%; margin: 20px 0; border-radius: 10px;" />
      
      <h2>2. Khả năng tư vấn và sáng tạo</h2>
      <p>Công ty thiết kế tốt không chỉ thực hiện theo yêu cầu mà còn đưa ra những giải pháp sáng tạo, tối ưu không gian và phù hợp với văn hóa doanh nghiệp của bạn. Họ cần hiểu rõ nhu cầu và đưa ra những tư vấn chuyên nghiệp.</p>
      
      <ul>
        <li>Tư vấn về layout và động tuyến làm việc</li>
        <li>Lựa chọn màu sắc và vật liệu phù hợp</li>
        <li>Tối ưu hóa ánh sáng và thông gió</li>
        <li>Giải pháp công nghệ thông minh</li>
      </ul>
      
      <h2>3. Giá cả và tiến độ thực hiện</h2>
      <p>Báo giá minh bạch và tiến độ thực hiện rõ ràng là những yếu tố quan trọng. Hãy so sánh giá cả từ nhiều công ty nhưng đừng chỉ chọn công ty rẻ nhất. Chất lượng và uy tín cũng rất quan trọng.</p>
      
      <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200" alt="Không gian làm việc" style="width: 100%; margin: 20px 0; border-radius: 10px;" />
      
      <h2>Kết luận</h2>
      <p>Việc lựa chọn công ty thiết kế văn phòng cần được cân nhắc kỹ lưỡng. Hãy dành thời gian tìm hiểu, so sánh và gặp gỡ trực tiếp để đưa ra quyết định đúng đắn cho dự án của bạn.</p>
    `,
    tags: ['thiết kế văn phòng', 'nội thất', 'tư vấn'],
    relatedNews: [2, 4, 7]
  },
  {
    id: 2,
    title: 'CÔNG TY THIẾT KẾ NỘI THẤT TẠI KHU ĐÔ THỊ VẠN PHÚC',
    slug: 'cong-ty-thiet-ke-noi-that-tai-khu-do-thi-van-phuc',
    excerpt: 'VANTAYdecor tự hào là đơn vị thiết kế nội thất hàng đầu tại khu đô thị Vạn Phúc, mang đến những giải pháp tối ưu cho không gian sống của bạn.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
    category: 'Nội thất',
    author: 'VANTAYdecor',
    publishDate: '2024-01-20',
    views: 980,
    content: `
      <h2>Về VANTAYdecor</h2>
      <p>VANTAYdecor là công ty chuyên thiết kế và thi công nội thất với hơn 10 năm kinh nghiệm trong ngành. Chúng tôi đặc biệt chuyên sâu vào các dự án tại khu đô thị Vạn Phúc và khu vực lân cận.</p>
      
      <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200" alt="Phòng khách hiện đại" style="width: 100%; margin: 20px 0; border-radius: 10px;" />
      
      <h2>Dịch vụ của chúng tôi</h2>
      <ul>
        <li>Thiết kế nội thất căn hộ chung cư</li>
        <li>Thiết kế nội thất nhà phố, biệt thự</li>
        <li>Thiết kế văn phòng, showroom</li>
        <li>Thi công trọn gói theo tiêu chuẩn cao</li>
        <li>Bảo hành và bảo trì dài hạn</li>
      </ul>
      
      <h2>Ưu điểm khi chọn VANTAYdecor</h2>
      <p>Với đội ngũ kiến trúc sư và thợ thi công giàu kinh nghiệm, chúng tôi cam kết mang đến những không gian sống hoàn hảo nhất cho khách hàng tại Vạn Phúc.</p>
      
      <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200" alt="Không gian nội thất" style="width: 100%; margin: 20px 0; border-radius: 10px;" />
    `,
    tags: ['VANTAYdecor', 'Vạn Phúc', 'thiết kế nội thất'],
    relatedNews: [1, 3, 6]
  },
  {
    id: 3,
    title: '7 MẪU THIẾT KẾ NỘI THẤT CHUNG CƯ XU HƯỚNG VÀ GIẢI PHÁP TỐI ƯU',
    slug: '7-mau-thiet-ke-noi-that-chung-cu-xu-huong',
    excerpt: 'Khám phá 7 mẫu thiết kế nội thất chung cư đang được ưa chuộng nhất hiện nay với những giải pháp tối ưu không gian và chi phí.',
    image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200',
    category: 'Xu hướng',
    author: 'VANTAYdecor',
    publishDate: '2024-01-25',
    views: 1500,
    content: `
      <h2>1. Phong cách tối giản (Minimalist)</h2>
      <p>Phong cách tối giản đang rất được ưa chuộng với những căn hộ chung cư hiện đại. Đặc trưng bởi đường nét đơn giản, màu sắc trung tính và tối ưu không gian.</p>
      
      <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200" alt="Phong cách tối giản" style="width: 100%; margin: 20px 0; border-radius: 10px;" />
      
      <h2>2. Phong cách Scandinavian</h2>
      <p>Với màu trắng chủ đạo, gỗ tự nhiên và ánh sáng tự nhiên tối đa, phong cách Bắc Âu mang đến sự ấm cúng và thoải mái.</p>
      
      <h2>3. Phong cách Indochine</h2>
      <p>Kết hợp giữa nét Á Đông truyền thống và phong cách Pháp hiện đại, tạo nên không gian sang trọng và độc đáo.</p>
      
      <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200" alt="Phòng khách sang trọng" style="width: 100%; margin: 20px 0; border-radius: 10px;" />
      
      <h2>4. Phong cách Industrial</h2>
      <p>Phong cách công nghiệp với gạch thô, ống nước lộ thiên và vật liệu thép tạo nên vẻ mạnh mẽ, cá tính.</p>
      
      <h2>5. Phong cách Tropical</h2>
      <p>Mang thiên nhiên vào nhà với cây xanh, vật liệu tự nhiên và màu sắc tươi mới.</p>
      
      <h2>6. Phong cách Luxury Modern</h2>
      <p>Sang trọng với đá marble, đồng thau và các vật liệu cao cấp.</p>
      
      <h2>7. Phong cách Japandi</h2>
      <p>Kết hợp tinh tế giữa Nhật Bản và Scandinavian, mang đến sự cân bằng hoàn hảo.</p>
      
      <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200" alt="Phong cách Japandi" style="width: 100%; margin: 20px 0; border-radius: 10px;" />
    `,
    tags: ['xu hướng', 'chung cư', 'phong cách'],
    relatedNews: [4, 5, 8]
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  const article = newsDetail.find(n => n.id === id);

  if (!article) {
    return NextResponse.json(
      { error: 'Không tìm thấy tin tức' },
      { status: 404 }
    );
  }

  return NextResponse.json(article);
}

