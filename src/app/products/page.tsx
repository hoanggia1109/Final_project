'use client';

import ProductList from '../component/ProductList';

export default function AllProductsPage() {
  return (
    <>
      {/* --- CSS --- */}
      <style jsx global>{`
        .product-card {
          transition: all 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        .product-title {
          font-weight: 600;
          color: #1e90ff;
          font-size: 1.05rem;
          margin-bottom: 8px;
        }
        .product-desc {
          color: #666;
          font-size: 0.9rem;
          min-height: 45px;
        }
        .category-label {
          font-size: 0.8rem;
          color: #00bfff;
        }
      `}</style>

      {/* --- Header --- */}
      <header className="bg-dark text-white text-center py-4 mb-4">
        <h2 className="fw-bold text-uppercase mb-0">Tất cả sản phẩm</h2>
      </header>

      {/* --- Main: gọi component ProductList --- */}
      <ProductList
        title="Tất cả sản phẩm"
        apiUrl="http://localhost:3001/api/sanpham" // 👉 đổi nếu API backend bạn chạy port khác
      />

      {/* --- Footer --- */}
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <p className="m-0">&copy; 2025 Danny Decor. All rights reserved.</p>
      </footer>
    </>
  );
}
