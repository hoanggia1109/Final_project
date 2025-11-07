'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

interface DanhMuc {
  id: string;
  code: string;
  tendm: string;
  image: string | null;
  mota: string | null;
  anhien: number;
}

export default function DanhMucPage() {
  const [list, setList] = useState<DanhMuc[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/danhmuc')
      .then(res => res.json())
      .then(data => setList(data))
      .catch(err => console.error('Lỗi khi tải danh mục:', err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này không?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/danhmuc/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(list.filter(item => item.id !== id));
        alert('✅ Xóa thành công!');
      } else alert('❌ Xóa thất bại!');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa danh mục!');
    }
  };

  const filtered = list.filter(
    item => item.tendm?.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Danh sách danh mục</h2>

        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm danh mục..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
            style={{ width: '250px' }}
          />

          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push('/danhmuc/create')}
          >
            <PlusCircle size={18} />
            <span>Thêm danh mục</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Tên danh mục</th>
                <th>Ảnh</th>
                <th>Mã</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="fw-semibold text-primary">{item.tendm}</td>
                    <td className="text-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.tendm}
                          className="img-thumbnail"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      ) : (
                        <span className="text-muted fst-italic">Chưa có ảnh</span>
                      )}
                    </td>
                    <td className="text-center">{item.code}</td>
                    <td className="text-center">
                      {item.anhien === 1 ? (
                        <span className="badge bg-success-subtle text-success border px-3 py-2">Hiển thị</span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border px-3 py-2">Ẩn</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => router.push(`/danhmuc/edit/${item.id}`)}
                          className="btn btn-warning btn-sm d-flex align-items-center gap-1 text-white"
                        >
                          <Pencil size={16} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                  <td colSpan={6} className="text-center text-muted py-4 fst-italic">
                    Không có danh mục nào
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
