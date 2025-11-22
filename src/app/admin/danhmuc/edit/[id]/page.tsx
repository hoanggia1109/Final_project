'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';

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
    
    fetch(`http://localhost:5001/api/danhmuc/${params.id}`)
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
        alert('❌ Lỗi khi tải thông tin danh mục!');
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

      const res = await fetch(`http://localhost:5001/api/danhmuc/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật danh mục thành công!');
        router.push('/admin/danhmuc');
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
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Cập nhật Danh mục</h2>
          <p className="text-muted mb-0">Chỉnh sửa thông tin danh mục</p>
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
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Mô tả */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Mô tả</label>
                <textarea
                  name="mota"
                  value={form.mota}
                  onChange={handleChange}
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
                      <div className="mb-2">
                        <span className="badge bg-info text-white">Ảnh mới (chưa lưu)</span>
                      </div>
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
                          Đổi ảnh khác
                        </label>
                      </div>
                    </div>
                  ) : currentImage ? (
                    <div>
                      <div className="mb-2">
                        <span className="badge bg-success text-white">Ảnh hiện tại</span>
                      </div>
                      <img
                        src={currentImage}
                        alt="Current"
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
                          Thay đổi ảnh
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="text-muted mb-3" />
                      <p className="text-muted mb-2">Chưa có ảnh - Click để upload</p>
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
                  className="btn btn-success d-flex align-items-center gap-2"
                >
                  <Save size={18} />
                  {saving ? 'Đang lưu...' : 'Cập nhật danh mục'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-bold mb-3">📝 Thông tin</h6>
              <div className="small text-muted">
                <p className="mb-2"><strong>ID:</strong> <code>{params.id}</code></p>
                <p className="mb-0"><strong>Trạng thái:</strong> {form.anhien === 1 ? 'Đang hiển thị' : 'Đang ẩn'}</p>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">💡 Lưu ý</h6>
              <ul className="small text-muted mb-0" style={{ lineHeight: '1.8' }}>
                <li>Thay đổi sẽ ảnh hưởng đến tất cả sản phẩm trong danh mục</li>
                <li>Nếu thay ảnh mới, ảnh cũ sẽ bị xóa</li>
                <li>Ẩn danh mục sẽ ẩn tất cả sản phẩm liên quan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

