'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

interface Banner {
  id: string;
  tieude: string;
  mota: string;
  url: string;
  thutu: number;
  anhien: number;
  linksp: string;
  created_at: string;
  updated_at: string;
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/banner')
      .then(res => res.json())
      .then(data => setBanners(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa banner này không?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/banner/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(banners.filter(b => b.id !== id));
        alert('Đã xóa thành công!');
      } else alert('Xóa thất bại!');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa banner!');
    }
  };

  const filtered = banners.filter(b =>
    b.tieude.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Danh sách Banner</h2>
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm banner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
            style={{ width: '250px' }}
          />
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push('/banner/create')}
          >
            <PlusCircle size={18} /> Tạo Banner
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Ảnh</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Link</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((b, idx) => (
                  <tr key={b.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold text-primary">{b.tieude}</td>
                    <td>
                      {b.url ? (
                        <img
                          src={b.url}
                          alt={b.tieude}
                          className="img-thumbnail"
                          style={{ width: 80, height: 80, objectFit: 'cover' }}
                        />
                      ) : (
                        <span className="text-muted fst-italic">Chưa có ảnh</span>
                      )}
                    </td>
                    <td>{b.thutu ?? '-'}</td>
                    <td>
                      {b.anhien === 1 ? (
                        <span className="badge bg-success-subtle text-success px-3 py-2">Hiển thị</span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger px-3 py-2">Ẩn</span>
                      )}
                    </td>
                    <td>{b.linksp || '-'}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => router.push(`/banner/edit/${b.id}`)}
                          className="btn btn-warning btn-sm text-white d-flex align-items-center gap-1"
                        >
                          <Pencil size={16} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted fst-italic">
                    Không có banner nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
