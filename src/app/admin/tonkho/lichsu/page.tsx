'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, ArrowUpCircle, ArrowDownCircle, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PhieuNhapXuat {
  id: string;
  loai: 'nhap' | 'xuat';
  soluong: number;
  soluong_truoc: number;
  soluong_sau: number;
  lydo?: string;
  created_at: string;
  bienthe: {
    id: string;
    code: string;
    mausac?: string;
    kichthuoc?: string;
    chatlieu?: string;
    sanpham: {
      id: string;
      code: string;
      tensp: string;
      thumbnail?: string;
    };
  };
  nguoi_thuc_hien_info?: {
    id: string;
    ho_ten: string;
    email: string;
  };
}

export default function LichSuNhapXuatKhoPage() {
  const router = useRouter();
  const [list, setList] = useState<PhieuNhapXuat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLoai, setFilterLoai] = useState<'all' | 'nhap' | 'xuat'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/tonkho/lichsu/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi tải lịch sử:', err);
      setLoading(false);
    }
  };

  const filteredList = list.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchSearch = 
      item.bienthe.sanpham.tensp.toLowerCase().includes(search) ||
      item.bienthe.sanpham.code?.toLowerCase().includes(search) ||
      item.bienthe.code?.toLowerCase().includes(search) ||
      item.lydo?.toLowerCase().includes(search) ||
      item.nguoi_thuc_hien_info?.ho_ten.toLowerCase().includes(search);
    
    const matchLoai = filterLoai === 'all' || item.loai === filterLoai;
    
    return matchSearch && matchLoai;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            onClick={() => router.back()}
            className="btn btn-outline-secondary btn-sm mb-2 d-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
          <h2 className="mb-1">
            <Calendar size={32} className="me-2" />
            Lịch sử Nhập/Xuất kho
          </h2>
          <p className="text-muted mb-0">Theo dõi toàn bộ lịch sử nhập xuất kho</p>
        </div>
      </div>

      {/* Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Tìm kiếm theo sản phẩm, mã, lý do, người thực hiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterLoai}
                onChange={(e) => setFilterLoai(e.target.value as 'all' | 'nhap' | 'xuat')}
              >
                <option value="all">Tất cả</option>
                <option value="nhap">Chỉ nhập kho</option>
                <option value="xuat">Chỉ xuất kho</option>
              </select>
            </div>
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
                    <th style={{ width: '60px' }}>Loại</th>
                    <th style={{ width: '60px' }}>Hình</th>
                    <th>Sản phẩm & Biến thể</th>
                    <th className="text-center">SL trước</th>
                    <th className="text-center">SL thay đổi</th>
                    <th className="text-center">SL sau</th>
                    <th>Lý do</th>
                    <th>Người thực hiện</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5 text-muted">
                        <Calendar size={48} className="mb-2 opacity-25" />
                        <p className="mb-0">Không có dữ liệu</p>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.loai === 'nhap' ? (
                            <span className="badge bg-success d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '11px' }}>
                              <ArrowUpCircle size={14} />
                              Nhập
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '11px' }}>
                              <ArrowDownCircle size={14} />
                              Xuất
                            </span>
                          )}
                        </td>
                        <td>
                          {item.bienthe.sanpham.thumbnail ? (
                            <img
                              src={item.bienthe.sanpham.thumbnail}
                              alt={item.bienthe.sanpham.tensp}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#e9ecef', borderRadius: '4px' }} />
                          )}
                        </td>
                        <td>
                          <div className="fw-medium">{item.bienthe.sanpham.tensp}</div>
                          <small className="text-muted d-block">{item.bienthe.sanpham.code}</small>
                          <div className="small mt-1">
                            {item.bienthe.mausac && <span className="badge bg-light text-dark me-1">🎨 {item.bienthe.mausac}</span>}
                            {item.bienthe.kichthuoc && <span className="badge bg-light text-dark me-1">📏 {item.bienthe.kichthuoc}</span>}
                            {item.bienthe.chatlieu && <span className="badge bg-light text-dark">🧵 {item.bienthe.chatlieu}</span>}
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-muted">{item.soluong_truoc}</span>
                        </td>
                        <td className="text-center">
                          <span className={`fw-bold ${item.loai === 'nhap' ? 'text-success' : 'text-warning'}`}>
                            {item.loai === 'nhap' ? '+' : '-'}{item.soluong}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="fw-bold">{item.soluong_sau}</span>
                        </td>
                        <td>
                          <small className="text-muted">{item.lydo || '-'}</small>
                        </td>
                        <td>
                          {item.nguoi_thuc_hien_info ? (
                            <div>
                              <div className="small fw-medium d-flex align-items-center gap-1">
                                <User size={14} />
                                {item.nguoi_thuc_hien_info.ho_ten}
                              </div>
                              <small className="text-muted">{item.nguoi_thuc_hien_info.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">{formatDate(item.created_at)}</small>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Stats */}
          {!loading && filteredList.length > 0 && (
            <div className="row mt-4 pt-3 border-top">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="text-muted small mb-1">Tổng số giao dịch</div>
                  <h5 className="mb-0">{filteredList.length}</h5>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="text-muted small mb-1">Tổng nhập</div>
                  <h5 className="mb-0 text-success">
                    {filteredList
                      .filter(item => item.loai === 'nhap')
                      .reduce((sum, item) => sum + item.soluong, 0)
                      .toLocaleString()}
                  </h5>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="text-muted small mb-1">Tổng xuất</div>
                  <h5 className="mb-0 text-warning">
                    {filteredList
                      .filter(item => item.loai === 'xuat')
                      .reduce((sum, item) => sum + item.soluong, 0)
                      .toLocaleString()}
                  </h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





