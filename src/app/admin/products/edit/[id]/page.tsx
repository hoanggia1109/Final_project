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
    mota_chitiet: '',
    thumbnail: null as File | { url: string } | null,
    anhien: 1,
    danhmuc_id: '',
    thuonghieu_id: '',
  });

  const [dacdiem, setDacdiem] = useState<string[]>(['']);
  const [thongsokythuat, setThongsokythuat] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ]);

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
        console.log('[Edit Product] Full product data:', data);
        console.log('[Edit Product] Variants:', data.bienthe);
        
        console.log('[Edit Product] Thumbnail data:', data.thumbnail);
        
        let thumbnailValue = null;
        if (data.thumbnail) {
          // Xử lý URL thumbnail
          if (data.thumbnail.startsWith('http')) {
            thumbnailValue = { url: data.thumbnail };
          } else if (data.thumbnail.startsWith('/')) {
            thumbnailValue = { url: `http://localhost:5000${data.thumbnail}` };
          } else {
            thumbnailValue = { url: `http://localhost:5000/${data.thumbnail}` };
          }
          console.log('[Edit Product] Processed thumbnail URL:', thumbnailValue.url);
        } else {
          console.log('[Edit Product] No thumbnail found');
        }
        
        setForm({
          code: data.code,
          tensp: data.tensp,
          mota: data.mota || '',
          mota_chitiet: data.mota_chitiet || '',
          anhien: data.anhien,
          danhmuc_id: data.danhmuc?.id || '',
          thuonghieu_id: data.thuonghieu?.id || '',
          thumbnail: thumbnailValue,
        });

        // Load đặc điểm nổi bật
        try {
          const dacdiemData = data.dacdiem_noibat ? JSON.parse(data.dacdiem_noibat) : [];
          setDacdiem(Array.isArray(dacdiemData) && dacdiemData.length > 0 ? dacdiemData : ['']);
        } catch {
          setDacdiem(['']);
        }

        // Load thông số kỹ thuật
        try {
          const thongsoData = data.thongsokythuat ? JSON.parse(data.thongsokythuat) : {};
          const thongsoArray = Object.entries(thongsoData).map(([key, value]) => ({
            key,
            value: String(value)
          }));
          setThongsokythuat(thongsoArray.length > 0 ? thongsoArray : [{ key: '', value: '' }]);
        } catch {
          setThongsokythuat([{ key: '', value: '' }]);
        }

        const variants = (data.bienthe || []).map((bt: any) => {
          console.log(`[Edit Product] Variant ${bt.id}:`, bt);
          console.log(`[Edit Product] Variant ${bt.id} images:`, bt.images);
          
          const images = (bt.images || []).map((img: any) => {
            const imageUrl = img.url 
              ? (img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`)
              : null;
            console.log(`[Edit Product] Image:`, { id: img.id, url: img.url, finalUrl: imageUrl });
            return {
              id: img.id,
              url: imageUrl
            };
          });
          
          console.log(`[Edit Product] Variant ${bt.id} processed images:`, images);
          
          return {
            id: bt.id,
            mausac: bt.mausac || '',
            kichthuoc: bt.kichthuoc || '',
            chatlieu: bt.chatlieu || '',
            gia: bt.gia || '',
            sl_tonkho: bt.sl_tonkho || '',
            images: images,
          };
        });
        
        console.log('[Edit Product] Final variants:', variants);
        setBienthe(variants);
      })
      .catch(err => {
        console.error('[Edit Product] Error loading product:', err);
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
      formData.append('mota_chitiet', form.mota_chitiet);
      formData.append('dacdiem_noibat', JSON.stringify(dacdiem.filter(d => d.trim() !== '')));
      formData.append('thongsokythuat', JSON.stringify(
        thongsokythuat
          .filter(t => t.key.trim() !== '' && t.value.trim() !== '')
          .reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {} as Record<string, string>)
      ));
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
        .form-section {
          padding: 1.5rem 0;
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
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          color: #fff;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .image-preview {
          border-radius: 12px;
          border: 2px solid #e0e0e0;
          padding: 0.5rem;
          background: #fafafa;
        }
        @media (max-width: 768px) {
          .form-section {
            padding: 1rem 0;
          }
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
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Sửa sản phẩm</h2>
              <p className="text-muted mb-0">Cập nhật thông tin sản phẩm</p>
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
              </div>
              <div className="mb-4">
                <label className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                <input name="tensp" value={form.tensp} onChange={handleChange} className="form-control" placeholder="Nhập tên sản phẩm" required />
              </div>
              <div className="row g-3 mb-4">
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
              {/* Mô tả ngắn */}
              <div className="mb-4">
                <label className="form-label">Mô tả ngắn</label>
                <textarea 
                  name="mota" 
                  value={form.mota} 
                  onChange={handleChange} 
                  className="form-control" 
                  rows={3} 
                  placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị ở danh sách sản phẩm)..." 
                />
                <small className="text-muted">Mô tả ngắn gọn, khoảng 100-200 ký tự</small>
              </div>

              {/* Mô tả chi tiết */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  <i className="bi bi-file-text me-2" style={{ color: '#FF8E53' }}></i>
                  Mô tả chi tiết <span className="text-danger">*</span>
                </label>
                <textarea 
                  name="mota_chitiet" 
                  value={form.mota_chitiet} 
                  onChange={handleChange} 
                  className="form-control" 
                  rows={6} 
                  placeholder="Nhập mô tả chi tiết về sản phẩm. Mô tả này sẽ hiển thị trong tab 'Mô tả sản phẩm'..." 
                  required
                />
                <small className="text-muted">Mô tả chi tiết về sản phẩm, chất liệu, công dụng, v.v.</small>
              </div>

              {/* Đặc điểm nổi bật */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  <i className="bi bi-star-fill me-2" style={{ color: '#FF8E53' }}></i>
                  Đặc điểm nổi bật
                </label>
                {dacdiem.map((item, index) => (
                  <div key={index} className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={item}
                      onChange={(e) => {
                        const updated = [...dacdiem];
                        updated[index] = e.target.value;
                        setDacdiem(updated);
                      }}
                      placeholder={`Đặc điểm ${index + 1} (VD: Chất liệu cao cấp, Thiết kế hiện đại...)`}
                    />
                    {dacdiem.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setDacdiem(dacdiem.filter((_, i) => i !== index))}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() => setDacdiem([...dacdiem, ''])}
                >
                  <PlusCircle size={16} className="me-1" />
                  Thêm đặc điểm
                </button>
                <small className="text-muted d-block mt-2">Các đặc điểm nổi bật sẽ hiển thị dưới dạng danh sách bullet points</small>
              </div>

              {/* Thông số kỹ thuật */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  <i className="bi bi-gear me-2" style={{ color: '#FF8E53' }}></i>
                  Thông số kỹ thuật
                </label>
                {thongsokythuat.map((item, index) => (
                  <div key={index} className="row g-2 mb-2">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        value={item.key}
                        onChange={(e) => {
                          const updated = [...thongsokythuat];
                          updated[index].key = e.target.value;
                          setThongsokythuat(updated);
                        }}
                        placeholder="Tên thông số (VD: Kích thước, Chất liệu...)"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...thongsokythuat];
                          updated[index].value = e.target.value;
                          setThongsokythuat(updated);
                        }}
                        placeholder="Giá trị (VD: 120x60x75cm, Gỗ MDF...)"
                      />
                    </div>
                    <div className="col-md-1">
                      {thongsokythuat.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100"
                          onClick={() => setThongsokythuat(thongsokythuat.filter((_, i) => i !== index))}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() => setThongsokythuat([...thongsokythuat, { key: '', value: '' }])}
                >
                  <PlusCircle size={16} className="me-1" />
                  Thêm thông số
                </button>
                <small className="text-muted d-block mt-2">Thông số kỹ thuật sẽ hiển thị trong tab 'Thông số kỹ thuật'</small>
              </div>
              <div className="mb-4">
                <label className="form-label">Thumbnail</label>
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="form-control" />
                {form.thumbnail && (
                  <div className="mt-3">
                    <img
                      src={(form.thumbnail as any).url ? (form.thumbnail as any).url : URL.createObjectURL(form.thumbnail as File)}
                      alt="thumbnail"
                      className="image-preview"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="form-section-title mb-0">Biến thể sản phẩm</h5>
                <button type="button" onClick={addVariant} className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                  <PlusCircle size={16} /> Thêm biến thể
                </button>
              </div>
              {bienthe.map((bt, i) => (
                <div key={i} className="variant-card">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold" style={{ color: '#2C3E50' }}>Biến thể #{i + 1}</h6>
                    <button type="button" className="btn btn-sm btn-danger d-flex align-items-center gap-1" onClick={() => removeVariant(i)}>
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <input
                        placeholder="Màu sắc"
                        value={bt.mausac}
                        onChange={e => updateVariant(i, 'mausac', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        placeholder="Kích thước"
                        value={bt.kichthuoc}
                        onChange={e => updateVariant(i, 'kichthuoc', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        placeholder="Chất liệu"
                        value={bt.chatlieu}
                        onChange={e => updateVariant(i, 'chatlieu', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        placeholder="Giá (VNĐ)"
                        value={bt.gia}
                        onChange={e => updateVariant(i, 'gia', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        placeholder="Số lượng tồn kho"
                        value={bt.sl_tonkho}
                        onChange={e => updateVariant(i, 'sl_tonkho', e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Ảnh biến thể */}
                  <div className="mt-3">
                    <label className="form-label">Ảnh biến thể</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={e => handleVariantImage(i, e.target.files!)}
                      className="form-control"
                    />
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {bt.images.map((img, idx) => (
                        <div key={idx} className="position-relative">
                          <img
                            src={(img as any).url ? (img as any).url : URL.createObjectURL(img as File)}
                            alt={`variant-${i}`}
                            className="image-preview"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(i, idx)}
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            style={{ padding: '2px 6px', borderRadius: '50%', transform: 'translate(50%, -50%)' }}
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

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <button type="button" onClick={() => router.back()} className="btn btn-light" disabled={saving}>
                Hủy
              </button>
              <button type="submit" disabled={saving} className="btn-submit d-flex align-items-center gap-2">
                <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
