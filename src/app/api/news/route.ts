import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

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

export async function GET() {
  try {
    // API backend để lấy danh sách bài viết (chỉ lấy bài viết đã hiển thị)
    const response = await fetch(`${BACKEND_URL}/api/baiviet/`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách bài viết');
    }

    const articles = await response.json();

    // Map data từ backend sang format frontend
    const mappedArticles = (articles as BackendArticle[])
      .filter((article) => article.anhien === 1) // Chỉ lấy bài viết hiển thị
      .map((article) => ({
        id: article.id,
        title: article.tieude,
        slug: article.tieude.toLowerCase().replace(/\s+/g, '-'),
        excerpt: article.tieude, // Backend chưa có excerpt, dùng tạm title
        image: article.hinh_anh || '', // Sửa từ thumbnail thành hinh_anh
        category: article.danhmuc?.tendanhmuc || 'Tin tức', // Lấy từ relationship
        author: article.user?.ho_ten || article.user?.email || 'VANTAYdecor', // Lấy từ relationship
        publishDate: article.created_at,
        views: 0, // Backend chưa có field này
        featured: false
      }));

    return NextResponse.json(mappedArticles);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách bài viết' },
      { status: 500 }
    );
  }
}

