'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateBlogCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    tendanhmuc: '',
    mota: '',
    anhien: 1,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('http://localhost:5000/api/danhmucbaiviet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('✅ Thêm danh mục thành công!');
        router.push('/admin/blog-categories');
      } else {
        const data = await res.json();
        alert('❌ Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi thêm danh mục!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Thêm Danh mục Bài viết</h2>
          <p className="text-muted mb-0">Tạo danh mục mới cho bài viết</p>
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
                <div className="col-12">
                  <label className="form-label fw-semibold">Tên danh mục <span className="text-danger">*</span></label>
                  <input 
                    name="tendanhmuc" 
                    value={form.tendanhmuc} 
                    onChange={handleChange} 
                    className="form-control" 
                    required 
                    placeholder="Ví dụ: Tin tức, Khuyến mãi, Hướng dẫn..."
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Mô tả</label>
                  <textarea 
                    name="mota" 
                    value={form.mota} 
                    onChange={handleChange} 
                    className="form-control" 
                    rows={4}
                    placeholder="Mô tả ngắn về danh mục này..."
                  />
                </div>

                <div className="col-md-6">
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
              </div>

              <div className="d-flex gap-2 justify-content-end pt-4 mt-3 border-top">
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
                  {saving ? 'Đang lưu...' : 'Thêm danh mục'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">💡 Lưu ý</h6>
              <ul className="small text-muted mb-0" style={{ lineHeight: '1.8' }}>
                <li>Tên danh mục nên ngắn gọn và dễ hiểu</li>
                <li>Mô tả giúp người quản trị phân biệt các danh mục</li>
                <li>Chọn "Ẩn" nếu chưa muốn hiển thị danh mục</li>
                <li>Bài viết thuộc danh mục này sẽ được nhóm lại</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

