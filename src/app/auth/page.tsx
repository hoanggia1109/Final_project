'use client';
import { useState } from 'react';
import Link from 'next/link';
import LocationSelector from '../component/LocationSelector';
import { API_BASE_URL } from '@/lib/api-config';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    gender: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error khi user bắt đầu nhập
    if (loginErrors[name]) {
      setLoginErrors({ ...loginErrors, [name]: '' });
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error khi user bắt đầu nhập
    if (registerErrors[name]) {
      setRegisterErrors({ ...registerErrors, [name]: '' });
    }
  };

  const validateLogin = (): boolean => {
    const errors: Record<string, string> = {};
    if (!loginData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    if (!loginData.password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = (): boolean => {
    const errors: Record<string, string> = {};
    if (!registerData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!registerData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    if (!registerData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(registerData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!registerData.password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (registerData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!registerData.confirmPassword.trim()) {
      errors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }
    if (!registerData.agreeTerms) {
      errors.agreeTerms = 'Vui lòng đồng ý với điều khoản sử dụng';
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLogin()) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/dangnhap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Kiểm tra nếu email chưa xác thực
        if (data.requiresVerification) {
          alert(data.message + '\n\nVui lòng kiểm tra email và click vào link xác nhận để kích hoạt tài khoản.');
          return;
        }
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        
        if (data.user) {
          const userName = data.user.fullName || data.user.email.split('@')[0];
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userRole', data.user.role || 'customer');
          // Lưu userId để dùng cho Socket.IO tracking
          if (data.user.id) {
            localStorage.setItem('userId', data.user.id);
          }
        }
      }

      alert('Đăng nhập thành công!');
      
      const userRole = localStorage.getItem('userRole');
      setTimeout(() => {
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 200);
    } catch (error) {
      console.error(' Lỗi đăng nhập:', error);
      alert((error as Error).message || 'Email hoặc mật khẩu không đúng!');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegister()) {
      return;
    }

    try {
      // Chuyển đổi giới tính từ chuỗi sang số (database mong đợi integer)
      let gioitinhValue: number | null = null;
      if (registerData.gender) {
        if (registerData.gender === 'male') {
          gioitinhValue = 1;
        } else if (registerData.gender === 'female') {
          gioitinhValue = 0;
        } else if (registerData.gender === 'other') {
          gioitinhValue = 2;
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/dangky`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName,
          phone: registerData.phone,
          ngaysinh: registerData.birthDate || null,
          gioitinh: gioitinhValue,
          address: registerData.address || null,
          city: registerData.city || null,
          district: registerData.district || null,
          ward: registerData.ward || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại');

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setMode('login');
      setLoginData({ ...loginData, email: registerData.email, password: '' });
    } catch (error) {
      console.error('❌ Lỗi đăng ký:', error);
      alert((error as Error).message || 'Có lỗi xảy ra khi đăng ký!');
    }
  };

  return (
    <div 
      className="position-relative"
      style={{
        minHeight: '100vh',
        background: mode === 'login' 
          ? 'linear-gradient(135deg, #FFC107 0%, #FF8E53 100%)'
          : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        transition: 'background 0.6s ease',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: mode === 'login'
            ? 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920")'
            : 'url("https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Animated Shapes */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <div
          className="position-absolute rounded-circle"
          style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '-150px',
            right: '-150px',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          className="position-absolute rounded-circle"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.08)',
            bottom: '-100px',
            left: '-100px',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Forms Container */}
      <div 
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ 
          minHeight: '100vh',
          padding: '20px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="row g-0">
              {/* Forms - Full Width */}
              <div className="col-12 position-relative" style={{ overflow: 'hidden' }}>
                <div 
                  className="p-4" 
                >
                  <div className="mb-3">
                    <Link 
                      href="/" 
                      className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center"
                      style={{ 
                        color: '#FF6B6B',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FF8E53';
                        e.currentTarget.style.transform = 'translateX(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#FF6B6B';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      <span>Quay lại trang chủ</span>
                    </Link>
                  </div>

                  {/* Login Form */}
                  <div
                    style={{
                      display: mode === 'login' ? 'block' : 'none',
                      animation: mode === 'login' ? 'fadeIn 0.5s ease' : 'none',
                    }}
                  >
                  <h2 className="fw-bold mb-2" style={{ fontSize: '1.75rem' }}>Đăng Nhập</h2>
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>Nhập thông tin để tiếp tục</p>

                  <form onSubmit={handleLoginSubmit} noValidate>
                    <div className="mb-2">
                      <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Email <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-light"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          style={{
                            borderColor: loginErrors.email ? '#dc3545' : undefined
                          }}
                        />
                      </div>
                      {loginErrors.email && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                          {loginErrors.email}
                        </small>
                      )}
                    </div>

                    <div className="mb-2">
                      <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Mật khẩu <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="form-control bg-light"
                          placeholder="Nhập mật khẩu"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          style={{
                            borderColor: loginErrors.password ? '#dc3545' : undefined
                          }}
                        />
                        <button
                          type="button"
                          className="btn bg-light"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                      {loginErrors.password && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                          {loginErrors.password}
                        </small>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          className="form-check-input"
                          id="rememberMe"
                          checked={loginData.rememberMe}
                          onChange={handleLoginChange}
                        />
                        <label className="form-check-label small" htmlFor="rememberMe">Ghi nhớ</label>
                      </div>
                      <Link 
                        href="/forgot-password" 
                        className="text-decoration-none small" 
                        style={{ color: '#FF8E53', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B6B'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#FF8E53'}
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <button 
                      type="submit" 
                      className="btn text-white w-100 fw-bold mb-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
                        padding: '12px',
                        fontSize: '15px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(255, 142, 83, 0.3)',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.4)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 142, 83, 0.3)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)';
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Đăng Nhập Ngay
                    </button>

                    <div className="text-center">
                      <p className="text-muted small mb-0">
                        Chưa có tài khoản?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('register')}
                          className="btn btn-link p-0 text-decoration-none fw-semibold"
                          style={{ color: '#FF6B6B', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#FF8E53'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#FF6B6B'}
                        >
                          Đăng ký ngay
                        </button>
                      </p>
                    </div>
                  </form>
                </div>

                  {/* Register Form */}
                  <div
                    style={{
                      display: mode === 'register' ? 'block' : 'none',
                      animation: mode === 'register' ? 'fadeIn 0.5s ease' : 'none',
                    }}
                  >
                  <h2 className="fw-bold mb-2" style={{ fontSize: '1.75rem' }}>Đăng Ký</h2>
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>Tạo tài khoản mới</p>

                  <form onSubmit={handleRegisterSubmit} noValidate>
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Họ tên <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control bg-light"
                          placeholder="Nguyễn Văn A"
                          value={registerData.fullName}
                          onChange={handleRegisterChange}
                          style={{
                            borderColor: registerErrors.fullName ? '#dc3545' : undefined
                          }}
                        />
                        {registerErrors.fullName && (
                          <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                            {registerErrors.fullName}
                          </small>
                        )}
                      </div>

                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Email <span className="text-danger">*</span></label>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-light"
                          placeholder="your@email.com"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          style={{
                            borderColor: registerErrors.email ? '#dc3545' : undefined
                          }}
                        />
                        {registerErrors.email && (
                          <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                            {registerErrors.email}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Số điện thoại <span className="text-danger">*</span></label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control bg-light"
                          placeholder="0123456789"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          style={{
                            borderColor: registerErrors.phone ? '#dc3545' : undefined
                          }}
                        />
                        {registerErrors.phone && (
                          <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                            {registerErrors.phone}
                          </small>
                        )}
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Ngày sinh</label>
                        <input
                          type="date"
                          name="birthDate"
                          className="form-control bg-light"
                          value={registerData.birthDate}
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Giới tính</label>
                        <select
                          name="gender"
                          className="form-select bg-light"
                          value={registerData.gender}
                          onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Địa chỉ</label>
                        <input
                          type="text"
                          name="address"
                          className="form-control bg-light"
                          placeholder="Số nhà, tên đường"
                          value={registerData.address}
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-2">
                      <LocationSelector
                        selectedCity={registerData.city}
                        selectedDistrict={registerData.district}
                        selectedWard={registerData.ward}
                        onCityChange={(city) => setRegisterData(prev => ({ ...prev, city }))}
                        onDistrictChange={(district) => setRegisterData(prev => ({ ...prev, district }))}
                        onWardChange={(ward) => setRegisterData(prev => ({ ...prev, ward }))}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Mật khẩu <span className="text-danger">*</span></label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="form-control bg-light"
                            placeholder="Tối thiểu 6 ký tự"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            style={{
                              borderColor: registerErrors.password ? '#dc3545' : undefined
                            }}
                          />
                          <button
                            type="button"
                            className="btn bg-light"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                        {registerErrors.password && (
                          <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                            {registerErrors.password}
                          </small>
                        )}
                      </div>

                      <div className="col-md-6 mb-2">
                        <label className="form-label fw-semibold small" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>Xác nhận mật khẩu <span className="text-danger">*</span></label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            className="form-control bg-light"
                            placeholder="Nhập lại mật khẩu"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            style={{
                              borderColor: registerErrors.confirmPassword ? '#dc3545' : undefined
                            }}
                          />
                          <button
                            type="button"
                            className="btn bg-light"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                        {registerErrors.confirmPassword && (
                          <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                            {registerErrors.confirmPassword}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        className="form-check-input"
                        id="agreeTerms"
                        checked={registerData.agreeTerms}
                        onChange={handleRegisterChange}
                        style={{
                          borderColor: registerErrors.agreeTerms ? '#dc3545' : undefined
                        }}
                      />
                      <label className="form-check-label small" htmlFor="agreeTerms">
                        Tôi đồng ý với{' '}
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none border-0"
                          style={{ 
                            color: '#FF6B6B', 
                            transition: 'all 0.3s ease',
                            fontSize: 'inherit',
                            fontWeight: 'inherit',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTermsModal(true);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#FF8E53'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#FF6B6B'}
                        >
                          Điều khoản sử dụng
                        </button>
                      </label>
                      {registerErrors.agreeTerms && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                          {registerErrors.agreeTerms}
                        </small>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      className="btn text-white w-100 fw-bold mb-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA726 100%)',
                        padding: '12px',
                        fontSize: '15px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 167, 38, 0.4)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #FFA726 0%, #FF6B6B 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FFA726 100%)';
                      }}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Đăng Ký Tài Khoản
                    </button>

                    <div className="text-center">
                      <p className="text-muted small mb-0">
                        Đã có tài khoản?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="btn btn-link p-0 text-decoration-none fw-semibold"
                          style={{ color: '#FFA726', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B6B'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#FFA726'}
                        >
                          Đăng nhập ngay
                        </button>
                      </p>
                    </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white rounded-3 shadow-lg"
            style={{
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h4 className="fw-bold mb-0" style={{ color: '#FF6B6B' }}>Điều khoản sử dụng</h4>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowTermsModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="p-4" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              <h5 className="fw-semibold mb-3">1. Chấp nhận điều khoản</h5>
              <p className="text-muted mb-4">
                Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu ra dưới đây.
              </p>

              <h5 className="fw-semibold mb-3">2. Quyền sở hữu trí tuệ</h5>
              <p className="text-muted mb-4">
                Tất cả nội dung trên website này, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, hình ảnh, phần mềm, đều thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép và được bảo vệ bởi luật bản quyền.
              </p>

              <h5 className="fw-semibold mb-3">3. Sử dụng dịch vụ</h5>
              <p className="text-muted mb-4">
                Bạn được phép sử dụng website này cho mục đích cá nhân và thương mại hợp pháp. Bạn không được phép sao chép, phân phối, sửa đổi, tạo ra các tác phẩm phái sinh từ nội dung của website mà không có sự cho phép bằng văn bản của chúng tôi.
              </p>

              <h5 className="fw-semibold mb-3">4. Tài khoản người dùng</h5>
              <p className="text-muted mb-4">
                Khi tạo tài khoản, bạn có trách nhiệm bảo mật thông tin đăng nhập của mình. Bạn chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của bạn.
              </p>

              <h5 className="fw-semibold mb-3">5. Bảo mật thông tin</h5>
              <p className="text-muted mb-4">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo chính sách bảo mật. Tuy nhiên, không có phương thức truyền tải qua internet nào là hoàn toàn an toàn.
              </p>

              <h5 className="fw-semibold mb-3">6. Giới hạn trách nhiệm</h5>
              <p className="text-muted mb-4">
                Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng website này.
              </p>

              <h5 className="fw-semibold mb-3">7. Thay đổi điều khoản</h5>
              <p className="text-muted mb-4">
                Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Việc tiếp tục sử dụng website sau khi có thay đổi được coi là bạn đã chấp nhận các điều khoản mới.
              </p>

              <h5 className="fw-semibold mb-3">8. Liên hệ</h5>
              <p className="text-muted mb-0">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại được cung cấp trên website.
              </p>
            </div>
            <div className="p-4 border-top text-end">
              <button
                type="button"
                className="btn text-white fw-semibold"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA726 100%)',
                  padding: '10px 30px',
                  borderRadius: '8px',
                  border: 'none'
                }}
                onClick={() => setShowTermsModal(false)}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Form Input Styling */
        .form-control,
        .form-select {
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
        }
        
        .input-group-text {
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
        }
        
        /* Form Input Focus */
        .form-control:focus,
        .form-select:focus {
          border-color: #FF8E53;
          box-shadow: 0 0 0 0.2rem rgba(255, 142, 83, 0.15);
        }
        
        .form-check-input:checked {
          background-color: #FF6B6B;
          border-color: #FF6B6B;
        }
        
        .form-check-input:focus {
          border-color: #FF8E53;
          box-shadow: 0 0 0 0.2rem rgba(255, 142, 83, 0.15);
        }
      `}</style>
    </div>
  );
}

