'use client';

import { useState, useEffect } from 'react';
import { Search, Package, ArrowUpCircle, ArrowDownCircle, History, AlertTriangle } from 'lucide-react';

interface BienThe {
  id: string;
  code: string;
  mausac?: string;
  kichthuoc?: string;
  chatlieu?: string;
  gia: number;
  sl_tonkho: number;
  sanpham: {
    id: string;
    code: string;
    tensp: string;
    thumbnail?: string;
    danhmuc?: {
      id: string;
      tendm: string;
    };
    thuonghieu?: {
      id: string;
      tenbrand: string;
    };
  };
}

interface ThongKe {
  tongBienThe: number;
  tongTonKho: number;
  sapHetHang: number;
  hetHang: number;
  nhapTrongThang: number;
  xuatTrongThang: number;
}

export default function TonKhoPage() {
  const [list, setList] = useState<BienThe[]>([]);
  const [thongke, setThongKe] = useState<ThongKe | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNhapModal, setShowNhapModal] = useState(false);
  const [showXuatModal, setShowXuatModal] = useState(false);
  const [selectedBienThe, setSelectedBienThe] = useState<BienThe | null>(null);
  const [soluong, setSoluong] = useState('');
  const [lydo, setLydo] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadData();
  }, [currentPage]);
  
  useEffect(() => {
    loadThongKe();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('📦 Đang tải dữ liệu tồn kho...');
      console.log('🔑 Token:', token ? 'Có' : 'KHÔNG CÓ');
      
      const url = `http://localhost:5000/api/tonkho?page=${currentPage}&limit=${itemsPerPage}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('📡 Status code:', res.status);
      
      if (res.ok) {
        const response = await res.json();
        console.log('✅ Dữ liệu nhận được:', response);
        
        // API trả về { data: [], pagination: {} }
        if (response.data && response.pagination) {
          setList(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.total);
          console.log('📊 Số lượng biến thể:', response.data.length);
          console.log('📄 Trang:', response.pagination.page, '/', response.pagination.totalPages);
        } else {
          // Fallback: nếu API trả về array trực tiếp (backward compatible)
          setList(Array.isArray(response) ? response : []);
        }
      } else {
        const error = await res.json();
        console.error('❌ Lỗi API:', error);
        alert('Lỗi: ' + (error.message || 'Không thể tải dữ liệu'));
      }
      setLoading(false);
    } catch (err) {
      console.error('❌ Lỗi khi tải tồn kho:', err);
      alert('Lỗi kết nối: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setLoading(false);
    }
  };

  const loadThongKe = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/tonkho/thongke/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setThongKe(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
    }
  };

  const handleNhapKho = async () => {
    if (!selectedBienThe || !soluong) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/tonkho/nhap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bienthe_id: selectedBienThe.id,
          soluong: parseInt(soluong),
          lydo,
        }),
      });

      if (res.ok) {
        alert('✅ Nhập kho thành công!');
        setShowNhapModal(false);
        setSoluong('');
        setLydo('');
        loadData();
        loadThongKe();
      } else {
        const data = await res.json();
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error('Lỗi nhập kho:', err);
      alert('❌ Lỗi khi nhập kho');
    }
    setSaving(false);
  };

  const handleXuatKho = async () => {
    if (!selectedBienThe || !soluong) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/tonkho/xuat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bienthe_id: selectedBienThe.id,
          soluong: parseInt(soluong),
          lydo,
        }),
      });

      if (res.ok) {
        alert('✅ Xuất kho thành công!');
        setShowXuatModal(false);
        setSoluong('');
        setLydo('');
        loadData();
        loadThongKe();
      } else {
        const data = await res.json();
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error('Lỗi xuất kho:', err);
      alert('❌ Lỗi khi xuất kho');
    }
    setSaving(false);
  };

  // Filter search - Client-side search
  const displayList = list.filter((item) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    
    // Search trong tên sản phẩm
    if (item.sanpham.tensp.toLowerCase().includes(search)) return true;
    
    // Search trong mã sản phẩm
    if (item.sanpham.code.toLowerCase().includes(search)) return true;
    
    // Search trong mã biến thể
    if (item.code.toLowerCase().includes(search)) return true;
    
    // Search trong màu sắc
    if (item.mausac?.toLowerCase().includes(search)) return true;
    
    // Search trong kích thước
    if (item.kichthuoc?.toLowerCase().includes(search)) return true;
    
    // Search trong chất liệu
    if (item.chatlieu?.toLowerCase().includes(search)) return true;
    
    // Search trong danh mục
    if (item.sanpham.danhmuc?.tendm.toLowerCase().includes(search)) return true;
    
    // Search trong thương hiệu
    if (item.sanpham.thuonghieu?.tenbrand.toLowerCase().includes(search)) return true;
    
    return false;
  });

  const getStatusBadge = (tonkho: number) => {
    if (tonkho <= 0) {
      return <span className="badge bg-danger">Hết hàng</span>;
    } else if (tonkho < 10) {
      return <span className="badge bg-warning text-dark">Sắp hết</span>;
    } else if (tonkho < 50) {
      return <span className="badge bg-info text-dark">Tồn ít</span>;
    } else {
      return <span className="badge bg-success">Còn nhiều</span>;
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <Package size={32} className="me-2" />
            Quản lý Tồn kho
          </h2>
          <p className="text-muted mb-0">Theo dõi số lượng tồn kho và nhập/xuất kho</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            window.location.href = '/admin/tonkho/lichsu';
          }}
        >
          <History size={18} />
          Lịch sử nhập/xuất
        </button>
      </div>

      {/* Thống kê */}
      {thongke && (
        <div className="row mb-4">
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Tổng biến thể</div>
                <h4 className="mb-0">{thongke.tongBienThe}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Tổng tồn kho</div>
                <h4 className="mb-0 text-primary">{thongke.tongTonKho.toLocaleString()}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Sắp hết hàng</div>
                <h4 className="mb-0 text-warning">{thongke.sapHetHang}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Hết hàng</div>
                <h4 className="mb-0 text-danger">{thongke.hetHang}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Nhập tháng này</div>
                <h4 className="mb-0 text-success">{thongke.nhapTrongThang.toLocaleString()}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-muted small mb-1">Xuất tháng này</div>
                <h4 className="mb-0 text-info">{thongke.xuatTrongThang.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card danh sách */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* Search Bar */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Tìm kiếm theo tên sản phẩm, mã, màu sắc, kích thước..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchTerm('')}
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 small text-muted">
                Tìm thấy <strong className="text-primary">{displayList.length}</strong> kết quả cho &quot;<strong>{searchTerm}</strong>&quot;
              </div>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>Hình</th>
                    <th>Sản phẩm</th>
                    <th>Biến thể</th>
                    <th>Danh mục</th>
                    <th>Thương hiệu</th>
                    <th className="text-center">Giá</th>
                    <th className="text-center">Tồn kho</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center" style={{ width: '200px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {displayList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        {searchTerm ? (
                          <>
                            <Search size={48} className="mb-2 opacity-25" />
                            <p className="mb-0">Không tìm thấy kết quả cho &quot;<strong>{searchTerm}</strong>&quot;</p>
                            <button 
                              className="btn btn-sm btn-outline-primary mt-2"
                              onClick={() => setSearchTerm('')}
                            >
                              Xóa bộ lọc
                            </button>
                          </>
                        ) : (
                          <>
                        <Package size={48} className="mb-2 opacity-25" />
                        <p className="mb-0">Không có dữ liệu</p>
                          </>
                        )}
                      </td>
                    </tr>
                  ) : (
                    displayList.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.sanpham.thumbnail ? (
                            <img
                              src={item.sanpham.thumbnail}
                              alt={item.sanpham.tensp}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#e9ecef', borderRadius: '4px' }} />
                          )}
                        </td>
                        <td>
                          <div className="fw-medium">{item.sanpham.tensp}</div>
                          <small className="text-muted">{item.sanpham.code}</small>
                        </td>
                        <td>
                          <div className="small">
                            {item.mausac && <span className="badge bg-light text-dark me-1">🎨 {item.mausac}</span>}
                            {item.kichthuoc && <span className="badge bg-light text-dark me-1">📏 {item.kichthuoc}</span>}
                            {item.chatlieu && <span className="badge bg-light text-dark">🧵 {item.chatlieu}</span>}
                          </div>
                          <small className="text-muted d-block mt-1">{item.code}</small>
                        </td>
                        <td>{item.sanpham.danhmuc?.tendm || '-'}</td>
                        <td>{item.sanpham.thuonghieu?.tenbrand || '-'}</td>
                        <td className="text-center">
                          <span className="text-primary fw-medium">
                            {item.gia.toLocaleString()} ₫
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={`fw-bold ${item.sl_tonkho <= 0 ? 'text-danger' : item.sl_tonkho < 10 ? 'text-warning' : 'text-success'}`}>
                            {item.sl_tonkho}
                          </span>
                        </td>
                        <td className="text-center">
                          {getStatusBadge(item.sl_tonkho)}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => {
                              setSelectedBienThe(item);
                              setShowNhapModal(true);
                              setSoluong('');
                              setLydo('');
                            }}
                            title="Nhập kho"
                          >
                            <ArrowUpCircle size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-warning me-1"
                            onClick={() => {
                              setSelectedBienThe(item);
                              setShowXuatModal(true);
                              setSoluong('');
                              setLydo('');
                            }}
                            title="Xuất kho"
                            disabled={item.sl_tonkho <= 0}
                          >
                            <ArrowDownCircle size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Info & Controls */}
          {!loading && totalItems > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3 px-3 pb-3">
              <div className="text-muted small">
                Hiển thị <strong>{displayList.length}</strong> / <strong>{totalItems}</strong> biến thể
                {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
              </div>
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      « Trước
                    </button>
                  </li>
                  
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <li className="page-item">
                        <button className="page-link" onClick={() => setCurrentPage(1)}>
                          1
                        </button>
                      </li>
                      {currentPage > 4 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                    </>
                  )}
                  
                  {/* Page numbers around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page === currentPage || 
                             page === currentPage - 1 || 
                             page === currentPage + 1 ||
                             (page === currentPage - 2 && currentPage <= 3) ||
                             (page === currentPage + 2 && currentPage >= totalPages - 2);
                    })
                    .map(page => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  
                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                      <li className="page-item">
                        <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau »
                    </button>
                  </li>
                </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Nhập kho */}
      {showNhapModal && selectedBienThe && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <ArrowUpCircle size={20} className="me-2" />
                  Nhập kho
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowNhapModal(false)}
                  disabled={saving}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Sản phẩm</label>
                  <div className="p-2 bg-light rounded">
                    <div className="fw-medium">{selectedBienThe.sanpham.tensp}</div>
                    <div className="small text-muted">
                      {selectedBienThe.mausac && `Màu: ${selectedBienThe.mausac} | `}
                      {selectedBienThe.kichthuoc && `Size: ${selectedBienThe.kichthuoc} | `}
                      Tồn hiện tại: <span className="fw-bold">{selectedBienThe.sl_tonkho}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Số lượng nhập <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={soluong}
                    onChange={(e) => setSoluong(e.target.value)}
                    placeholder="Nhập số lượng"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Lý do</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={lydo}
                    onChange={(e) => setLydo(e.target.value)}
                    placeholder="Nhập lý do nhập kho (không bắt buộc)"
                  />
                </div>
                {soluong && (
                  <div className="alert alert-info mb-0">
                    <small>
                      Sau khi nhập: <strong>{selectedBienThe.sl_tonkho + parseInt(soluong)}</strong> sản phẩm
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNhapModal(false)}
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleNhapKho}
                  disabled={!soluong || saving}
                >
                  {saving ? 'Đang xử lý...' : 'Nhập kho'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xuất kho */}
      {showXuatModal && selectedBienThe && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <ArrowDownCircle size={20} className="me-2" />
                  Xuất kho
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowXuatModal(false)}
                  disabled={saving}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Sản phẩm</label>
                  <div className="p-2 bg-light rounded">
                    <div className="fw-medium">{selectedBienThe.sanpham.tensp}</div>
                    <div className="small text-muted">
                      {selectedBienThe.mausac && `Màu: ${selectedBienThe.mausac} | `}
                      {selectedBienThe.kichthuoc && `Size: ${selectedBienThe.kichthuoc} | `}
                      Tồn hiện tại: <span className="fw-bold">{selectedBienThe.sl_tonkho}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Số lượng xuất <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={selectedBienThe.sl_tonkho}
                    value={soluong}
                    onChange={(e) => setSoluong(e.target.value)}
                    placeholder="Nhập số lượng"
                  />
                  <small className="text-muted">Tối đa: {selectedBienThe.sl_tonkho}</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Lý do</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={lydo}
                    onChange={(e) => setLydo(e.target.value)}
                    placeholder="Nhập lý do xuất kho (không bắt buộc)"
                  />
                </div>
                {soluong && parseInt(soluong) <= selectedBienThe.sl_tonkho && (
                  <div className="alert alert-warning mb-0">
                    <small>
                      Sau khi xuất: <strong>{selectedBienThe.sl_tonkho - parseInt(soluong)}</strong> sản phẩm
                    </small>
                  </div>
                )}
                {soluong && parseInt(soluong) > selectedBienThe.sl_tonkho && (
                  <div className="alert alert-danger mb-0">
                    <AlertTriangle size={16} className="me-1" />
                    <small>Số lượng xuất vượt quá số lượng tồn kho!</small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowXuatModal(false)}
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleXuatKho}
                  disabled={!soluong || parseInt(soluong) > selectedBienThe.sl_tonkho || saving}
                >
                  {saving ? 'Đang xử lý...' : 'Xuất kho'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

