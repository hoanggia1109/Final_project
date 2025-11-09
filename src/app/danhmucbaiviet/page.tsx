'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

interface DanhMuc {
  id: string;
  tendanhmuc: string;
  mota: string;
  anhien: number;
  created_at: string;
  updated_at: string;
}

export default function DanhMucPage() {
  const [list, setList] = useState<DanhMuc[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/danhmucbaiviet")
      .then((res) => res.json())
      .then((data) => setList(data))
      .catch((err) => console.error("Lỗi lấy danh sách danh mục:", err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/danhmucbaiviet/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setList(list.filter((l) => l.id !== id));
        alert("Đã xóa thành công!");
      } else alert("Xóa thất bại!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa danh mục!");
    }
  };

  const filtered = list.filter(
    (l) => l.tendanhmuc.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold">Danh sách danh mục bài viết</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            className="form-control"
            style={{ width: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => router.push("/danhmucbaiviet/create")}
          >
            <PlusCircle size={18} /> Thêm mới
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
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((dm, idx) => (
                  <tr key={dm.id}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{dm.tendanhmuc}</td>
                    <td>{dm.mota}</td>
                    <td className="text-center">
                      {dm.anhien === 1 ? (
                        <span className="badge bg-success">Hiển thị</span>
                      ) : (
                        <span className="badge bg-secondary">Ẩn</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => router.push(`/danhmucbaiviet/edit/${dm.id}`)}
                          className="btn btn-warning btn-sm text-white d-flex align-items-center gap-1"
                        >
                          <Pencil size={16} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(dm.id)}
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
                  <td colSpan={5} className="text-center text-muted py-4">
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
