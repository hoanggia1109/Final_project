'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, Mail, Phone, User, Calendar, Eye, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-config';

interface LienHe {
  lienhe_id: string;
  hoten: string;
  email: string;
  sdt?: string;
  tieude: string;
  noidung: string;
  created_at: string;
}

export default function AdminContactPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<LienHe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<LienHe | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }

    loadContacts();
  }, [router]);

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admin/lienhe`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải liên hệ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa liên hệ này không?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admin/lienhe/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setContacts(contacts.filter(item => item.lienhe_id !== id));
        if (selectedContact?.lienhe_id === id) {
          setSelectedContact(null);
        }
        alert('Xóa thành công!');
      } else {
        alert('Xóa thất bại!');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa liên hệ!');
    }
  };

  const filtered = contacts.filter(
    item =>
      item.hoten?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.tieude?.toLowerCase().includes(search.toLowerCase())
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
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <MessageSquare size={24} />
            Quản lý Liên hệ
          </h4>
          <p className="text-muted mb-0">Tổng số: {contacts.length} liên hệ</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="position-relative">
          <Search className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Tìm kiếm theo tên, email hoặc tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Contact List */}
        <div className={selectedContact ? 'col-md-5' : 'col-12'}>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {filtered.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <MessageSquare size={48} className="mb-3 opacity-50" />
                  <p>Không có liên hệ nào</p>
                </div>
              ) : (
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {filtered.map((contact) => (
                    <div
                      key={contact.lienhe_id}
                      className={`p-3 border-bottom cursor-pointer ${
                        selectedContact?.lienhe_id === contact.lienhe_id ? 'bg-warning bg-opacity-10' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-semibold mb-0">{contact.hoten}</h6>
                        <button
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contact.lienhe_id);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-muted small mb-1">{contact.tieude}</p>
                      <div className="d-flex align-items-center gap-2 text-muted small">
                        <Mail size={12} />
                        <span>{contact.email}</span>
                      </div>
                      {contact.sdt && (
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <Phone size={12} />
                          <span>{contact.sdt}</span>
                        </div>
                      )}
                      <div className="d-flex align-items-center gap-2 text-muted small mt-1">
                        <Calendar size={12} />
                        <span>{new Date(contact.created_at).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Detail */}
        {selectedContact && (
          <div className="col-md-7">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-warning bg-opacity-10 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Chi tiết liên hệ</h5>
                <button
                  className="btn btn-sm btn-close"
                  onClick={() => setSelectedContact(null)}
                />
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="text-muted small">Họ tên</label>
                  <div className="d-flex align-items-center gap-2">
                    <User size={16} className="text-warning" />
                    <p className="mb-0 fw-semibold">{selectedContact.hoten}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-muted small">Email</label>
                  <div className="d-flex align-items-center gap-2">
                    <Mail size={16} className="text-warning" />
                    <a href={`mailto:${selectedContact.email}`} className="text-decoration-none">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                {selectedContact.sdt && (
                  <div className="mb-3">
                    <label className="text-muted small">Số điện thoại</label>
                    <div className="d-flex align-items-center gap-2">
                      <Phone size={16} className="text-warning" />
                      <a href={`tel:${selectedContact.sdt}`} className="text-decoration-none">
                        {selectedContact.sdt}
                      </a>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="text-muted small">Tiêu đề</label>
                  <p className="mb-0 fw-semibold">{selectedContact.tieude}</p>
                </div>

                <div className="mb-3">
                  <label className="text-muted small">Nội dung</label>
                  <div className="p-3 bg-light rounded" style={{ minHeight: '150px' }}>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedContact.noidung}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-muted small">Thời gian</label>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-warning" />
                    <span>{new Date(selectedContact.created_at).toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.tieude)}`}
                    className="btn btn-warning"
                  >
                    <Mail size={16} className="me-2" />
                    Phản hồi
                  </a>
                  {selectedContact.sdt && (
                    <a href={`tel:${selectedContact.sdt}`} className="btn btn-outline-primary">
                      <Phone size={16} className="me-2" />
                      Gọi điện
                    </a>
                  )}
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(selectedContact.lienhe_id)}
                  >
                    <Trash2 size={16} className="me-2" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}









