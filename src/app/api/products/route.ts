import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call backend Node.js API (Port 5001)
    const response = await fetch('http://localhost:5001/api/sanpham', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();
    
    // Transform data cho homepage
    const transformedProducts = products.map((p: { id: number; tensp: string; thumbnail: string; bienthe: { gia: number }[]; }) => ({
      id: p.id,
      name: p.tensp || 'Sản phẩm',
      image: p.thumbnail || 'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg',
      discount: 20,
      price: p.bienthe?.[0]?.gia || 0,
      originalPrice: p.bienthe?.[0]?.gia ? Math.round(p.bienthe[0].gia * 1.25) : 0,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải sản phẩm' },
      { status: 500 }
    );
  }
}

