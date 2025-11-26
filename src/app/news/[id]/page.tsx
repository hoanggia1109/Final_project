'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PromoModal from '@/app/component/PromoModal';

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  views: number;
  content: string;
  tags: string[];
  relatedNews: number[];
}

interface RelatedArticle {
  id: number;
  title: string;
  image: string;
  category: string;
  publishDate: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      // Fetch article detail
      fetch(`/api/news/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setArticle(data);
          
          // Fetch related articles
          if (data.relatedNews && data.relatedNews.length > 0) {
            Promise.all(
              data.relatedNews.map((id: number) => 
                fetch(`/api/news/${id}`).then(res => res.json())
              )
            ).then(related => {
              setRelatedArticles(related);
            });
          }
          
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params?.id]);

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

  if (!article) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2>Không tìm thấy bài viết</h2>
          <Link href="/news" className="btn btn-warning mt-3">Về trang tin tức</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PromoModal />
      <style jsx global>{`
        .news-detail-container {
          padding-top: 100px;
          padding-bottom: 80px;
          background: #f8f9fa;
        }

        .article-header {
          background: white;
          border-radius: 0 0 50px 50px;
          padding: 60px 0;
          margin-bottom: 50px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }

        .article-category {
          display: inline-block;
          background: linear-gradient(135deg, #FFC107 0%, #FFB300 100%);
          color: white;
          padding: 10px 25px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .article-title {
          font-size: 3rem;
          font-weight: 900;
          color: #333;
          line-height: 1.2;
          margin-bottom: 25px;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 0.95rem;
        }

        .meta-item i {
          color: #FFC107;
          font-size: 1.1rem;
        }

        .featured-image {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 25px;
          overflow: hidden;
          margin-bottom: 50px;
          box-shadow: 0 15px 50px rgba(0,0,0,0.1);
        }

        .article-content {
          background: white;
          padding: 50px;
          border-radius: 25px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          margin-bottom: 50px;
        }

        .article-content h2 {
          color: #333;
          font-weight: 800;
          font-size: 2rem;
          margin-top: 40px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 3px solid #FFC107;
        }

        .article-content p {
          color: #555;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 25px;
        }

        .article-content ul {
          list-style: none;
          padding-left: 0;
          margin-bottom: 30px;
        }

        .article-content li {
          color: #555;
          font-size: 1.05rem;
          line-height: 1.8;
          padding-left: 30px;
          position: relative;
          margin-bottom: 15px;
        }

        .article-content li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #FFC107;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .article-content img {
          width: 100%;
          border-radius: 15px;
          margin: 30px 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .tags-section {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 30px 0;
          border-top: 2px solid #e0e0e0;
          border-bottom: 2px solid #e0e0e0;
          margin: 40px 0;
        }

        .tag {
          background: #f5f5f5;
          color: #666;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .tag:hover {
          background: #FFC107;
          color: white;
          transform: translateY(-2px);
        }

        .related-section {
          background: white;
          padding: 50px;
          border-radius: 25px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }

        .related-title {
          font-size: 2rem;
          font-weight: 900;
          color: #333;
          margin-bottom: 30px;
          text-align: center;
        }

        .related-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          cursor: pointer;
        }

        .related-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .related-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .related-image img {
          transition: transform 0.3s ease;
        }

        .related-card:hover .related-image img {
          transform: scale(1.1);
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          margin-bottom: 30px;
        }

        .back-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
          color: white;
        }

        @media (max-width: 768px) {
          .article-title {
            font-size: 2rem;
          }

          .featured-image {
            height: 300px;
          }

          .article-content {
            padding: 30px 20px;
          }

          .article-content h2 {
            font-size: 1.5rem;
          }

          .related-section {
            padding: 30px 20px;
          }
        }
      `}</style>

      <div className="news-detail-container">
        <div className="container">
          <Link href="/news" className="back-button">
            <i className="bi bi-arrow-left"></i>
            Quay lại tin tức
          </Link>

          {/* Article Header */}
          <div className="article-header">
            <div className="container">
              <span className="article-category">{article.category}</span>
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta">
                <span className="meta-item">
                  <i className="bi bi-person-circle"></i>
                  {article.author}
                </span>
                <span className="meta-item">
                  <i className="bi bi-calendar3"></i>
                  {formatDate(article.publishDate)}
                </span>
                <span className="meta-item">
                  <i className="bi bi-eye"></i>
                  {(article.views || 0).toLocaleString()} lượt xem
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="featured-image">
            {article.image && (
              <Image 
                src={article.image} 
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            )}
            {!article.image && (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-newspaper" style={{ fontSize: '5rem', color: 'rgba(255,255,255,0.3)' }}></i>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="article-content">
            <p className="lead fw-bold" style={{ fontSize: '1.3rem', color: '#333' }}>
              {article.excerpt}
            </p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="tags-section">
                <i className="bi bi-tags-fill" style={{ color: '#FFC107', fontSize: '1.2rem', marginRight: '10px' }}></i>
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="related-section">
              <h3 className="related-title">Bài viết liên quan</h3>
              <div className="row g-4">
                {relatedArticles.map((related) => (
                  <div key={related.id} className="col-md-4">
                    <Link href={`/news/${related.id}`} className="text-decoration-none">
                      <div className="related-card">
                        <div className="related-image">
                          {related.image && (
                            <Image 
                              src={related.image} 
                              alt={related.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                          {!related.image && (
                            <div style={{ 
                              width: '100%', 
                              height: '100%', 
                              background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <i className="bi bi-newspaper" style={{ fontSize: '2rem', color: 'rgba(0,0,0,0.1)' }}></i>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <span className="badge bg-warning text-dark mb-2">{related.category}</span>
                          <h5 className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                            {related.title}
                          </h5>
                          <p className="text-muted small mb-0">
                            <i className="bi bi-calendar3 me-2"></i>
                            {formatDate(related.publishDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


