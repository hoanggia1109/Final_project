import { NextResponse } from 'next/server';

// Fake data cho sản phẩm chi tiết
const productsDetail = [
  {
    id: 1,
    name: 'Ghế sofa hiện đại cao cấp',
    price: 15000000,
    originalPrice: 20000000,
    discount: 25,
    category: 'Sofa & ghế thư giãn',
    brand: 'VANTAYdecor',
    sku: 'SOFA-001',
    stock: 15,
    rating: 4.8,
    reviews: 128,
    description: 'Ghế sofa hiện đại với thiết kế sang trọng, chất liệu vải cao cấp, khung gỗ thông chắc chắn. Mang đến sự thoải mái tuyệt đối cho không gian phòng khách của bạn.',
    features: [
      'Chất liệu vải cao cấp chống bám bụi',
      'Khung gỗ thông tự nhiên, chắc chắn',
      'Đệm mút D40 êm ái, độ đàn hồi tốt',
      'Thiết kế hiện đại, phù hợp nhiều không gian',
      'Dễ dàng vệ sinh và bảo quản'
    ],
    specifications: {
      'Kích thước': '220 x 90 x 85 cm',
      'Chất liệu khung': 'Gỗ thông tự nhiên',
      'Chất liệu bọc': 'Vải cao cấp',
      'Chất liệu đệm': 'Mút D40',
      'Màu sắc': 'Xám, Be, Xanh navy',
      'Trọng lượng': '65 kg',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '24 tháng'
    },
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800'
    ],
    colors: [
      { name: 'Xám', code: '#808080' },
      { name: 'Be', code: '#F5F5DC' },
      { name: 'Xanh navy', code: '#000080' }
    ],
    relatedProducts: [2, 3, 4, 5]
  },
  {
    id: 2,
    name: 'Bàn làm việc gỗ tự nhiên',
    price: 5500000,
    originalPrice: 7000000,
    discount: 21,
    category: 'Bàn làm việc',
    brand: 'VANTAYdecor',
    sku: 'DESK-002',
    stock: 25,
    rating: 4.6,
    reviews: 89,
    description: 'Bàn làm việc cao cấp từ gỗ tự nhiên, thiết kế tối giản hiện đại. Bề mặt rộng rãi, chắc chắn, phù hợp cho cả văn phòng và nhà riêng.',
    features: [
      'Gỗ tự nhiên cao cấp',
      'Thiết kế tối giản, hiện đại',
      'Bề mặt rộng rãi, tiện lợi',
      'Chân bàn chắc chắn, có điều chỉnh độ cao',
      'Dễ dàng lắp ráp'
    ],
    specifications: {
      'Kích thước': '140 x 70 x 75 cm',
      'Chất liệu mặt bàn': 'Gỗ tự nhiên',
      'Chất liệu chân': 'Thép sơn tĩnh điện',
      'Màu sắc': 'Nâu gỗ, Đen',
      'Trọng lượng': '35 kg',
      'Tải trọng': '100 kg',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '18 tháng'
    },
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800',
      'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800',
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800'
    ],
    colors: [
      { name: 'Nâu gỗ', code: '#8B4513' },
      { name: 'Đen', code: '#000000' }
    ],
    relatedProducts: [1, 3, 6, 8]
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  const product = productsDetail.find(p => p.id === id);

  if (!product) {
    return NextResponse.json(
      { error: 'Không tìm thấy sản phẩm' },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

