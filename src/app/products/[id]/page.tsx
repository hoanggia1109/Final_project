'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PromoModal from '@/app/component/PromoModal';
import Toast from '@/app/component/Toast';
import { addToCart } from '@/app/utils/cart';

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
  colors: { id?: string; name: string; code: string }[];
  relatedProducts: number[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (params?.id) {
      console.log(' Fetching product from frontend, ID:', params.id);
      fetch(`/api/products/${params.id}`)
        .then(res => {
          console.log(' Frontend response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log(' Product data received:', data);
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(' Frontend error:', err);
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

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      const selectedColorData = product.colors?.[selectedColor];
      
      if (!selectedColorData?.id) {
        setToastMessage('Vui lòng chọn màu sắc!');
        setToastType('error');
        setShowToast(true);
        return;
      }
      
      await addToCart({
        bienthe_id: selectedColorData.id,
        soluong: quantity,
      });
      
      // Show success toast
      setToastMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      setToastType('success');
      setShowToast(true);
      
      // Reset quantity
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage('Có lỗi xảy ra khi thêm vào giỏ hàng!');
      setToastType('error');
      setShowToast(true);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      const selectedColorData = product.colors?.[selectedColor];
      
      if (!selectedColorData?.id) {
        setToastMessage('Vui lòng chọn màu sắc!');
        setToastType('error');
        setShowToast(true);
        return;
      }
      
      // Add to cart first
      await addToCart({
        bienthe_id: selectedColorData.id,
        soluong: quantity,
      });
      
      // Redirect to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error buying now:', error);
      setToastMessage('Có lỗi xảy ra!');
      setToastType('error');
      setShowToast(true);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = useCallback(() => {
    if (product?.images) {
      setLightboxIndex((prev) => (prev + 1) % product.images.length);
    }
  }, [product]);

  const prevImage = useCallback(() => {
    if (product?.images) {
      setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  }, [product]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, nextImage, prevImage]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 100%)' }}>
        <div className="text-center">
          <div className="spinner-border" style={{ width: '4rem', height: '4rem', color: '#FF6B6B', borderWidth: '4px' }}></div>
          <p className="mt-3" style={{ color: '#FF8E53', fontWeight: '600' }}>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 100%)' }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '4rem', color: '#FF6B6B' }}></i>
          <h2 className="mt-4" style={{ color: '#2c3e50' }}>Không tìm thấy sản phẩm</h2>
          <p style={{ color: '#999' }}>Sản phẩm không tồn tại hoặc đã bị xóa</p>
          <Link href="/" className="btn mt-3" style={{
            background: 'linear-gradient(135deg, #FF8E53, #FFA726)',
            color: '#fff',
            padding: '12px 30px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(255, 142, 83, 0.3)'
          }}>Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PromoModal />
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Image Lightbox Modal */}
      {showLightbox && product && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',
              border: 'none',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10002,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>

          {/* Previous Button */}
          {product.images && product.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              style={{
                position: 'absolute',
                left: '24px',
                background: 'linear-gradient(135deg, #FF8E53, #FFA726)',
                border: 'none',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                color: '#fff',
                fontSize: '28px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 142, 83, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10002,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 142, 83, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 142, 83, 0.4)';
              }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          )}

          {/* Next Button */}
          {product.images && product.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              style={{
                position: 'absolute',
                right: '24px',
                background: 'linear-gradient(135deg, #FF8E53, #FFA726)',
                border: 'none',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                color: '#fff',
                fontSize: '28px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 142, 83, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10002,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 142, 83, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 142, 83, 0.4)';
              }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          )}

          {/* Main Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
              zIndex: 10001,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '80vw',
                height: '80vh',
                maxWidth: '1200px',
              }}
            >
              <Image
                src={product.images?.[lightboxIndex] || product.images?.[0] || ''}
                alt={`${product.name} ${lightboxIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            {/* Image Counter */}
            <div
              style={{
                position: 'absolute',
                bottom: '-48px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
              }}
            >
              {lightboxIndex + 1} / {product.images?.length || 0}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '12px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '80vw',
                  overflowX: 'auto',
                }}
              >
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(index);
                    }}
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: lightboxIndex === index ? '3px solid #FF8E53' : '3px solid transparent',
                      opacity: lightboxIndex === index ? 1 : 0.6,
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (lightboxIndex !== index) {
                        e.currentTarget.style.opacity = '0.8';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (lightboxIndex !== index) {
                        e.currentTarget.style.opacity = '0.6';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .product-detail-container {
          padding-top: 100px;
          padding-bottom: 80px;
          background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%);
        }

        .breadcrumb-modern {
          background: transparent;
          padding: 0;
          margin-bottom: 2.5rem;
          font-size: 0.9rem;
        }

        .breadcrumb-modern .breadcrumb-item + .breadcrumb-item::before {
          content: '/';
          color: #FF8E53;
        }

        .breadcrumb-modern .breadcrumb-item a {
          color: #FF6B6B;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .breadcrumb-modern .breadcrumb-item a:hover {
          color: #FF8E53;
        }

        .breadcrumb-modern .breadcrumb-item.active {
          color: #2c3e50;
        }

        .image-gallery-main {
          position: relative;
          width: 100%;
          height: 550px;
          border: 1px solid #FFE5D9;
          overflow: hidden;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.08);
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
          border: 2px solid #FFE5D9;
          transition: all 0.3s ease;
          flex-shrink: 0;
          background: #FFFFFF;
          border-radius: 12px;
        }

        .thumb-image:hover {
          border-color: #FF8E53;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 142, 83, 0.2);
        }

        .thumb-image.active {
          border-color: #FF6B6B;
          border-width: 3px;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.25);
        }

        .product-info-card {
          background: #FFFFFF;
          padding: 45px;
          border: 1px solid #FFE5D9;
          box-shadow: 0 8px 30px rgba(255, 107, 107, 0.1);
          position: sticky;
          top: 100px;
          border-radius: 16px;
        }

        .price-section {
          background: linear-gradient(135deg, #FFF5F0 0%, #FFE5E0 100%);
          padding: 30px;
          border-left: 4px solid #FF6B6B;
          margin: 30px 0;
          border-radius: 12px;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 1rem;
          font-weight: 400;
        }

        .current-price {
          color: #FF6B6B;
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0;
        }

        .discount-badge {
          background: linear-gradient(135deg, #FF6B6B, #FF5252);
          color: #FFF;
          padding: 6px 16px;
          font-weight: 600;
          display: inline-block;
          font-size: 0.85rem;
          letter-spacing: 1px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
        }

        .color-option {
          width: 50px;
          height: 50px;
          border: 3px solid #FFE5D9;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .color-option:hover {
          border-color: #FF8E53;
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 6px 16px rgba(255, 142, 83, 0.3);
        }

        .color-option.active {
          border-color: #FF6B6B;
          border-width: 4px;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2), 0 6px 16px rgba(255, 107, 107, 0.3);
          transform: scale(1.1);
        }
        
        .color-option.active::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-size: 20px;
          font-weight: bold;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 2px solid #FFE5D9;
          overflow: hidden;
          width: fit-content;
          border-radius: 12px;
        }

        .quantity-btn {
          width: 50px;
          height: 50px;
          border: none;
          background: #FFFFFF;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #FF6B6B;
          font-weight: 600;
        }

        .quantity-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          color: #FF6B6B;
          transform: scale(1.1);
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
          border-left: 1px solid #FFE5D9;
          border-right: 1px solid #FFE5D9;
          color: #FF6B6B;
        }

        .btn-add-cart {
          background: linear-gradient(135deg, #FF8E53 0%, #FFA726 100%);
          color: #FFFFFF;
          border: none;
          padding: 18px 40px;
          font-weight: 600;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          letter-spacing: 1px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(255, 142, 83, 0.3);
        }

        .btn-add-cart:hover:not(:disabled) {
          background: linear-gradient(135deg, #FFA726 0%, #FF8E53 100%);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 142, 83, 0.4);
          color: #FFFFFF;
        }

        .btn-add-cart:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-buy-now {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
          color: #FFFFFF;
          border: none;
          padding: 18px 40px;
          font-weight: 600;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          letter-spacing: 1px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .btn-buy-now:hover:not(:disabled) {
          background: linear-gradient(135deg, #FF5252 0%, #FF6B6B 100%);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
          color: #FFFFFF;
        }

        .btn-buy-now:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .info-tabs {
          background: #FFFFFF;
          padding: 50px;
          margin-top: 60px;
          border: 1px solid #FFE5D9;
          box-shadow: 0 8px 30px rgba(255, 107, 107, 0.08);
          border-radius: 16px;
        }

        .tab-buttons {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #FFE5D9;
          margin-bottom: 40px;
        }

        .tab-btn {
          padding: 16px 35px;
          background: transparent;
          border: none;
          color: #999;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .tab-btn:hover {
          color: #FF8E53;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #FF6B6B, #FF8E53);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .tab-btn.active {
          color: #FF6B6B;
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
          border-bottom: 1px solid #FFE5D9;
        }

        .feature-icon {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          flex-shrink: 0;
          margin-top: 10px;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
        }

        .spec-table {
          width: 100%;
        }

        .spec-row {
          display: grid;
          grid-template-columns: 220px 1fr;
          padding: 18px 20px;
          border-bottom: 1px solid #FFE5D9;
        }

        .spec-row:nth-child(odd) {
          background: #FFF9F5;
        }

        .spec-label {
          font-weight: 600;
          color: #2c3e50;
        }

        .spec-value {
          color: #666;
        }

        .rating-stars {
          color: #FFA726;
          font-size: 1.1rem;
          letter-spacing: 2px;
        }

        .stock-status {
          display: inline-block;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          letter-spacing: 0.5px;
          border-radius: 8px;
        }

        .in-stock {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #155724;
          box-shadow: 0 2px 8px rgba(21, 87, 36, 0.15);
        }

        .low-stock {
          background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%);
          color: #856404;
          box-shadow: 0 2px 8px rgba(133, 100, 4, 0.15);
        }

        .product-name-title {
          font-size: 1.9rem;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1.4;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2c3e50;
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
              <div 
                className="image-gallery-main"
                onClick={() => openLightbox(selectedImage)}
                style={{ cursor: 'pointer' }}
              >
                <Image 
                  src={product.images?.[selectedImage] || product.images?.[0] || 'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'} 
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div 
                  className="zoom-icon"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #FF8E53, #FFA726)',
                    color: '#fff',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 4px 12px rgba(255, 142, 83, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 142, 83, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 142, 83, 0.3)';
                  }}
                >
                  <i className="bi bi-zoom-in"></i>
                </div>
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
                    background: 'linear-gradient(135deg, #FFF5F0, #FFE5E0)', 
                    color: '#FF6B6B', 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    marginRight: '10px',
                    border: '2px solid #FFE5D9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(255, 107, 107, 0.1)'
                  }}>{product.brand}</span>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #FFF5F0, #FFE5E0)', 
                    color: '#FF8E53', 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    border: '2px solid #FFE5D9',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(255, 142, 83, 0.1)'
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
                    <h6 className="mb-3 fw-semibold" style={{ color: '#2c3e50', letterSpacing: '0.5px', fontSize: '1.05rem' }}>Màu sắc</h6>
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
                  <h6 className="mb-3 fw-semibold" style={{ color: '#2c3e50', letterSpacing: '0.5px', fontSize: '1.05rem' }}>Số lượng</h6>
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
                  <button 
                    className="btn btn-add-cart w-100"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2"></i>
                        Thêm vào giỏ hàng
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-buy-now w-100"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                  >
                    <i className="bi bi-lightning-charge me-2"></i>
                    Mua ngay
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4" style={{ borderTop: '2px solid #FFE5D9' }}>
                  <div className="d-flex align-items-center gap-3 mb-3 p-2 rounded" style={{ background: 'linear-gradient(135deg, #FFF9F5, #FFE5E0)', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #FF8E53, #FFA726)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255, 142, 83, 0.3)'
                    }}>
                      <i className="bi bi-truck" style={{ fontSize: '1.1rem', color: '#fff' }}></i>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Miễn phí vận chuyển cho đơn hàng trên 5 triệu</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-3 p-2 rounded" style={{ background: 'linear-gradient(135deg, #FFF9F5, #FFE5E0)', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
                    }}>
                      <i className="bi bi-shield-check" style={{ fontSize: '1.1rem', color: '#fff' }}></i>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Bảo hành chính hãng {product.specifications?.['Bảo hành'] || '12 tháng'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 p-2 rounded" style={{ background: 'linear-gradient(135deg, #FFF9F5, #FFE5E0)', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #FFA726, #FFB74D)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255, 167, 38, 0.3)'
                    }}>
                      <i className="bi bi-arrow-counterclockwise" style={{ fontSize: '1.1rem', color: '#fff' }}></i>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất</span>
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
                  <i className="bi bi-star-fill" style={{ fontSize: '3.5rem', color: '#FFA726' }}></i>
                  <h5 className="mt-4" style={{ color: '#666' }}>Chưa có đánh giá nào</h5>
                  <p style={{ color: '#999' }}>Hãy là người đầu tiên đánh giá sản phẩm này</p>
                  <button className="btn mt-3" style={{ 
                    background: 'linear-gradient(135deg, #FF8E53, #FFA726)', 
                    color: '#FFF', 
                    border: 'none',
                    padding: '14px 35px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(255, 142, 83, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 142, 83, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 142, 83, 0.3)';
                  }}
                  >Viết đánh giá</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

