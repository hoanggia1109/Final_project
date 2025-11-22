'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserData {
  id: string;
  email: string;
  ho_ten: string;
  sdt: string;
  ngaysinh: string;
  gioitinh: string;
  avatar: string;
  role: string;
}

interface Stats {
  orderCount: number;
  wishlistCount: number;
  addressCount: number;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: '',
    email: '',
    ho_ten: '',
    sdt: '',
    ngaysinh: '',
    gioitinh: 'male',
    avatar: '',
    role: 'customer',
  });
  const [stats, setStats] = useState<Stats>({
    orderCount: 0,
    wishlistCount: 0,
    addressCount: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserData(data.user);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ho_ten: userData.ho_ten,
          sdt: userData.sdt,
          ngaysinh: userData.ngaysinh,
          gioitinh: userData.gioitinh,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUserData(data.user);
      alert('Cập nhật thông tin thành công!');
      setEditing(false);
      
      // Update localStorage for header display
      localStorage.setItem('userName', userData.ho_ten);
      window.dispatchEvent(new Event('loginSuccess'));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File ảnh không được vượt quá 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Chỉ chấp nhận file ảnh');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      setUserData(prev => ({ ...prev, avatar: data.avatar }));
      alert('Upload avatar thành công!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Không thể upload avatar');
    } finally {
      setUploading(false);
    }
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
                        border: '4px solid #FFC107',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      {userData.avatar ? (
                        <Image
                          src={`http://localhost:5001${userData.avatar}`}
                          alt="Avatar"
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                          <i className="bi bi-person-circle text-muted" style={{ fontSize: '60px' }}></i>
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="btn btn-warning btn-sm position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: '32px', height: '32px', padding: 0, cursor: 'pointer' }}
                    >
                      {uploading ? (
                        <span className="spinner-border spinner-border-sm text-white" role="status"></span>
                      ) : (
                        <i className="bi bi-camera text-white"></i>
                      )}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      style={{ display: 'none' }}
                      disabled={uploading}
                    />
                  </div>
                  <h5 className="fw-bold mb-1">{userData.ho_ten || 'User'}</h5>
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
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2 me-2"></i>
                            Lưu
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Họ và tên</label>
                    <input
                      type="text"
                      name="ho_ten"
                      className="form-control"
                      value={userData.ho_ten || ''}
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
                      name="sdt"
                      className="form-control"
                      placeholder="0123456789"
                      value={userData.sdt || ''}
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
                      name="ngaysinh"
                      className="form-control"
                      value={userData.ngaysinh || ''}
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
                      name="gioitinh"
                      className="form-select"
                      value={userData.gioitinh || 'male'}
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
                        <h4 className="fw-bold mt-2 mb-0">{stats.orderCount}</h4>
                        <small className="text-muted">Đơn hàng</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-light text-center p-3" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-heart text-danger" style={{ fontSize: '32px' }}></i>
                        <h4 className="fw-bold mt-2 mb-0">{stats.wishlistCount}</h4>
                        <small className="text-muted">Yêu thích</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-0 bg-light text-center p-3" style={{ borderRadius: '12px' }}>
                        <i className="bi bi-geo-alt text-success" style={{ fontSize: '32px' }}></i>
                        <h4 className="fw-bold mt-2 mb-0">{stats.addressCount}</h4>
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

