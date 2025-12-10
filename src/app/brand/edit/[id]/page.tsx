'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-config';

export default function EditBrandPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    code: '',
    tenbrand: '',
    logo: '',
    thutu: '',
    anhien: 1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🟢 Lấy dữ liệu thương hiệu hiện tại
  useEffect(() => {
    if (!id) return;
    const fetchBrand = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/thuonghieu/${id}`);
        const data = await res.json();
        setForm({
          code: data.code || '',
          tenbrand: data.tenbrand || '',
          logo: data.logo || '',
          thutu: data.thutu || '',
          anhien: data.anhien ?? 1,
        });
      } catch (err) {
        console.error('Lỗi khi tải thương hiệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/thuonghieu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Cập nhật thương hiệu thành công!');
        router.push('/brand');
      } else {
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật thương hiệu!');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="container py-5 text-center text-muted">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary fw-bold text-uppercase m-0">
          Sửa thương hiệu
        </h2>
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 mx-auto p-4"
        style={{ maxWidth: '900px' }}
      >
        <div className="row g-4">
          {/* Cột trái */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Mã thương hiệu</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Tên thương hiệu</label>
              <input
                name="tenbrand"
                value={form.tenbrand}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Logo (URL)</label>
              <input
                name="logo"
                value={form.logo}
                onChange={handleChange}
                className="form-control"
              />
              {form.logo && (
                <div className="mt-3 text-center">
                  <img
                    src={form.logo}
                    alt="Logo Preview"
                    className="img-thumbnail"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cột phải */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label fw-semibold">Thứ tự</label>
              <input
                type="number"
                name="thutu"
                value={form.thutu}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Trạng thái</label>
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

            <div className="d-flex justify-content-end align-items-center mt-5">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary d-flex align-items-center gap-2 px-4"
              >
                <Save size={18} />
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
