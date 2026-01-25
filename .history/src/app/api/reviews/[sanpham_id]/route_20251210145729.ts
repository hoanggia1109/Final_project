import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sanpham_id: string }> }
) {
  try {
    const { sanpham_id } = await params;
    console.log(`[API Reviews] Fetching reviews for product: ${sanpham_id}`);

    // Fetch reviews
    const reviewsResponse = await fetch(`${BACKEND_URL}/api/review/sanpham/${sanpham_id}`, {
      cache: 'no-store'
    });

    console.log(`[API Reviews] Reviews response status: ${reviewsResponse.status}`);

    // Fetch average rating
    const ratingResponse = await fetch(`${BACKEND_URL}/api/review/${sanpham_id}/average`, {
      cache: 'no-store'
    });
 
    console.log(`[API Reviews] Rating response status: ${ratingResponse.status}`);

    let reviews = [];
    let rating = { average_rating: 0, count: 0 };

    if (reviewsResponse.ok) {
      reviews = await reviewsResponse.json();
      console.log(`[API Reviews] Found ${Array.isArray(reviews) ? reviews.length : 0} reviews`);
    } else {
      const errorText = await reviewsResponse.text();
      console.error(`[API Reviews] Error fetching reviews: ${errorText}`);
    }

    if (ratingResponse.ok) {
      rating = await ratingResponse.json();
      console.log(`[API Reviews] Rating data:`, rating);
    } else {
      const errorText = await ratingResponse.text();
      console.error(`[API Reviews] Error fetching rating: ${errorText}`);
    }

    // Nếu không có reviews từ API nhưng có rating, tính count từ rating
    if (Array.isArray(reviews) && reviews.length > 0 && rating.count === 0) {
      rating.count = reviews.length;
      const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      rating.average_rating = totalRating / reviews.length;
    }

    const result = { reviews: Array.isArray(reviews) ? reviews : [], rating };
    console.log(`[API Reviews] Returning: ${result.reviews.length} reviews, rating: ${result.rating.average_rating} (${result.rating.count})`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API Reviews] Error fetching reviews:', error);
    return NextResponse.json(
      { reviews: [], rating: { average_rating: 0, count: 0 } },
      { status: 200 }
    );
  }
}

