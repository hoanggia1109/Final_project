'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Search } from 'lucide-react';

interface Banner {
  id: number;
  tieude: string;
  mota: string;
  url: string;
  thutu: number;
  anhien: number;
  linksp: string;
  created_at: string;
  updated_at: string;
}

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/banner')
      .then(res => res.json())
      .then(data => {
        console.log(' Banner data:', data);
        // Đảm bảo data là array
        if (Array.isArray(data)) {
          setBanners(data);
        } else {
          console.error(' Data không phải array:', data);
          setBanners([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải banner:', err);
        setBanners([]);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa banner này không?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/banner/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(banners.filter(b => b.id !== id));
        alert(' Đã xóa thành công!');
      } else alert(' Xóa thất bại!');
    } catch (err) {
      console.error(err);
      alert(' Lỗi khi xóa banner!');
    }
  };

  const filtered = banners.filter(b =>
    b.tieude?.toLowerCase().includes(search.trim().toLowerCase())
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
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Quản lý Banner</h2>
          <p className="text-muted mb-0">Danh sách tất cả các banner trên trang chủ</p>
        </div>
        <button
          className="btn btn-warning text-white d-flex align-items-center gap-2 shadow-sm"
          onClick={() => router.push('/admin/banner/create')}
        >
          <PlusCircle size={18} />
          <span>Thêm banner mới</span>
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
              placeholder="Tìm kiếm banner theo tiêu đề..."
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
                  <th className="px-4 py-3 text-center" style={{ width: '120px' }}>Ảnh</th>
                  <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Thứ tự</th>
                  <th className="px-4 py-3 text-center" style={{ width: '120px' }}>Trạng thái</th>
                  <th className="px-4 py-3 text-center" style={{ width: '150px' }}>Link</th>
                  <th className="px-4 py-3 text-center" style={{ width: '180px' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((b, idx) => (
                    <tr key={b.id}>
                      <td className="px-4 py-3 text-center text-muted">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="fw-semibold" style={{ color: '#2C3E50' }}>{b.tieude}</span>
                          {b.mota && <p className="text-muted small mb-0 mt-1">{b.mota.substring(0, 50)}...</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b.url ? (
                          <img
                            src={b.url}
                            alt={b.tieude}
                            className="rounded"
                            style={{ 
                              width: '70px', 
                              height: '70px', 
                              objectFit: 'cover',
                              border: '2px solid #E9ECEF'
                            }}
                          />
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center rounded bg-light"
                            style={{ width: '70px', height: '70px', fontSize: '0.75rem' }}
                          >
                            <span className="text-muted">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="badge bg-light text-dark">{b.thutu ?? '-'}</span>
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
                        {b.linksp ? (
                          <a href={b.linksp} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                            <i className="bi bi-link-45deg"></i> Link
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/banner/edit/${b.id}`)}
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
                        <p className="mt-2 mb-0">Không tìm thấy banner nào</p>
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
        <p className="mb-0">Tổng cộng: <strong>{banners.length}</strong> banner | Đang hiển thị: <strong>{filtered.length}</strong></p>
      </div>
    </div>
  );
}
