import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

interface BackendArticle {
  id: string;
  tieude: string;
  noidung: string;
  hinh_anh: string | null;
  luotxem?: number;
  anhien: number;
  created_at: string;
  danhmuc?: {
    tendanhmuc: string;
  };
  user?: {
    ho_ten?: string;
    email: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Gọi API backend để lấy chi tiết bài viết 
    const response = await fetch(`${BACKEND_URL}/api/baiviet/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Không tìm thấy tin tức' },
        { status: 404 }
      );
    }

    const article = await response.json() as BackendArticle;

    // Xử lý URL hình ảnh
    let imageUrl = article.hinh_anh || '';
    console.log('[News Detail API] Original hinh_anh:', imageUrl);
    
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Nếu là relative path, thêm backend URL
      imageUrl = `${BACKEND_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    console.log('[News Detail API] Processed image URL:', imageUrl);

    // Map data từ backend sang format frontend
    const mappedArticle = {
      id: article.id,
      title: article.tieude,
      slug: article.tieude.toLowerCase().replace(/\s+/g, '-'),
      excerpt: article.tieude, 
      image: imageUrl,
      category: article.danhmuc?.tendanhmuc || 'Tin tức', 
      author: article.user?.ho_ten || article.user?.email || 'DANNYdecor', 
      publishDate: article.created_at,
      views: article.luotxem || 0, 
      content: article.noidung || '<p>Nội dung đang được cập nhật...</p>',
      tags: [], 
      relatedNews: [] 
    };

    return NextResponse.json(mappedArticle);
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return NextResponse.json(
      { error: 'Không thể lấy chi tiết bài viết' },
      { status: 500 }
    );
  }
}

