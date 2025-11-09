'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

export default function EditDanhMucPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ tendanhmuc: "", mota: "", anhien: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/danhmucbaiviet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          tendanhmuc: data.tendanhmuc || "",
          mota: data.mota || "",
          anhien: data.anhien ?? 1,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/danhmucbaiviet/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Cập nhật danh mục thành công!");
        router.push("/danhmucbaiviet");
      } else {
        const data = await res.json();
        alert("❌ Lỗi: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật danh mục!");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="container py-5 text-center text-muted">
        Đang tải dữ liệu danh mục...
      </div>
    );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold m-0">Chỉnh sửa danh mục bài viết</h2>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 mx-auto p-4"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Tên danh mục</label>
          <input
            name="tendanhmuc"
            value={form.tendanhmuc}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Mô tả</label>
          <textarea
            name="mota"
            value={form.mota}
            onChange={handleChange}
            rows={4}
            className="form-control"
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Trạng thái</label>
          <select
            name="anhien"
            value={form.anhien}
            onChange={handleChange}
            className="form-select"
          >
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary d-flex align-items-center gap-2 px-4"
          >
            <Save size={18} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
