'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Pencil, 
  Trash2, 
  PlusCircle, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Package
} from "lucide-react";

interface SanPham {
  id: string;
  tensp: string;
  thumbnail: string;
  danhmuc?: { id: string; tendm: string };
  thuonghieu?: { id: string; tenbrand: string };
  bienthe?: { gia: number }[];
  created_at: string;
  anhien: number;
}

interface DanhMuc {
  id: string;
  tendm: string;
}

interface ThuongHieu {
  id: string;
  tenbrand: string;
}

export default function ProductAdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<SanPham[]>([]);
  const [danhmucs, setDanhmucs] = useState<DanhMuc[]>([]);
  const [thuonghieus, setThuonghieus] = useState<ThuongHieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Filter & Pagination states
  const [search, setSearch] = useState("");
  const [filterDanhMuc, setFilterDanhMuc] = useState<string>("all");
  const [filterThuongHieu, setFilterThuongHieu] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, danhmucsRes, thuonghieusRes] = await Promise.all([
        fetch("http://localhost:5001/api/sanpham"),
        fetch("http://localhost:5001/api/danhmuc"),
        fetch("http://localhost:5001/api/thuonghieu"),
      ]);

      const productsData = await productsRes.json();
      const danhmucsData = await danhmucsRes.json();
      const thuonghieusData = await thuonghieusRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setDanhmucs(Array.isArray(danhmucsData) ? danhmucsData : []);
      setThuonghieus(Array.isArray(thuonghieusData) ? thuonghieusData : []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm: ${name}?`)) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`http://localhost:5001/api/sanpham/${id}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Xóa sản phẩm thành công!");
      } else {
        alert("Không thể xóa sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.tensp?.toLowerCase().includes(search.toLowerCase());
    const matchDanhMuc = filterDanhMuc === "all" || p.danhmuc?.id === filterDanhMuc;
    const matchThuongHieu = filterThuongHieu === "all" || p.thuonghieu?.id === filterThuongHieu;
    const matchStatus = 
      filterStatus === "all" || 
      (filterStatus === "active" && p.anhien === 1) ||
      (filterStatus === "inactive" && p.anhien === 0);

    return matchSearch && matchDanhMuc && matchThuongHieu && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  // Get min price
  const getMinPrice = (bienthe?: { gia: number }[]) => {
    if (!bienthe || bienthe.length === 0) return 0;
    return Math.min(...bienthe.map(b => b.gia));
  };

  if (loading) {
    return (
      <>
        <style jsx global>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%);
          }
        `}</style>
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border" style={{ width: '4rem', height: '4rem', color: '#FF6B6B', borderWidth: '4px' }}></div>
            <p className="mt-3" style={{ color: '#FF8E53', fontWeight: '600', fontSize: '1.1rem' }}>Đang tải sản phẩm...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        .product-management {
          min-height: 100vh;
          background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 30%, #FFF5E8 100%);
          padding-top: 100px;
          padding-bottom: 60px;
        }

        .page-header {
          margin-bottom: 30px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.05), rgba(255, 142, 83, 0.05));
          border-radius: 20px;
          border: 2px solid #FFE5D9;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .filters-card {
          background: #fff;
          padding: 25px;
          border-radius: 16px;
          border: 2px solid #FFE5D9;
          margin-bottom: 25px;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.08);
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input {
          width: 100%;
          padding: 12px 18px 12px 50px;
          border: 2px solid #FFE5D9;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #FF8E53;
          box-shadow: 0 0 0 3px rgba(255, 142, 83, 0.1);
        }

        .filter-select {
          padding: 10px 16px;
          border: 2px solid #FFE5D9;
          border-radius: 10px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: #fff;
        }

        .filter-select:focus {
          outline: none;
          border-color: #FF8E53;
          box-shadow: 0 0 0 3px rgba(255, 142, 83, 0.1);
        }

        .btn-add {
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
          color: #fff;
        }

        .btn-back {
          background: #fff;
          color: #666;
          border: 2px solid #FFE5D9;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          border-color: #FF8E53;
          background: #FFF5F0;
          color: #FF6B6B;
        }

        .products-table {
          background: #fff;
          border-radius: 16px;
          border: 2px solid #FFE5D9;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.08);
        }

        .table-header {
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          padding: 20px 25px;
          border-bottom: 2px solid #FFE5D9;
        }

        .table-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .custom-table {
          width: 100%;
          margin: 0;
        }

        .custom-table thead {
          background: #FFF9F5;
        }

        .custom-table th {
          padding: 16px;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #FFE5D9;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .custom-table td {
          padding: 16px;
          vertical-align: middle;
          border-bottom: 1px solid #FFE5D9;
          color: #666;
        }

        .custom-table tbody tr {
          transition: all 0.3s ease;
        }

        .custom-table tbody tr:hover {
          background: #FFF9F5;
        }

        .product-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 10px;
          border: 2px solid #FFE5D9;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-active {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          color: #155724;
        }

        .status-inactive {
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
          color: #721c24;
        }

        .btn-edit {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
        }

        .btn-delete {
          background: linear-gradient(135deg, #FF6B6B, #FF5252);
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-delete:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          background: #FFF9F5;
          border-top: 2px solid #FFE5D9;
        }

        .pagination-info {
          color: #666;
          font-size: 0.9rem;
        }

        .pagination-buttons {
          display: flex;
          gap: 8px;
        }

        .page-btn {
          padding: 8px 14px;
          border: 2px solid #FFE5D9;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #666;
        }

        .page-btn:hover:not(:disabled) {
          border-color: #FF8E53;
          background: #FFF5F0;
          color: #FF6B6B;
        }

        .page-btn.active {
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          color: #fff;
          border-color: #FF6B6B;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.5rem;
          }

          .product-management {
            padding-top: 80px;
          }

          .custom-table {
            font-size: 0.85rem;
          }

          .product-img {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>

      <div className="product-management">
        <div className="container-fluid">
          {/* Header */}
          <div className="page-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h1 className="page-title">
                <Package size={32} />
                Quản lý sản phẩm
              </h1>
              <div className="d-flex gap-2">
                <button className="btn-back" onClick={() => router.push('/admin')}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Về Dashboard
                </button>
                <button className="btn-add" onClick={() => router.push('/admin/products/create')}>
                  <PlusCircle size={20} />
                  Thêm sản phẩm
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-card">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: '#666' }}>
                  <Search size={16} className="me-2" style={{ verticalAlign: 'middle' }} />
                  Tìm kiếm
                </label>
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Danh mục filter */}
              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: '#666' }}>
                  <Filter size={16} className="me-2" style={{ verticalAlign: 'middle' }} />
                  Danh mục
                </label>
                <select
                  className="filter-select form-select"
                  value={filterDanhMuc}
                  onChange={(e) => {
                    setFilterDanhMuc(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Tất cả</option>
                  {danhmucs.map((dm) => (
                    <option key={dm.id} value={dm.id}>
                      {dm.tendm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thương hiệu filter */}
              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: '#666' }}>
                  <Filter size={16} className="me-2" style={{ verticalAlign: 'middle' }} />
                  Thương hiệu
                </label>
                <select
                  className="filter-select form-select"
                  value={filterThuongHieu}
                  onChange={(e) => {
                    setFilterThuongHieu(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Tất cả</option>
                  {thuonghieus.map((th) => (
                    <option key={th.id} value={th.id}>
                      {th.tenbrand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: '#666' }}>
                  <Filter size={16} className="me-2" style={{ verticalAlign: 'middle' }} />
                  Trạng thái
                </label>
                <select
                  className="filter-select form-select"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Hiển thị</option>
                  <option value="inactive">Ẩn</option>
                </select>
              </div>

              {/* Items per page */}
              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ fontSize: '0.9rem', color: '#666' }}>
                  Số dòng/trang
                </label>
                <select
                  className="filter-select form-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="products-table">
            <div className="table-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="table-title">
                  Danh sách sản phẩm ({filteredProducts.length})
                </h4>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  Trang {currentPage} / {totalPages || 1}
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {currentItems.length > 0 ? (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>#</th>
                      <th style={{ width: '80px' }}>Ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Thương hiệu</th>
                      <th>Giá</th>
                      <th>Ngày tạo</th>
                      <th>Trạng thái</th>
                      <th style={{ width: '150px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((p, i) => (
                      <tr key={p.id}>
                        <td className="text-center">{indexOfFirstItem + i + 1}</td>
                        <td className="text-center">
                          <img
                            src={
                              p.thumbnail
                                ? p.thumbnail.startsWith("http")
                                  ? p.thumbnail
                                  : `http://localhost:5001${p.thumbnail}`
                                : "/no-image.png"
                            }
                            alt={p.tensp}
                            className="product-img"
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </td>
                        <td>
                          <strong style={{ color: '#2c3e50' }}>{p.tensp}</strong>
                        </td>
                        <td>{p.danhmuc?.tendm || <span style={{ color: '#999' }}>Chưa có</span>}</td>
                        <td>{p.thuonghieu?.tenbrand || <span style={{ color: '#999' }}>Chưa có</span>}</td>
                        <td>
                          <strong style={{ color: '#FF6B6B' }}>
                            {formatPrice(getMinPrice(p.bienthe))}
                          </strong>
                        </td>
                        <td>{formatDate(p.created_at)}</td>
                        <td>
                          <span className={`status-badge ${p.anhien === 1 ? 'status-active' : 'status-inactive'}`}>
                            {p.anhien === 1 ? (
                              <>
                                <Eye size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Hiển thị
                              </>
                            ) : (
                              <>
                                <EyeOff size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Ẩn
                              </>
                            )}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn-edit"
                              onClick={() => router.push(`/admin/products/${p.id}`)}
                              title="Sửa"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(p.id, p.tensp)}
                              disabled={deleteLoading === p.id}
                              title="Xóa"
                            >
                              {deleteLoading === p.id ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Package size={40} color="#FF8E53" />
                  </div>
                  <p style={{ fontSize: '1.1rem', color: '#999', fontWeight: '500' }}>
                    {search || filterDanhMuc !== 'all' || filterThuongHieu !== 'all' || filterStatus !== 'all'
                      ? 'Không tìm thấy sản phẩm phù hợp'
                      : 'Chưa có sản phẩm nào'}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} / {filteredProducts.length} sản phẩm
                </div>
                <div className="pagination-buttons">
                  <button
                    className="page-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span style={{ padding: '8px', color: '#999' }}>...</span>
                            <button
                              className={`page-btn ${currentPage === page ? 'active' : ''}`}
                              onClick={() => paginate(page)}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      }
                      return (
                        <button
                          key={page}
                          className={`page-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => paginate(page)}
                        >
                          {page}
                        </button>
                      );
                    })}
                  
                  <button
                    className="page-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
