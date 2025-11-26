'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

interface DanhMuc {
  id: string;
  code: string;
  tendm: string;
  mota: string;
  image: string | null;
  anhien: number;
}

export default function EditDanhMucPage() {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    code: '',
    tendm: '',
    mota: '',
    image: null as File | null,
    anhien: 1,
  });

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu danh mục
  useEffect(() => {
    if (!params.id) return;
    
    fetch(`http://localhost:5000/api/danhmuc/${params.id}`)
      .then(res => res.json())
      .then((data: DanhMuc) => {
        setForm({
          code: data.code || '',
          tendm: data.tendm || '',
          mota: data.mota || '',
          image: null,
          anhien: data.anhien || 1,
        });
        setCurrentImage(data.image);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh mục:', err);
        alert('Lỗi khi tải thông tin danh mục!');
        setLoading(false);
      });
  }, [params.id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('code', form.code);
      formData.append('tendm', form.tendm);
      formData.append('mota', form.mota);
      formData.append('anhien', form.anhien.toString());
      if (form.image) formData.append('image', form.image);

      const res = await fetch(`http://localhost:5000/api/danhmuc/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật danh mục thành công!');
        router.push('/danhmuc');
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi cập nhật danh mục!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Cập nhật danh mục</h2>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 mx-auto p-4"
        style={{ maxWidth: '700px' }}
      >
        {/* Mã danh mục */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Mã danh mục</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Tên danh mục */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Tên danh mục</label>
          <input
            name="tendm"
            value={form.tendm}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Mô tả */}
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

        {/* Ảnh */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Ảnh danh mục</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
          <div className="mt-3 text-center">
            {preview ? (
              <div>
                <p className="text-muted small mb-2">Ảnh mới (chưa lưu)</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ) : currentImage ? (
              <div>
                <p className="text-muted small mb-2">Ảnh hiện tại</p>
                <img
                  src={currentImage}
                  alt="Current"
                  className="img-thumbnail"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ) : (
              <p className="text-muted fst-italic">Chưa có ảnh</p>
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
        <div className="d-flex justify-content-end align-items-center mt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-success d-flex align-items-center gap-2 px-4"
          >
            <Save size={18} />
            {saving ? 'Đang lưu...' : 'Cập nhật danh mục'}
          </button>
        </div>
      </form>
    </div>
  );
}
