'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import PromoModal from './PromoModal';
import ChatBox from './ChatBox';

//INTERFACES
interface Product {
  id: number;
  name: string;
  image: string;
  discount: number;
  price: number;
  originalPrice: number;
}

interface Category {
  id: number;
  title: string;
  image: string;
  link: string;
}

// Định nghĩa interface cho Banner
interface BannerType {
  id: number;
  tieude: string;
  mota: string;
  url: string;
  anhien: number;
  thutu: number;
  image: string;
  link?: string;
  // Bổ sung các trường khác nếu cần thiết
}

//Banner 
function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<BannerType[]>([]);

  // Fetch banners từ API
  useEffect(() => {
    fetch('http://localhost:5000/api/banner')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Chỉ lấy banner có anhien = 1, sắp xếp theo thutu và giới hạn 4 banner
          const activeBanners = data
            .filter(b => b.anhien === 1)
            .sort((a, b) => a.thutu - b.thutu)
            .slice(0, 4); // Chỉ lấy 4 banner đầu tiên
          
          if (activeBanners.length > 0) {
            setBanners(activeBanners);
          }
        }
      })
      .catch(err => {
        console.error('Lỗi khi tải banner:', err);
        // Giữ nguyên banner mặc định nếu lỗi
      });
  }, []);

  useEffect(() => {
    if (banners.length === 0) return; // kiểm tra banner có tồn tại không
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length); 
    }, 5000); // Chuyển slide mỗi 5 giây
    
    return () => clearInterval(timer); 
  }, [banners.length]);

  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) {
    return (
      <section className="position-relative" style={{ minHeight: '640px', overflow: 'hidden', background: 'linear-gradient(135deg, #FFF9F0 0%, #ffffff 100%)' }}>
        <div className="container position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '640px' }}>
          <div className="text-center">
            <h1 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Chào mừng đến với DANNYdecor</h1>
            <p className="mb-4 text-muted">Đang tải banner...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="position-relative banner-section" style={{ minHeight: '640px', overflow: 'hidden' }}>
      {/* Banner Slides */}
      {banners.map((banner, slideIndex) => (
        <div
          key={banner.id}
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white banner-content"
          style={{
            minHeight: '520px',
            opacity: currentSlide === slideIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: currentSlide === slideIndex ? 1 : 0,
          }}
        >
          {/* Background Image with Animation */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: `url("${banner.url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              animation: currentSlide === slideIndex ? 'kenburns 20s ease-out infinite' : 'none',
            }}
          ></div>
          
          <div 
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1 }}
          ></div>
          <div className="container position-relative text-center px-3" style={{ zIndex: 2 }}>
            <h1 className="fw-bold hero-title mb-3">
              {banner.tieude}
            </h1>
            <p className="mb-4 mx-auto hero-desc">
              {banner.mota}
            </p>
            <Link href={banner.link || "/contact"} className="btn btn-warning btn-lg text-white px-5 py-3 fw-semibold banner-button btn-lg-responsive">
              Xem thêm
            </Link>
          </div>
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3"
        style={{ width: '50px', height: '50px', zIndex: 10, opacity: 0.7 }}
        suppressHydrationWarning
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-3"
        style={{ width: '50px', height: '50px', zIndex: 10, opacity: 0.7 }}
        suppressHydrationWarning
      >
        <i className="bi bi-chevron-right"></i>
      </button>

    </section>
  );
}

// PRODUCT CATEGORIES
function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { 
        // Giới hạn chỉ lấy 6 danh mục đầu tiên cho trang chủ
        setCategories(data.slice(0, 6)); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Error fetching categories:', err); 
        setLoading(false); 
      });
  }, []);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, Math.ceil(categories.length / itemsPerPage) - 1);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('right');
    setCurrentIndex(prev => (prev + 1) % (maxIndex + 1));
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, maxIndex]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('left');
    setCurrentIndex(prev => (prev - 1 + maxIndex + 1) % (maxIndex + 1));
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, maxIndex]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (categories.length === 0 || isAnimating) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    
    return () => clearInterval(timer);
  }, [categories.length, isAnimating, currentIndex, handleNext]);

  if (loading) return <div className="py-5 text-center"><div className="spinner-border text-warning"></div></div>;

  if (categories.length === 0) {
    return (
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center py-5">
            <h3 className="text-muted">Không có danh mục nào</h3>
            <p className="text-muted">Vui lòng kiểm tra kết nối API</p>
          </div>
        </div>
      </section>
    );
  }

  const visibleCategories = categories.slice(currentIndex * itemsPerPage, (currentIndex * itemsPerPage) + itemsPerPage);

  return (
    <section className="py-5 section-padding" style={{ background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-uppercase fw-bold mb-2 section-title responsive-title" style={{ 
            fontSize: '2rem', 
            letterSpacing: '2px',
            color: '#2c3e50',
            position: 'relative',
            display: 'inline-block'
          }}>
            DANH MỤC SẢN PHẨM
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #FFC107, #FFD54F)',
              borderRadius: '2px'
            }}></div>
          </h2>
          <p className="text-muted mt-3 responsive-text" style={{ fontSize: '1.05rem' }}>Khám phá bộ sưu tập nội thất cao cấp</p>
        </div>
        
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark px-3 py-2">{currentIndex + 1} / {maxIndex + 1}</span>
          </div>
        </div>
        
        <div className="position-relative">
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="carousel-arrow position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center"
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%',
              zIndex: 10,
              marginLeft: '-22px'
            }}
          >
            <i className="bi bi-chevron-left" style={{ fontSize: '18px' }}></i>
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="carousel-arrow position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center"
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%',
              zIndex: 10,
              marginRight: '-22px'
            }}
          >
            <i className="bi bi-chevron-right" style={{ fontSize: '18px' }}></i>
          </button>

          <div className="row g-4">
            {visibleCategories.length === 0 && (
              <div className="col-12 text-center">
                <p className="text-muted">Không có danh mục hiển thị</p>
              </div>
            )}
            {visibleCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="col-12 col-md-6 col-lg-4"
                style={{
                  animationName: isAnimating 
                    ? (slideDirection === 'right' ? 'slideInLeft' : 'slideInRight')
                    : 'none',
                  animationDuration: isAnimating ? '0.6s' : '0s',
                  animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  animationFillMode: 'both'
                }}
              >
                <Link href={cat.link} className="text-decoration-none">
                  <div 
                    className="card border-0 overflow-hidden category-card" 
                    style={{ 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      borderRadius: '20px',
                      boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(255,193,7,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div className="position-relative overflow-hidden category-image" style={{ height: '250px' }}>
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Image src={cat.image} alt={cat.title} fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                      </div>
                      {/* Overlay on hover */}
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ 
                          backgroundColor: 'rgba(255, 193, 7, 0)', 
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0)'; }}
                      >
                        <i className="bi bi-arrow-right-circle text-white" style={{ fontSize: '40px', opacity: 0, transition: 'opacity 0.3s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                        ></i>
                      </div>
                    </div>
                    <div className="card-body text-center py-3" style={{ background: '#ffffff' }}>
                      <h6 className="card-title text-dark mb-0 fw-bold" style={{ 
                        transition: 'all 0.3s ease', 
                        fontSize: '1rem',
                        letterSpacing: '0.5px'
                      }}
                        onMouseEnter={(e) => { 
                          e.currentTarget.style.color = '#FFC107';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => { 
                          e.currentTarget.style.color = '#2c3e50';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {cat.title}
                      </h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// HOT PRODUCTS SECTION
function HotProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Products API did not return array:', data);
          setProducts([]);
        }
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Error fetching products:', err); 
        setProducts([]);
        setLoading(false); 
      });
  }, []);

  const formatPrice = (price: number) => Number(price || 0).toLocaleString('vi-VN') + '₫';

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const nextProducts = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevProducts = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };


  if (loading) return <div className="py-5 text-center"><div className="spinner-border text-warning"></div></div>;

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-5 section-padding" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #FFF5E1 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-uppercase fw-bold mb-2 section-title responsive-title" style={{ 
            fontSize: '2rem', 
            letterSpacing: '2px',
            color: '#2c3e50',
            position: 'relative',
            display: 'inline-block'
          }}>
            🔥 SẢN PHẨM HOT
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #ff6b6b, #ff8787)',
              borderRadius: '2px'
            }}></div>
          </h2>
          <p className="text-muted mt-3 responsive-text" style={{ fontSize: '1.05rem' }}>Sản phẩm được yêu thích nhất</p>
          <Link href="/products" className="btn btn-outline-dark mt-2 px-4 btn-responsive" style={{ 
            borderRadius: '25px',
            transition: 'all 0.3s ease'
          }}>
            Xem tất cả <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
        <div className="position-relative">
          {/* Previous Arrow */}
          <button
            onClick={prevProducts}
            disabled={currentIndex === 0}
            className="carousel-arrow position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center"
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%',
              zIndex: 10,
              marginLeft: '-22px'
            }}
          >
            <i className="bi bi-chevron-left" style={{ fontSize: '18px' }}></i>
          </button>

          {/* Next Arrow */}
          <button
            onClick={nextProducts}
            disabled={currentIndex >= maxIndex}
            className="carousel-arrow position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center"
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%',
              zIndex: 10,
              marginRight: '-22px'
            }}
          >
            <i className="bi bi-chevron-right" style={{ fontSize: '18px' }}></i>
          </button>

          <div className="row g-4">
            {visibleProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <Link href={`/products/${product.id}`} className="text-decoration-none">
                  <div 
                    className="card border-0 product-card"
                    style={{ 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                      cursor: 'pointer',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                      <div className="position-absolute top-0 start-0 text-white px-3 py-2 fw-bold" 
                        style={{ 
                          fontSize: '12px', 
                          zIndex: 2,
                          background: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
                          borderRadius: '0 0 15px 0',
                          boxShadow: '0 4px 10px rgba(255,107,107,0.3)'
                        }}>
                        <i className="bi bi-fire me-1"></i>-{product.discount}%
                      </div>
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          position: 'relative',
                          transition: 'transform 0.4s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      {/* Gradient overlay */}
                      <div className="position-absolute bottom-0 start-0 w-100" style={{
                        height: '60px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
                      }}></div>
                    </div>
                    <div className="card-body py-3 px-3">
                      <p className="mb-2 text-dark fw-semibold product-card-title" style={{ fontSize: '0.95rem', lineHeight: '1.4', minHeight: '40px' }}>{product.name}</p>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <span className="text-danger fw-bold product-price" style={{ fontSize: '1.1rem' }}>{formatPrice(product.price)}</span>
                          <span className="text-muted text-decoration-line-through responsive-text" style={{ fontSize: '0.85rem' }}>{formatPrice(product.originalPrice)}</span>
                        </div>
                        <div className="badge bg-danger text-white px-2 py-1" style={{ fontSize: '0.7rem', borderRadius: '8px' }}>
                          <i className="bi bi-fire me-1"></i>HOT
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// DISCOUNT PRODUCTS SECTION
function DiscountProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/discount-products')
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Discount products API did not return array:', data);
          setProducts([]);
        }
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Error fetching discount products:', err); 
        setProducts([]);
        setLoading(false); 
      });
  }, []);

  const formatPrice = (price: number) => Number(price || 0).toLocaleString('vi-VN') + '₫';

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const nextProducts = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevProducts = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };


  if (loading) return <div className="py-5 text-center"><div className="spinner-border text-warning"></div></div>;

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-5 section-padding" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-uppercase fw-bold mb-2 text-white section-title responsive-title" style={{ 
            fontSize: '2rem', 
            letterSpacing: '2px',
            position: 'relative',
            display: 'inline-block',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
              SẢN PHẨM GIẢM GIÁ
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #FFE66D, #FFEB99)',
              borderRadius: '2px',
              boxShadow: '0 2px 8px rgba(255,230,109,0.6)'
            }}></div>
          </h2>
          <p className="text-white mt-3 responsive-text" style={{ fontSize: '1.05rem', opacity: 0.95 }}>Ưu đãi đặc biệt - Giá tốt nhất</p>
          <Link href="/discount-products" className="btn btn-light mt-2 px-4 fw-semibold btn-responsive" style={{ 
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Xem tất cả <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
        <div className="position-relative">
          {/* Previous Arrow */}
          <button
            onClick={prevProducts}
            disabled={currentIndex === 0}
            className="carousel-arrow position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center"
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%',
              zIndex: 10,
              marginLeft: '-22px'
            }}
          >
            <i className="bi bi-chevron-left" style={{ fontSize: '18px' }}></i>
          </button>

          {/* Next Arrow */}
          <button
            onClick={nextProducts}
            disabled={currentIndex >= maxIndex}
            className="carousel-arrow position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center"
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%',
              zIndex: 10,
              marginRight: '-22px'
            }}
          >
            <i className="bi bi-chevron-right" style={{ fontSize: '18px' }}></i>
          </button>

          <div className="row g-4">
            {visibleProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <Link href={`/products/${product.id}`} className="text-decoration-none">
                  <div 
                    className="card border-0 product-card"
                    style={{ 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                      cursor: 'pointer',
                      background: '#ffffff',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                    }}
                  >
                    <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                      <div className="position-absolute top-0 start-0 text-white px-3 py-2 fw-bold" 
                        style={{ 
                          fontSize: '12px', 
                          zIndex: 2,
                          background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                          borderRadius: '0 0 15px 0',
                          boxShadow: '0 4px 10px rgba(255,107,107,0.3)'
                        }}>
                        <i className="bi bi-lightning-fill me-1"></i>-{product.discount}%
                      </div>
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          position: 'relative',
                          transition: 'transform 0.4s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15) rotate(2deg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
                      >
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      {/* Gradient overlay */}
                      <div className="position-absolute bottom-0 start-0 w-100" style={{
                        height: '60px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
                      }}></div>
                    </div>
                    <div className="card-body py-3 px-3">
                      <h6 className="card-title mb-2 text-dark fw-semibold product-card-title" style={{ minHeight: '40px', fontSize: '0.95rem', lineHeight: '1.4' }}>{product.name}</h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <span className="text-danger fw-bold product-price" style={{ fontSize: '1.1rem' }}>{formatPrice(product.price)}</span>
                          <span className="text-muted text-decoration-line-through responsive-text" style={{ fontSize: '0.85rem' }}>{formatPrice(product.originalPrice)}</span>
                        </div>
                        <div className="badge bg-warning text-dark px-2 py-1" style={{ fontSize: '0.7rem', borderRadius: '8px' }}>
                          HOT
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// FEATURES 
function Features() {
  const features = [
    { 
      id: 1, 
      iconType: 'chat-heart-fill', 
      title: 'Thông điệp nhà sáng lập', 
      description: 'DANNYdecor là "đứa con tinh thần" mà chúng tôi đã tạo ra từ niềm đam mê thiết kế nội thất',
      color: '#FF6B6B'
    },
    { 
      id: 2, 
      iconType: 'eye-fill', 
      title: 'Tầm nhìn', 
      description: 'Tạo ra một thế giới khỏe mạnh, thoải mái thông qua những giải pháp trong nội thất',
      color: '#FF8E53'
    },
    { 
      id: 3, 
      iconType: 'bullseye', 
      title: 'Sứ mệnh', 
      description: 'Vận Tây nỗ lực tạo ra những không gian nội thất mang năng lượng chữa lành',
      color: '#FFA726'
    },
    { 
      id: 4, 
      iconType: 'gem', 
      title: 'Giá trị cốt lõi', 
      description: 'DANNYdecor xây dựng cho mình 05 giá trị cốt lõi: Sáng tạo, hành công, lành đạo, đổi ngũ và khách hàng',
      color: '#FFC107'
    },
  ];

  return (
    <section className="py-5 section-padding" style={{ background: 'linear-gradient(180deg, #FFF8E8 0%, #ffffff 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-uppercase fw-bold mb-2 section-title responsive-title" style={{ 
            fontSize: '2rem', 
            letterSpacing: '2px',
            color: '#2c3e50',
            position: 'relative',
            display: 'inline-block'
          }}>
            VỀ CHÚNG TÔI
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #FF6B6B, #FFC107)',
              borderRadius: '2px'
            }}></div>
          </h2>
          <p className="text-muted mt-3 responsive-text" style={{ fontSize: '1.05rem' }}>Giá trị và tầm nhìn của DANNYdecor</p>
        </div>

        <div className="row g-4">
          {features.map((f) => (
            <div key={f.id} className="col-12 col-md-6 col-lg-3">
              <div 
                className="card border-0 h-100 p-4 text-center d-flex flex-column feature-card"
                style={{
                  borderRadius: '20px',
                  background: '#ffffff',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,107,107,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.06)';
                }}
              >
                <div 
                  className="d-inline-flex align-items-center justify-content-center mb-3 mx-auto feature-icon"
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${f.color}, ${f.color}dd)`,
                    boxShadow: `0 8px 20px ${f.color}40`
                  }}
                >
                  <i className={`bi bi-${f.iconType}`} style={{ fontSize: '32px', color: '#fff' }}></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>{f.title}</h5>
                <p className="text-muted mb-3 flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{f.description}</p>
                <Link 
                  href="/introduction" 
                  className="text-decoration-none fw-semibold d-inline-flex align-items-center gap-1 mt-auto" 
                  style={{ color: f.color, fontSize: '0.9rem', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = '4px';
                  }}
                >
                  Xem Thêm <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// PARTNERS 
function Partners() {
  const partners = [
    { 
      name: 'Bến xe Miền Đông', 
      logo: '/logo/benxe.png' 
    },
    { 
      name: 'Wolffun Game', 
      logo: '/logo/game.png' 
    },
    { 
      name: 'Flash Fitness', 
      logo: '/logo/flash.png' 
    },
    { 
      name: 'An Lạc Gia Estate', 
      logo: '/logo/anlac.png' 
    },
    { 
      name: 'Gạo Vĩnh Hiển', 
      logo: '/logo/gao.png' 
    },
    { 
      name: '25FIT', 
      logo: '/logo/25fit.png' 
    },
    { 
      name: 'Vua Cua', 
      logo: '/logo/vuacua.png' 
    },
    { 
      name: 'Chi Pilates', 
      logo: '/logo/phongtap.png' 
    },
    { 
      name: 'Vạn Xuân Holding', 
      logo: '/logo/VXH.png' 
    },
    { 
      name: 'Boost Juice Bars', 
      logo: '/logo/boost.png' 
    },
    { 
      name: 'Đăng Gia Trang', 
      logo: '/logo/danggiatrang.png' 
    },
    { 
      name: 'Otoke Chicken', 
      logo: '/logo/chicken.png' 
    }
  ];

  return (
    <section className="py-5 section-padding" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #FFF9F0 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div className="d-inline-block mb-3" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #FF6B6B, #FF8E53)' }}></div>
          <h2 className="text-uppercase fw-bold section-title responsive-title" style={{ color: '#2c3e50' }}>CÁC THƯƠNG HIỆU HỢP TÁC</h2>
        </div>
        <div className="row g-4">
          {partners.map((partner, partnerIndex) => (
            <div key={partnerIndex} className="col-6 col-md-4 col-lg-3">
              <div 
                className="card border-0 shadow-sm overflow-hidden partner-card"
                style={{ 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  height: '200px',
                  backgroundColor: '#fff', // Nền trắng
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 193, 7, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                {/* Logo Image - Grayscale/Đen trắng */}
                <div 
                  className="position-relative w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ 
                    padding: '30px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Image 
                    src={partner.logo} 
                    alt={partner.name}
                    fill
                    style={{ 
                      objectFit: 'contain', // Giữ nguyên tỷ lệ logo
                      filter: 'grayscale(100%) contrast(1.2) brightness(0.9)', // Đen trắng
                      transition: 'all 0.3s ease',
                      padding: '30px' // Padding để logo không chạm viền
                    }}
                    onMouseEnter={(e) => { 
                      // Khi hover: thêm màu nhẹ
                      e.currentTarget.style.filter = 'grayscale(0%) brightness(1.1)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.filter = 'grayscale(100%) contrast(1.2) brightness(0.9)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                
                {/* Tên thương hiệu bên dưới (optional) */}
                <div 
                  className="position-absolute bottom-0 start-0 w-100 text-center py-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderTop: '1px solid #f0f0f0'
                  }}
                >
                  <p 
                    className="mb-0 small text-muted" 
                    style={{ 
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}
                  >
                    {partner.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// PORTFOLIO 
// function PortfolioQuote() {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     message: '',
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.');
//     setFormData({ name: '', phone: '', message: '' });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <section className="py-5">
//       <div className="container">
//         <div className="row g-4">
//           {/* Portfolio Card - Left */}
//           <div className="col-md-6">
//             <div 
//               className="card border-0 shadow-lg overflow-hidden h-100"
//               style={{ 
//                 background: 'linear-gradient(135deg, rgba(150,120,100,0.9) 0%, rgba(100,80,70,0.9) 100%)',
//                 transition: 'all 0.3s ease',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translateY(-10px)';
//                 e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
//               }}
//             >
//               <div className="card-body p-5 text-white">
//                 {/* Logo */}
//                 <div className="mb-4">
//                   <div className="d-flex align-items-center mb-2">
//                     <div className="bg-white text-dark px-2 py-1 fw-bold me-2" style={{ fontSize: '16px' }}>
//                       Danny
//                     </div>
//                     <span className="text-white" style={{ fontSize: '10px' }}>DECOR</span>
//                   </div>
//                 </div>

//                 {/* Title */}
//                 <h2 className="display-5 fw-bold mb-3">PORTFOLIO</h2>
//                 <p className="mb-4" style={{ fontSize: '14px', opacity: 0.9 }}>
//                   & CATALOGUE
//                 </p>

//                 {/* Description */}
//                 <p className="mb-4" style={{ fontSize: '14px', lineHeight: '1.8' }}>
//                   Để có thể hiểu rõ hơn về những dịch vụ mà chúng tôi cung cấp cho khách hàng.<br/>
//                   Để có thể tìm hiểu rõ hơn về phong cách thiết kế nội thất mà chúng tôi hướng tới.<br/>
//                   Để có thể thấy được chất lượng công trình mà chúng tôi đã và đang thi công.
//                 </p>

//                 {/* Download Button */}
//                 <button 
//                   className="btn btn-warning text-white fw-semibold px-5 py-3"
//                   style={{ 
//                     fontSize: '16px',
//                     transition: 'all 0.3s ease',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'scale(1.05)';
//                     e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,193,7,0.4)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'scale(1)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}
//                   suppressHydrationWarning
//                 >
//                   Tải Portfolio
//                 </button>

//                 {/* Decorative Image */}
//                 <div className="position-absolute" style={{ bottom: '20px', right: '20px', opacity: 0.3 }}>
//                   <i className="bi bi-folder2-open" style={{ fontSize: '120px' }}></i>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Quote Form - Right */}
//           <div className="col-md-6">
//             <div 
//               className="card shadow-lg h-100"
//               style={{ 
//                 border: '3px dashed #FFC107',
//                 transition: 'all 0.3s ease',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translateY(-10px)';
//                 e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,193,7,0.2)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
//               }}
//             >
//               <div className="card-body p-5">
//                 <h2 className="text-center fw-bold mb-4 section-title">
//                   NHẬN BÁO GIÁ
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                   {/* Name Input */}
//                   <div className="mb-3">
//                     <input
//                       type="text"
//                       name="name"
//                       className="form-control"
//                       placeholder="Họ & Tên"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       style={{
//                         padding: '12px 16px',
//                         border: '1px solid #ddd',
//                         borderRadius: '4px',
//                         fontSize: '15px',
//                       }}
//                       suppressHydrationWarning
//                     />
//                   </div>

//                   {/* Phone Input */}
//                   <div className="mb-3">
//                     <input
//                       type="tel"
//                       name="phone"
//                       className="form-control"
//                       placeholder="Số điện thoại"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                       style={{
//                         padding: '12px 16px',
//                         border: '1px solid #ddd',
//                         borderRadius: '4px',
//                         fontSize: '15px',
//                       }}
//                       suppressHydrationWarning
//                     />
//                   </div>

//                   {/* Message Textarea */}
//                   <div className="mb-4">
//                     <textarea
//                       name="message"
//                       className="form-control"
//                       rows={5}
//                       placeholder="Nội dung tin nhắn..."
//                       value={formData.message}
//                       onChange={handleChange}
//                       style={{
//                         padding: '12px 16px',
//                         border: '1px solid #ddd',
//                         borderRadius: '4px',
//                         fontSize: '15px',
//                         resize: 'none',
//                       }}
//                     ></textarea>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     className="btn btn-warning text-white w-100 py-3 fw-semibold"
//                     style={{
//                       fontSize: '16px',
//                       transition: 'all 0.3s ease',
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = 'translateY(-2px)';
//                       e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,193,7,0.4)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = 'translateY(0)';
//                       e.currentTarget.style.boxShadow = 'none';
//                     }}
//                     suppressHydrationWarning
//                   >
//                     Gửi
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// CONTACT INFO SECTION
function ContactInfo() {
  const contactData = [
    {
      id: 1,
      icon: 'geo-alt',
      title: 'Văn phòng',
      description: 'Số 50 Đường số 3, KDT Vạn Phúc, Hiệp Bình Phước, TP Thủ Đức, TP Hồ Chí Minh',
      linkText: 'Xem địa chỉ',
      link: '/contact',
    },
    {
      id: 2,
      icon: 'envelope',
      title: 'Tư vấn',
      description: 'Để lại thông tin của bạn để được báo giá ngay',
      linkText: 'Nhận báo giá',
      link: '/contact',
    },
    {
      id: 3,
      icon: 'headset',
      title: 'Hỗ trợ',
      description: 'Liên lạc ngay cho chúng tôi qua số hotline',
      linkText: 'Gọi ngay',
      link: 'tel:0909123456',
    },
  ];

  return (
    <section 
      className="py-5 position-relative section-padding"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
      
      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="text-center text-white mb-5">
          <i className="bi bi-geo-alt-fill mb-3" style={{ fontSize: '40px' }}></i>
          <h2 className="text-uppercase fw-bold section-title responsive-title">
            THÔNG TIN LIÊN HỆ
          </h2>
        </div>

        {/* Info Cards */}
        <div className="row g-0">
          {contactData.map((item, itemIndex) => (
            <div key={item.id} className="col-12 col-md-4">
              <div 
                className="bg-white p-5 text-center h-100 contact-card"
                style={{
                  borderRight: itemIndex < 2 ? '1px solid #eee' : 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  e.currentTarget.style.backgroundColor = '#FFFBF0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <i 
                    className={`bi bi-${item.icon}`} 
                    style={{ 
                      fontSize: '48px', 
                      color: '#333',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FFC107'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}
                  ></i>
                </div>

                {/* Title */}
                <h4 className="fw-bold mb-3 contact-title" style={{ color: '#FFC107' }}>
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-muted mb-4 feature-desc" style={{ minHeight: '60px' }}>
                  {item.description}
                </p>

                {/* Link */}
                {item.link.startsWith('tel:') || item.link.startsWith('mailto:') ? (
                  <a 
                    href={item.link}
                    className="text-decoration-none fw-semibold d-inline-block feature-desc"
                    style={{ 
                      color: '#FFC107',
                      borderBottom: '2px solid #FFC107',
                      paddingBottom: '4px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderBottomColor = '#333';
                      e.currentTarget.style.color = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderBottomColor = '#FFC107';
                      e.currentTarget.style.color = '#FFC107';
                    }}
                  >
                    {item.linkText}
                  </a>
                ) : (
                  <Link 
                    href={item.link}
                    className="text-decoration-none fw-semibold d-inline-block feature-desc"
                    style={{ 
                      color: '#FFC107',
                      borderBottom: '2px solid #FFC107',
                      paddingBottom: '4px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderBottomColor = '#333';
                      e.currentTarget.style.color = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderBottomColor = '#FFC107';
                      e.currentTarget.style.color = '#FFC107';
                    }}
                  >
                    {item.linkText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// NEWS SECTION
interface NewsArticle {
  id: string;
  title: string;
  image: string;
  slug: string;
  category: string;
  excerpt?: string;
}

function News() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Chỉ lấy 3 bài viết đầu tiên cho homepage
          const latestNews = data.slice(0, 3).map((article: {
            id: string;
            title: string;
            image: string;
            slug: string;
            category: string;
            excerpt?: string;
          }) => ({
            id: article.id,
            title: article.title,
            image: article.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            slug: article.slug || article.id,
            category: article.category || 'Tin tức',
            excerpt: article.excerpt,
          }));
          setNewsData(latestNews);
        } else {
          console.error('News API did not return array:', data);
          setNewsData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setNewsData([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-inline-block bg-warning mb-3" style={{ width: '60px', height: '3px' }}></div>
            <h2 className="text-uppercase fw-bold section-title mb-3" style={{ letterSpacing: '2px' }}>
              TIN TỨC
            </h2>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light section-padding">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-block bg-warning mb-3" style={{ width: '60px', height: '3px' }}></div>
          <h2 className="text-uppercase fw-bold section-title mb-3 responsive-title" style={{ letterSpacing: '2px' }}>
            TIN TỨC
          </h2>
          <p className="text-muted mx-auto responsive-text" style={{ maxWidth: '800px', fontSize: '15px', lineHeight: '1.8' }}>
            Cập nhật những thông tin để khách hàng tìm hiểu thêm về kiến trúc, xu hướng của thiết kế nội thất đồng 
            thời là nơi để DaNNYdecor chia sẻ những hoạt động nội bộ của mình
          </p>
          <Link href="/news" className="btn btn-outline-dark mt-3 px-4 btn-responsive" style={{ 
            borderRadius: '25px',
            transition: 'all 0.3s ease'
          }}>
            Xem tất cả tin tức <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        {/* News Grid */}
        {newsData.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Chưa có tin tức nào</p>
          </div>
        ) : (
          <div className="row g-4">
            {newsData.map((news) => (
              <div key={news.id} className="col-12 col-md-6 col-lg-4">
                <div 
                  className="card border-0 shadow-sm overflow-hidden h-100 news-card"
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Image with overlay */}
                  <div className="position-relative overflow-hidden news-image" style={{ height: '250px' }}>
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{ transition: 'transform 0.3s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Image src={news.image} alt={news.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                    
                    {/* Dark overlay */}
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    ></div>

                    {/* Category badge on image */}
                    <div 
                      className="position-absolute top-0 start-0 p-3"
                      style={{ zIndex: 2 }}
                    >
                      <span 
                        className="badge bg-warning text-dark px-3 py-2"
                        style={{ 
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          borderRadius: '8px'
                        }}
                      >
                        {news.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4">
                    <h6 
                      className="card-title fw-bold mb-3 news-title responsive-text" 
                      style={{ 
                        minHeight: '45px',
                      }}
                    >
                      {news.title}
                    </h6>
                    <Link 
                      href={`/news/${news.id}`}
                      className="text-decoration-none fw-semibold feature-desc"
                      style={{ 
                        color: '#333',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#FFC107'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}
                    >
                      Xem thêm →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Scroll
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Kiểm tra vị trí scroll
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Thêm event listener
    window.addEventListener('scroll', toggleVisibility);

    // Kiểm tra ngay khi component mount
    toggleVisibility();

    // Cleanup
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      onClick={scrollToTop}
      className="position-fixed d-flex align-items-center justify-content-center scroll-to-top"
      style={{
        width: '45px',
        height: '45px',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#FFC107',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.3s ease-in'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,193,7,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      }}
    >
      <i className="bi bi-arrow-up" style={{ fontSize: '24px', color: 'white' }}></i>
    </div>
  );
}

// MAIN EXPORT
export default function HomePage() {
  return (
    <>
      <PromoModal />
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes kenburns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.15) translate(-3%, 2%);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Styles */
        /* Mobile First - Base styles for mobile */
        .hero-title {
          font-size: 1.75rem;
          line-height: 1.3;
        }

        .hero-desc {
          font-size: 0.95rem;
          max-width: 90%;
        }

        .section-title {
          font-size: 1.5rem;
        }

        .carousel-arrow {
          display: none;
        }

        /* Tablet - 768px and up */
        @media (min-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-desc {
            font-size: 1.1rem;
            max-width: 80%;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .carousel-arrow {
            display: flex;
          }
        }

        /* Desktop - 992px and up */
        @media (min-width: 992px) {
          .hero-title {
            font-size: 3.5rem;
          }

          .hero-desc {
            font-size: 1.25rem;
            max-width: 70%;
          }

          .section-title {
            font-size: 2rem;
          }
        }

        /* Banner Responsive */
        @media (max-width: 767px) {
          .banner-section {
            min-height: 400px !important;
          }

          .banner-content {
            min-height: 400px !important;
            padding: 20px 15px;
          }

          .banner-button {
            padding: 10px 20px !important;
            font-size: 0.9rem !important;
          }

          .banner-nav-btn {
            width: 40px !important;
            height: 40px !important;
            font-size: 0.8rem;
          }

          .banner-nav-btn.start-0 {
            margin-left: 10px !important;
          }

          .banner-nav-btn.end-0 {
            margin-right: 10px !important;
          }
        }

        /* Product Cards Responsive */
        @media (max-width: 767px) {
          .product-card {
            margin-bottom: 20px;
          }

          .product-card .card-body {
            padding: 15px !important;
          }

          .product-card-title {
            font-size: 0.9rem !important;
            min-height: auto !important;
          }

          .product-price {
            font-size: 1rem !important;
          }
        }

        /* Category Cards Responsive */
        @media (max-width: 767px) {
          .category-card {
            margin-bottom: 20px;
          }

          .category-image {
            height: 180px !important;
          }
        }

        /* Features Section Responsive */
        @media (max-width: 767px) {
          .feature-card {
            margin-bottom: 20px;
          }

          .feature-icon {
            width: 50px !important;
            height: 50px !important;
          }

          .feature-icon i {
            font-size: 24px !important;
          }
        }

        /* Partners Section Responsive */
        @media (max-width: 767px) {
          .partner-card {
            height: 150px !important;
            margin-bottom: 15px;
          }
        }

        /* News Section Responsive */
        @media (max-width: 767px) {
          .news-card {
            margin-bottom: 20px;
          }

          .news-image {
            height: 200px !important;
          }

          .news-title {
            font-size: 0.95rem !important;
            min-height: auto !important;
          }
        }

        /* Contact Info Responsive */
        @media (max-width: 767px) {
          .contact-card {
            border-right: none !important;
            border-bottom: 1px solid #eee;
            padding: 30px 20px !important;
          }

          .contact-card:last-child {
            border-bottom: none;
          }

          section[style*="backgroundAttachment"] {
            background-attachment: scroll !important;
          }
        }

        /* Section Padding Responsive */
        @media (max-width: 767px) {
          .section-padding {
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }
        }

        /* Text Responsive */
        @media (max-width: 767px) {
          .responsive-text {
            font-size: 0.9rem;
          }

          .responsive-title {
            font-size: 1.25rem;
          }
        }

        /* Button Responsive */
        @media (max-width: 767px) {
          .btn-responsive {
            padding: 8px 16px !important;
            font-size: 0.85rem !important;
          }

          .btn-lg-responsive {
            padding: 10px 20px !important;
            font-size: 0.95rem !important;
          }
        }

        /* Container Padding Responsive */
        @media (max-width: 767px) {
          .container {
            padding-left: 15px;
            padding-right: 15px;
          }
        }

        /* Scroll to Top Button Responsive */
        @media (max-width: 767px) {
          .scroll-to-top {
            width: 40px !important;
            height: 40px !important;
            bottom: 20px !important;
            right: 20px !important;
          }

          .scroll-to-top i {
            font-size: 20px !important;
          }
        }

        /* Hide arrows on mobile for carousel */
        @media (max-width: 767px) {
          .carousel-arrow {
            display: none !important;
          }
        }

        /* Grid adjustments for mobile */
        @media (max-width: 767px) {
          .row.g-4 {
            --bs-gutter-y: 1.5rem;
          }
        }
      `}</style>
      <Banner />
      <ProductCategories />
      <HotProducts />
      <DiscountProducts />
      <Features />
      <Partners />
      {/* <PortfolioQuote /> */}
      <ContactInfo />
      <News />
      <ChatBox />
      <ScrollToTopButton />
    </>
  );
}

