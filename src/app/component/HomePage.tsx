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

// (removed unused Partner interface)

//Banner 
function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920',
      title: 'TRỞ THÀNH NGƯỜI CỘNG SỰ',
      subtitle: 'NHIỆT TÌNH - UY TÍN - HIỆU QUẢ',
      description: 'Công ty TNHH Trang trí Nội thất và Xây dựng Vân Tây chuyên thiết kế và thi công các phòng vệ sắc có hình dạng trọn gói như cửa hàng, phòng làm việc/cửa hàng, các cửa hàng, Showroom...'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920',
      title: 'THIẾT KẾ NỘI THẤT HIỆN ĐẠI',
      subtitle: 'SÁNG TẠO - CHUYÊN NGHIỆP - TINH TẾ',
      description: 'Mang đến những không gian sống và làm việc hoàn hảo với phong cách thiết kế hiện đại, tối ưu công năng và thẩm mỹ cao.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920',
      title: 'THI CÔNG CHUYÊN NGHIỆP',
      subtitle: 'CHẤT LƯỢNG - TIẾN ĐỘ - CAM KẾT',
      description: 'Đội ngũ thợ lành nghề, quy trình thi công chuyên nghiệp, đảm bảo tiến độ và chất lượng công trình theo đúng cam kết.'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1920',
      title: 'GIÁ TRỊ BỀN VỮNG',
      subtitle: 'TIN CẬY - TRÁCH NHIỆM - PHÁT TRIỂN',
      description: 'Xây dựng mối quan hệ lâu dài với khách hàng thông qua chất lượng sản phẩm và dịch vụ tốt nhất.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Chuyển slide mỗi 5 giây
    
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="position-relative" style={{ minHeight: '640px', overflow: 'hidden' }}>
      {/* Banner Slides */}
      {banners.map((banner, slideIndex) => (
        <div
          key={banner.id}
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white"
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
              backgroundImage: `url("${banner.image}")`,
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
          <div className="container position-relative text-center" style={{ zIndex: 2 }}>
            <h1 className="fw-bold hero-title mb-3">
              {banner.title}
            </h1>
            <h2 className="hero-subtitle mb-3">
              {banner.subtitle}
            </h2>
            <p className="mb-4 mx-auto hero-desc">
              {banner.description}
            </p>
            <Link href="/contact" className="btn btn-warning btn-lg text-white px-5 py-3 fw-semibold">
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
    <section className="py-5 bg-light">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-uppercase fw-bold mb-0" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>DANH MỤC SẢN PHẨM</h3>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">{currentIndex + 1} / {maxIndex + 1}</span>
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
                className="col-md-4"
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
                    className="card border-0 shadow-sm overflow-hidden" 
                    style={{ 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
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
                    <div className="card-body text-center py-2">
                      <h6 className="card-title text-dark mb-0 fw-semibold" style={{ transition: 'color 0.3s ease', fontSize: '0.95rem' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#FFC107'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}
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

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

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
    <section className="py-5">
      <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-uppercase fw-bold mb-0" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>SẢN PHẨM HOT</h3>
          <Link href="/products" className="text-dark text-decoration-none" style={{ fontSize: '0.9rem' }}>xem tất cả →</Link>
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
              <div key={product.id} className="col-md-3">
                <Link href={`/products/${product.id}`} className="text-decoration-none">
                  <div 
                    className="card border-0 shadow-sm"
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                      <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 fw-bold" style={{ fontSize: '11px', zIndex: 2 }}>
                        -{product.discount}%
                      </div>
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          position: 'relative',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                    </div>
                    <div className="card-body text-center py-2">
                      <p className="mb-2 text-dark fw-medium" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>{product.name}</p>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <span className="text-danger fw-bold" style={{ fontSize: '1rem' }}>{formatPrice(product.price)}</span>
                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>{formatPrice(product.originalPrice)}</span>
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

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

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
    <section className="py-5 bg-light">
      <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-uppercase fw-bold mb-0" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>SẢN PHẨM GIẢM GIÁ</h3>
          <Link href="/discount-products" className="text-dark text-decoration-none" style={{ fontSize: '0.9rem' }}>xem tất cả →</Link>
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
              <div key={product.id} className="col-md-3">
                <Link href={`/products/${product.id}`} className="text-decoration-none">
                  <div 
                    className="card border-0 shadow-sm"
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                      <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 fw-bold" style={{ fontSize: '11px', zIndex: 2 }}>
                        -{product.discount}%
                      </div>
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          position: 'relative',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                    </div>
                    <div className="card-body py-2">
                      <h6 className="card-title mb-2 text-dark" style={{ minHeight: '38px', fontSize: '0.9rem', lineHeight: '1.3' }}>{product.name}</h6>
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-danger fw-bold" style={{ fontSize: '1rem' }}>{formatPrice(product.price)}</span>
                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>{formatPrice(product.originalPrice)}</span>
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
    { id: 1, iconType: 'pencil', title: 'Thông điệp nhà sáng lập', description: 'VANTAYdecor là "đứa con tinh thần" mà chúng tôi đã tạo ra từ niềm đam mê thiết kế nội thất' },
    { id: 2, iconType: 'eye', title: 'Tầm nhìn', description: 'Tạo ra một thế giới khỏe mạnh, thoải mái thông qua những giải pháp trong nội thất' },
    { id: 3, iconType: 'target', title: 'Sứ mệnh', description: 'Vận Tây nỗ lực tạo ra những không gian nội thất mang năng lượng chữa lành' },
    { id: 4, iconType: 'diamond', title: 'Giá trị cốt lõi', description: 'VANTAYdecor xây dựng cho mình 05 giá trị cốt lõi: Sáng tạo, hành công, lành đạo, đổi ngũ và khách hàng' },
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          {features.map((f) => (
                        <div key={f.id} className="col-md-3 text-center">
                        <i className="bi bi-circle" style={{ fontSize: '36px', color: '#FFC107' }}></i>
                        <h5 className="fw-bold my-3 feature-title" style={{ color: '#FFC107' }}>{f.title}</h5>
                        <p className="text-muted feature-desc" style={{ minHeight: '80px' }}>{f.description}</p>
              <Link href="/" className="text-decoration-none fw-semibold feature-desc" style={{ color: '#FFC107' }}>Xem Thêm</Link>
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
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <div className="d-inline-block bg-warning mb-3" style={{ width: '60px', height: '3px' }}></div>
          <h2 className="text-uppercase fw-bold section-title">CÁC THƯƠNG HIỆU HỢP TÁC</h2>
        </div>
        <div className="row g-4">
          {partners.map((partner, partnerIndex) => (
            <div key={partnerIndex} className="col-6 col-md-4 col-lg-3">
              <div 
                className="card border-0 shadow-sm overflow-hidden"
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
      link: '#',
    },
    {
      id: 2,
      icon: 'envelope',
      title: 'Tư vấn',
      description: 'Để lại thông tin của bạn để được báo giá ngay',
      linkText: 'Nhận báo giá',
      link: '#quote',
    },
    {
      id: 3,
      icon: 'headset',
      title: 'Hỗ trợ',
      description: 'Liên lạc ngay cho chúng tôi qua số hotline',
      linkText: 'Gọi ngay',
      link: 'tel:0123456789',
    },
  ];

  return (
    <section 
      className="py-5 position-relative"
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
          <h2 className="text-uppercase fw-bold section-title">
            THÔNG TIN LIÊN HỆ
          </h2>
        </div>

        {/* Info Cards */}
        <div className="row g-0">
          {contactData.map((item, itemIndex) => (
            <div key={item.id} className="col-md-4">
              <div 
                className="bg-white p-5 text-center h-100"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// NEWS SECTION
function News() {
  const newsData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      title: '3 ĐIỀU CẦN BIẾT KHI LỰA CHỌN CÔNG TY THIẾT KẾ VĂN PHÒNG',
      tag: '3 ĐIỀU CẦN BIẾT ĐỂ LỰA CHỌN CÔNG TY THIẾT KẾ VĂN PHÒNG',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      title: 'CÔNG TY THIẾT KẾ NỘI THẤT TẠI KHU ĐÔ THỊ VẠN PHÚC',
      tag: 'CÔNG TY THIẾT KẾ NỘI THẤT TẠI KHU ĐÔ THỊ VẠN PHÚC',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
      title: '7 MẪU THIẾT KẾ NỘI THẤT CHUNG CƯ XU HƯỚNG VÀ GIẢI PHÁP TỐI ƯU',
      tag: 'MẪU THIẾT KẾ NỘI THẤT CĂN HỘ ĐẸP XU HƯỚNG VÀ GIẢI PHÁP TỐI ƯU',
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-block bg-warning mb-3" style={{ width: '60px', height: '3px' }}></div>
          <h2 className="text-uppercase fw-bold section-title mb-3" style={{ letterSpacing: '2px' }}>
            TIN TỨC
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '800px', fontSize: '15px', lineHeight: '1.8' }}>
            Cập nhật những thông tin để khách hàng tìm hiểu thêm về kiến trúc, xu hướng của thiết kế nội thất đồng 
            thời là nơi để VANTAYdecor chia sẻ những hoạt động nội bộ của mình
          </p>
        </div>

        {/* News Grid */}
        <div className="row g-4">
          {newsData.map((news) => (
            <div key={news.id} className="col-md-4">
              <div 
                className="card border-0 shadow-sm overflow-hidden h-100"
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
                <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
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

                  {/* Tag on image */}
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4"
                  >
                    <h5 
                      className="text-white text-center fw-bold text-uppercase news-tag"
                      style={{ 
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {news.tag}
                    </h5>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4">
                  <h6 
                    className="card-title fw-bold mb-3 news-title" 
                    style={{ 
                      minHeight: '45px',
                    }}
                  >
                    {news.title}
                  </h6>
                  <a 
                    href="#" 
                    className="text-decoration-none fw-semibold feature-desc"
                    style={{ 
                      color: '#333',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FFC107'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}
                  >
                    Xem thêm →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      className="position-fixed d-flex align-items-center justify-content-center"
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
    </>
  );
}

