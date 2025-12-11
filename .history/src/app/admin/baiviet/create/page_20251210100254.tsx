'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { validateRequired, validateMinLength, validateMaxLength, ValidationMessages } from '../../../utils/validation';

interface DanhMuc {
  id: string;
  tendanhmuc: string;
}

interface User {
  id: string;
  ho_ten: string;
}

export default function CreateBaiVietPage() {
  const router = useRouter();

  const [tieude, setTieude] = useState('');
  const [noidung, setNoidung] = useState('');
  const [anhien, setAnhien] = useState(1);
  const [selectedDanhMuc, setSelectedDanhMuc] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [hinhAnhFile, setHinhAnhFile] = useState<File | null>(null);

  const [danhmucs, setDanhmucs] = useState<DanhMuc[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch danh mục
  useEffect(() => {
    fetch('http://localhost:5002/api/baiviet/danhmuc/all')
      .then(res => res.json())
      .then(data => setDanhmucs(data))
      .catch(err => console.error('Lỗi lấy danh mục:', err));
  }, []);

  // Fetch user
  useEffect(() => {
    fetch('http://localhost:5000/api/baiviet/users/all')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Lỗi lấy users:', err));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate tieude
    if (!validateRequired(tieude)) {
      newErrors.tieude = ValidationMessages.required('tiêu đề');
    } else if (!validateMinLength(tieude, 10)) {
      newErrors.tieude = ValidationMessages.minLength('Tiêu đề', 10);
    } else if (!validateMaxLength(tieude, 200)) {
      newErrors.tieude = ValidationMessages.maxLength('Tiêu đề', 200);
    }

    // Validate noidung
    if (!validateRequired(noidung)) {
      newErrors.noidung = ValidationMessages.required('nội dung');
    } else if (!validateMinLength(noidung, 50)) {
      newErrors.noidung = ValidationMessages.minLength('Nội dung', 50);
    }

    // Validate danhmuc
    if (!validateRequired(selectedDanhMuc)) {
      newErrors.danhmuc = ValidationMessages.required('danh mục');
    }

    // Validate user
    if (!validateRequired(selectedUser)) {
      newErrors.user = ValidationMessages.required('tác giả');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('tieude', tieude);
    formData.append('noidung', noidung);
    formData.append('anhien', String(anhien));
    formData.append('danhmuc_baiviet_id', selectedDanhMuc);
    formData.append('user_id', selectedUser);
    if (hinhAnhFile) formData.append('hinh_anh', hinhAnhFile);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/baiviet', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        alert('✅ Thêm bài viết thành công!');
        router.push('/admin/baiviet');
      } else {
        alert('❌ Thêm thất bại: ' + data.message);
      }
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      alert('❌ Thêm thất bại: ' + err.message);
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
        textarea.form-control {
          min-height: 150px;
          resize: vertical;
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
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Tạo bài viết mới</h2>
              <p className="text-muted mb-0">Thêm bài viết mới cho website</p>
            </div>
            <button onClick={() => router.back()} className="btn btn-outline-secondary d-flex align-items-center gap-2">
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
                type="text"
                className="form-control"
                value={tieude}
                onChange={e => {
                  setTieude(e.target.value);
                  if (errors.tieude) setErrors({ ...errors, tieude: '' });
                }}
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
                className="form-control"
                rows={8}
                value={noidung}
                onChange={e => {
                  setNoidung(e.target.value);
                  if (errors.noidung) setErrors({ ...errors, noidung: '' });
                }}
                placeholder="Nhập nội dung bài viết..."
                required
                style={{ borderColor: errors.noidung ? '#dc3545' : undefined }}
              ></textarea>
              {errors.noidung && (
                <small className="text-danger d-block mt-1">{errors.noidung}</small>
              )}
              <small className="text-muted">Tối thiểu 50 ký tự</small>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Danh mục <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={selectedDanhMuc}
                  onChange={e => {
                    setSelectedDanhMuc(e.target.value);
                    if (errors.danhmuc) setErrors({ ...errors, danhmuc: '' });
                  }}
                  required
                  style={{ borderColor: errors.danhmuc ? '#dc3545' : undefined }}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {danhmucs.map(dm => (
                    <option key={dm.id} value={dm.id}>
                      {dm.tendanhmuc}
                    </option>
                  ))}
                </select>
                {errors.danhmuc && (
                  <small className="text-danger d-block mt-1">{errors.danhmuc}</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Tác giả <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={selectedUser}
                  onChange={e => {
                    setSelectedUser(e.target.value);
                    if (errors.user) setErrors({ ...errors, user: '' });
                  }}
                  required
                  style={{ borderColor: errors.user ? '#dc3545' : undefined }}
                >
                  <option value="">-- Chọn tác giả --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.ho_ten}
                    </option>
                  ))}
                </select>
                {errors.user && (
                  <small className="text-danger d-block mt-1">{errors.user}</small>
                )}
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Ảnh đại diện</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={e => setHinhAnhFile(e.target.files ? e.target.files[0] : null)}
                />
                <small className="text-muted">Khuyến nghị: 1200x630px</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={anhien}
                  onChange={e => setAnhien(Number(e.target.value))}
                >
                  <option value={1}>✓ Hiển thị</option>
                  <option value={0}>✗ Ẩn</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button type="button" onClick={() => router.back()} className="btn btn-light" disabled={loading}>
                Hủy
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Đang thêm...' : 'Thêm bài viết'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
