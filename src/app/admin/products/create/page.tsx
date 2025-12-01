'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, PlusCircle, Trash2 } from 'lucide-react';

interface DanhMuc {
  id: string;
  tendm: string;
}

interface ThuongHieu {
  id: string;
  tenbrand: string;
}

interface BienThe {
  mausac: string;
  kichthuoc: string;
  chatlieu: string;
  gia: string;
  sl_tonkho: string;
  images: File[];
}

export default function CreateProductPage() {
  const router = useRouter();
  const [danhmucs, setDanhmucs] = useState<DanhMuc[]>([]);
  const [thuonghieus, setThuonghieus] = useState<ThuongHieu[]>([]);

  const [form, setForm] = useState({
    code: '',
    tensp: '',
    mota: '',
    thumbnail: null as File | null,
    anhien: 1,
    danhmuc_id: '',
    thuonghieu_id: '',
  });

  const [bienthe, setBienthe] = useState<BienThe[]>([
    { mausac: '', kichthuoc: '', chatlieu: '', gia: '', sl_tonkho: '', images: [] },
  ]);

  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 Load danh mục & thương hiệu
  useEffect(() => {
    fetch('http://localhost:5000/api/danhmuc').then(res => res.json()).then(setDanhmucs);
    fetch('http://localhost:5000/api/thuonghieu').then(res => res.json()).then(setThuonghieus);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, thumbnail: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Thêm biến thể mới
  const addVariant = () => {
    setBienthe([...bienthe, { mausac: '', kichthuoc: '', chatlieu: '', gia: '', sl_tonkho: '', images: [] }]);
  };

  // 🔹 Xóa biến thể (giữ ít nhất 1)
  const removeVariant = (index: number) => {
    if (bienthe.length === 1) return;
    setBienthe(bienthe.filter((_, i) => i !== index));
  };

  // 🔹 Cập nhật biến thể
  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...bienthe];
    (updated[index] as any)[field] = value;
    setBienthe(updated);
  };

  // 🔹 Ảnh biến thể
  const handleVariantImage = (index: number, files: FileList) => {
    const updated = [...bienthe];
    updated[index].images = Array.from(files);
    setBienthe(updated);
  };

  // 🔹 Xóa ảnh biến thể riêng lẻ
  const removeVariantImage = (variantIndex: number, imgIndex: number) => {
    const updated = [...bienthe];
    updated[variantIndex].images.splice(imgIndex, 1);
    setBienthe(updated);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('code', form.code);
      formData.append('tensp', form.tensp);
      formData.append('mota', form.mota);
      formData.append('anhien', form.anhien.toString());
      formData.append('danhmuc_id', form.danhmuc_id || '');
      formData.append('thuonghieu_id', form.thuonghieu_id || '');
      if (form.thumbnail) formData.append('thumbnail', form.thumbnail);

      // Biến thể
      formData.append('bienthe', JSON.stringify(bienthe.map(bt => ({
        mausac: bt.mausac,
        kichthuoc: bt.kichthuoc,
        chatlieu: bt.chatlieu,
        gia: bt.gia,
        sl_tonkho: bt.sl_tonkho
      }))));

      const res = await fetch('http://localhost:5000/api/sanpham', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Thêm sản phẩm thành công!');
        router.push('/admin/products');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi thêm sản phẩm!');
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
          overflow: hidden;
        }
        .form-section {
          padding: 2rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .form-section:last-child {
          border-bottom: none;
        }
        .form-section-title {
          color: #2C3E50;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #FFC107;
          display: inline-block;
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
        .variant-card {
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        .variant-card:hover {
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
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
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .image-preview {
          border-radius: 12px;
          border: 2px solid #e0e0e0;
          padding: 0.5rem;
          background: #fafafa;
        }
        @media (max-width: 768px) {
          .form-section {
            padding: 1.5rem 1rem;
          }
          .form-header {
            padding: 1rem;
          }
        }
      `}</style>
      <div className="form-container">
        <div className="container">
          <div className="form-header d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Thêm sản phẩm</h2>
              <p className="text-muted mb-0">Tạo sản phẩm mới cho cửa hàng</p>
            </div>
            <button onClick={() => router.back()} className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <ArrowLeft size={18} /> Quay lại
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="form-section">
              <h5 className="form-section-title">Thông tin sản phẩm</h5>
              
              <div className="mb-4">
                <label className="form-label">Mã sản phẩm <span className="text-danger">*</span></label>
                <input name="code" value={form.code} onChange={handleChange} className="form-control" placeholder="VD: SP001" required />
                <small className="text-muted">Mã định danh duy nhất cho sản phẩm</small>
              </div>

              <div className="mb-4">
                <label className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                <input name="tensp" value={form.tensp} onChange={handleChange} className="form-control" placeholder="Nhập tên sản phẩm" required />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Danh mục <span className="text-danger">*</span></label>
                  <select name="danhmuc_id" value={form.danhmuc_id} onChange={handleChange} className="form-select" required>
                    <option value="">-- Chọn danh mục --</option>
                    {danhmucs.map(dm => <option key={dm.id} value={dm.id}>{dm.tendm}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Thương hiệu <span className="text-danger">*</span></label>
                  <select name="thuonghieu_id" value={form.thuonghieu_id} onChange={handleChange} className="form-select" required>
                    <option value="">-- Chọn thương hiệu --</option>
                    {thuonghieus.map(th => <option key={th.id} value={th.id}>{th.tenbrand}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4 mt-4">
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea name="mota" value={form.mota} onChange={handleChange} className="form-control" rows={4} placeholder="Nhập mô tả chi tiết về sản phẩm..." />
              </div>

              <div className="mb-4">
                <label className="form-label">Ảnh đại diện</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                {preview && (
                  <div className="mt-3 text-center">
                    <img src={preview} alt="preview" className="image-preview" style={{ width: 200, height: 200, objectFit: 'cover' }} />
                  </div>
                )}
                <small className="text-muted">Khuyến nghị: Ảnh vuông, kích thước tối thiểu 500x500px</small>
              </div>
            </div>

            {/* Biến thể */}
            <div className="form-section">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="form-section-title mb-0">Biến thể sản phẩm</h5>
                <button type="button" onClick={addVariant} className="btn btn-outline-primary d-flex align-items-center gap-2">
                  <PlusCircle size={18} /> Thêm biến thể
                </button>
              </div>
              
              {bienthe.map((bt, i) => (
                <div key={i} className="variant-card">
                  {/* Header biến thể với số thứ tự + nút xóa */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="m-0 fw-bold" style={{ color: '#2C3E50' }}>Biến thể {i + 1}</h6>
                    {bienthe.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={() => removeVariant(i)}>
                        <Trash2 size={16} /> Xóa
                      </button>
                    )}
                  </div>

                  {/* Thông tin biến thể */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label">Màu sắc</label>
                      <input
                        type="text"
                        className="form-control"
                        value={bt.mausac}
                        onChange={(e) => updateVariant(i, 'mausac', e.target.value)}
                        placeholder="VD: Đỏ, Xanh..."
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Kích thước</label>
                      <input
                        type="text"
                        className="form-control"
                        value={bt.kichthuoc}
                        onChange={(e) => updateVariant(i, 'kichthuoc', e.target.value)}
                        placeholder="VD: L, M, S..."
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Chất liệu</label>
                      <input
                        type="text"
                        className="form-control"
                        value={bt.chatlieu}
                        onChange={(e) => updateVariant(i, 'chatlieu', e.target.value)}
                        placeholder="VD: Gỗ, Nhựa..."
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Giá <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        value={bt.gia}
                        onChange={(e) => updateVariant(i, 'gia', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Số lượng tồn kho</label>
                      <input
                        type="number"
                        className="form-control"
                        value={bt.sl_tonkho}
                        onChange={(e) => updateVariant(i, 'sl_tonkho', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Preview ảnh biến thể */}
                  {bt.images.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {bt.images.map((img, idx) => (
                        <div key={idx} className="position-relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`variant-${i}`}
                            className="image-preview"
                            style={{ width: 80, height: 80, objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(i, idx)}
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            style={{ padding: '2px 6px', borderRadius: '50%', fontSize: '12px' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input thêm ảnh */}
                  <div>
                    <label className="form-label">Ảnh biến thể</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantImage(i, e.target.files!)}
                      className="form-control"
                    />
                    <small className="text-muted">Có thể chọn nhiều ảnh</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Trạng thái */}
            <div className="form-section">
              <h5 className="form-section-title">Cài đặt hiển thị</h5>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select name="anhien" value={form.anhien} onChange={handleChange} className="form-select">
                  <option value={1}>✓ Hiển thị</option>
                  <option value={0}>✗ Ẩn</option>
                </select>
              </div>
            </div>

            {/* Nút submit */}
            <div className="form-section">
              <div className="d-flex gap-3 justify-content-end">
                <button type="button" onClick={() => router.back()} className="btn btn-outline-secondary" disabled={saving}>
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="btn-submit d-flex align-items-center gap-2">
                  <Save size={18} /> {saving ? 'Đang lưu...' : 'Thêm sản phẩm'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
