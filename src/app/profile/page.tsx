'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthday: '',
    gender: 'male',
    avatar: '/default-avatar.jpg'
  });

  useEffect(() => {
    // Load user data từ localStorage
    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('userName') || '';
    const role = localStorage.getItem('userRole') || 'customer';

    setUserData(prev => ({
      ...prev,
      email,
      fullName: name,
    }));
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Save to localStorage (hoặc call API)
    localStorage.setItem('userName', userData.fullName);
    alert('Cập nhật thông tin thành công!');
    setEditing(false);
    window.dispatchEvent(new Event('loginSuccess'));
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <div
                      className="rounded-circle overflow-hidden mx-auto mb-3"
                      style={{
                        width: '100px',
                        height: '100px',
                        border: '4px solid #FFC107'
                      }}
                    >
                      <Image
                        src={userData.avatar}
                        alt="Avatar"
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      className="btn btn-warning btn-sm position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                    >
                      <i className="bi bi-camera text-white"></i>
                    </button>
                  </div>
                  <h5 className="fw-bold mb-1">{userData.fullName || 'User'}</h5>
                  <p className="text-muted small mb-0">{userData.email}</p>
                </div>

                <div className="list-group list-group-flush">
                  <Link
                    href="/profile"
                    className="list-group-item list-group-item-action border-0 active"
                    style={{
                      backgroundColor: '#FFF8E1',
                      color: '#FFC107',
                      borderRadius: '12px',
                      marginBottom: '8px'
                    }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Tài khoản của tôi
                  </Link>
                  <Link
                    href="/orders"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px', marginBottom: '8px' }}
                  >
                    <i className="bi bi-bag-check me-2"></i>
                    Đơn hàng
                  </Link>
                  <Link
                    href="/wishlist"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px', marginBottom: '8px' }}
                  >
                    <i className="bi bi-heart me-2"></i>
                    Yêu thích
                  </Link>
                  <Link
                    href="/addresses"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px', marginBottom: '8px' }}
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    Địa chỉ
                  </Link>
                  <Link
                    href="/notifications"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="bi bi-bell me-2"></i>
                    Thông báo
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">
                    <i className="bi bi-person-circle text-warning me-2"></i>
                    Thông tin cá nhân
                  </h4>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn btn-outline-warning"
                      style={{ borderRadius: '12px' }}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={() => setEditing(false)}
                        className="btn btn-outline-secondary me-2"
                        style={{ borderRadius: '12px' }}
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="btn btn-warning text-white"
                        style={{ borderRadius: '12px' }}
                      >
                        <i className="bi bi-check2 me-2"></i>
                        Lưu
                      </button>
                    </div>
                  )}
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={userData.fullName}
                      onChange={handleChange}
                      disabled={!editing}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        backgroundColor: editing ? 'white' : '#f8f9fa'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={userData.email}
                      disabled
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    <small className="text-muted">Email không thể thay đổi</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="0123456789"
                      value={userData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        backgroundColor: editing ? 'white' : '#f8f9fa'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Ngày sinh</label>
                    <input
                      type="date"
                      name="birthday"
                      className="form-control"
                      value={userData.birthday}
                      onChange={handleChange}
                      disabled={!editing}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        backgroundColor: editing ? 'white' : '#f8f9fa'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Giới tính</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={userData.gender}
                      onChange={handleChange}
                      disabled={!editing}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        backgroundColor: editing ? 'white' : '#f8f9fa'
                      }}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="border-top mt-5 pt-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-shield-lock text-warning me-2"></i>
                    Đổi mật khẩu
                  </h5>
                  <Link
                    href="/change-password"
                    className="btn btn-outline-warning"
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="bi bi-key me-2"></i>
                    Thay đổi mật khẩu
                  </Link>
                </div>

                {/* Account Stats */}
                <div className="border-top mt-5 pt-4">
                  <h5 className="fw-bold mb-4">Thống kê tài khoản</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="card border-0 bg-light text-center p-3" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-bag-check text-warning" style={{ fontSize: '32px' }}></i>
                        <h4 className="fw-bold mt-2 mb-0">0</h4>
                        <small className="text-muted">Đơn hàng</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-light text-center p-3" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-heart text-danger" style={{ fontSize: '32px' }}></i>
                        <h4 className="fw-bold mt-2 mb-0">0</h4>
                        <small className="text-muted">Yêu thích</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-light text-center p-3" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-geo-alt text-success" style={{ fontSize: '32px' }}></i>
                        <h4 className="fw-bold mt-2 mb-0">0</h4>
                        <small className="text-muted">Địa chỉ</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

