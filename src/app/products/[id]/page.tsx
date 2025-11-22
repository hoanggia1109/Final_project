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
  colors: { id?: string; name: string; code: string; stock?: number }[];
  relatedProducts: number[];
}

interface RelatedProduct {
  id: string;
  tensp: string;
  thumbnail?: string;
  bienthe?: Array<{
    gia: number;
  }>;
}

interface Review {
  id: string;
  rating: number;
  binhluan: string;
  created_at: string;
  user_id: string;
  chitiet_donhang: {
    bienthe: {
      mausac?: string;
      kichthuoc?: string;
    };
  };
  hinhanh?: Array<{
    id: string;
    url: string;
  }>;
}

interface ReviewData {
  reviews: Review[];
  rating: {
    average_rating: number;
    count: number;
  };
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
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [reviewData, setReviewData] = useState<ReviewData>({ reviews: [], rating: { average_rating: 0, count: 0 } });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

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

  // Fetch related products
  useEffect(() => {
    fetch('http://localhost:5001/api/sanpham')
      .then(res => res.json())
      .then(data => {
        // Get random 4 products
        const shuffled = data.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 4));
      })
      .catch(err => console.error('Error fetching related products:', err));
  }, []);

  // Fetch reviews
  useEffect(() => {
    if (params?.id) {
      fetch(`/api/reviews/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setReviewData(data);
        })
        .catch(err => console.error('Error fetching reviews:', err));
    }
  }, [params?.id]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token || !params?.id) return;

      try {
        const response = await fetch(`/api/wishlist/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsWishlisted(data.isWishlisted);
        }
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };

    checkWishlist();
  }, [params?.id]);

  // Toggle wishlist
  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setToastMessage('Vui lòng đăng nhập để thêm vào yêu thích');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (!params?.id) return;

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist/${params.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsWishlisted(false);
          setToastMessage('Đã xóa khỏi yêu thích');
          setToastType('success');
          setShowToast(true);
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ sanpham_id: params.id }),
        });

        if (response.ok) {
          setIsWishlisted(true);
          setToastMessage('Đã thêm vào yêu thích');
          setToastType('success');
          setShowToast(true);
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setToastMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  // Lấy số lượng tồn kho của biến thể được chọn
  const getCurrentStock = () => {
    if (!product) return 0;
    if (product.colors && product.colors.length > 0) {
      return product.colors[selectedColor]?.stock || 0;
    }
    return product.stock;
  };

  const currentStock = getCurrentStock();

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < currentStock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'increase' && quantity >= currentStock) {
      // Show toast when reaching max stock
      setToastMessage(`Số lượng tối đa: ${currentStock} sản phẩm`);
      setToastType('info');
      setShowToast(true);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityInput = (value: string) => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
      return;
    }
    
    if (numValue > currentStock) {
      setQuantity(currentStock);
      setToastMessage(`Chỉ còn ${currentStock} sản phẩm trong kho`);
      setToastType('info');
      setShowToast(true);
      return;
    }
    
    setQuantity(numValue);
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

  // Reset quantity khi thay đổi màu sắc (nếu quantity vượt quá stock của màu mới)
  useEffect(() => {
    if (quantity > currentStock) {
      setQuantity(Math.min(quantity, currentStock) || 1);
    }
  }, [selectedColor, currentStock, quantity]);

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
          border: 1px solid rgba(212, 175, 55, 0.2);
          overflow: hidden;
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(139, 115, 85, 0.1);
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

        .quantity-input {
          padding: 0 20px;
          font-weight: 600;
          font-size: 1.1rem;
          min-width: 100px;
          max-width: 100px;
          text-align: center;
          border: none;
          border-left: 1px solid #FFE5D9;
          border-right: 1px solid #FFE5D9;
          color: #FF6B6B;
          background: #FFFFFF;
          outline: none;
        }

        .quantity-input:focus {
          background: #FFF9F5;
        }

        /* Hide spinner buttons on number input */
        .quantity-input::-webkit-outer-spin-button,
        .quantity-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .quantity-input[type=number] {
          -moz-appearance: textfield;
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

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }

        @keyframes pulse {
          0%, 100% { 
            box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
          }
          50% { 
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5);
          }
        }

        .hotline-floating-btn {
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .hotline-floating-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .hotline-floating-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .hotline-floating-btn:active {
          transform: scale(0.98) !important;
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
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'linear-gradient(135deg, #D4AF37, #C4A855)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                    zIndex: 2
                  }}>
                    -{product.discount}%
                  </div>
                )}

                {/* Stock Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: product.discount > 0 ? '100px' : '16px',
                  background: currentStock > 10 ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #FFA726, #FF9800)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  letterSpacing: '0.3px',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
                  zIndex: 2
                }}>
                  {currentStock > 10 ? `Còn ${currentStock}` : 'Sắp hết'}
                </div>

                <Image 
                  src={product.images?.[selectedImage] || product.images?.[0] || 'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'} 
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                
                {/* Zoom Icon */}
                <div 
                  className="zoom-icon"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #D4AF37, #C4A855)',
                    color: '#fff',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                    transition: 'all 0.3s ease',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
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

              {/* Quick Info Cards */}
              <div className="row g-3 mt-3">
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ 
                    background: 'linear-gradient(135deg, #FAF8F3, #F5F2E8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'}
                  >
                    <i className="bi bi-shield-check" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '8px' }}></i>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.85rem', color: '#3D3D3D' }}>Bảo hành chính hãng</p>
                    <p className="mb-0" style={{ fontSize: '0.75rem', color: '#7A7A7A' }}>12 tháng</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ 
                    background: 'linear-gradient(135deg, #FAF8F3, #F5F2E8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'}
                  >
                    <i className="bi bi-truck" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '8px' }}></i>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.85rem', color: '#3D3D3D' }}>Giao hàng nhanh</p>
                    <p className="mb-0" style={{ fontSize: '0.75rem', color: '#7A7A7A' }}>Miễn phí 5tr</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ 
                    background: 'linear-gradient(135deg, #FAF8F3, #F5F2E8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'}
                  >
                    <i className="bi bi-arrow-counterclockwise" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '8px' }}></i>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.85rem', color: '#3D3D3D' }}>Đổi trả 7 ngày</p>
                    <p className="mb-0" style={{ fontSize: '0.75rem', color: '#7A7A7A' }}>Miễn phí</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ 
                    background: 'linear-gradient(135deg, #FAF8F3, #F5F2E8)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'}
                  >
                    <i className="bi bi-star-fill" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '8px' }}></i>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.85rem', color: '#3D3D3D' }}>Chất lượng cao</p>
                    <p className="mb-0" style={{ fontSize: '0.75rem', color: '#7A7A7A' }}>Hàng chính hãng</p>
                  </div>
                </div>
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
                    {'★'.repeat(Math.floor(reviewData.rating.average_rating))}
                    {'☆'.repeat(5 - Math.floor(reviewData.rating.average_rating))}
                  </div>
                  <span className="text-muted">
                    {reviewData.rating.average_rating.toFixed(1)} ({reviewData.rating.count} đánh giá)
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
                  <span className={`stock-status ${currentStock > 10 ? 'in-stock' : 'low-stock'}`}>
                    {currentStock > 10 ? `Còn hàng (${currentStock} sản phẩm)` : `Sắp hết (${currentStock} sản phẩm)`}
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
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="mb-0 fw-semibold" style={{ color: '#2c3e50', letterSpacing: '0.5px', fontSize: '1.05rem' }}>Số lượng</h6>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      Còn lại: <strong style={{ color: '#FF6B6B' }}>{currentStock}</strong> sản phẩm
                    </span>
                  </div>
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      title="Giảm số lượng"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      onChange={(e) => handleQuantityInput(e.target.value)}
                      min="1"
                      max={currentStock}
                    />
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= currentStock}
                      title={quantity >= currentStock ? `Tối đa ${currentStock} sản phẩm` : 'Tăng số lượng'}
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
                    disabled={addingToCart || currentStock === 0}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2"></i>
                        {currentStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-buy-now w-100"
                    onClick={handleBuyNow}
                    disabled={currentStock === 0}
                  >
                    <i className="bi bi-lightning-charge me-2"></i>
                    {currentStock === 0 ? 'Hết hàng' : 'Mua ngay'}
                  </button>
                </div>

                {/* Social Share & Wishlist */}
                <div className="mt-3 pt-3 pb-3" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span style={{ fontSize: '0.85rem', color: '#5A5A5A', fontWeight: '600', letterSpacing: '0.3px' }}>Chia sẻ:</span>
                      <button className="btn btn-sm" style={{ background: '#3b5998', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem' }}>
                        <i className="bi bi-facebook me-1"></i> Facebook
                      </button>
                      <button className="btn btn-sm" style={{ background: '#1DA1F2', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem' }}>
                        <i className="bi bi-twitter me-1"></i> Twitter
                      </button>
                      <button className="btn btn-sm" style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem' }}>
                        <i className="bi bi-whatsapp me-1"></i> WhatsApp
                      </button>
                    </div>
                    <button 
                      className="btn btn-sm"
                      onClick={handleToggleWishlist}
                      disabled={wishlistLoading}
                      style={{
                        borderRadius: '10px',
                        padding: '8px 18px',
                        fontWeight: '600',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: isWishlisted ? '#dc3545' : '#D4AF37',
                        color: isWishlisted ? '#fff' : '#D4AF37',
                        background: isWishlisted ? '#dc3545' : 'transparent',
                        transition: 'all 0.3s ease',
                        fontSize: '0.85rem'
                      }}
                      onMouseEnter={(e) => {
                        if (!isWishlisted) {
                          e.currentTarget.style.background = '#D4AF37';
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isWishlisted) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#D4AF37';
                        }
                      }}
                    >
                      {wishlistLoading ? (
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      ) : (
                        <i className={`bi bi-heart${isWishlisted ? '-fill' : ''} me-1`}></i>
                      )}
                      {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
                    </button>
                  </div>
                </div>

                {/* Contact Hotline Button */}
                <a 
                  href="tel:1900xxxx" 
                  className="hotline-floating-btn d-flex align-items-center justify-content-between gap-3 text-decoration-none mt-3 p-3 rounded"
                  style={{ 
                    background: 'linear-gradient(135deg, #D4AF37, #C4A855)', 
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                    transition: 'all 0.3s ease',
                    animation: 'pulse 2s ease-in-out infinite',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
                    e.currentTarget.style.animation = 'none';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.animation = 'pulse 2s ease-in-out infinite';
                  }}
                >
                  <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: 'rgba(255, 255, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className="bi bi-telephone-fill" style={{ fontSize: '1.3rem', animation: 'shake 0.5s ease-in-out infinite' }}></i>
                    </div>
                    <div>
                      <p className="mb-0 fw-bold" style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>Cần tư vấn ngay?</p>
                      <p className="mb-0" style={{ fontSize: '0.8rem', opacity: '0.95' }}>Hotline: <strong style={{ fontSize: '0.95rem' }}>1900 xxxx</strong></p>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right" style={{ fontSize: '1.5rem', opacity: '0.8', position: 'relative', zIndex: 1 }}></i>
                </a>
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
                Đánh giá ({reviewData.rating.count})
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="section-title mb-0">Đánh giá từ khách hàng</h4>
                  <button 
                    className="btn btn-warning"
                    onClick={() => setShowReviewForm(true)}
                    style={{
                      fontWeight: '600',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)'
                    }}
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Viết đánh giá
                  </button>
                </div>

                {/* Review Summary */}
                {reviewData.rating.count > 0 && (
                  <div className="review-summary p-4 mb-4" style={{
                    background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE5E0 100%)',
                    borderRadius: '12px',
                    border: '1px solid #FFE5D9'
                  }}>
                    <div className="row align-items-center">
                      <div className="col-md-4 text-center border-end">
                        <div style={{ fontSize: '3rem', fontWeight: '700', color: '#FF6B6B' }}>
                          {reviewData.rating.average_rating.toFixed(1)}
                        </div>
                        <div className="rating-stars mb-2" style={{ fontSize: '1.5rem' }}>
                          {'★'.repeat(Math.floor(reviewData.rating.average_rating))}
                          {'☆'.repeat(5 - Math.floor(reviewData.rating.average_rating))}
                        </div>
                        <div className="text-muted">{reviewData.rating.count} đánh giá</div>
                      </div>
                      <div className="col-md-8">
                        <div className="ps-4">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviewData.reviews.filter(r => r.rating === star).length;
                            const percentage = reviewData.rating.count > 0 ? (count / reviewData.rating.count) * 100 : 0;
                            return (
                              <div key={star} className="d-flex align-items-center mb-2">
                                <span className="me-2" style={{ minWidth: '60px' }}>{star} ★</span>
                                <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                  <div 
                                    className="progress-bar bg-warning" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-muted" style={{ minWidth: '40px' }}>{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {reviewData.reviews.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-star-fill" style={{ fontSize: '3.5rem', color: '#FFA726', opacity: 0.3 }}></i>
                  <h5 className="mt-4" style={{ color: '#666' }}>Chưa có đánh giá nào</h5>
                  <p style={{ color: '#999' }}>Hãy là người đầu tiên đánh giá sản phẩm này</p>
                </div>
                ) : (
                  <div className="reviews-list">
                    {reviewData.reviews.map((review) => (
                      <div key={review.id} className="review-item p-4 mb-3" style={{
                        background: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <div className="d-flex justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-3">
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '1.2rem',
                              fontWeight: '600'
                            }}>
                              {review.user_id.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold">Khách hàng</div>
                              <div className="rating-stars text-warning">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                              </div>
                            </div>
                          </div>
                          <div className="text-muted small">
                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        
                        {/* Variant info */}
                        {review.chitiet_donhang?.bienthe && (
                          <div className="mb-2">
                            <small className="text-muted">
                              Phân loại: {review.chitiet_donhang.bienthe.mausac || ''} 
                              {review.chitiet_donhang.bienthe.kichthuoc ? ` - ${review.chitiet_donhang.bienthe.kichthuoc}` : ''}
                            </small>
                          </div>
                        )}

                        <p className="mb-3">{review.binhluan}</p>

                        {/* Review Images */}
                        {review.hinhanh && review.hinhanh.length > 0 && (
                          <div className="review-images d-flex gap-2 flex-wrap">
                            {review.hinhanh.map((img) => (
                              <div key={img.id} style={{
                                position: 'relative',
                                width: '100px',
                                height: '100px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: '1px solid #e0e0e0'
                              }}>
                                <Image 
                                  src={img.url}
                                  alt="Review"
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <i className="bi bi-pencil-square me-2"></i>
                      Viết đánh giá
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowReviewForm(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Bạn cần mua sản phẩm và đơn hàng đã giao thành công mới có thể đánh giá.
                    </div>
                    <p className="text-muted">
                      Vui lòng vào trang <Link href="/orders" className="text-primary fw-semibold">Đơn hàng của tôi</Link> để đánh giá sản phẩm đã mua.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setShowReviewForm(false);
                        router.push('/orders');
                      }}
                    >
                      Xem đơn hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section mt-5">
              <h3 className="section-title mb-4">Sản phẩm liên quan</h3>
              <div className="row g-4">
                {relatedProducts.map((item) => (
                  <div key={item.id} className="col-6 col-md-3">
                    <div 
                      className="related-product-card"
                      onClick={() => router.push(`/products/${item.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="related-product-image">
                        <Image
                          src={item.thumbnail || 'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'}
                          alt={item.tensp}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="related-product-info p-3">
                        <h6 className="fw-semibold mb-2" style={{ 
                          fontSize: '0.95rem', 
                          color: '#3D3D3D',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '2.8rem',
                          letterSpacing: '0.3px'
                        }}>
                          {item.tensp}
                        </h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ 
                            color: '#D4AF37',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            letterSpacing: '0.5px'
                          }}>
                            {item.bienthe && item.bienthe.length > 0
                              ? `${Number(item.bienthe[0].gia).toLocaleString('vi-VN')}₫`
                              : 'Liên hệ'}
                          </span>
                          <button 
                            className="btn btn-sm"
                            style={{
                              background: 'linear-gradient(135deg, #D4AF37, #C4A855)',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '8px 18px',
                              borderRadius: '24px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #C4A855, #D4AF37)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37, #C4A855)';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.25)';
                            }}
                          >
                            Xem
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .related-products-section {
          background: #FFFFFF;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(139, 115, 85, 0.08);
          border: 1px solid rgba(139, 115, 85, 0.08);
        }

        .related-product-card {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s ease;
          box-shadow: 0 4px 16px rgba(139, 115, 85, 0.08);
          border: 1px solid rgba(139, 115, 85, 0.08);
        }

        .related-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(139, 115, 85, 0.16);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .related-product-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
        }

        .related-product-card:hover .related-product-image img {
          transform: scale(1.08);
        }

        .related-product-image img {
          transition: transform 0.5s ease;
        }

        .related-product-info {
          background: #FFFFFF;
        }
      `}</style>
    </>
  );
}

