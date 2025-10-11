'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              className="bg-dark text-white px-3 py-2 fw-bold" 
              style={{ 
                fontSize: scrolled ? '20px' : '24px', 
                transition: 'all 0.3s ease',
              }}
            >
              DN
            </div>
            <span 
              className="ms-2 text-muted" 
              style={{ 
                fontSize: scrolled ? '10px' : '12px',
                transition: 'all 0.3s ease',
              }}
            >
              BRAND
            </span>
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
                  href="/design" 
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
                  Thiết kế
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
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
