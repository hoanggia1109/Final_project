'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function CreateBrandPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: '',
    tenbrand: '',
    logo: null as File | null,
    thutu: '',
    anhien: 1,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('code', form.code);
      formData.append('tenbrand', form.tenbrand);
      formData.append('thutu', form.thutu || '0');
      formData.append('anhien', form.anhien.toString());
      if (form.logo) formData.append('logo', form.logo);
  
      const res = await fetch('http://localhost:5000/api/thuonghieu', {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('✅ Thêm thương hiệu thành công!');
        router.push('/admin/brand');
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi thêm thương hiệu!');
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
          padding: 2rem;
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
          max-width: 100%;
          height: auto;
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
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .help-card {
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          .form-container {
            padding: 1rem 0;
          }
          .form-header {
            padding: 1rem;
            margin-bottom: 1rem;
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          .form-header h2 {
            font-size: 1.5rem !important;
          }
          .form-header .btn {
            width: 100%;
          }
          .form-card {
            padding: 1.5rem;
            border-radius: 12px;
          }
          .row.g-4 {
            margin: 0;
          }
          .row.g-4 > * {
            padding: 0;
            margin-bottom: 1rem;
          }
          .image-upload-area {
            padding: 1.5rem;
          }
          .image-preview {
            max-width: 100%;
            height: auto;
          }
          .btn-submit {
            padding: 0.6rem 1.5rem;
            font-size: 0.9rem;
            width: 100%;
          }
          .d-flex.gap-2 {
            flex-direction: column;
          }
          .d-flex.gap-2 .btn {
            width: 100%;
            margin: 0 !important;
          }
          .col-lg-8 {
            padding: 0;
          }
          .col-lg-4 {
            margin-top: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .form-card {
            padding: 1rem;
          }
          .row.g-4 .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
      <div className="form-container">
        <div className="container">
          <div className="form-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Thêm Thương hiệu mới</h2>
              <p className="text-muted mb-0">Tạo thương hiệu mới cho cửa hàng</p>
            </div>
            <button
              onClick={() => router.back()}
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit} className="form-card" noValidate>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Mã thương hiệu <span className="text-danger">*</span></label>
                    <input name="code" value={form.code} onChange={handleChange} className="form-control" placeholder="VD: BR001" required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tên thương hiệu <span className="text-danger">*</span></label>
                    <input name="tenbrand" value={form.tenbrand} onChange={handleChange} className="form-control" placeholder="Nhập tên thương hiệu" required />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Logo thương hiệu</label>
                    <div className="image-upload-area">
                      {preview ? (
                        <div>
                          <img
                            src={preview}
                            alt="Preview"
                            className="image-preview mb-3"
                            style={{
                              maxWidth: '250px',
                              maxHeight: '250px',
                              objectFit: 'contain'
                            }}
                          />
                          <div>
                            <label htmlFor="file-upload" className="btn btn-sm btn-outline-primary">
                              <Upload size={14} className="me-1" />
                              Đổi logo
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload size={48} className="text-muted mb-3" />
                          <p className="text-muted mb-2">Kéo thả logo vào đây hoặc click để chọn</p>
                          <label htmlFor="file-upload" className="btn btn-sm btn-primary">
                            Chọn file
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
                    <small className="text-muted">Khuyến nghị: Logo PNG trong suốt, kích thước vuông (500x500px)</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Thứ tự hiển thị</label>
                    <input type="number" name="thutu" value={form.thutu} onChange={handleChange} className="form-control" placeholder="0" min="0" />
                    <small className="text-muted">Số càng nhỏ hiển thị càng trước</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Trạng thái</label>
                    <select name="anhien" value={form.anhien} onChange={handleChange} className="form-select">
                      <option value={1}>✓ Hiển thị</option>
                      <option value={0}>✗ Ẩn</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-end pt-4 mt-3 border-top">
                  <button type="button" onClick={() => router.back()} className="btn btn-light" disabled={saving}>
                    Hủy
                  </button>
                  <button type="submit" disabled={saving} className="btn-submit d-flex align-items-center gap-2">
                    <Save size={18} />
                    {saving ? 'Đang lưu...' : 'Lưu thương hiệu'}
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-4">
              <div className="form-card help-card">
                <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>💡 Hướng dẫn</h6>
                <ul className="small text-muted mb-0" style={{ lineHeight: '1.8' }}>
                  <li>Mã phải là duy nhất và không có khoảng trắng</li>
                  <li>Logo nên dùng PNG trong suốt hoặc SVG</li>
                  <li>Kích thước khuyến nghị: vuông (500x500px)</li>
                  <li>Thứ tự càng nhỏ hiển thị càng trước</li>
                  <li>Logo sẽ được tự động resize nếu cần</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
