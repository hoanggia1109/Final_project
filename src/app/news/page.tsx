'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PromoModal from '@/app/component/PromoModal';

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  views: number;
  featured: boolean;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...Array.from(new Set(news.map(n => n.category)))];
  
  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  const featuredNews = filteredNews.filter(n => n.featured);
  const regularNews = filteredNews.filter(n => !n.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <>
      <PromoModal />
      <style jsx global>{`
        .news-page-container {
          padding-top: 100px;
          padding-bottom: 80px;
          background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 50%);
          min-height: 100vh;
        }

        .news-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 0;
          margin-bottom: 50px;
          border-radius: 0 0 50px 50px;
        }

        .news-hero h1 {
          color: white;
          font-size: 3.5rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 15px;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.2);
        }

        .news-hero p {
          color: rgba(255,255,255,0.9);
          font-size: 1.2rem;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .category-filter {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 50px;
        }

        .category-btn {
          padding: 12px 30px;
          border-radius: 50px;
          border: 2px solid #e0e0e0;
          background: white;
          color: #666;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-btn:hover {
          border-color: #FFC107;
          color: #FFC107;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.2);
        }

        .category-btn.active {
          background: linear-gradient(135deg, #FFC107 0%, #FFB300 100%);
          border-color: #FFC107;
          color: white;
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);
        }

        .featured-card {
          position: relative;
          height: 500px;
          border-radius: 25px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }

        .featured-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.2);
        }

        .featured-card .news-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .featured-card .news-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 40px;
          transition: all 0.3s ease;
        }

        .featured-card:hover .news-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 70%);
        }

        .news-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s ease;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          height: 100%;
          cursor: pointer;
        }

        .news-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .news-card-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .news-card-image img {
          transition: transform 0.4s ease;
        }

        .news-card:hover .news-card-image img {
          transform: scale(1.1);
        }

        .news-category-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: linear-gradient(135deg, #FFC107 0%, #FFB300 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 0.85rem;
          z-index: 2;
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }

        .news-card-body {
          padding: 25px;
        }

        .news-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #333;
          margin-bottom: 15px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-excerpt {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }

        .news-date {
          color: #999;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .news-views {
          color: #999;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        @media (max-width: 768px) {
          .news-hero h1 {
            font-size: 2.5rem;
          }

          .featured-card {
            height: 400px;
          }

          .category-filter {
            gap: 10px;
          }

          .category-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="news-page-container">
        {/* Hero Section */}
        <div className="news-hero">
          <div className="container">
            <h1>Tin Tức & Xu Hướng</h1>
            <p>Cập nhật những thông tin mới nhất về kiến trúc, thiết kế nội thất và xu hướng trang trí</p>
          </div>
        </div>

        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <div className="row g-4 mb-5">
              {featuredNews.map((article) => (
                <div key={article.id} className="col-12">
                  <Link href={`/news/${article.id}`} className="text-decoration-none">
                    <div className="featured-card">
                      <div className="news-image">
                        <Image 
                          src={article.image} 
                          alt={article.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="news-overlay">
                        <span className="news-category-badge">{article.category}</span>
                        <h2 className="text-white fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
                          {article.title}
                        </h2>
                        <p className="text-white mb-3" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                          {article.excerpt}
                        </p>
                        <div className="d-flex align-items-center gap-4">
                          <span className="text-white d-flex align-items-center gap-2">
                            <i className="bi bi-calendar3"></i>
                            {formatDate(article.publishDate)}
                          </span>
                          <span className="text-white d-flex align-items-center gap-2">
                            <i className="bi bi-eye"></i>
                            {article.views.toLocaleString()} lượt xem
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Regular News Grid */}
          <div className="row g-4">
            {regularNews.map((article) => (
              <div key={article.id} className="col-lg-4 col-md-6">
                <Link href={`/news/${article.id}`} className="text-decoration-none">
                  <div className="news-card">
                    <div className="news-card-image">
                      <span className="news-category-badge">{article.category}</span>
                      <Image 
                        src={article.image} 
                        alt={article.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="news-card-body">
                      <h3 className="news-title">{article.title}</h3>
                      <p className="news-excerpt">{article.excerpt}</p>
                      <div className="news-meta">
                        <span className="news-date">
                          <i className="bi bi-calendar3"></i>
                          {formatDate(article.publishDate)}
                        </span>
                        <span className="news-views">
                          <i className="bi bi-eye"></i>
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredNews.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-newspaper" style={{ fontSize: '5rem', color: '#ddd' }}></i>
              <h3 className="mt-3 text-muted">Không có tin tức nào</h3>
              <p className="text-muted">Thử chọn danh mục khác</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


