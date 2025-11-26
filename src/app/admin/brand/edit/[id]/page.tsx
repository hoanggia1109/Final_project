'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';

interface Brand {
  id: string;
  code: string;
  tenbrand: string;
  logo: string;
  thutu: number;
  anhien: number;
}

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    code: '',
    tenbrand: '',
    logo: null as File | null,
    thutu: 0,
    anhien: 1,
  });
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    fetch(`http://localhost:5000/api/thuonghieu/${params.id}`)
      .then(res => res.json())
      .then((data: Brand) => {
        console.log('📦 Data từ API:', data);
        setForm({
          code: data.code || '',
          tenbrand: data.tenbrand || '',
          logo: null,
          thutu: data.thutu || 0,
          anhien: data.anhien || 1,
        });
        setCurrentLogo(data.logo);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải thương hiệu:', err);
        alert('❌ Lỗi khi tải thông tin thương hiệu!');
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
      formData.append('thutu', form.thutu.toString());
      formData.append('anhien', form.anhien.toString());
      if (form.logo) formData.append('logo', form.logo);

      const res = await fetch(`http://localhost:5000/api/thuonghieu/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật thương hiệu thành công!');
        router.push('/admin/brand');
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi cập nhật thương hiệu!');
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
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Cập nhật Thương hiệu</h2>
          <p className="text-muted mb-0">Chỉnh sửa thông tin thương hiệu</p>
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
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Mã thương hiệu <span className="text-danger">*</span></label>
                  <input name="code" value={form.code} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Tên thương hiệu <span className="text-danger">*</span></label>
                  <input name="tenbrand" value={form.tenbrand} onChange={handleChange} className="form-control" required />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Logo thương hiệu</label>
                  <div className="border border-2 border-dashed rounded p-4 text-center">
                    {preview ? (
                      <div>
                        <div className="mb-2">
                          <span className="badge bg-info text-white">Logo mới (chưa lưu)</span>
                        </div>
                        <img
                          src={preview}
                          alt="Preview"
                          className="img-thumbnail mb-3"
                          style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'contain',
                            padding: '10px'
                          }}
                        />
                        <div>
                          <label htmlFor="file-upload" className="btn btn-sm btn-outline-primary">
                            <Upload size={14} className="me-1" />
                            Đổi logo khác
                          </label>
                        </div>
                      </div>
                    ) : currentLogo ? (
                      <div>
                        <div className="mb-2">
                          <span className="badge bg-success text-white">Logo hiện tại</span>
                        </div>
                        <img
                          src={currentLogo}
                          alt="Current"
                          className="img-thumbnail mb-3"
                          style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'contain',
                            padding: '10px'
                          }}
                        />
                        <div>
                          <label htmlFor="file-upload" className="btn btn-sm btn-outline-primary">
                            <Upload size={14} className="me-1" />
                            Thay đổi logo
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload size={48} className="text-muted mb-3" />
                        <p className="text-muted mb-2">Chưa có logo - Click để upload</p>
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
                  <small className="text-muted">Khuyến nghị: Logo PNG trong suốt, kích thước vuông</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Thứ tự hiển thị</label>
                  <input type="number" name="thutu" value={form.thutu} onChange={handleChange} className="form-control" />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Trạng thái</label>
                  <select name="anhien" value={form.anhien} onChange={handleChange} className="form-select">
                    <option value={1}>✓ Hiển thị</option>
                    <option value={0}>✗ Ẩn</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end pt-4 mt-3 border-top">
                <button type="button" onClick={() => router.back()} className="btn btn-light" disabled={saving}>Hủy</button>
                <button type="submit" disabled={saving} className="btn btn-success d-flex align-items-center gap-2">
                  <Save size={18} />
                  {saving ? 'Đang lưu...' : 'Cập nhật thương hiệu'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-bold mb-3">📝 Thông tin</h6>
              <div className="small text-muted">
                <p className="mb-2"><strong>ID:</strong> <code>{params.id}</code></p>
                <p className="mb-2"><strong>Mã:</strong> <code>{form.code || 'Chưa có'}</code></p>
                <p className="mb-0"><strong>Trạng thái:</strong> {form.anhien === 1 ? 'Đang hiển thị' : 'Đang ẩn'}</p>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">💡 Lưu ý</h6>
              <ul className="small text-muted mb-0" style={{ lineHeight: '1.8' }}>
                <li>Thay đổi sẽ ảnh hưởng đến tất cả sản phẩm của thương hiệu</li>
                <li>Nếu thay logo mới, logo cũ sẽ bị xóa</li>
                <li>Nên dùng logo PNG trong suốt hoặc SVG</li>
                <li>Kích thước khuyến nghị: vuông (500x500px)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

