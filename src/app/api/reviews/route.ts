import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Gửi formData trực tiếp đến backend (bao gồm cả files)
    const response = await fetch(`${BACKEND_URL}/api/review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Không set Content-Type, để browser tự set với boundary cho multipart/form-data
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[API Reviews] Backend error:', data);
      return NextResponse.json(
        { error: data.message || data.error || 'Không thể tạo đánh giá' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API Reviews] Error creating review:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo đánh giá', details: error.message },
      { status: 500 }
    );
  }
}

