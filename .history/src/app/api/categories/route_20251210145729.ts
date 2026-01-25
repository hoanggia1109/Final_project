import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Gọi API từ Node.js backend
    const response = await fetch('http://localhost:5000/api/danhmuc', {
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories from backend');
    }

    const data = await response.json();

    const categories = data.map((item: { id: string; tendm: string; image: string | undefined; }) => ({
      id: item.id,
      title: item.tendm,
      image: item.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      link: `/category/${item.id}`,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
