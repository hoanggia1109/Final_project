'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Upload, MapPin, Clock, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api-config';

export default function EditChiNhanhPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    tenchinhanh: '',
    diachi: '',
    quan: '',
    thanhpho: '',
    sdt: '',
    email: '',
    giomocua: '08:00',
    giodongcua: '21:00',
    giomocua_cn: '09:00',
    giodongcua_cn: '20:00',
    mapurl: '',
    thutu: '0',
    anhien: 1,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadChiNhanh();
  }, [id]);

  const loadChiNhanh = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chinhanh/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          tenchinhanh: data.tenchinhanh || '',
          diachi: data.diachi || '',
          quan: data.quan || '',
          thanhpho: data.thanhpho || '',
          sdt: data.sdt || '',
          email: data.email || '',
          giomocua: data.giomocua || '08:00',
          giodongcua: data.giodongcua || '21:00',
          giomocua_cn: data.giomocua_cn || '09:00',
          giodongcua_cn: data.giodongcua_cn || '20:00',
          mapurl: data.mapurl || '',
          thutu: data.thutu?.toString() || '0',
          anhien: data.anhien ?? 1,
        });
        if (data.hinhanh) {
          setCurrentImage(data.hinhanh);
          setPreview(data.hinhanh);
        }
      } else {
        alert('Không tìm thấy chi nhánh!');
        router.push('/admin/chinhanh');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải thông tin chi nhánh!');
      router.push('/admin/chinhanh');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.tenchinhanh.trim()) newErrors.tenchinhanh = 'Tên chi nhánh là bắt buộc';
    if (!form.diachi.trim()) newErrors.diachi = 'Địa chỉ là bắt buộc';
    if (!form.quan.trim()) newErrors.quan = 'Quận/Huyện là bắt buộc';
    if (!form.thanhpho.trim()) newErrors.thanhpho = 'Thành phố là bắt buộc';
    if (!form.sdt.trim()) newErrors.sdt = 'Số điện thoại là bắt buộc';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('tenchinhanh', form.tenchinhanh);
      formData.append('diachi', form.diachi);
      formData.append('quan', form.quan);
      formData.append('thanhpho', form.thanhpho);
      formData.append('sdt', form.sdt);
      formData.append('email', form.email || '');
      formData.append('giomocua', form.giomocua);
      formData.append('giodongcua', form.giodongcua);
      formData.append('giomocua_cn', form.giomocua_cn);
      formData.append('giodongcua_cn', form.giodongcua_cn);
      formData.append('mapurl', form.mapurl || '');
      formData.append('thutu', form.thutu || '0');
      formData.append('anhien', form.anhien.toString());
      if (imageFile) formData.append('hinhanh', imageFile);

      const res = await fetch(`${API_BASE_URL}/api/chinhanh/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật chi nhánh thành công!');
        router.push('/admin/chinhanh');
      } else {
        alert('❌ Lỗi: ' + (data.message || 'Không thể cập nhật chi nhánh'));
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi cập nhật chi nhánh!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Đang tải...</span>
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
        .form-control.is-invalid {
          border-color: #dc3545;
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
      `}</style>

      <div className="form-container">
        <div className="container">
          {/* Header */}
          <div className="form-header">
            <div className="d-flex align-items-center gap-3 mb-3">
              <button
                onClick={() => router.back()}
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>
              <div>
                <h3 className="fw-bold mb-0" style={{ color: '#2C3E50' }}>Sửa Chi nhánh</h3>
                <p className="text-muted mb-0 small">Cập nhật thông tin chi nhánh</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-lg-8">
                <div className="form-card">
                  {/* Basic Info */}
                  <h5 className="fw-bold mb-4" style={{ color: '#2C3E50' }}>
                    <MapPin className="d-inline me-2" size={20} />
                    Thông tin cơ bản
                  </h5>

                  <div className="mb-3">
                    <label className="form-label">Tên chi nhánh <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="tenchinhanh"
                      value={form.tenchinhanh}
                      onChange={handleChange}
                      className={`form-control ${errors.tenchinhanh ? 'is-invalid' : ''}`}
                      placeholder="VD: DANNYdecor - Showroom Quận 1"
                    />
                    {errors.tenchinhanh && <div className="text-danger small mt-1">{errors.tenchinhanh}</div>}
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Thành phố <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="thanhpho"
                        value={form.thanhpho}
                        onChange={handleChange}
                        className={`form-control ${errors.thanhpho ? 'is-invalid' : ''}`}
                        placeholder="VD: TP. Hồ Chí Minh"
                      />
                      {errors.thanhpho && <div className="text-danger small mt-1">{errors.thanhpho}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Quận/Huyện <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="quan"
                        value={form.quan}
                        onChange={handleChange}
                        className={`form-control ${errors.quan ? 'is-invalid' : ''}`}
                        placeholder="VD: Quận 1"
                      />
                      {errors.quan && <div className="text-danger small mt-1">{errors.quan}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Địa chỉ chi tiết <span className="text-danger">*</span></label>
                    <textarea
                      name="diachi"
                      value={form.diachi}
                      onChange={handleChange}
                      className={`form-control ${errors.diachi ? 'is-invalid' : ''}`}
                      rows={2}
                      placeholder="VD: 123 Đường Nguyễn Huệ, Phường Bến Nghé"
                    />
                    {errors.diachi && <div className="text-danger small mt-1">{errors.diachi}</div>}
                  </div>

                  {/* Contact Info */}
                  <h5 className="fw-bold mb-4 mt-4" style={{ color: '#2C3E50' }}>
                    <Phone className="d-inline me-2" size={20} />
                    Thông tin liên hệ
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                      <input
                        type="tel"
                        name="sdt"
                        value={form.sdt}
                        onChange={handleChange}
                        className={`form-control ${errors.sdt ? 'is-invalid' : ''}`}
                        placeholder="VD: 0909 123 456"
                      />
                      {errors.sdt && <div className="text-danger small mt-1">{errors.sdt}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="VD: quan1@dannydecor.com"
                      />
                      {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <h5 className="fw-bold mb-4 mt-4" style={{ color: '#2C3E50' }}>
                    <Clock className="d-inline me-2" size={20} />
                    Giờ mở cửa
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Thứ 2 - Thứ 6</label>
                      <div className="row g-2">
                        <div className="col-6">
                          <input
                            type="time"
                            name="giomocua"
                            value={form.giomocua}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="time"
                            name="giodongcua"
                            value={form.giodongcua}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Thứ 7 - Chủ nhật</label>
                      <div className="row g-2">
                        <div className="col-6">
                          <input
                            type="time"
                            name="giomocua_cn"
                            value={form.giomocua_cn}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="time"
                            name="giodongcua_cn"
                            value={form.giodongcua_cn}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 mt-3">
                    <label className="form-label">URL Google Maps</label>
                    <input
                      type="url"
                      name="mapurl"
                      value={form.mapurl}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <small className="text-muted">Dán URL embed từ Google Maps</small>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                {/* Image Upload */}
                <div className="form-card mb-4">
                  <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Hình ảnh</h5>
                  <div className="image-upload-area">
                    {preview ? (
                      <div className="position-relative">
                        <Image
                          src={preview}
                          alt="Preview"
                          width={300}
                          height={200}
                          className="image-preview mb-3"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(currentImage);
                              setImageFile(null);
                            }}
                            className="btn btn-sm btn-outline-secondary flex-fill"
                          >
                            Khôi phục
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setImageFile(null);
                              setCurrentImage(null);
                            }}
                            className="btn btn-sm btn-outline-danger flex-fill"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload size={48} className="text-muted mb-3" />
                        <p className="text-muted mb-3">Chọn hình ảnh chi nhánh</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="d-none"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="btn btn-warning text-white"
                        >
                          Chọn ảnh
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Settings */}
                <div className="form-card">
                  <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Cài đặt</h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      name="thutu"
                      value={form.thutu}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
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

                  <button
                    type="submit"
                    className="btn btn-submit w-100 d-flex align-items-center justify-content-center gap-2"
                    disabled={saving}
                  >
                    <Save size={18} />
                    {saving ? 'Đang lưu...' : 'Cập nhật chi nhánh'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

