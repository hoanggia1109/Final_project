'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

export default function CreateBaiVietPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    tieude: '',
    noidung: '',
    anhien: 1,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('tieude', form.tieude);
      formData.append('noidung', form.noidung);
      formData.append('anhien', form.anhien.toString());
      if (avatar) formData.append('hinh_anh', avatar);

      const res = await fetch('http://localhost:5000/api/baiviet', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Tạo bài viết thành công!');
        router.push('/baiviet');
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi tạo bài viết!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Tạo bài viết</h2>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 mx-auto p-4"
        style={{ maxWidth: '700px' }}
      >
        {/* Tiêu đề */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Tiêu đề</label>
          <input
            name="tieude"
            value={form.tieude}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Nội dung */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nội dung</label>
          <textarea
            name="noidung"
            value={form.noidung}
            onChange={handleChange}
            rows={6}
            className="form-control"
            required
          />
        </div>

        {/* Ảnh đại diện */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
          <div className="mt-3 text-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="img-thumbnail"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
            ) : (
              <span className="text-muted fst-italic">Chưa có ảnh</span>
            )}
          </div>
        </div>

        {/* Trạng thái */}
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

        {/* Nút lưu */}
        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary d-flex align-items-center gap-2 px-4"
          >
            <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}
