import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

interface BackendArticle {
  id: string;
  tieude: string;
  noidung: string;
  hinh_anh: string | null;
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

    // Map data từ backend sang format frontend
    const mappedArticle = {
      id: article.id,
      title: article.tieude,
      slug: article.tieude.toLowerCase().replace(/\s+/g, '-'),
      excerpt: article.tieude, 
      category: article.danhmuc?.tendanhmuc || 'Tin tức', 
      author: article.user?.ho_ten || article.user?.email || 'VANTAYdecor', 
      publishDate: article.created_at,
      views: 0, 
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

