'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;
  const router = useRouter();

  // Lấy danh mục
  useEffect(() => {
    fetch('http://localhost:5000/api/danhmuc')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Lỗi tải danh mục:', err));
  }, []);

  //  Lấy sản phẩm (theo danh mục hoặc tất cả)
  useEffect(() => {
    setLoading(true);
    const url = selectedCat
      ? `http://localhost:5000/api/danhmuc/${selectedCat}`
      : `http://localhost:5000/api/sanpham`;

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

        .layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          animation: fadeIn 0.6s ease-out;
        }

        @media (max-width: 992px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }

        .sidebar {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          height: fit-content;
          position: sticky;
          top: 90px;
          animation: slideInLeft 0.6s ease-out;
        }

        .sidebar-title {
          color: #333;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 3px solid #FFC107;
        }

        .sidebar-item {
          padding: 12px 16px;
          margin-bottom: 6px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #555;
          position: relative;
          overflow: hidden;
        }

        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: #FFC107;
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .sidebar-item:hover {
          background: #FFF8E1;
          color: #333;
          padding-left: 20px;
        }

        .sidebar-item:hover::before {
          transform: scaleY(1);
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
          color: #333;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
          padding-left: 20px;
        }

        .sidebar-item.active::before {
          transform: scaleY(1);
        }

        .product-card {
          border: none;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          animation: fadeIn 0.5s ease-out;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .product-img-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.1);
        }

        .product-body {
          padding: 18px;
          text-align: center;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .product-title {
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
          margin-bottom: 10px;
          line-height: 1.4;
          min-height: 42px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price {
          color: #FFC107;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }

        .btn-detail {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
          border: none;
          color: #333;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 25px;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-detail:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
          background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);
          color: #333;
        }

        .search-input {
          border: 2px solid #f0f0f0;
          border-radius: 25px;
          padding: 10px 20px;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .search-input:focus {
          border-color: #FFC107;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1);
          outline: none;
        }

        .page-title {
          color: #333;
          font-weight: 700;
          letter-spacing: 1px;
          position: relative;
          display: inline-block;
        }

        .page-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 4px;
          background: #FFC107;
          border-radius: 2px;
        }

        .pagination button {
          min-width: 40px;
          height: 40px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .pagination .btn-warning {
          background: #FFC107;
          border: none;
          color: #333;
        }

        .pagination .btn-warning:hover {
          background: #FFD54F;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }

        .pagination .btn-light {
          background: white;
          border: 2px solid #f0f0f0;
        }

        .pagination .btn-light:hover:not(:disabled) {
          background: #FFF8E1;
          border-color: #FFC107;
        }

        .pagination button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div className="container py-5">
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
                <div className="row g-4">
                  {currentProducts.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-4 col-lg-3" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="product-card">
                        <div className="product-img-wrapper">
                          <img
                            src={
                              p.thumbnail ||
                              'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'
                            }
                            alt={p.tensp}
                            className="product-img"
                          />
                        </div>
                        <div className="product-body">
                          <div>
                            <h6 className="product-title">{p.tensp}</h6>

                            {/*  Giá từ bảng sanpham_bienthe */}
                            <p className="product-price">
                              {p.bienthe?.length > 0
                                ? `${Number(p.bienthe[0].gia).toLocaleString('vi-VN')}₫`
                                : 'Liên hệ'}
                            </p>
                          </div>

                          <button
                            className="btn btn-detail w-100"
                            onClick={() => router.push(`/products/${p.id}`)}
                          >
                            <i className="bi bi-eye me-2"></i>
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
    </>
  );
}
