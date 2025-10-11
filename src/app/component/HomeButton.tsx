'use client';
import Link from 'next/link';

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="btn btn-warning text-white d-flex align-items-center justify-content-center shadow-lg"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        fontSize: '24px',
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
      }}
      title="Quay về trang chủ"
    >
      <i className="bi bi-house-door-fill"></i>
    </Link>
  );
}
