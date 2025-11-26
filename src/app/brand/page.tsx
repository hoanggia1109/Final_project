'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

interface Brand {
  id: string;
  tenbrand: string;
  logo: string;
  thutu: number;
  anhien: number;
  created_at: string;
  updated_at: string;
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/thuonghieu")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Lỗi khi tải thương hiệu:", err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thương hiệu này không?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/thuonghieu/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBrands(brands.filter((b) => b.id !== id));
        alert("Đã xóa thành công!");
      } else alert("Xóa thất bại!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa thương hiệu!");
    }
  };

  const filtered = brands.filter(
    (b) =>
      b.tenbrand &&
      b.tenbrand.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">
          Danh sách thương hiệu
        </h2>

        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ width: "250px" }}
          />

          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push("/brand/create")}
          >
            <PlusCircle size={18} />
            <span>Tạo thương hiệu</span>
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Tên thương hiệu</th>
                <th>Logo</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((b, index) => (
                  <tr key={b.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="fw-semibold text-primary">{b.tenbrand}</td>
                    <td className="text-center">
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt={b.tenbrand}
                          className="img-thumbnail"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <span className="text-muted fst-italic">
                          Chưa có logo
                        </span>
                      )}
                    </td>
                    <td className="text-center">{b.thutu ?? "-"}</td>
                    <td className="text-center">
                      {b.anhien === 1 ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => router.push(`/brand/edit/${b.id}`)}
                          className="btn btn-warning btn-sm d-flex align-items-center gap-1 text-white"
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
                  <td
                    colSpan={6}
                    className="text-center text-muted py-4 fst-italic"
                  >
                    Không có thương hiệu nào
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
