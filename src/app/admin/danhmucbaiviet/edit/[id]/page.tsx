'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

interface BlogCategory {
  id: string;
  tendanhmuc: string;
  mota: string;
  anhien: number;
}

export default function EditBlogCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    tendanhmuc: '',
    mota: '',
    anhien: 1,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    fetch(`http://localhost:5001/api/danhmucbaiviet/${params.id}`)
      .then(res => res.json())
      .then((data: BlogCategory) => {
        setForm({
          tendanhmuc: data.tendanhmuc || '',
          mota: data.mota || '',
          anhien: data.anhien || 1,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh mục:', err);
        alert('❌ Lỗi khi tải thông tin danh mục!');
        setLoading(false);
      });
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:5001/api/danhmucbaiviet/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('✅ Cập nhật danh mục thành công!');
        router.push('/admin/blog-categories');
      } else {
        const data = await res.json();
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
          <p className="text-muted mb-0">Chỉnh sửa thông tin danh mục bài viết</p>
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
                  {saving ? 'Đang lưu...' : 'Cập nhật danh mục'}
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
                <p className="mb-0"><strong>Trạng thái:</strong> {form.anhien === 1 ? 'Đang hiển thị' : 'Đang ẩn'}</p>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">💡 Lưu ý</h6>
              <ul className="small text-muted mb-0" style={{ lineHeight: '1.8' }}>
                <li>Thay đổi sẽ ảnh hưởng đến tất cả bài viết trong danh mục</li>
                <li>Nên cập nhật mô tả để dễ quản lý</li>
                <li>Có thể ẩn danh mục tạm thời</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

