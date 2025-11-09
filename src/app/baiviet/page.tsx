'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus } from 'lucide-react';

interface BaiViet {
  id: string;
  tieude: string;
  hinh_anh: string | null;
  anhien: number;
  created_at: string;
}

export default function ListBaiVietPage() {
  const router = useRouter();
  const [baiViets, setBaiViets] = useState<BaiViet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBaiViets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/baiviet');
      const data = await res.json();
      setBaiViets(data);
    } catch (err) {
      console.error('Lỗi lấy danh sách bài viết:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaiViets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/baiviet/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('✅ Xóa thành công!');
        fetchBaiViets();
      } else {
        alert('❌ Lỗi khi xóa bài viết');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi server!');
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Quản lý bài viết</h2>
        <button
          onClick={() => router.push('/baiviet/create')}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Plus size={18} /> Thêm bài viết
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-primary me-2" /> Đang tải dữ liệu...
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Tiêu đề</th>
                <th>Ảnh đại diện</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {baiViets.map((bv, index) => (
                <tr key={bv.id}>
                  <td>{index + 1}</td>
                  <td>{bv.tieude}</td>
                  <td>
                    {bv.hinh_anh ? (
                      <img
                        src={bv.hinh_anh}
                        alt="Ảnh đại diện"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <span className="text-muted fst-italic">Chưa có ảnh</span>
                    )}
                  </td>
                  <td>{bv.anhien ? 'Hiển thị' : 'Ẩn'}</td>
                  <td>{new Date(bv.created_at).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => router.push(`/baiviet/edit/${bv.id}`)}
                    >
                      <Edit size={16} /> Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(bv.id)}
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {baiViets.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-3">
                    Chưa có bài viết nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
