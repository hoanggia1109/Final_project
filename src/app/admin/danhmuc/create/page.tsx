'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function CreateDanhMucPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    code: '',
    tendm: '',
    mota: '',
    image: null as File | null,
    anhien: 1,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('code', form.code);
      formData.append('tendm', form.tendm);
      formData.append('mota', form.mota);
      formData.append('anhien', form.anhien.toString());
      if (form.image) formData.append('image', form.image);

      const res = await fetch('http://localhost:5001/api/danhmuc', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(' Thêm danh mục thành công!');
        router.push('/admin/danhmuc');
      } else {
        alert(' Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert(' Lỗi khi thêm danh mục!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Thêm Danh mục mới</h2>
          <p className="text-muted mb-0">Tạo danh mục sản phẩm mới</p>
        </div>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
      </div>

      {/* Form */}
      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit} className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Mã danh mục */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Mã danh mục <span className="text-danger">*</span>
                </label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="VD: DM001"
                  required
                />
                <small className="text-muted">Mã định danh duy nhất cho danh mục</small>
              </div>

              {/* Tên danh mục */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Tên danh mục <span className="text-danger">*</span>
                </label>
                <input
                  name="tendm"
                  value={form.tendm}
                  onChange={handleChange as React.ChangeEvent<HTMLInputElement>}
                  className="form-control"
                  placeholder="VD: Bàn ghế phòng khách"
                  required
                />
              </div>

              {/* Mô tả */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Mô tả</label>
                <textarea
                  name="mota"
                  value={form.mota}
                  onChange={handleChange as React.ChangeEvent<HTMLTextAreaElement>}
                  rows={4}
                  className="form-control"
                  placeholder="Nhập mô tả chi tiết về danh mục..."
                />
              </div>

              {/* Ảnh */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Ảnh danh mục</label>
                <div className="border border-2 border-dashed rounded p-4 text-center">
                  {preview ? (
                    <div>
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-thumbnail mb-3"
                        style={{
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <label htmlFor="file-upload" className="btn btn-sm btn-outline-primary">
                          <Upload size={14} className="me-1" />
                          Đổi ảnh
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="text-muted mb-3" />
                      <p className="text-muted mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
                      <label htmlFor="file-upload" className="btn btn-sm btn-primary">
                        Chọn ảnh
                      </label>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="d-none"
                  />
                </div>
                <small className="text-muted">Khuyến nghị: 500x500px, định dạng JPG/PNG</small>
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
                  <option value={1}>✓ Hiển thị</option>
                  <option value={0}>✗ Ẩn</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex gap-2 justify-content-end pt-3 border-top">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-light"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-warning text-white d-flex align-items-center gap-2"
                >
                  <Save size={18} />
                  {saving ? 'Đang lưu...' : 'Lưu danh mục'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">💡 Hướng dẫn</h6>
              <ul className="small text-muted mb-0" style={{ lineHeight: '1.8' }}>
                <li>Mã danh mục phải là duy nhất</li>
                <li>Tên danh mục nên ngắn gọn, dễ hiểu</li>
                <li>Ảnh đại diện giúp khách hàng dễ nhận diện</li>
                <li>Có thể ẩn danh mục tạm thời nếu chưa có sản phẩm</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

