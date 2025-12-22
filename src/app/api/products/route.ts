import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call backend Node.js API (Port 5000)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/sanpham`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();
    
    // Transform data cho homepage
    const transformedProducts = products.map((p: { id: number; tensp: string; thumbnail: string; bienthe: { gia: number }[]; }) => {
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải sản phẩm' },
      { status: 500 }
    );
  }
}

