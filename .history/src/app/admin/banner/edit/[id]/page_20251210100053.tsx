'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditBannerPage() {
  const router = useRouter();
  const { id } = useParams();

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/banner/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          tieude: data.tieude || '',
          mota: data.mota || '',
          url: data.url || '',
          thutu: data.thutu ?? 1,
          anhien: data.anhien ?? 1,
          linksp: data.linksp || ''
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

      const res = await fetch(`http://localhost:5000/api/banner/${id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật banner thành công!');
        router.push('/admin/banner');
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật banner!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="container py-5 text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

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
            margin: 0 1rem;
            max-width: 100% !important;
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
          .row.g-3 .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
        
        @media (max-width: 576px) {
          .form-card {
            padding: 1rem;
            margin: 0 0.5rem;
          }
        }
      `}</style>
      <div className="form-container">
        <div className="container">
          <div className="form-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Chỉnh sửa banner</h2>
              <p className="text-muted mb-0">Cập nhật thông tin banner</p>
            </div>
            <button onClick={() => router.back()} className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <ArrowLeft size={18} /> Quay lại
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-card mx-auto" style={{ maxWidth: '800px' }} noValidate>
            <div className="mb-4">
              <label className="form-label">Tiêu đề <span className="text-danger">*</span></label>
              <input name="tieude" value={form.tieude} onChange={handleChange} className="form-control" placeholder="Nhập tiêu đề banner" required />
            </div>

            <div className="mb-4">
              <label className="form-label">Mô tả</label>
              <textarea name="mota" value={form.mota} onChange={handleChange} className="form-control" rows={3} placeholder="Nhập mô tả banner" />
            </div>

            <div className="mb-4">
              <label className="form-label">Link sản phẩm</label>
              <input name="linksp" value={form.linksp} onChange={handleChange} className="form-control" placeholder="https://..." />
              <small className="text-muted">Link đến sản phẩm hoặc trang liên quan</small>
            </div>

            <div className="mb-4">
              <label className="form-label">Ảnh banner</label>
              <div className="image-upload-area">
                {preview ? (
                  <div>
                    <img src={preview} className="image-preview mb-3" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} alt="Preview" />
                    <div>
                      <label htmlFor="banner-upload-edit" className="btn btn-sm btn-outline-primary">
                        Đổi ảnh
                      </label>
                    </div>
                  </div>
                ) : form.url ? (
                  <div>
                    <img src={form.url} className="image-preview mb-3" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} alt="Current" />
                    <div>
                      <label htmlFor="banner-upload-edit" className="btn btn-sm btn-outline-primary">
                        Đổi ảnh
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
                    <label htmlFor="banner-upload-edit" className="btn btn-sm btn-primary">
                      Chọn file
                    </label>
                  </div>
                )}
                <input id="banner-upload-edit" type="file" accept="image/*" onChange={handleFileChange} className="d-none" />
              </div>
              <small className="text-muted">Khuyến nghị: 1920x640px hoặc tỷ lệ tương tự</small>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Thứ tự hiển thị</label>
                <input type="number" name="thutu" value={form.thutu} onChange={handleChange} className="form-control" min="1" />
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

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button type="button" onClick={() => router.back()} className="btn btn-light" disabled={saving}>
                Hủy
              </button>
              <button type="submit" disabled={saving} className="btn-submit d-flex align-items-center gap-2">
                <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
