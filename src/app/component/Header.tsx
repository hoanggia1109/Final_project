'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giả lập trạng thái đăng nhập

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
    alert('Đăng xuất thành công!');
  };

  return (
    <header 
      className="bg-white"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
        padding: scrolled ? '0.5rem 0' : '1rem 0',
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-light py-0">
        <div className="container">
          {/* Logo */}
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <div 
              className="position-relative" 
              style={{ 
                width: scrolled ? '70px' : '100px',
                height: scrolled ? '70px' : '70px',
                transition: 'all 0.3s ease',
              }}
            >
              <Image 
                src="/logo/logo.jpg" 
                alt="Logo" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-3">
              <li className="nav-item">
                <Link 
                  href="/" 
                  className="nav-link fw-semibold position-relative" 
                  style={{ 
                    color: '#FFC107',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/introduction" 
                  className="nav-link text-dark position-relative"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFC107';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Giới thiệu
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/products" 
                  className="nav-link text-dark"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFC107';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Sản Phẩm
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/construction" 
                  className="nav-link text-dark"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFC107';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Thi công
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/portfolio" 
                  className="nav-link text-dark"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFC107';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/news" 
                  className="nav-link text-dark"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFC107';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Tin tức
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/recruitment" 
                  className="nav-link text-dark"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFC107';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Tuyển dụng
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/contact" 
                  className="nav-link text-dark"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFC107';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Liên hệ
                </Link>
              </li>
              
              {/* User Dropdown */}
              <li className="nav-item position-relative user-dropdown">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="btn btn-link p-0"
                  style={{
                    fontSize: '28px',
                    color: '#FFC107',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.color = '#FFB000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.color = '#FFC107';
                  }}
                >
                  <i className={`bi ${isLoggedIn ? 'bi-person-circle-fill' : 'bi-person-circle'}`}></i>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className="position-absolute bg-white shadow-lg rounded-3 overflow-hidden"
                    style={{
                      top: '100%',
                      right: 0,
                      marginTop: '10px',
                      minWidth: '220px',
                      zIndex: 1000,
                      animation: 'dropdownSlide 0.2s ease-out',
                    }}
                  >
                    {isLoggedIn ? (
                      <>
                        {/* Logged in menu */}
                        <div className="p-3 border-bottom bg-light">
                          <p className="mb-0 fw-semibold small">Xin chào!</p>
                          <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>user@example.com</p>
                        </div>
                        <Link
                          href="/profile"
                          className="d-block px-3 py-2 text-decoration-none text-dark"
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF8E1';
                            e.currentTarget.style.color = '#FFC107';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#333';
                          }}
                        >
                          <i className="bi bi-person me-2"></i>
                          Tài khoản của tôi
                        </Link>
                        <Link
                          href="/orders"
                          className="d-block px-3 py-2 text-decoration-none text-dark"
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF8E1';
                            e.currentTarget.style.color = '#FFC107';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#333';
                          }}
                        >
                          <i className="bi bi-bag me-2"></i>
                          Đơn hàng của tôi
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-100 text-start px-3 py-2 border-0 bg-transparent text-dark"
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF8E1';
                            e.currentTarget.style.color = '#dc3545';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#333';
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Not logged in menu */}
                        <Link
                          href="/login"
                          className="d-block px-3 py-3 text-decoration-none text-dark fw-semibold"
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF8E1';
                            e.currentTarget.style.color = '#FFC107';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#333';
                          }}
                          onClick={() => setShowDropdown(false)}
                        >
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Đăng nhập
                        </Link>
                        <div className="border-top"></div>
                        <Link
                          href="/register"
                          className="d-block px-3 py-3 text-decoration-none text-dark fw-semibold"
                          style={{ transition: 'all 0.2s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF8E1';
                            e.currentTarget.style.color = '#FFC107';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#333';
                          }}
                          onClick={() => setShowDropdown(false)}
                        >
                          <i className="bi bi-person-plus me-2"></i>
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </div>
                )}

                {/* Dropdown Animation */}
                <style jsx>{`
                  @keyframes dropdownSlide {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    </header>
  );
}
