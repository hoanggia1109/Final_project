'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { validateRequired, validateMinLength, validateMaxLength, ValidationMessages } from '../../../../utils/validation';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:5000/api/baiviet/users/all')
      .then(res => res.json())
      .then(data => setUsers(data));

    if (!id) return;
    fetch(`http://localhost:5000/api/baiviet/${id}`)
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleFileChange = (e: any) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate tieude
    if (!validateRequired(form.tieude)) {
      newErrors.tieude = ValidationMessages.required('tiêu đề');
    } else if (!validateMinLength(form.tieude, 10)) {
      newErrors.tieude = ValidationMessages.minLength('Tiêu đề', 10);
    } else if (!validateMaxLength(form.tieude, 200)) {
      newErrors.tieude = ValidationMessages.maxLength('Tiêu đề', 200);
    }

    // Validate noidung
    if (!validateRequired(form.noidung)) {
      newErrors.noidung = ValidationMessages.required('nội dung');
    } else if (!validateMinLength(form.noidung, 50)) {
      newErrors.noidung = ValidationMessages.minLength('Nội dung', 50);
    }

    // Validate user_id
    if (!validateRequired(form.user_id)) {
      newErrors.user_id = ValidationMessages.required('tác giả');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v as any));
      if (file) formData.append('hinh_anh', file);

      const res = await fetch(`http://localhost:5000/api/baiviet/${id}`, {
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

  if (loading) {
    return (
      <div className="form-container">
        <div className="container text-center py-5">
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
        textarea.form-control {
          min-height: 200px;
          resize: vertical;
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
          .form-header {
            padding: 1rem;
          }
          .form-card {
            padding: 1.5rem;
          }
        }
      `}</style>
      <div className="form-container">
        <div className="container">
          <div className="form-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Chỉnh sửa bài viết</h2>
              <p className="text-muted mb-0">Cập nhật thông tin bài viết</p>
            </div>
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => router.back()}>
              <ArrowLeft size={18} /> Quay lại
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-card mx-auto" style={{ maxWidth: '900px' }} noValidate>
            {/* Thông báo lỗi tổng hợp */}
            {Object.keys(errors).length > 0 && (
              <div className="alert alert-danger d-flex align-items-start mb-4" role="alert" style={{ borderRadius: '12px' }}>
                <i className="bi bi-exclamation-triangle-fill me-2 mt-1" style={{ fontSize: '1.2rem' }}></i>
                <div>
                  <strong>Vui lòng kiểm tra lại thông tin:</strong>
                  <ul className="mb-0 mt-2" style={{ paddingLeft: '20px' }}>
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="form-label">Tiêu đề <span className="text-danger">*</span></label>
              <input 
                name="tieude" 
                value={form.tieude} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Nhập tiêu đề bài viết" 
                required
                style={{ borderColor: errors.tieude ? '#dc3545' : undefined }}
              />
              {errors.tieude && (
                <small className="text-danger d-block mt-1">{errors.tieude}</small>
              )}
              <small className="text-muted">Tối thiểu 10 ký tự, tối đa 200 ký tự</small>
            </div>

            <div className="mb-4">
              <label className="form-label">Nội dung <span className="text-danger">*</span></label>
              <textarea 
                name="noidung" 
                value={form.noidung} 
                onChange={handleChange} 
                className="form-control" 
                rows={10} 
                placeholder="Nhập nội dung bài viết..." 
                required
                style={{ borderColor: errors.noidung ? '#dc3545' : undefined }}
              />
              {errors.noidung && (
                <small className="text-danger d-block mt-1">{errors.noidung}</small>
              )}
              <small className="text-muted">Tối thiểu 50 ký tự</small>
            </div>

            <div className="mb-4">
              <label className="form-label">Ảnh đại diện</label>
              <div className="image-upload-area">
                {preview ? (
                  <div>
                    <img src={preview} className="image-preview mb-3" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} alt="Preview" />
                    <div>
                      <label htmlFor="article-image-edit" className="btn btn-sm btn-outline-primary">
                        Đổi ảnh
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
                    <label htmlFor="article-image-edit" className="btn btn-sm btn-primary">
                      Chọn file
                    </label>
                  </div>
                )}
                <input id="article-image-edit" type="file" accept="image/*" onChange={handleFileChange} className="d-none" />
              </div>
              <small className="text-muted">Khuyến nghị: 1200x630px</small>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Tác giả <span className="text-danger">*</span></label>
                <select 
                  name="user_id" 
                  value={form.user_id} 
                  onChange={handleChange} 
                  className="form-select" 
                  required
                  style={{ borderColor: errors.user_id ? '#dc3545' : undefined }}
                >
                  <option value="">-- Chọn tác giả --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.ho_ten}</option>
                  ))}
                </select>
                {errors.user_id && (
                  <small className="text-danger d-block mt-1">{errors.user_id}</small>
                )}
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
              <button className="btn-submit d-flex align-items-center gap-2" type="submit" disabled={saving}>
                <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
