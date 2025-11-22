'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditBaiViet() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    tieude: '',
    noidung: '',
    anhien: 1,
    user_id: '',
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/baiviet/users/all')
      .then(res => res.json())
      .then(data => setUsers(data));

    if (!id) return;
    fetch(`http://localhost:5001/api/baiviet/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          tieude: data.tieude,
          noidung: data.noidung,
          anhien: data.anhien,
          user_id: data.user_id,
        });
        setPreview(data.hinh_anh);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
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
      Object.entries(form).forEach(([k, v]) => formData.append(k, v as any));
      if (file) formData.append('hinh_anh', file);

      const res = await fetch(`http://localhost:5001/api/baiviet/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) router.push('/admin/baiviet');
      else {
        const data = await res.json();
        alert('Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật bài viết');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5 text-muted">Đang tải...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold text-uppercase m-0">Chỉnh sửa bài viết</h2>
        <button className="btn btn-outline-secondary" onClick={() => router.back()}>
          <ArrowLeft size={16} /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm p-4" style={{ maxWidth: '700px' }}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Tiêu đề</label>
          <input name="tieude" value={form.tieude} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Nội dung</label>
          <textarea name="noidung" value={form.noidung} onChange={handleChange} className="form-control" rows={6} />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
          {preview && <img src={preview} className="img-thumbnail mt-2" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Tác giả</label>
          <select name="user_id" value={form.user_id} onChange={handleChange} className="form-select" required>
            <option value="">Chọn tác giả</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Trạng thái</label>
          <select name="anhien" value={form.anhien} onChange={handleChange} className="form-select">
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary d-flex align-items-center gap-2" type="submit" disabled={saving}>
            <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
