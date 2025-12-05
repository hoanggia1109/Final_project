import { NextResponse } from 'next/server';

interface BienThe {
  id?: string;
  gia?: number;
  mausac?: string;
  kichthuoc?: string;
  sl_tonkho?: number;
  images?: { url: string }[];
}

interface BackendProduct {
  id: number;
  tensp?: string;
  code?: string;
  mota?: string;
  mota_chitiet?: string;
  dacdiem_noibat?: string;
  thongsokythuat?: string;
  thumbnail?: string;
  luotxem?: number;
  bienthe?: BienThe[];
  danhmuc?: { tendm?: string };
  thuonghieu?: { tenbrand?: string };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔍 Fetching product ID:', id);
    
    // Call backend Node.js API (Port 5000)
    const backendUrl = `http://localhost:5000/api/sanpham/${id}`;
    console.log('📡 Calling backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      cache: 'no-store' // Tắt cache
    });
    
    console.log(' Response status:', response.status);
    
    if (!response.ok) {
      console.error('Backend response not OK:', response.status);
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }
    
    const product: BackendProduct = await response.json();
    console.log('✅ Product from backend:', product);
    
    // Tính tổng tồn kho từ tất cả các biến thể
    const totalStock = product.bienthe?.reduce((sum, bt) => sum + (bt.sl_tonkho || 0), 0) || 0;
    
    // Transform data để phù hợp với frontend
    const transformedProduct = {
      id: product.id,
      name: product.tensp || 'Sản phẩm',
      price: product.bienthe?.[0]?.gia || 0,
      originalPrice: product.bienthe?.[0]?.gia ? Math.round(product.bienthe[0].gia * 1.2) : 0,
      discount: 20,
      category: product.danhmuc?.tendm || 'Chưa phân loại',
      brand: product.thuonghieu?.tenbrand || 'VANTAYdecor',
      sku: product.code || `SP-${product.id}`,
      stock: totalStock, // Tổng tồn kho từ tất cả biến thể
      views: product.luotxem || 0,
      rating: 4.8,
      reviews: 0,
      description: product.mota_chitiet || product.mota || 'Sản phẩm chất lượng cao từ VANTAYdecor',
      features: (() => {
        try {
          if (product.dacdiem_noibat) {
            const parsed = JSON.parse(product.dacdiem_noibat);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          }
        } catch (e) {
          console.error('Error parsing dacdiem_noibat:', e);
        }
        // Fallback nếu không có dữ liệu
        return [
          'Chất liệu cao cấp',
          'Thiết kế hiện đại',
          'Bền bỉ theo thời gian',
          'Dễ dàng vệ sinh',
          'Bảo hành chính hãng'
        ];
      })(),
      specifications: (() => {
        try {
          if (product.thongsokythuat) {
            const parsed = JSON.parse(product.thongsokythuat);
            if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
              return parsed;
            }
          }
        } catch (e) {
          console.error('Error parsing thongsokythuat:', e);
        }
        // Fallback nếu không có dữ liệu
        return {
          'Mã sản phẩm': product.code || `SP-${product.id}`,
          'Thương hiệu': product.thuonghieu?.tenbrand || 'VANTAYdecor',
          'Danh mục': product.danhmuc?.tendm || 'Chưa phân loại',
          'Màu sắc': product.bienthe?.map((bt: BienThe) => bt.mausac).filter(Boolean).join(', ') || 'Nhiều màu',
          'Kích thước': product.bienthe?.map((bt: BienThe) => bt.kichthuoc).filter(Boolean).join(', ') || 'Liên hệ',
          'Xuất xứ': 'Việt Nam',
          'Bảo hành': '12 tháng'
        };
      })(),
      // Lấy images từ biến thể hoặc dùng thumbnail
      images: product.bienthe?.[0]?.images && product.bienthe[0].images.length > 0
        ? product.bienthe[0].images.map((img: { url: string }) => img.url)
        : product.thumbnail
        ? [product.thumbnail]
        : [],
        // : ['https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'],
      colors: product.bienthe
        ?.filter((bt: BienThe) => bt.mausac)
        .map((bt: BienThe) => ({
          id: bt.id, // ID của biến thể (bienthe_id)
          name: bt.mausac || 'Màu mặc định',
          code: '#808080', // Default color
          stock: bt.sl_tonkho || 0 // Số lượng tồn kho của biến thể này
        })) || [],
      relatedProducts: []
    };
    
    console.log('🎯 Transformed product:', transformedProduct);
    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('❌❌❌ Error fetching product:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải sản phẩm', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

