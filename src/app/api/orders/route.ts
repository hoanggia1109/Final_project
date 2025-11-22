import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || '';
    
    const response = await fetch(`${BACKEND_URL}/api/donhang`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Không thể tải đơn hàng' },
        { status: response.status }
      );
    }

    const orders = await response.json();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Lỗi kết nối server' },
      { status: 500 }
    );
  }
}

