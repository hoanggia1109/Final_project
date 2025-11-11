import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Gọi API backend để lấy chi tiết bài viết
    const response = await fetch(`${BACKEND_URL}/api/baiviet/chitiet/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Không tìm thấy tin tức' },
        { status: 404 }
      );
    }

    const article = await response.json();

    // Map data từ backend sang format frontend
    const mappedArticle = {
      id: article.id,
      title: article.tieude,
      slug: article.tieude.toLowerCase().replace(/\s+/g, '-'),
      excerpt: article.tieude, // Backend chưa có excerpt
      image: article.thumbnail,
      category: article.danh_muc || 'Tin tức',
      author: article.tacgia || 'VANTAYdecor',
      publishDate: article.created_at,
      views: article.luotxem || 0,
      content: article.noidung || '<p>Nội dung đang được cập nhật...</p>',
      tags: [], // Backend chưa có tags
      relatedNews: [] // Backend chưa có bài viết liên quan
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

