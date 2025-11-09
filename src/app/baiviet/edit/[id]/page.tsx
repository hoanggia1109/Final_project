'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditBaiVietPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    tieude: '',
    noidung: '',
    anhien: 1,
    hinh_anh: '',
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy chi tiết bài viết
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/baiviet/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          tieude: data.tieude || '',
          noidung: data.noidung || '',
          anhien: data.anhien ?? 1,
          hinh_anh: data.hinh_anh || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
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
      if (newAvatar) formData.append('hinh_anh', newAvatar);

      const res = await fetch(`http://localhost:5000/api/baiviet/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật bài viết thành công!');
        router.push('/baiviet');
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi cập nhật bài viết!');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border text-primary me-2" />
        Đang tải bài viết...
      </div>
    );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Chỉnh sửa bài viết</h2>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 mx-auto p-4"
        style={{ maxWidth: '700px' }}
      >
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
            ) : form.hinh_anh ? (
              <img
                src={form.hinh_anh}
                alt="Ảnh cũ"
                className="img-thumbnail"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
            ) : (
              <span className="text-muted fst-italic">Chưa có ảnh</span>
            )}
          </div>
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
