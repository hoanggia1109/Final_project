'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateBannerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    tieude: '',
    mota: '',
    url: '',
    thutu: 1,
    anhien: 1,
    linksp: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: any) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('tieude', form.tieude);
      formData.append('mota', form.mota);
      formData.append('thutu', form.thutu.toString());
      formData.append('anhien', form.anhien.toString());
      formData.append('linksp', form.linksp);
      if (file) formData.append('url', file);

      const res = await fetch('http://localhost:5000/api/banner', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('✅ Tạo banner thành công!');
        router.push('/admin/banner');
      } else {
        const data = await res.json();
        alert(' Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tạo banner!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Tạo banner mới</h2>
        <button onClick={() => router.back()} className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 700 }}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Tiêu đề</label>
          <input name="tieude" value={form.tieude} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Mô tả</label>
          <textarea name="mota" value={form.mota} onChange={handleChange} className="form-control" rows={3} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Link sản phẩm</label>
          <input name="linksp" value={form.linksp} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Ảnh banner</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
          {preview && (
            <div className="mt-3 text-center">
              <img src={preview} className="img-thumbnail" style={{ width: 120, height: 120, objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Thứ tự</label>
          <input type="number" name="thutu" value={form.thutu} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Trạng thái</label>
          <select name="anhien" value={form.anhien} onChange={handleChange} className="form-select">
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" disabled={saving} className="btn btn-primary d-flex align-items-center gap-2 px-4">
            <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}
