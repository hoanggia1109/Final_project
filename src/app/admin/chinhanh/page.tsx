'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, PlusCircle, Search, MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api-config';

interface ChiNhanh {
  id: string;
  tenchinhanh: string;
  diachi: string;
  quan: string;
  thanhpho: string;
  sdt: string;
  email: string;
  giomocua: string;
  giodongcua: string;
  giomocua_cn: string;
  giodongcua_cn: string;
  hinhanh: string;
  mapurl: string;
  anhien: number;
  thutu: number;
  created_at: string;
}

export default function AdminChiNhanhPage() {
  const [chinhanhs, setChiNhanhs] = useState<ChiNhanh[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadChiNhanhs();
  }, []);

  const loadChiNhanhs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chinhanh?admin=true`);
      const data = await res.json();
      setChiNhanhs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải chi nhánh:', err);
      setChiNhanhs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa chi nhánh này không?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/chinhanh/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setChiNhanhs(chinhanhs.filter(c => c.id !== id));
        alert('✅ Xóa thành công!');
      } else {
        const error = await res.json();
        alert(error.message || '❌ Xóa thất bại!');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi xóa chi nhánh!');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chinhanh/${id}/toggle`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const data = await res.json();
        setChiNhanhs(chinhanhs.map(c => 
          c.id === id ? { ...c, anhien: data.anhien } : c
        ));
        alert('✅ Cập nhật trạng thái thành công!');
      } else {
        alert('❌ Cập nhật thất bại!');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi cập nhật trạng thái!');
    }
  };

  const filtered = chinhanhs.filter(
    c => c.tenchinhanh?.toLowerCase().includes(search.trim().toLowerCase()) ||
         c.diachi?.toLowerCase().includes(search.trim().toLowerCase()) ||
         c.quan?.toLowerCase().includes(search.trim().toLowerCase()) ||
         c.thanhpho?.toLowerCase().includes(search.trim().toLowerCase())
  );

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
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Quản lý Chi nhánh</h2>
          <p className="text-muted mb-0">Danh sách tất cả các chi nhánh và showroom</p>
        </div>
        <button
          className="btn btn-warning text-white d-flex align-items-center gap-2 shadow-sm"
          onClick={() => router.push('/admin/chinhanh/create')}
        >
          <PlusCircle size={18} />
          <span>Thêm chi nhánh mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, địa chỉ, quận, thành phố..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control border-start-0 ps-0"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="row g-4">
        {filtered.length > 0 ? (
          filtered.map((cn) => (
            <div key={cn.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100" style={{ transition: 'all 0.3s ease' }}>
                {/* Image */}
                {cn.hinhanh && (
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    <Image
                      src={cn.hinhanh}
                      alt={cn.tenchinhanh}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      {cn.anhien === 1 ? (
                        <span className="badge bg-success">Hiển thị</span>
                      ) : (
                        <span className="badge bg-danger">Ẩn</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3" style={{ color: '#2C3E50' }}>
                    {cn.tenchinhanh}
                  </h5>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <MapPin size={16} className="text-warning me-2 mt-1 flex-shrink-0" />
                      <div className="small">
                        <div className="fw-semibold">{cn.diachi}</div>
                        <div className="text-muted">{cn.quan}, {cn.thanhpho}</div>
                      </div>
                    </div>
                    
                    {cn.sdt && (
                      <div className="d-flex align-items-center mb-2">
                        <Phone size={16} className="text-primary me-2 flex-shrink-0" />
                        <a href={`tel:${cn.sdt}`} className="text-decoration-none small">
                          {cn.sdt}
                        </a>
                      </div>
                    )}
                    
                    {cn.email && (
                      <div className="d-flex align-items-center mb-2">
                        <Mail size={16} className="text-danger me-2 flex-shrink-0" />
                        <a href={`mailto:${cn.email}`} className="text-decoration-none small">
                          {cn.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted mb-1">Giờ mở cửa:</div>
                    <div className="small">
                      <div>Thứ 2-6: {cn.giomocua} - {cn.giodongcua}</div>
                      <div>Thứ 7-CN: {cn.giomocua_cn} - {cn.giodongcua_cn}</div>
                    </div>
                  </div>

                  {cn.thutu && (
                    <div className="mb-3">
                      <span className="badge bg-secondary">Thứ tự: {cn.thutu}</span>
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-3">
                    <button
                      onClick={() => router.push(`/admin/chinhanh/edit/${cn.id}`)}
                      className="btn btn-sm btn-outline-primary flex-fill d-flex align-items-center justify-content-center gap-1"
                    >
                      <Pencil size={14} /> Sửa
                    </button>
                    <button
                      onClick={() => handleToggleStatus(cn.id)}
                      className={`btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 ${
                        cn.anhien === 1 ? 'btn-outline-warning' : 'btn-outline-success'
                      }`}
                    >
                      {cn.anhien === 1 ? 'Ẩn' : 'Hiện'}
                    </button>
                    <button
                      onClick={() => handleDelete(cn.id)}
                      className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1"
                      style={{ width: '45px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <div className="text-muted">
                  <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-2 mb-0">Không tìm thấy chi nhánh nào</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-4 text-muted small">
        <p className="mb-0">
          Tổng cộng: <strong>{chinhanhs.length}</strong> chi nhánh | 
          Đang hiển thị: <strong>{filtered.length}</strong> | 
          Đang hoạt động: <strong>{chinhanhs.filter(c => c.anhien === 1).length}</strong>
        </p>
      </div>
    </div>
  );
}

