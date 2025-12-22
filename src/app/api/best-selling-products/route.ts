import { NextResponse } from 'next/server';

interface ProductFromAPI {
  id: number;
  tensp: string;
  thumbnail: string;
  giamgia?: number;
  bienthe?: Array<{ gia: number }>;
}

interface OrderDetail {
  soluong?: number;
  bienthe?: {
    sanpham_id: number;
  };
}

interface OrderFromAPI {
  chitiet_donhang?: OrderDetail[];
  chitiet?: OrderDetail[];
}

interface ProductWithPurchaseCount extends ProductFromAPI {
  purchaseCount: number;
}

export async function GET() {
  try {
    // Lấy sản phẩm và thống kê đơn hàng từ backend
    const [productsRes, ordersRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/sanpham`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/donhang/stats`, { cache: 'no-store' }).catch(() => null)
    ]);

    if (!productsRes.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await productsRes.json() as ProductFromAPI[];
    
    // Tính số lượng mua từ đơn hàng nếu có
    const productPurchaseCount: { [key: number]: number } = {};
    
    if (ordersRes && ordersRes.ok) {
      try {
        const orders = await ordersRes.json() as OrderFromAPI[];
        if (Array.isArray(orders)) {
          orders.forEach((order) => {
            // Sử dụng 'chitiet' (alias trong Sequelize) thay vì 'chitiet_donhang'
            const orderDetails = order.chitiet || order.chitiet_donhang;
            if (orderDetails && Array.isArray(orderDetails)) {
              orderDetails.forEach((detail) => {
                if (detail.bienthe && detail.bienthe.sanpham_id) {
                  const productId = detail.bienthe.sanpham_id;
                  const quantity = detail.soluong || 0;
                  productPurchaseCount[productId] = (productPurchaseCount[productId] || 0) + quantity;
                }
              });
            }
          });
        }
      } catch (err) {
        console.error('Error processing orders:', err);
        // Tiếp tục mà không có số lượng mua nếu không thể xử lý đơn hàng
      }
    }
    
    // Lọc ra sản phẩm không hợp lệ
    const validProducts = products.filter(p => p.id && p.tensp);
    
    // Biến đổi và sắp xếp sản phẩm theo số lượng mua
    const productsWithPurchaseCount = validProducts
      .map((p) => ({
        ...p,
        purchaseCount: productPurchaseCount[p.id] || 0
      } as ProductWithPurchaseCount));
    
    // Sắp xếp theo số lượng mua, nếu không có purchases, sắp xếp theo ID (newest first)
    const sortedProducts = productsWithPurchaseCount
      .sort((a, b) => {
        if (a.purchaseCount > 0 || b.purchaseCount > 0) {
          return b.purchaseCount - a.purchaseCount;
        }
        // nếu không có purchases, sắp xếp theo ID (newest first)
        return b.id - a.id;
      });
    
    // Hiển thị sản phẩm (ngay cả khi không có purchases)
    const transformedProducts = sortedProducts
      .slice(0, 20)
      .map((p) => {
        const price = p.bienthe?.[0]?.gia || 0;
        const originalPrice = price ? Math.round(price * 1.25) : 0;
        // Tính phần trăm giảm giá dựa trên originalPrice và price
        const discount = originalPrice > price && originalPrice > 0 
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 0;
        
        return {
          id: p.id,
          name: p.tensp || 'Sản phẩm',
          image: p.thumbnail || 'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg',
          discount: discount,
          price: price,
          originalPrice: originalPrice,
        };
      });

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching best-selling products:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải sản phẩm bán chạy' },
      { status: 500 }
    );
  }
}

