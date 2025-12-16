'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Search } from 'lucide-react';

interface BaiViet {
  id: string;
  tieude: string;
  noidung: string;
  anhien: number;
  hinh_anh: string | null;
  user_id: string;
  danhmuc_baiviet_id: string;
  created_at: string;
  user?: { email: string; ho_ten: string | null };
  danhmuc?: { tendanhmuc: string };
}

export default function AdminBaiVietPage() {
  const [list, setList] = useState<BaiViet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5002/api/baiviet?admin=true')
      .then(res => res.json())
      .then(data => {
        console.log('📦 Bài viết data:', data);
        if (Array.isArray(data)) {
          setList(data);
        } else {
          console.error('❌ Data không phải array:', data);
          setList([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải bài viết:', err);
        setList([]);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này không?')) return;
    try {
      const res = await fetch(`http://localhost:5002/api/baiviet/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(list.filter(item => item.id !== id));
        alert('✅ Xóa thành công!');
      } else alert('❌ Xóa thất bại!');
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi xóa bài viết!');
    }
  };

  const filtered = list.filter(
    item => item.tieude?.toLowerCase().includes(search.trim().toLowerCase())
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
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Quản lý Bài viết</h2>
          <p className="text-muted mb-0">Danh sách tất cả các bài viết</p>
        </div>
        <button
          className="btn btn-warning text-white d-flex align-items-center gap-2 shadow-sm"
          onClick={() => router.push('/admin/baiviet/create')}
        >
          <PlusCircle size={18} />
          <span>Thêm bài viết mới</span>
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
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
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
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Ảnh</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Tác giả</th>
                  <th className="px-4 py-3 text-center" style={{ width: '120px' }}>Trạng thái</th>
                  <th className="px-4 py-3 text-center" style={{ width: '180px' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-center text-muted">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className="fw-semibold" style={{ color: '#2C3E50' }}>{item.tieude}</span>
                        {item.noidung && (
                          <p className="text-muted small mb-0 mt-1">
                            {item.noidung.substring(0, 80)}...
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.hinh_anh ? (
                          <img
                            src={item.hinh_anh}
                            alt={item.tieude}
                            className="rounded"
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              objectFit: 'cover',
                              border: '2px solid #E9ECEF'
                            }}
                          />
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center rounded bg-light"
                            style={{ width: '60px', height: '60px', fontSize: '0.75rem' }}
                          >
                            <span className="text-muted">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-light text-dark">
                          {item.danhmuc?.tendanhmuc || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted small">
                          {item.user?.ho_ten || item.user?.email || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.anhien === 1 ? (
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
                            onClick={() => router.push(`/admin/baiviet/edit/${item.id}`)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          >
                            <Pencil size={14} /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
                        <p className="mt-2 mb-0">Không tìm thấy bài viết nào</p>
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
        <p className="mb-0">Tổng cộng: <strong>{list.length}</strong> bài viết | Đang hiển thị: <strong>{filtered.length}</strong></p>
      </div>
    </div>
  );
}
