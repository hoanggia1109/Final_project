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

      const res = await fetch('http://localhost:5000/api/danhmuc', {
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
    <>
      <style jsx>{`
        .form-container {
          background: linear-gradient(135deg, #FFF9F0 0%, #ffffff 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }
        .form-header {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .form-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: none;
        }
        .form-label {
          color: #2C3E50;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .form-control, .form-select {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }
        .form-control:focus, .form-select:focus {
          border-color: #FFC107;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
          outline: none;
        }
        .form-control:hover, .form-select:hover {
          border-color: #d0d0d0;
        }
        .btn-submit {
          background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
          border: none;
          color: #fff;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }
        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4);
        }
        .image-upload-area {
          border: 2px dashed #d0d0d0;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: #fafafa;
        }
        .image-upload-area:hover {
          border-color: #FFC107;
          background: #fffbf0;
        }
        .image-preview {
          border-radius: 12px;
          border: 2px solid #e0e0e0;
          padding: 0.5rem;
          background: #fafafa;
        }
        @media (max-width: 768px) {
          .form-header {
            padding: 1rem;
          }
        }
      `}</style>
      <div className="form-container">
        <div className="container">
          {/* Header */}
          <div className="form-header d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Thêm Danh mục mới</h2>
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
              <form onSubmit={handleSubmit} className="form-card">
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
                    <label className="form-label">Ảnh danh mục</label>
                    <div className="image-upload-area">
                      {preview ? (
                        <div>
                          <img
                            src={preview}
                            alt="Preview"
                            className="image-preview mb-3"
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
                  <div className="d-flex gap-3 justify-content-end pt-4 mt-3 border-top">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="btn btn-outline-secondary"
                      disabled={saving}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-submit d-flex align-items-center gap-2"
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
              <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
                <div className="card-body">
                  <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>💡 Hướng dẫn</h6>
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
      </div>
    </>
  );
}

