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
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/sanpham/${id}`;
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
    
    // Helper function để format image URL
    const formatImageUrl = (url: string | undefined): string => {
      if (!url) return '';
      // Nếu đã là URL đầy đủ (bắt đầu bằng http/https), trả về nguyên
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Nếu là đường dẫn tương đối, thêm API_BASE_URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
      return `${apiBaseUrl}${url.startsWith('/') ? url : '/' + url}`;
    };
    
    // Transform data để phù hợp với frontend
    const transformedProduct = {
      id: product.id,
      name: product.tensp || 'Sản phẩm',
      price: product.bienthe?.[0]?.gia || 0,
      originalPrice: product.bienthe?.[0]?.gia ? Math.round(product.bienthe[0].gia * 1.2) : 0,
      discount: 20,
      category: product.danhmuc?.tendm || 'Chưa phân loại',
      brand: product.thuonghieu?.tenbrand || 'DANNYdecor',
      sku: product.code || `SP-${product.id}`,
      stock: totalStock, // Tổng tồn kho từ tất cả biến thể
      views: product.luotxem || 0,
      rating: 4.8,
      reviews: 0,
      description: product.mota_chitiet || product.mota || 'Sản phẩm chất lượng cao từ DANNYdecor',
      features: (() => {
        try {
          if (product.dacdiem_noibat) {
            // Backend đã parse JSON rồi, nên có thể là array hoặc string
            let parsed = product.dacdiem_noibat;
            if (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          }
        } catch (e) {
          console.error('Error parsing dacdiem_noibat:', e);
        }
        // Fallback nếu không có dữ liệu
        return [];
      })(),
      specifications: (() => {
        try {
          if (product.thongsokythuat) {
            // Backend đã parse JSON rồi, nên có thể là object hoặc string
            let parsed = product.thongsokythuat;
            if (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
              return parsed;
            }
          }
        } catch (e) {
          console.error('Error parsing thongsokythuat:', e);
        }
        // Fallback nếu không có dữ liệu - chỉ trả về thông tin cơ bản
        const fallback: Record<string, string> = {};
        if (product.code) fallback['Mã sản phẩm'] = product.code;
        if (product.thuonghieu?.tenbrand) fallback['Thương hiệu'] = product.thuonghieu.tenbrand;
        if (product.danhmuc?.tendm) fallback['Danh mục'] = product.danhmuc.tendm;
        const colors = product.bienthe?.map((bt: BienThe) => bt.mausac).filter(Boolean);
        if (colors && colors.length > 0) fallback['Màu sắc'] = colors.join(', ');
        const sizes = product.bienthe?.map((bt: BienThe) => bt.kichthuoc).filter(Boolean);
        if (sizes && sizes.length > 0) fallback['Kích thước'] = sizes.join(', ');
        return fallback;
      })(),
      // Lấy images từ biến thể hoặc dùng thumbnail, và format URL
      images: product.bienthe?.[0]?.images && product.bienthe[0].images.length > 0
        ? product.bienthe[0].images.map((img: { url: string }) => formatImageUrl(img.url))
        : product.thumbnail
        ? [formatImageUrl(product.thumbnail)]
        : [],
        // : ['https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'],
      colors: product.bienthe?.map((bt: BienThe) => ({
        id: bt.id, // ID của biến thể (bienthe_id)
        name: bt.mausac || 'Màu mặc định',
        code: '#808080', // Default color
        stock: bt.sl_tonkho || 0, // Số lượng tồn kho của biến thể này
        gia: bt.gia || 0, // Giá của biến thể
        kichthuoc: bt.kichthuoc || '', // Kích thước
        mausac: bt.mausac || '' // Màu sắc
      })) || [],
      relatedProducts: []
    };
    
    console.log(' Transformed product:', transformedProduct);
    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error(' Error fetching product:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải sản phẩm', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

