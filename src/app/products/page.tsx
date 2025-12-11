'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api-config';

interface Category {
  id: string;
  tendm: string;
}

interface Product {
  id: string;
  tensp: string;
  thumbnail?: string;
  bienthe?: Array<{
    gia: number;
  }>;
}

export default function ProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;
  const router = useRouter();

  // Hàm fetch sản phẩm
  const fetchProducts = useCallback(() => {
    setLoading(true);
    const url = selectedCat
      ? `${API_BASE_URL}/api/danhmuc/${selectedCat}`
      : `${API_BASE_URL}/api/sanpham`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = selectedCat ? data.sanphams || [] : data;
        setProducts(list);
        setCurrentPage(1); // reset về trang 1 khi đổi danh mục
      })
      .catch((err) => console.error('Lỗi tải sản phẩm:', err))
      .finally(() => setLoading(false));
  }, [selectedCat]);

  // Lấy danh mục
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/danhmuc`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Lỗi tải danh mục:', err));
  }, []);

  //  Lấy sản phẩm (theo danh mục hoặc tất cả)
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Tự động refresh khi quay lại tab/window (để cập nhật sau khi thêm/sửa sản phẩm)
  useEffect(() => {
    const handleFocus = () => {
      // Refresh dữ liệu khi quay lại tab
      fetchProducts();
    };

    const handleVisibilityChange = () => {
      // Refresh khi tab trở nên visible
      if (!document.hidden) {
        fetchProducts();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchProducts]);

  //  Lọc sản phẩm theo từ khóa
  const filteredProducts = products.filter((p) =>
    p.tensp?.toLowerCase().includes(search.trim().toLowerCase())
  );

  //  Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .products-page-container {
          padding-top: 110px;
          padding-bottom: 80px;
          background: linear-gradient(180deg, #FAFAF8 0%, #F5F4F0 50%, #FAFAF8 100%);
          min-height: 100vh;
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
        }

        .layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          animation: fadeIn 0.6s ease-out;
        }

        @media (max-width: 992px) {
          .layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .layout {
            gap: 16px;
          }
        }

        .sidebar {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(139, 115, 85, 0.08);
          height: fit-content;
          position: sticky;
          top: 90px;
          animation: slideInLeft 0.6s ease-out;
          border: 1px solid rgba(139, 115, 85, 0.08);
        }

        @media (max-width: 768px) {
          .sidebar {
            position: relative;
            top: 0;
            padding: 20px 16px;
            border-radius: 12px;
            margin-bottom: 20px;
          }
        }

        .sidebar-title {
          color: #3D3D3D;
          font-size: 1.4rem;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 2px solid #FFC107;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .sidebar-title {
            font-size: 1.1rem;
            margin-bottom: 16px;
            padding-bottom: 12px;
          }
        }

        .sidebar-item {
          padding: 15px 20px;
          margin-bottom: 10px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          color: #5A5A5A;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.5px;
        }

        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: linear-gradient(180deg, #FFC107 0%, #FFB300 100%);
          transform: scaleY(0);
          transition: transform 0.4s ease;
        }

        .sidebar-item:hover {
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
          color: #2D2D2D;
          padding-left: 26px;
        }

        .sidebar-item:hover::before {
          transform: scaleY(1);
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
          color: #FFFFFF;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.3);
          padding-left: 26px;
        }

        .sidebar-item.active::before {
          transform: scaleY(1);
          background: #FFFFFF;
        }

        .product-card {
          border: 1px solid rgba(139, 115, 85, 0.1);
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: #FFFFFF;
          box-shadow: 0 4px 16px rgba(139, 115, 85, 0.08);
          animation: fadeIn 0.5s ease-out;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        
        .product-img-wrapper {
          flex-shrink: 0;
        }
        
        .product-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 16px 40px rgba(139, 115, 85, 0.18);
          border-color: rgba(255, 193, 7, 0.3);
        }

        .product-img-wrapper {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }

        .product-card:hover .product-img {
          transform: scale(1.08);
        }

        .product-body {
          padding: 24px 20px;
          text-align: center;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #FFFFFF;
        }

        .product-title {
          font-weight: 500;
          color: #3D3D3D;
          font-size: 1.05rem;
          margin-bottom: 14px;
          line-height: 1.5;
          min-height: 50px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: 0.3px;
        }

        .product-price {
          color: #FFC107;
          font-weight: 600;
          font-size: 1.3rem;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .btn-detail {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
          border: none;
          color: #FFFFFF;
          font-weight: 600;
          padding: 12px 28px;
          border-radius: 30px;
          transition: all 0.4s ease;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.25);
        }

        .btn-detail:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.4);
          background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);
          color: #FFFFFF;
        }

        .search-input {
          border: 2px solid rgba(139, 115, 85, 0.15);
          border-radius: 30px;
          padding: 14px 24px;
          transition: all 0.3s ease;
          font-size: 1rem;
          background: #FFFFFF;
          letter-spacing: 0.3px;
        }

        @media (max-width: 768px) {
          .search-input {
            padding: 10px 16px;
            font-size: 0.9rem;
            width: 100% !important;
            max-width: 100% !important;
          }
        }

        .search-input:focus {
          border-color: #FFC107;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.12);
          outline: none;
          background: #FFFFFF;
        }

        .page-title {
          color: #3D3D3D;
          font-weight: 600;
          letter-spacing: 3px;
          position: relative;
          display: inline-block;
          text-transform: uppercase;
          font-size: 2rem;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.3rem;
            letter-spacing: 1px;
          }
        }

        .page-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #FFC107 0%, #FFB300 100%);
          border-radius: 2px;
        }

        .pagination button {
          min-width: 48px;
          height: 48px;
          border-radius: 14px;
          font-weight: 600;
          transition: all 0.4s ease;
          letter-spacing: 0.5px;
        }

        .pagination .btn-warning {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
          border: none;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.25);
        }

        .pagination .btn-warning:hover {
          background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(255, 193, 7, 0.4);
        }

        .pagination .btn-light {
          background: white;
          border: 2px solid rgba(139, 115, 85, 0.15);
          color: #5A5A5A;
        }

        .pagination .btn-light:hover:not(:disabled) {
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
          border-color: #FFC107;
          color: #3D3D3D;
          transform: translateY(-2px);
        }

        .pagination button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .products-page-container {
            padding-top: 80px;
            padding-bottom: 40px;
            padding-left: 12px;
            padding-right: 12px;
          }

          .products-page-container .container {
            padding-left: 0;
            padding-right: 0;
            max-width: 100%;
            overflow-x: hidden;
          }

          .product-img-wrapper {
            height: 220px;
          }
          
          .product-body {
            padding: 16px 12px;
          }
          
          .product-title {
            font-size: 0.9rem;
            min-height: 40px;
          }
          
          .product-price {
            font-size: 1rem;
          }

          .btn-detail {
            padding: 10px 20px;
            font-size: 0.8rem;
            letter-spacing: 1px;
          }

          .row.g-4 {
            margin-left: -8px;
            margin-right: -8px;
          }

          .row.g-4 > * {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
        
        @media (max-width: 576px) {
          .product-img-wrapper {
            height: 180px;
          }

          .product-body {
            padding: 12px 10px;
          }

          .product-title {
            font-size: 0.85rem;
            min-height: 36px;
          }

          .product-price {
            font-size: 0.95rem;
          }

          .btn-detail {
            padding: 8px 16px;
            font-size: 0.75rem;
          }

          .pagination {
            flex-wrap: wrap;
            gap: 4px !important;
          }

          .pagination button {
            min-width: 40px;
            height: 40px;
            font-size: 0.85rem;
          }
        }
      `}</style>

      <div className="products-page-container">
        <div className="container" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <div className="layout">
          {/* Sidebar danh mục */}
          <div className="sidebar">
            <h5 className="sidebar-title">
              <i className="bi bi-grid-3x3-gap-fill me-2"></i>
              DANH MỤC
            </h5>
            <div
              className={`sidebar-item ${!selectedCat ? 'active' : ''}`}
              onClick={() => setSelectedCat(null)}
            >
              <i className="bi bi-collection me-2"></i>
              Tất cả sản phẩm
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`sidebar-item ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                <i className="bi bi-folder me-2"></i>
                {cat.tendm}
              </div>
            ))}
          </div>

          {/* Khu vực sản phẩm */}
          <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
              <h4 className="page-title mb-3 mb-md-0">
                {selectedCat
                  ? categories.find((c) => c.id === selectedCat)?.tendm || 'Sản phẩm'
                  : 'TẤT CẢ SẢN PHẨM'}
              </h4>

              {/*  Ô tìm kiếm */}
              <input
                type="text"
                placeholder="🔍 Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
                style={{ width: '100%', maxWidth: '320px' }}
              />
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>
                <p className="text-muted mt-3">Đang tải sản phẩm...</p>
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="row g-4" style={{ marginLeft: 0, marginRight: 0 }}>
                  {currentProducts.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-4 col-lg-3" style={{ animationDelay: `${index * 0.05}s`, paddingLeft: '8px', paddingRight: '8px' }}>
                      <div className="product-card">
                        <div className="product-img-wrapper">
                          <Image
                            src={
                              p.thumbnail
                                ? p.thumbnail.startsWith("http")
                                  ? p.thumbnail
                                  : `${API_BASE_URL}${p.thumbnail}`
                                : 'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'
                            }
                            alt={p.tensp}
                            fill
                            className="product-img"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="product-body">
                          <div>
                            <h6 className="product-title">{p.tensp}</h6>

                            {/*  Giá từ bảng sanpham_bienthe */}
                            <p className="product-price">
                              {p.bienthe && p.bienthe.length > 0
                                ? `${Number(p.bienthe[0].gia).toLocaleString('vi-VN')}₫`
                                : 'Liên hệ'}
                            </p>
                          </div>

                          <button
                            className="btn btn-detail w-100"
                            onClick={() => router.push(`/products/${p.id}`)}
                          >
                            <i className="bi bi-eye me-2" style={{ fontSize: '18px' }}></i>
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/*  PHÂN TRANG */}
                <div className="pagination d-flex justify-content-center align-items-center mt-5 gap-2">
                  <button
                    className="btn btn-light"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`btn ${
                          currentPage === pageNum
                            ? 'btn-warning'
                            : 'btn-light'
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="btn btn-light"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ddd' }}></i>
                <p className="text-muted mt-3 fs-5">
                  {search ? 'Không tìm thấy sản phẩm nào phù hợp' : 'Không có sản phẩm nào'}
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
