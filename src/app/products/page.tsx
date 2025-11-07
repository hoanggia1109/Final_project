'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;
  const router = useRouter();

  // 🟢 Lấy danh mục
  useEffect(() => {
    fetch('http://localhost:5000/api/danhmuc')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Lỗi tải danh mục:', err));
  }, []);

  // 🟢 Lấy sản phẩm (theo danh mục hoặc tất cả)
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

  // 🧠 Lọc sản phẩm theo từ khóa
  const filteredProducts = products.filter((p) =>
    p.tensp?.toLowerCase().includes(search.trim().toLowerCase())
  );

  // 📄 Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <style jsx global>{`
        .layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 24px;
        }
        .sidebar {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          height: fit-content;
        }
        .sidebar-item {
          padding: 10px 14px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .sidebar-item:hover {
          background: #f1f9ff;
          color: #1e90ff;
        }
        .sidebar-item.active {
          background: #1e90ff;
          color: white;
        }
        .product-card {
          border: 1px solid #eee;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
        }
        .product-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-bottom: 1px solid #eee;
        }
        .product-body {
          padding: 14px;
          text-align: center;
        }
        .product-title {
          font-weight: 600;
          color: #1e90ff;
          font-size: 1rem;
          margin-bottom: 4px;
        }
        .product-price {
          color: #00bfff;
          font-weight: 700;
        }
        .pagination button {
          min-width: 36px;
          border-radius: 10px;
        }
        .pagination .btn-primary {
          background: #1e90ff;
          border: none;
        }
        .pagination .btn-primary:hover {
          background: #00bfff;
        }
      `}</style>

      <div className="container py-5">
        <div className="layout">
          {/* Sidebar danh mục */}
          <div className="sidebar">
            <h5 className="fw-bold mb-3 text-primary">Danh mục</h5>
            <div
              className={`sidebar-item ${!selectedCat ? 'active' : ''}`}
              onClick={() => setSelectedCat(null)}
            >
              Tất cả sản phẩm
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`sidebar-item ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.tendm}
              </div>
            ))}
          </div>

          {/* Khu vực sản phẩm */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-primary mb-0">
                {selectedCat
                  ? `Danh mục: ${
                      categories.find((c) => c.id === selectedCat)?.tendm || ''
                    }`
                  : 'Tất cả sản phẩm'}
              </h4>

              {/* 🔍 Ô tìm kiếm */}
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-control shadow-sm"
                style={{ width: '280px', borderRadius: '12px' }}
              />
            </div>

            {loading ? (
              <p className="text-muted text-center">Đang tải sản phẩm...</p>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="row g-4">
                  {currentProducts.map((p) => (
                    <div key={p.id} className="col-6 col-md-4 col-lg-3">
                      <div className="product-card h-100 d-flex flex-column">
                        <img
                          src={
                            p.bienthe?.[0]?.images?.[0]?.url ||
                            p.thumbnail ||
                            'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'
                          }
                          alt={p.tensp}
                          className="product-img"
                        />
                        <div className="product-body flex-grow-1">
                          <h6 className="product-title">{p.tensp}</h6>

                          {/* 💰 Giá từ bảng sanpham_bienthe */}
                          <p className="product-price">
                            {p.bienthe && p.bienthe.length > 0
                              ? `${Number(p.bienthe[0].gia).toLocaleString()}₫`
                              : 'Liên hệ'}
                          </p>

                          <button
                            className="btn btn-outline-primary btn-sm mt-2 rounded-pill"
                            onClick={() => router.push(`/product/${p.id}`)}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 🔢 PHÂN TRANG */}
                <div className="pagination d-flex justify-content-center align-items-center mt-4 gap-2">
                  <button
                    className="btn btn-light border"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    «
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`btn ${
                        currentPage === i + 1
                          ? 'btn-primary text-white'
                          : 'btn-light border'
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="btn btn-light border"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    »
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted mt-4">
                Không có sản phẩm nào.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
