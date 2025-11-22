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
    fetch('http://localhost:5001/api/danhmuc').then(res => res.json()).then(setDanhmucs);
    fetch('http://localhost:5001/api/thuonghieu').then(res => res.json()).then(setThuonghieus);
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

      const res = await fetch('http://localhost:5001/api/sanpham', {
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
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Thêm sản phẩm</h2>
        <button onClick={() => router.back()} className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm border-0 p-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Thông tin sản phẩm */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Mã sản phẩm</label>
          <input name="code" value={form.code} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Tên sản phẩm</label>
          <input name="tensp" value={form.tensp} onChange={handleChange} className="form-control" required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Danh mục</label>
            <select name="danhmuc_id" value={form.danhmuc_id} onChange={handleChange} className="form-select">
              <option value="">-- Chọn danh mục --</option>
              {danhmucs.map(dm => <option key={dm.id} value={dm.id}>{dm.tendm}</option>)}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Thương hiệu</label>
            <select name="thuonghieu_id" value={form.thuonghieu_id} onChange={handleChange} className="form-select">
              <option value="">-- Chọn thương hiệu --</option>
              {thuonghieus.map(th => <option key={th.id} value={th.id}>{th.tenbrand}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Mô tả</label>
          <textarea name="mota" value={form.mota} onChange={handleChange} className="form-control" rows={3} />
        </div>

        {/* Thumbnail */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
          {preview && (
            <div className="mt-3 text-center">
              <img src={preview} alt="preview" className="img-thumbnail" style={{ width: 150, height: 150, objectFit: 'cover' }} />
            </div>
          )}
        </div>

       {/* Biến thể */}
<div className="border-top pt-3">
  <h5 className="fw-bold mb-3">Biến thể sản phẩm</h5>
  {bienthe.map((bt, i) => (
    <div key={i} className="border rounded p-3 mb-3 bg-light">
      {/* Header biến thể với số thứ tự + nút xóa */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="m-0 fw-bold">Biến thể {i + 1}</h6>
        {bienthe.length > 1 && (
          <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVariant(i)}>
            <Trash2 size={16} /> Xóa
          </button>
        )}
      </div>

     {/* Thông tin biến thể */}
<div className="row g-3 mb-3">
  <div className="col-md-3">
    <label className="form-label fw-semibold">Màu sắc</label>
    <input
      type="text"
      className="form-control"
      value={bt.mausac}
      onChange={(e) => updateVariant(i, 'mausac', e.target.value)}
    />
  </div>
  <div className="col-md-3">
    <label className="form-label fw-semibold">Kích thước</label>
    <input
      type="text"
      className="form-control"
      value={bt.kichthuoc}
      onChange={(e) => updateVariant(i, 'kichthuoc', e.target.value)}
    />
  </div>
  <div className="col-md-3">
    <label className="form-label fw-semibold">Chất liệu</label>
    <input
      type="text"
      className="form-control"
      value={bt.chatlieu}
      onChange={(e) => updateVariant(i, 'chatlieu', e.target.value)}
    />
  </div>
  <div className="col-md-3">
    <label className="form-label fw-semibold">Giá</label>
    <input
      type="number"
      className="form-control"
      value={bt.gia}
      onChange={(e) => updateVariant(i, 'gia', e.target.value)}
    />
  </div>
</div>


      {/* Preview ảnh biến thể */}
      <div className="d-flex flex-wrap gap-2 mb-2">
        {bt.images.map((img, idx) => (
          <div key={idx} className="position-relative">
            <img
              src={URL.createObjectURL(img)}
              alt={`variant-${i}`}
              className="img-thumbnail"
              style={{ width: 80, height: 80, objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => removeVariantImage(i, idx)}
              className="btn btn-sm btn-danger position-absolute top-0 end-0"
              style={{ padding: '2px 6px', borderRadius: '50%' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Input thêm ảnh */}
      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleVariantImage(i, e.target.files!)}
          className="form-control"
        />
      </div>
    </div>
  ))}

  {/* Nút thêm biến thể */}
  <button type="button" className="btn btn-outline-primary w-100" onClick={addVariant}>
    <PlusCircle size={16} /> Thêm biến thể
  </button>
</div>


        {/* Hiển thị */}
        <div className="mt-4">
          <label className="form-label fw-semibold">Trạng thái</label>
          <select name="anhien" value={form.anhien} onChange={handleChange} className="form-select">
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" disabled={saving} className="btn btn-primary d-flex align-items-center gap-2 px-4">
            <Save size={18} /> {saving ? 'Đang lưu...' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
