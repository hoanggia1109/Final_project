'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Trash2, Search, Phone, User, MessageSquare, Calendar, Eye } from 'lucide-react';

interface LienHe {
  lienhe_id: string;
  hoten: string;
  email: string;
  sdt?: string;
  tieude: string;
  noidung: string;
  created_at: string;
}

export default function LienHePage() {
  const router = useRouter();
  const [lienhes, setLienhes] = useState<LienHe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<LienHe | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/lienhe', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLienhes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa liên hệ này?')) return;
    
    setDeleteLoading(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/lienhe/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setLienhes(lienhes.filter((lh) => lh.lienhe_id !== id));
        alert('Xóa liên hệ thành công!');
        if (selectedItem?.lienhe_id === id) {
          setSelectedItem(null);
        }
      } else {
        alert('Không thể xóa liên hệ!');
      }
    } catch (err) {
      console.error('Lỗi xóa:', err);
      alert('Có lỗi xảy ra!');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredData = lienhes.filter(
    (lh) =>
      lh.hoten.toLowerCase().includes(search.toLowerCase()) ||
      lh.email.toLowerCase().includes(search.toLowerCase()) ||
      lh.tieude.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>
            <Mail className="me-2" size={28} />
            Quản lý liên hệ
          </h2>
          <p className="text-muted mb-0">Xem và quản lý các thông tin liên hệ từ khách hàng</p>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo tên, email hoặc tiêu đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Table */}
        <div className={selectedItem ? 'col-md-7' : 'col-12'}>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {filteredData.length === 0 ? (
                <div className="text-center py-5">
                  <Mail size={48} className="text-muted mb-3" />
                  <p className="text-muted">Chưa có liên hệ nào</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Người gửi</th>
                        <th>Email</th>
                        <th>Tiêu đề</th>
                        <th>Ngày gửi</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((lh) => (
                        <tr
                          key={lh.lienhe_id}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: selectedItem?.lienhe_id === lh.lienhe_id ? '#f8f9fa' : 'white',
                          }}
                          onClick={() => setSelectedItem(lh)}
                        >
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <User size={18} className="text-primary" />
                              <strong>{lh.hoten}</strong>
                            </div>
                            {lh.sdt && (
                              <small className="text-muted d-block">
                                <Phone size={12} className="me-1" />
                                {lh.sdt}
                              </small>
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Mail size={16} className="text-muted" />
                              {lh.email}
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {lh.tieude}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              <Calendar size={14} className="me-1" />
                              {formatDate(lh.created_at)}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(lh);
                                }}
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(lh.lienhe_id);
                                }}
                                disabled={deleteLoading === lh.lienhe_id}
                                title="Xóa"
                              >
                                {deleteLoading === lh.lienhe_id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="col-md-5">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <MessageSquare className="me-2" size={20} />
                  Chi tiết liên hệ
                </h5>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setSelectedItem(null)}
                >
                  ×
                </button>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Người gửi</label>
                  <div className="d-flex align-items-center gap-2">
                    <User size={18} className="text-primary" />
                    <strong>{selectedItem.hoten}</strong>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Email</label>
                  <div className="d-flex align-items-center gap-2">
                    <Mail size={16} className="text-muted" />
                    <a href={`mailto:${selectedItem.email}`}>{selectedItem.email}</a>
                  </div>
                </div>

                {selectedItem.sdt && (
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Số điện thoại</label>
                    <div className="d-flex align-items-center gap-2">
                      <Phone size={16} className="text-muted" />
                      <a href={`tel:${selectedItem.sdt}`}>{selectedItem.sdt}</a>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Tiêu đề</label>
                  <p className="mb-0">{selectedItem.tieude}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Nội dung</label>
                  <div
                    className="p-3 bg-light rounded"
                    style={{ whiteSpace: 'pre-wrap', minHeight: '150px' }}
                  >
                    {selectedItem.noidung}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Ngày gửi</label>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span>{formatDate(selectedItem.created_at)}</span>
                  </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <a
                    href={`mailto:${selectedItem.email}?subject=Re: ${selectedItem.tieude}`}
                    className="btn btn-primary"
                  >
                    <Mail className="me-2" size={18} />
                    Trả lời email
                  </a>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(selectedItem.lienhe_id)}
                    disabled={deleteLoading === selectedItem.lienhe_id}
                  >
                    {deleteLoading === selectedItem.lienhe_id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <Trash2 className="me-2" size={18} />
                        Xóa liên hệ
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


