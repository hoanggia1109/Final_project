'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PromoModal from '@/app/component/PromoModal';

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  colors: { name: string; code: string }[];
  relatedProducts: number[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  useEffect(() => {
    if (params?.id) {
      console.log('🔍 Fetching product from frontend, ID:', params.id);
      fetch(`/api/products/${params.id}`)
        .then(res => {
          console.log('📥 Frontend response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('✅ Product data received:', data);
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Frontend error:', err);
          setLoading(false);
        });
    }
  }, [params?.id]);

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2>Không tìm thấy sản phẩm</h2>
          <Link href="/" className="btn btn-warning mt-3">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PromoModal />
      <style jsx global>{`
        .product-detail-container {
          padding-top: 100px;
          padding-bottom: 80px;
          background: #FAF8F5;
        }

        .breadcrumb-modern {
          background: transparent;
          padding: 0;
          margin-bottom: 2.5rem;
          font-size: 0.9rem;
        }

        .breadcrumb-modern .breadcrumb-item + .breadcrumb-item::before {
          content: '/';
          color: #8B7355;
        }

        .breadcrumb-modern .breadcrumb-item a {
          color: #8B7355;
          text-decoration: none;
        }

        .breadcrumb-modern .breadcrumb-item.active {
          color: #5C4A3A;
        }

        .image-gallery-main {
          position: relative;
          width: 100%;
          height: 550px;
          border: 1px solid #E5DDD5;
          overflow: hidden;
          background: #FFFFFF;
        }

        .image-gallery-thumbs {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          overflow-x: auto;
          padding: 2px;
        }

        .thumb-image {
          position: relative;
          width: 90px;
          height: 90px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid #E5DDD5;
          transition: all 0.3s ease;
          flex-shrink: 0;
          background: #FFFFFF;
        }

        .thumb-image:hover {
          border-color: #C9A86A;
        }

        .thumb-image.active {
          border-color: #C9A86A;
          border-width: 3px;
        }

        .product-info-card {
          background: #FFFFFF;
          padding: 45px;
          border: 1px solid #E5DDD5;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          position: sticky;
          top: 100px;
        }

        .price-section {
          background: #FBF7F0;
          padding: 30px;
          border-left: 4px solid #C9A86A;
          margin: 30px 0;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 1rem;
          font-weight: 400;
        }

        .current-price {
          color: #8B4513;
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0;
        }

        .discount-badge {
          background: #8B4513;
          color: #FFF;
          padding: 6px 16px;
          font-weight: 600;
          display: inline-block;
          font-size: 0.85rem;
          letter-spacing: 1px;
        }

        .color-option {
          width: 45px;
          height: 45px;
          border: 2px solid #E5DDD5;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .color-option:hover {
          border-color: #C9A86A;
        }

        .color-option.active {
          border-color: #C9A86A;
          border-width: 3px;
          box-shadow: 0 0 0 2px #FBF7F0;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 2px solid #E5DDD5;
          overflow: hidden;
          width: fit-content;
        }

        .quantity-btn {
          width: 50px;
          height: 50px;
          border: none;
          background: #FFFFFF;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #5C4A3A;
          font-weight: 300;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #FBF7F0;
          color: #8B4513;
        }

        .quantity-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .quantity-value {
          padding: 0 30px;
          font-weight: 600;
          font-size: 1.1rem;
          min-width: 70px;
          text-align: center;
          border-left: 1px solid #E5DDD5;
          border-right: 1px solid #E5DDD5;
        }

        .btn-add-cart {
          background: #C9A86A;
          color: #FFFFFF;
          border: 2px solid #C9A86A;
          padding: 16px 40px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .btn-add-cart:hover {
          background: #FFFFFF;
          color: #C9A86A;
        }

        .btn-buy-now {
          background: #8B4513;
          color: #FFFFFF;
          border: 2px solid #8B4513;
          padding: 16px 40px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .btn-buy-now:hover {
          background: #FFFFFF;
          color: #8B4513;
        }

        .info-tabs {
          background: #FFFFFF;
          padding: 50px;
          margin-top: 60px;
          border: 1px solid #E5DDD5;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .tab-buttons {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #E5DDD5;
          margin-bottom: 40px;
        }

        .tab-btn {
          padding: 16px 35px;
          background: transparent;
          border: none;
          color: #8B7355;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #C9A86A;
          transition: width 0.3s ease;
        }

        .tab-btn.active {
          color: #5C4A3A;
          font-weight: 600;
        }

        .tab-btn.active::after {
          width: 100%;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 14px 0;
          border-bottom: 1px solid #F5F1EB;
        }

        .feature-icon {
          width: 6px;
          height: 6px;
          background: #C9A86A;
          flex-shrink: 0;
          margin-top: 10px;
        }

        .spec-table {
          width: 100%;
        }

        .spec-row {
          display: grid;
          grid-template-columns: 220px 1fr;
          padding: 18px 20px;
          border-bottom: 1px solid #F5F1EB;
        }

        .spec-row:nth-child(odd) {
          background: #FDFCFB;
        }

        .spec-label {
          font-weight: 600;
          color: #5C4A3A;
        }

        .spec-value {
          color: #6B5D52;
        }

        .rating-stars {
          color: #C9A86A;
          font-size: 1.1rem;
          letter-spacing: 2px;
        }

        .stock-status {
          display: inline-block;
          padding: 8px 18px;
          font-weight: 500;
          font-size: 0.85rem;
          border: 1px solid;
          letter-spacing: 0.5px;
        }

        .in-stock {
          background: #F0F8F4;
          color: #2D5F3F;
          border-color: #C8E6D4;
        }

        .low-stock {
          background: #FFF9ED;
          color: #8B6914;
          border-color: #F4E4C1;
        }

        .product-name-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2C2416;
          line-height: 1.4;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2C2416;
          margin-bottom: 25px;
          letter-spacing: 0px;
        }

        @media (max-width: 768px) {
          .product-info-card {
            position: relative;
            top: 0;
            margin-top: 30px;
          }

          .image-gallery-main {
            height: 350px;
          }

          .current-price {
            font-size: 2rem;
          }

          .spec-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>

      <div className="product-detail-container">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-modern">
              <li className="breadcrumb-item"><Link href="/">Trang chủ</Link></li>
              <li className="breadcrumb-item"><Link href="/products">Sản phẩm</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.category}</li>
            </ol>
          </nav>

          <div className="row g-5">
            {/* Image Gallery */}
            <div className="col-lg-6">
              <div className="image-gallery-main">
                <Image 
                  src={product.images?.[selectedImage] || product.images?.[0] || 'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'} 
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              
              <div className="image-gallery-thumbs">
                {product.images?.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumb-image ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name} ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )) || null}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div className="product-info-card">
                {/* Brand & Category */}
                <div className="mb-3">
                  <span style={{ 
                    background: '#F5F1EB', 
                    color: '#8B7355', 
                    padding: '6px 14px', 
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    marginRight: '8px',
                    border: '1px solid #E5DDD5'
                  }}>{product.brand}</span>
                  <span style={{ 
                    background: '#F5F1EB', 
                    color: '#8B7355', 
                    padding: '6px 14px', 
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    border: '1px solid #E5DDD5'
                  }}>{product.category}</span>
                </div>

                {/* Product Name */}
                <h1 className="product-name-title">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rating-stars">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-muted">
                    {product.rating} ({product.reviews} đánh giá)
                  </span>
                </div>

                {/* Price Section */}
                <div className="price-section">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="discount-badge">-{product.discount}%</span>
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  </div>
                  <h2 className="current-price">{formatPrice(product.price)}</h2>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  <span className={`stock-status ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                    {product.stock > 10 ? `Còn hàng (${product.stock} sản phẩm)` : `Sắp hết (${product.stock} sản phẩm)`}
                  </span>
                </div>

                {/* SKU */}
                <div className="mb-4">
                  <span className="text-muted">Mã sản phẩm: <strong>{product.sku}</strong></span>
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3 fw-semibold" style={{ color: '#5C4A3A', letterSpacing: '0.5px' }}>Màu sắc</h6>
                    <div className="d-flex gap-3">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className={`color-option ${selectedColor === index ? 'active' : ''}`}
                          style={{ backgroundColor: color.code }}
                          onClick={() => setSelectedColor(index)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.9rem' }}>
                      {product.colors[selectedColor]?.name || 'Màu mặc định'}
                    </p>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-4">
                  <h6 className="mb-3 fw-semibold" style={{ color: '#5C4A3A', letterSpacing: '0.5px' }}>Số lượng</h6>
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <div className="quantity-value">{quantity}</div>
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column gap-3">
                  <button className="btn btn-add-cart w-100">
                    <i className="bi bi-cart-plus me-2"></i>
                    Thêm vào giỏ hàng
                  </button>
                  <button className="btn btn-buy-now w-100">
                    <i className="bi bi-lightning-charge me-2"></i>
                    Mua ngay
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E5DDD5' }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <i className="bi bi-truck" style={{ fontSize: '1.2rem', color: '#C9A86A' }}></i>
                    <span style={{ fontSize: '0.9rem', color: '#6B5D52' }}>Miễn phí vận chuyển cho đơn hàng trên 5 triệu</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <i className="bi bi-shield-check" style={{ fontSize: '1.2rem', color: '#C9A86A' }}></i>
                    <span style={{ fontSize: '0.9rem', color: '#6B5D52' }}>Bảo hành chính hãng {product.specifications?.['Bảo hành'] || '12 tháng'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-arrow-counterclockwise" style={{ fontSize: '1.2rem', color: '#C9A86A' }}></i>
                    <span style={{ fontSize: '0.9rem', color: '#6B5D52' }}>Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="info-tabs">
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả sản phẩm
              </button>
              <button 
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Thông số kỹ thuật
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá ({product.reviews})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'description' && (
              <div className="tab-content-description">
                <h4 className="section-title">Mô tả chi tiết</h4>
                <p className="mb-4" style={{ fontSize: '1rem', lineHeight: '1.9', color: '#6B5D52' }}>
                  {product.description}
                </p>
                
                <h5 className="fw-semibold mb-4" style={{ color: '#5C4A3A', fontSize: '1.1rem' }}>Đặc điểm nổi bật</h5>
                <div>
                  {product.features?.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon"></div>
                      <span style={{ fontSize: '0.95rem', color: '#6B5D52', lineHeight: '1.7' }}>{feature}</span>
                    </div>
                  )) || <p style={{ color: '#999' }}>Chưa có thông tin chi tiết</p>}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-content-specifications">
                <h4 className="section-title">Thông số kỹ thuật</h4>
                <div className="spec-table">
                  {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={index} className="spec-row">
                      <div className="spec-label">{key}</div>
                      <div className="spec-value">{value}</div>
                    </div>
                  ))}
                  {!product.specifications && (
                    <p className="text-muted text-center">Chưa có thông số kỹ thuật</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content-reviews">
                <h4 className="section-title">Đánh giá từ khách hàng</h4>
                <div className="text-center py-5">
                  <i className="bi bi-star" style={{ fontSize: '3.5rem', color: '#C9A86A' }}></i>
                  <h5 className="mt-4" style={{ color: '#8B7355' }}>Chưa có đánh giá nào</h5>
                  <p style={{ color: '#999' }}>Hãy là người đầu tiên đánh giá sản phẩm này</p>
                  <button className="btn mt-3" style={{ 
                    background: '#C9A86A', 
                    color: '#FFF', 
                    border: '2px solid #C9A86A',
                    padding: '12px 30px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>Viết đánh giá</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

