'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-config';

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
      const res = await fetch(`${API_BASE_URL}/api/danhmucbaiviet`, {
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
        .form-control:hover, .form-select:hover {
          border-color: #d0d0d0;
        }
        textarea.form-control {
          min-height: 120px;
          resize: vertical;
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
        .help-card {
          background: linear-gradient(135deg, #FAF8F3 0%, #F5F2E8 100%);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          .form-container {
            padding: 1rem 0;
          }
          .form-header {
            padding: 1rem;
            margin-bottom: 1rem;
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          .form-header h2 {
            font-size: 1.5rem !important;
          }
          .form-header .btn {
            width: 100%;
          }
          .form-card {
            padding: 1.5rem;
            border-radius: 12px;
          }
          .row.g-4 {
            margin: 0;
          }
          .row.g-4 > * {
            padding: 0;
            margin-bottom: 1rem;
          }
          .btn-submit {
            padding: 0.6rem 1.5rem;
            font-size: 0.9rem;
            width: 100%;
          }
          .d-flex.gap-2 {
            flex-direction: column;
          }
          .d-flex.gap-2 .btn {
            width: 100%;
            margin: 0 !important;
          }
          .col-lg-8 {
            padding: 0;
          }
          .col-lg-4 {
            margin-top: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .form-card {
            padding: 1rem;
          }
          .row.g-4 .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
      <div className="form-container">
        <div className="container">
          <div className="form-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#2C3E50', fontSize: '1.75rem' }}>Thêm Danh mục Bài viết</h2>
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

          <div className="row g-4">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit} className="form-card" noValidate>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Tên danh mục <span className="text-danger">*</span></label>
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
                    <label className="form-label">Mô tả</label>
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
                    <label className="form-label">Trạng thái</label>
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
                    className="btn-submit d-flex align-items-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? 'Đang lưu...' : 'Thêm danh mục'}
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-4">
              <div className="form-card help-card">
                <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>💡 Lưu ý</h6>
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
    </>
  );
}

