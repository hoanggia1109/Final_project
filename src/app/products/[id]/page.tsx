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
      fetch(`/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
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
          background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 50%);
        }

        .breadcrumb-modern {
          background: transparent;
          padding: 0;
          margin-bottom: 2rem;
        }

        .breadcrumb-modern .breadcrumb-item + .breadcrumb-item::before {
          content: '›';
          color: #999;
        }

        .image-gallery-main {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          background: #f5f5f5;
        }

        .image-gallery-thumbs {
          display: flex;
          gap: 12px;
          margin-top: 12px;
          overflow-x: auto;
          padding: 5px;
        }

        .thumb-image {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .thumb-image:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .thumb-image.active {
          border-color: #FFC107;
          transform: scale(1.05);
        }

        .product-info-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          position: sticky;
          top: 100px;
        }

        .price-section {
          background: linear-gradient(135deg, #FFF3CD 0%, #FFE69C 100%);
          padding: 25px;
          border-radius: 15px;
          margin: 25px 0;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 1.1rem;
        }

        .current-price {
          color: #dc3545;
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 700;
          display: inline-block;
          font-size: 1rem;
        }

        .color-option {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .color-option:hover {
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .color-option.active {
          border-color: #FFC107;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.3);
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 2px solid #e0e0e0;
          border-radius: 50px;
          overflow: hidden;
          width: fit-content;
        }

        .quantity-btn {
          width: 45px;
          height: 45px;
          border: none;
          background: transparent;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #666;
        }

        .quantity-btn:hover {
          background: #FFC107;
          color: white;
        }

        .quantity-value {
          padding: 0 25px;
          font-weight: 600;
          font-size: 1.1rem;
          min-width: 60px;
          text-align: center;
        }

        .btn-add-cart {
          background: linear-gradient(135deg, #FFC107 0%, #FFB300 100%);
          color: white;
          border: none;
          padding: 18px 40px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-add-cart:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 193, 7, 0.4);
        }

        .btn-buy-now {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          border: none;
          padding: 18px 40px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-buy-now:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(40, 167, 69, 0.4);
        }

        .info-tabs {
          background: white;
          border-radius: 20px;
          padding: 40px;
          margin-top: 60px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }

        .tab-buttons {
          display: flex;
          gap: 10px;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 30px;
        }

        .tab-btn {
          padding: 15px 30px;
          background: transparent;
          border: none;
          color: #666;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #FFC107 0%, #FFB300 100%);
          transition: width 0.3s ease;
        }

        .tab-btn.active {
          color: #FFC107;
        }

        .tab-btn.active::after {
          width: 100%;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
        }

        .feature-icon {
          width: 24px;
          height: 24px;
          background: #FFC107;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .spec-table {
          width: 100%;
        }

        .spec-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          padding: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .spec-row:nth-child(even) {
          background: #f8f9fa;
        }

        .spec-label {
          font-weight: 600;
          color: #333;
        }

        .spec-value {
          color: #666;
        }

        .rating-stars {
          color: #FFC107;
          font-size: 1.2rem;
        }

        .stock-status {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .in-stock {
          background: #d4edda;
          color: #155724;
        }

        .low-stock {
          background: #fff3cd;
          color: #856404;
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
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              
              <div className="image-gallery-thumbs">
                {product.images.map((img, index) => (
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
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div className="product-info-card">
                {/* Brand & Category */}
                <div className="mb-3">
                  <span className="badge bg-secondary me-2">{product.brand}</span>
                  <span className="badge bg-info">{product.category}</span>
                </div>

                {/* Product Name */}
                <h1 className="mb-3" style={{ fontSize: '2.2rem', fontWeight: '800', color: '#333' }}>
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
                <div className="mb-4">
                  <h5 className="mb-3 fw-bold">Màu sắc</h5>
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
                    {product.colors[selectedColor].name}
                  </p>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <h5 className="mb-3 fw-bold">Số lượng</h5>
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
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e0e0e0' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-truck text-warning"></i>
                    <span>Miễn phí vận chuyển cho đơn hàng trên 5 triệu</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-shield-check text-success"></i>
                    <span>Bảo hành chính hãng {product.specifications['Bảo hành']}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-arrow-counterclockwise text-info"></i>
                    <span>Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất</span>
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
                <h4 className="mb-4 fw-bold">Mô tả chi tiết</h4>
                <p className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#555' }}>
                  {product.description}
                </p>
                
                <h5 className="mb-3 fw-bold">Đặc điểm nổi bật</h5>
                <div>
                  {product.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-check text-white" style={{ fontSize: '0.8rem' }}></i>
                      </div>
                      <span style={{ fontSize: '1rem', color: '#555' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-content-specifications">
                <h4 className="mb-4 fw-bold">Thông số kỹ thuật</h4>
                <div className="spec-table">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={index} className="spec-row">
                      <div className="spec-label">{key}</div>
                      <div className="spec-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content-reviews">
                <h4 className="mb-4 fw-bold">Đánh giá từ khách hàng</h4>
                <div className="text-center py-5">
                  <i className="bi bi-star text-warning" style={{ fontSize: '4rem' }}></i>
                  <h5 className="mt-3 text-muted">Chưa có đánh giá nào</h5>
                  <p className="text-muted">Hãy là người đầu tiên đánh giá sản phẩm này</p>
                  <button className="btn btn-warning mt-3">Viết đánh giá</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

