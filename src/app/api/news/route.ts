import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

export async function GET() {
  try {
    // API backend để lấy danh sách bài viết
    const response = await fetch(`${BACKEND_URL}/api/baiviet/`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách bài viết');
    }

    const articles = await response.json();

    // Map data từ backend sang format frontend
    const mappedArticles = articles.map((article: any) => ({
      id: article.id,
      title: article.tieude,
      slug: article.tieude.toLowerCase().replace(/\s+/g, '-'),
      excerpt: article.tieude, // Backend chưa có excerpt, dùng tạm title
      image: article.thumbnail,
      category: article.danh_muc || 'Tin tức',
      author: article.tacgia || 'VANTAYdecor',
      publishDate: article.created_at,
      views: article.luotxem || 0,
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

