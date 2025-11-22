import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sanpham_id: string }> }
) {
  try {
    const { sanpham_id } = await params;

    // Fetch reviews
    const reviewsResponse = await fetch(`${BACKEND_URL}/api/review/sanpham/${sanpham_id}`, {
      cache: 'no-store'
    });

    // Fetch average rating
    const ratingResponse = await fetch(`${BACKEND_URL}/api/review/${sanpham_id}/average`, {
      cache: 'no-store'
    });

    if (!reviewsResponse.ok || !ratingResponse.ok) {
      return NextResponse.json({ reviews: [], rating: { average_rating: 0, count: 0 } });
    }

    const reviews = await reviewsResponse.json();
    const rating = await ratingResponse.json();

    return NextResponse.json({ reviews, rating });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { reviews: [], rating: { average_rating: 0, count: 0 } },
      { status: 200 }
    );
  }
}

