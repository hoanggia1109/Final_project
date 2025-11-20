'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Search } from 'lucide-react';

interface Brand {
  id: string;
  code: string;
  tenbrand: string;
  logo: string;
  thutu: number;
  anhien: number;
}

export default function AdminBrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Admin mode: lấy tất cả brands (kể cả ẩn)
    fetch('http://localhost:5000/api/thuonghieu?admin=true')
      .then(res => res.json())
      .then(data => {
        setBrands(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải thương hiệu:', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thương hiệu này không?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/thuonghieu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBrands(brands.filter(b => b.id !== id));
        alert('✅ Xóa thành công!');
      } else alert('❌ Xóa thất bại!');
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi xóa thương hiệu!');
    }
  };

  const filtered = brands.filter(
    b => b.tenbrand && b.tenbrand.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Quản lý Thương hiệu</h2>
          <p className="text-muted mb-0">Danh sách tất cả các thương hiệu</p>
        </div>
        <button
          className="btn btn-warning text-white d-flex align-items-center gap-2 shadow-sm"
          onClick={() => router.push('/admin/brand/create')}
        >
          <PlusCircle size={18} />
          <span>Thêm thương hiệu mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu theo tên..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control border-start-0 ps-0"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#F8F9FA' }}>
                <tr>
                  <th className="px-4 py-3 text-center" style={{ width: '60px' }}>#</th>
                  <th className="px-4 py-3" style={{ width: '120px' }}>Mã</th>
                  <th className="px-4 py-3">Tên thương hiệu</th>
                  <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Logo</th>
                  <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Thứ tự</th>
                  <th className="px-4 py-3 text-center" style={{ width: '120px' }}>Trạng thái</th>
                  <th className="px-4 py-3 text-center" style={{ width: '180px' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((b, index) => (
                    <tr key={b.id}>
                      <td className="px-4 py-3 text-center text-muted">{index + 1}</td>
                      <td className="px-4 py-3">
                        <code className="text-primary">{b.code || '—'}</code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="fw-semibold" style={{ color: '#2C3E50' }}>{b.tenbrand}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b.logo ? (
                          <img
                            src={b.logo}
                            alt={b.tenbrand}
                            className="rounded"
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              objectFit: 'contain',
                              border: '2px solid #E9ECEF',
                              padding: '4px',
                              backgroundColor: '#fff'
                            }}
                          />
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center rounded bg-light"
                            style={{ width: '50px', height: '50px', fontSize: '0.75rem' }}
                          >
                            <span className="text-muted">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="badge bg-secondary">{b.thutu ?? '-'}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b.anhien === 1 ? (
                          <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger px-3 py-2">
                            Ẩn
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/brand/edit/${b.id}`)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          >
                            <Pencil size={14} /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-5 text-center">
                      <div className="text-muted">
                        <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2 mb-0">Không tìm thấy thương hiệu nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-3 text-muted small">
        <p className="mb-0">Tổng cộng: <strong>{brands.length}</strong> thương hiệu | Đang hiển thị: <strong>{filtered.length}</strong></p>
      </div>
    </div>
  );
}

