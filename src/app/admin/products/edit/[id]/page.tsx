'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  id?: string; // có id nếu là biến thể cũ
  mausac: string;
  kichthuoc: string;
  chatlieu: string;
  gia: string;
  sl_tonkho: string;
  images: Array<File | { url: string }>; // file mới hoặc ảnh cũ
}

export default function EditProductPage() {
  const router = useRouter();
  const { id: productId } = useParams();

  const [danhmucs, setDanhmucs] = useState<DanhMuc[]>([]);
  const [thuonghieus, setThuonghieus] = useState<ThuongHieu[]>([]);

  const [form, setForm] = useState({
    code: '',
    tensp: '',
    mota: '',
    thumbnail: null as File | { url: string } | null,
    anhien: 1,
    danhmuc_id: '',
    thuonghieu_id: '',
  });

  const [bienthe, setBienthe] = useState<BienThe[]>([]);
  const [saving, setSaving] = useState(false);

  // 🔹 Load danh mục, thương hiệu và sản phẩm
  useEffect(() => {
    fetch('http://localhost:5000/api/danhmuc')
      .then(res => res.json())
      .then(setDanhmucs);
    fetch('http://localhost:5000/api/thuonghieu')
      .then(res => res.json())
      .then(setThuonghieus);

    if (!productId) return;
    fetch(`http://localhost:5000/api/sanpham/${productId}`)
      .then(res => res.json())
      .then((data) => {
        setForm({
          code: data.code,
          tensp: data.tensp,
          mota: data.mota,
          anhien: data.anhien,
          danhmuc_id: data.danhmuc?.id || '',
          thuonghieu_id: data.thuonghieu?.id || '',
          thumbnail: data.thumbnail ? { url: `http://localhost:5000${data.thumbnail}` } : null,
        });

        const variants = data.bienthe.map((bt: any) => ({
          id: bt.id,
          mausac: bt.mausac,
          kichthuoc: bt.kichthuoc,
          chatlieu: bt.chatlieu,
          gia: bt.gia,
          sl_tonkho: bt.sl_tonkho,
          images: bt.images.map((img: any) => ({ url: `http://localhost:5000${img.url}` })),
        }));
        setBienthe(variants);
      });
  }, [productId]);

  // 🔹 Handle input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleThumbnailChange = (e: any) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, thumbnail: file });
  };

  // 🔹 Biến thể
  const addVariant = () => setBienthe([...bienthe, { mausac: '', kichthuoc: '', chatlieu: '', gia: '', sl_tonkho: '', images: [] }]);
  const removeVariant = (index: number) => setBienthe(bienthe.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...bienthe];
    (updated[index] as any)[field] = value;
    setBienthe(updated);
  };

  // 🔹 Ảnh biến thể
  const handleVariantImage = (index: number, files: FileList) => {
    const updated = [...bienthe];
    updated[index].images = [...updated[index].images, ...Array.from(files)];
    setBienthe(updated);
  };

  const removeVariantImage = (variantIndex: number, imgIndex: number) => {
    const updated = [...bienthe];
    updated[variantIndex].images.splice(imgIndex, 1);
    setBienthe(updated);
  };

  // 🔹 Submit
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
      if (form.thumbnail && !(form.thumbnail as any).url) formData.append('thumbnail', form.thumbnail as File);

      // Biến thể
      formData.append('bienthe', JSON.stringify(bienthe.map(bt => ({
        id: bt.id,
        mausac: bt.mausac,
        kichthuoc: bt.kichthuoc,
        chatlieu: bt.chatlieu,
        gia: bt.gia,
        sl_tonkho: bt.sl_tonkho,
      }))));

      // Ảnh biến thể mới
      bienthe.forEach((bt, i) => {
        bt.images.forEach((img) => {
          if (!(img as any).url) formData.append(`images_${i}`, img as File);
        });
      });

      const res = await fetch(`http://localhost:5000/api/sanpham/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật sản phẩm thành công!');
        router.push('/admin/products');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật sản phẩm!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">Sửa sản phẩm</h2>
        <button onClick={() => router.back()} className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm border-0 p-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Thông tin cơ bản */}
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
          <textarea name="mota" value={form.mota} onChange={handleChange} className="form-control" rows={3}></textarea>
        </div>

        {/* Thumbnail */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Thumbnail</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} className="form-control" />
          {form.thumbnail && (
            <div className="mt-2">
              <img
                src={(form.thumbnail as any).url ? (form.thumbnail as any).url : URL.createObjectURL(form.thumbnail as File)}
                alt="thumbnail"
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        {/* Biến thể */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label fw-semibold mb-0">Biến thể</label>
            <button type="button" onClick={addVariant} className="btn btn-sm btn-primary d-flex align-items-center gap-1">
              <PlusCircle size={16} /> Thêm biến thể
            </button>
          </div>
          {bienthe.map((bt, i) => (
            <div key={i} className="card mb-3 p-3 border-1 shadow-sm">
              <div className="d-flex justify-content-end mb-2">
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeVariant(i)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <input
                    placeholder="Màu sắc"
                    value={bt.mausac}
                    onChange={e => updateVariant(i, 'mausac', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3 mb-2">
                  <input
                    placeholder="Kích thước"
                    value={bt.kichthuoc}
                    onChange={e => updateVariant(i, 'kichthuoc', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3 mb-2">
                  <input
                    placeholder="Chất liệu"
                    value={bt.chatlieu}
                    onChange={e => updateVariant(i, 'chatlieu', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3 mb-2">
                  <input
                    type="number"
                    placeholder="Giá"
                    value={bt.gia}
                    onChange={e => updateVariant(i, 'gia', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3 mb-2">
                  <input
                    type="number"
                    placeholder="SL tồn kho"
                    value={bt.sl_tonkho}
                    onChange={e => updateVariant(i, 'sl_tonkho', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Ảnh biến thể */}
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => handleVariantImage(i, e.target.files!)}
                  className="form-control"
                />
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {bt.images.map((img, idx) => (
                    <div key={idx} className="position-relative">
                      <img
                        src={(img as any).url ? (img as any).url : URL.createObjectURL(img as File)}
                        alt={`variant-${i}`}
                        style={{ width: 80, height: 80, objectFit: 'cover' }}
                        className="border rounded"
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
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn btn-success d-flex align-items-center gap-2">
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </form>
    </div>
  );
}
