'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, Edit, Search, Tag, Calendar, DollarSign, Percent } from 'lucide-react';

interface MaGiamGia {
  id: string;
  code: string;
  loai: 'percent' | 'cash' | 'ship';
  giatrigiam: number;
  giatri_toithieu: number;
  ngaybatdau: string;
  ngayketthuc: string;
  soluong: number;
  trangthai: number;
  mota?: string;
  created_at: string;
}

export default function MaGiamGiaPage() {
  const router = useRouter();
  const [magiamgias, setMagiamgias] = useState<MaGiamGia[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    loai: 'percent' as 'percent' | 'cash' | 'ship',
    giatrigiam: 0,
    giatri_toithieu: 0,
    ngaybatdau: '',
    ngayketthuc: '',
    soluong: 0,
    trangthai: 1,
    mota: '',
  });

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
      const res = await fetch('http://localhost:5000/api/admin/magiamgia', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMagiamgias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;
    
    setDeleteLoading(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/magiamgia/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setMagiamgias(magiamgias.filter((m) => m.id !== id));
        alert('Xóa mã giảm giá thành công!');
      } else {
        alert('Không thể xóa mã giảm giá!');
      }
    } catch (err) {
      console.error('Lỗi xóa:', err);
      alert('Có lỗi xảy ra!');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (mg: MaGiamGia) => {
    setEditingId(mg.id);
    setForm({
      code: mg.code,
      loai: mg.loai,
      giatrigiam: mg.giatrigiam,
      giatri_toithieu: mg.giatri_toithieu,
      ngaybatdau: mg.ngaybatdau.split('T')[0],
      ngayketthuc: mg.ngayketthuc.split('T')[0],
      soluong: mg.soluong,
      trangthai: mg.trangthai,
      mota: mg.mota || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `http://localhost:5000/api/admin/magiamgia/${editingId}`
        : 'http://localhost:5000/api/admin/magiamgia';
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        alert(editingId ? 'Cập nhật mã giảm giá thành công!' : 'Thêm mã giảm giá thành công!');
        setShowForm(false);
        setEditingId(null);
        setForm({
          code: '',
          loai: 'percent',
          giatrigiam: 0,
          giatri_toithieu: 0,
          ngaybatdau: '',
          ngayketthuc: '',
          soluong: 0,
          trangthai: 1,
          mota: '',
        });
        loadData();
      } else {
        const error = await res.json();
        alert(error.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      console.error('Lỗi submit:', err);
      alert('Có lỗi xảy ra!');
    }
  };

  const filteredData = magiamgias.filter((mg) =>
    mg.code.toLowerCase().includes(search.toLowerCase())
  );

  const getLoaiLabel = (loai: string) => {
    switch (loai) {
      case 'percent':
        return 'Phần trăm';
      case 'cash':
        return 'Số tiền';
      case 'ship':
        return 'Miễn phí ship';
      default:
        return loai;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
            <Tag className="me-2" size={28} />
            Quản lý mã giảm giá
          </h2>
          <p className="text-muted mb-0">Quản lý các mã giảm giá và khuyến mãi</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({
              code: '',
              loai: 'percent',
              giatrigiam: 0,
              giatri_toithieu: 0,
              ngaybatdau: '',
              ngayketthuc: '',
              soluong: 0,
              trangthai: 1,
              mota: '',
            });
          }}
        >
          <PlusCircle size={20} />
          Thêm mã giảm giá
        </button>
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
              placeholder="Tìm kiếm theo mã..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowForm(false)}
        >
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Mã giảm giá *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        required
                        placeholder="VD: SALE2024"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Loại giảm giá *</label>
                      <select
                        className="form-select"
                        value={form.loai}
                        onChange={(e) =>
                          setForm({ ...form, loai: e.target.value as 'percent' | 'cash' | 'ship' })
                        }
                        required
                      >
                        <option value="percent">Phần trăm (%)</option>
                        <option value="cash">Số tiền (VNĐ)</option>
                        <option value="ship">Miễn phí ship</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Giá trị giảm {form.loai === 'percent' ? '(%)' : '(VNĐ)'} *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.giatrigiam}
                        onChange={(e) =>
                          setForm({ ...form, giatrigiam: parseFloat(e.target.value) || 0 })
                        }
                        required
                        min="0"
                        max={form.loai === 'percent' ? 100 : undefined}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Giá trị đơn hàng tối thiểu (VNĐ) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.giatri_toithieu}
                        onChange={(e) =>
                          setForm({ ...form, giatri_toithieu: parseFloat(e.target.value) || 0 })
                        }
                        required
                        min="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ngày bắt đầu *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.ngaybatdau}
                        onChange={(e) => setForm({ ...form, ngaybatdau: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ngày kết thúc *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.ngayketthuc}
                        onChange={(e) => setForm({ ...form, ngayketthuc: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Số lượng *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.soluong}
                        onChange={(e) =>
                          setForm({ ...form, soluong: parseInt(e.target.value) || 0 })
                        }
                        required
                        min="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Trạng thái *</label>
                      <select
                        className="form-select"
                        value={form.trangthai}
                        onChange={(e) =>
                          setForm({ ...form, trangthai: parseInt(e.target.value) })
                        }
                        required
                      >
                        <option value={1}>Kích hoạt</option>
                        <option value={0}>Tắt</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Mô tả</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={form.mota}
                        onChange={(e) => setForm({ ...form, mota: e.target.value })}
                        placeholder="Mô tả về mã giảm giá..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {filteredData.length === 0 ? (
            <div className="text-center py-5">
              <Tag size={48} className="text-muted mb-3" />
              <p className="text-muted">Chưa có mã giảm giá nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Loại</th>
                    <th>Giá trị giảm</th>
                    <th>Giá trị tối thiểu</th>
                    <th>Thời gian</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((mg) => (
                    <tr key={mg.id}>
                      <td>
                        <strong className="text-primary">{mg.code}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">{getLoaiLabel(mg.loai)}</span>
                      </td>
                      <td>
                        {mg.loai === 'percent' ? (
                          <span>
                            <Percent size={16} className="me-1" />
                            {mg.giatrigiam}%
                          </span>
                        ) : mg.loai === 'cash' ? (
                          <span>
                            <DollarSign size={16} className="me-1" />
                            {mg.giatrigiam.toLocaleString('vi-VN')}₫
                          </span>
                        ) : (
                          <span className="text-success">Miễn phí ship</span>
                        )}
                      </td>
                      <td>{mg.giatri_toithieu.toLocaleString('vi-VN')}₫</td>
                      <td>
                        <small>
                          <Calendar size={14} className="me-1" />
                          {formatDate(mg.ngaybatdau)} - {formatDate(mg.ngayketthuc)}
                        </small>
                      </td>
                      <td>
                        <span className={mg.soluong > 0 ? 'text-success' : 'text-danger'}>
                          {mg.soluong}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${mg.trangthai === 1 ? 'bg-success' : 'bg-secondary'}`}
                        >
                          {mg.trangthai === 1 ? 'Kích hoạt' : 'Tắt'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(mg)}
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(mg.id)}
                            disabled={deleteLoading === mg.id}
                            title="Xóa"
                          >
                            {deleteLoading === mg.id ? (
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
  );
}
