'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

interface SanPham {
  id: string;
  tensp: string;
  thumbnail: string;
  danhmuc?: { tendm: string };
  thuonghieu?: { tenbrand: string };
  bienthe?: { gia: number }[];
  created_at: string;
  anhien: number;
}

export default function ProductAdminPage() {
  const [products, setProducts] = useState<SanPham[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // 🟢 Lấy danh sách sản phẩm
  useEffect(() => {
    fetch("http://localhost:5000/api/sanpham")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, []);

  // 🗑️ Xóa sản phẩm
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    const res = await fetch(`http://localhost:5000/api/sanpham/${id}`, { method: "DELETE" });
    if (res.ok) setProducts(products.filter((p) => p.id !== id));
  };

  // 🔍 Lọc theo tên
  const filtered = products.filter((p) =>
    p.tensp?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Danh sách sản phẩm</h2>
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ width: "250px" }}
          />
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push("/admin/products/create")}
          >
            <PlusCircle size={18} />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td className="text-center">{i + 1}</td>
                    <td className="text-center">
  <img
    src={
      p.thumbnail
        ? p.thumbnail.startsWith("http")
          ? p.thumbnail
          : `http://localhost:5000${p.thumbnail}`
        : "/no-image.png"
    }
    alt={p.tensp}
    className="img-thumbnail"
    style={{ width: "70px", height: "70px", objectFit: "cover" }}
  />
</td>

                    <td className="fw-semibold text-primary">{p.tensp}</td>
                    <td className="text-center">{p.danhmuc?.tendm || "-"}</td>
                    <td className="text-center">{p.thuonghieu?.tenbrand || "-"}</td>
                    <td className="text-center text-success fw-bold">
                    {p.bienthe?.length && p.bienthe[0].gia != null
  ? `${Number(p.bienthe[0].gia).toLocaleString("vi-VN")}₫`
  : "Liên hệ"}

                    </td>
                    <td className="text-center text-muted">
                      {new Date(p.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="text-center">
                      {p.anhien ? (
                        <span className="badge bg-success-subtle text-success px-3 py-2">Hiển thị</span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger px-3 py-2">Ẩn</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                          className="btn btn-warning btn-sm text-white"
                        >
                          <Pencil size={16} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted fst-italic">
                    Không có sản phẩm nào
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
