'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Search } from 'lucide-react';

interface BlogCategory {
  id: string;
  tendanhmuc: string;
  mota: string | null;
  anhien: number;
  created_at: string;
}

export default function AdminBlogCategoriesPage() {
  const [list, setList] = useState<BlogCategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5001/api/danhmucbaiviet')
      .then(res => res.json())
      .then(data => {
        console.log(' Data từ API:', data);
        console.log(' Data type:', typeof data);
        console.log(' Is Array:', Array.isArray(data));
        
        // Đảm bảo data là array
        if (Array.isArray(data)) {
          setList(data);
        } else {
          console.error(' Data không phải array:', data);
          setList([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh mục bài viết:', err);
        setList([]);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này không?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/danhmucbaiviet/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(list.filter(item => item.id !== id));
        alert(' Xóa thành công!');
      } else alert(' Xóa thất bại!');
    } catch (err) {
      console.error(err);
      alert(' Lỗi khi xóa danh mục!');
    }
  };

  const filtered = list.filter(
    item => item.tendanhmuc?.toLowerCase().includes(search.trim().toLowerCase())
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
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Danh mục Bài viết</h2>
          <p className="text-muted mb-0">Quản lý danh mục cho các bài viết</p>
        </div>
        <button
          className="btn btn-warning text-white d-flex align-items-center gap-2 shadow-sm"
          onClick={() => router.push('/admin/blog-categories/create')}
        >
          <PlusCircle size={18} />
          <span>Thêm danh mục mới</span>
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
              placeholder="Tìm kiếm danh mục..."
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
                  <th className="px-4 py-3">Tên danh mục</th>
                  <th className="px-4 py-3">Mô tả</th>
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
                        <span className="fw-semibold" style={{ color: '#2C3E50' }}>{item.tendanhmuc}</span>
                      </td>
                      <td className="px-4 py-3">
                        {item.mota ? (
                          <span className="text-muted">{item.mota.substring(0, 100)}...</span>
                        ) : (
                          <span className="text-muted fst-italic">Chưa có mô tả</span>
                        )}
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
                            onClick={() => router.push(`/admin/blog-categories/edit/${item.id}`)}
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
                    <td colSpan={5} className="px-4 py-5 text-center">
                      <div className="text-muted">
                        <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2 mb-0">Không tìm thấy danh mục nào</p>
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
        <p className="mb-0">Tổng cộng: <strong>{list.length}</strong> danh mục | Đang hiển thị: <strong>{filtered.length}</strong></p>
      </div>
    </div>
  );
}

