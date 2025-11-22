'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Trash2, Shield, User, Mail, Phone, Calendar, Search, Filter, Edit } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  ho_ten: string | null;
  sdt: string | null;
  role: 'admin' | 'customer';
  trangthai: number;
  ngaysinh: string | null;
  gioitinh: string | null;
  created_at: string;
}

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'customer'>('all');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({
    ho_ten: '',
    sdt: '',
    role: 'customer' as 'admin' | 'customer',
    trangthai: 1,
  });

  useEffect(() => {
    // Kiểm tra quyền admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }

    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Vui lòng đăng nhập!');
        router.push('/auth');
        return;
      }

      console.log('Đang tải người dùng với token:', token);

      const response = await fetch('http://localhost:5001/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Người dùng đã tải:', data.length);
        setUsers(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        alert(`Không thể tải danh sách người dùng! ${errorData.message || ''}`);
      }
    } catch (error) {
      console.error('Lỗi tải người dùng:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu! Kiểm tra console để biết chi tiết.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      ho_ten: user.ho_ten || '',
      sdt: user.sdt || '',
      role: user.role,
      trangthai: user.trangthai,
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Vui lòng đăng nhập!');
        router.push('/auth');
        return;
      }

      const response = await fetch(`http://localhost:5001/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert('Cập nhật người dùng thành công!');
        setEditingUser(null);
        loadUsers();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Không thể cập nhật người dùng! ${errorData.message || ''}`);
      }
    } catch (error) {
      console.error('Lỗi cập nhật người dùng:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng: ${email}?`)) return;

    setDeleteLoading(id);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Vui lòng đăng nhập!');
        router.push('/auth');
        return;
      }

      const response = await fetch(`http://localhost:5001/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Xóa người dùng thành công!');
        loadUsers();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Không thể xóa người dùng! ${errorData.message || ''}`);
      }
    } catch (error) {
      console.error('Lỗi xóa người dùng:', error);
      alert('Có lỗi xảy ra!');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa có';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return 'Không hợp lệ';
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.ho_ten && user.ho_ten.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.sdt && user.sdt.includes(searchTerm));
    
    const matchRole = filterRole === 'all' || user.role === filterRole;
    
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'customer').length,
    active: users.filter(u => u.trangthai === 1).length,
  };

  if (loading) {
    return (
      <>
        <style jsx global>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%);
          }
        `}</style>
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border" style={{ width: '4rem', height: '4rem', color: '#FF6B6B', borderWidth: '4px' }}></div>
            <p className="mt-3" style={{ color: '#FF8E53', fontWeight: '600', fontSize: '1.1rem' }}>Đang tải người dùng...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        .user-management {
          min-height: 100vh;
          background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 30%, #FFF5E8 100%);
          padding-top: 100px;
          padding-bottom: 60px;
        }

        .page-header {
          margin-bottom: 40px;
          padding: 35px;
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.05), rgba(255, 142, 83, 0.05));
          border-radius: 20px;
          border: 2px solid #FFE5D9;
        }

        .page-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .page-subtitle {
          color: #666;
          font-size: 1rem;
          margin: 0;
        }

        .stats-row {
          margin-bottom: 40px;
        }

        .stat-box {
          background: #fff;
          padding: 25px;
          border-radius: 16px;
          border: 2px solid #FFE5D9;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.08);
          transition: all 0.3s ease;
        }

        .stat-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(255, 107, 107, 0.15);
          border-color: #FF8E53;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .stat-label {
          color: #999;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .stat-value {
          color: #2c3e50;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .filters-section {
          background: #fff;
          padding: 25px;
          border-radius: 16px;
          border: 2px solid #FFE5D9;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.08);
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input {
          width: 100%;
          padding: 14px 18px 14px 50px;
          border: 2px solid #FFE5D9;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #FF8E53;
          box-shadow: 0 0 0 3px rgba(255, 142, 83, 0.1);
        }

        .filter-btn {
          padding: 10px 20px;
          border: 2px solid #FFE5D9;
          background: #fff;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .filter-btn:hover {
          border-color: #FF8E53;
          background: #FFF5F0;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          color: #fff;
          border-color: #FF6B6B;
        }

        .users-table {
          background: #fff;
          border-radius: 16px;
          border: 2px solid #FFE5D9;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.08);
        }

        .table-header {
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          padding: 20px 25px;
          border-bottom: 2px solid #FFE5D9;
        }

        .table-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .table-container {
          overflow-x: auto;
        }

        .custom-table {
          width: 100%;
          margin: 0;
        }

        .custom-table thead {
          background: #FFF9F5;
        }

        .custom-table th {
          padding: 18px 20px;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #FFE5D9;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .custom-table td {
          padding: 20px;
          vertical-align: middle;
          border-bottom: 1px solid #FFE5D9;
          color: #666;
        }

        .custom-table tbody tr {
          transition: all 0.3s ease;
        }

        .custom-table tbody tr:hover {
          background: #FFF9F5;
        }

        .role-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .role-admin {
          background: linear-gradient(135deg, #FF6B6B, #FF5252);
          color: #fff;
        }

        .role-customer {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: #fff;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-active {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          color: #155724;
        }

        .status-inactive {
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
          color: #721c24;
        }

        .btn-edit {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .btn-delete {
          background: linear-gradient(135deg, #FF6B6B, #FF5252);
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-delete:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-content {
          background: #fff;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 2px solid #FFE5D9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          color: #999;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #FFE5D9;
          color: #FF6B6B;
        }

        .modal-body {
          padding: 24px;
        }

        .form-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          display: block;
        }

        .form-control, .form-select {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid #FFE5D9;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-control:focus, .form-select:focus {
          outline: none;
          border-color: #FF8E53;
          box-shadow: 0 0 0 3px rgba(255, 142, 83, 0.1);
        }

        .form-control:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 2px solid #FFE5D9;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-cancel {
          background: #f5f5f5;
          color: #666;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #e0e0e0;
        }

        .btn-save {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .btn-back {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-back:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-text {
          font-size: 1.1rem;
          color: #999;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.8rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .user-management {
            padding-top: 80px;
          }
        }
      `}</style>

      <div className="user-management">
        <div className="container-fluid">
          {/* Header */}
          <div className="page-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="page-title">
                  <Users size={36} />
                  Quản lý người dùng
                </h1>
                <p className="page-subtitle">Quản lý tất cả người dùng trong hệ thống</p>
              </div>
              <button className="btn-back" onClick={() => router.push('/admin')}>
                <i className="bi bi-arrow-left"></i>
                Về Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stat-box">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    <Users size={24} color="#fff" />
                  </div>
                  <div className="stat-label">Tổng người dùng</div>
                  <h3 className="stat-value">{stats.total}</h3>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stat-box">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF5252)' }}>
                    <Shield size={24} color="#fff" />
                  </div>
                  <div className="stat-label">Quản trị viên</div>
                  <h3 className="stat-value">{stats.admins}</h3>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stat-box">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                    <User size={24} color="#fff" />
                  </div>
                  <div className="stat-label">Khách hàng</div>
                  <h3 className="stat-value">{stats.customers}</h3>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="stat-box">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
                    <i className="bi bi-check-circle" style={{ fontSize: '24px', color: '#fff' }}></i>
                  </div>
                  <div className="stat-label">Đang hoạt động</div>
                  <h3 className="stat-value">{stats.active}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div className="search-box">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm theo email, tên, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                  <button
                    className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterRole('all')}
                  >
                    <Filter size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Tất cả
                  </button>
                  <button
                    className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
                    onClick={() => setFilterRole('admin')}
                  >
                    <Shield size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Admin
                  </button>
                  <button
                    className={`filter-btn ${filterRole === 'customer' ? 'active' : ''}`}
                    onClick={() => setFilterRole('customer')}
                  >
                    <User size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Khách hàng
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="users-table">
            <div className="table-header">
              <h4 className="table-title">
                Danh sách người dùng ({filteredUsers.length})
              </h4>
            </div>
            <div className="table-container">
              {filteredUsers.length > 0 ? (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Họ tên</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Ngày đăng ký</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Mail size={16} color="#FF8E53" />
                            <strong>{user.email}</strong>
                          </div>
                        </td>
                        <td>{user.ho_ten || <span className="text-muted">Chưa cập nhật</span>}</td>
                        <td>
                          {user.sdt ? (
                            <div className="d-flex align-items-center gap-2">
                              <Phone size={14} color="#666" />
                              {user.sdt}
                            </div>
                          ) : (
                            <span className="text-muted">Chưa có</span>
                          )}
                        </td>
                        <td>
                          <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-customer'}`}>
                            {user.role === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.trangthai === 1 ? 'status-active' : 'status-inactive'}`}>
                            {user.trangthai === 1 ? '✓ Hoạt động' : '✗ Vô hiệu'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Calendar size={14} color="#666" />
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(user)}
                              title="Chỉnh sửa người dùng"
                            >
                              <Edit size={16} />
                              Sửa
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(user.id, user.email)}
                              disabled={deleteLoading === user.id || user.role === 'admin'}
                              title={user.role === 'admin' ? 'Không thể xóa Admin' : 'Xóa người dùng'}
                            >
                              {deleteLoading === user.id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm"></span>
                                  Đang xóa...
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} />
                                  Xóa
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Users size={40} color="#FF8E53" />
                  </div>
                  <p className="empty-text">
                    {searchTerm || filterRole !== 'all' 
                      ? 'Không tìm thấy người dùng phù hợp' 
                      : 'Chưa có người dùng nào'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Modal */}
          {editingUser && (
            <div className="modal-overlay" onClick={() => setEditingUser(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h4 className="modal-title">Chỉnh sửa người dùng</h4>
                  <button className="modal-close" onClick={() => setEditingUser(null)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email (không thể thay đổi)</label>
                    <input type="text" className="form-control" value={editingUser.email} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Họ tên</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editForm.ho_ten}
                      onChange={(e) => setEditForm({...editForm, ho_ten: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editForm.sdt}
                      onChange={(e) => setEditForm({...editForm, sdt: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai trò</label>
                    <select 
                      className="form-select" 
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'customer'})}
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <select 
                      className="form-select" 
                      value={editForm.trangthai}
                      onChange={(e) => setEditForm({...editForm, trangthai: parseInt(e.target.value)})}
                    >
                      <option value={1}>Hoạt động</option>
                      <option value={0}>Vô hiệu</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setEditingUser(null)}>Hủy</button>
                  <button className="btn-save" onClick={handleUpdate}>Lưu thay đổi</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

