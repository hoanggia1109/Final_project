'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
    gender: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/dangnhap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      if (data.token) {
        localStorage.setItem('token', data.token);
        
        if (data.user) {
          const userName = data.user.fullName || data.user.email.split('@')[0];
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userRole', data.user.role || 'customer');
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
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    if (!registerData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/dangky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName,
          phone: registerData.phone,
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
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        transition: 'background 0.6s ease',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: mode === 'login'
            ? 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920")'
            : 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
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
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="row g-0">
              {/* Left Side - Branding */}
              <div
                className="col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center text-white p-5 position-relative"
                style={{
                  background: mode === 'login'
                    ? 'linear-gradient(135deg, #FFC107 0%, #FFB000 100%)'
                    : 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                  transition: 'background 0.6s ease',
                }}
              >
                <div className="position-relative z-index-2 text-center">
                  <div className="mb-4">
                    <div
                      className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: '100px', height: '100px' }}
                    >
                      <i className="bi bi-house-heart-fill" style={{ fontSize: '48px', color: mode === 'login' ? '#FFC107' : '#FF6B6B' }}></i>
                    </div>
                  </div>

                  <h2 className="fw-bold mb-3">
                    {mode === 'login' ? 'Chào mừng trở lại!' : 'Tham gia ngay!'}
                  </h2>
                  <p className="mb-4 opacity-75">
                    {mode === 'login' 
                      ? 'Đăng nhập để trải nghiệm dịch vụ thiết kế và thi công nội thất tốt nhất'
                      : 'Đăng ký để khám phá thế giới nội thất đẳng cấp'}
                  </p>

                  <div className="text-start">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '20px' }}></i>
                      <span>Thiết kế chuyên nghiệp</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '20px' }}></i>
                      <span>Thi công uy tín</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2" style={{ fontSize: '20px' }}></i>
                      <span>Hỗ trợ 24/7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Forms with Slide Animation */}
              <div className="col-md-7 position-relative" style={{ overflow: 'hidden' }}>
                <div 
                  className="p-4 p-md-5" 
                  style={{ 
                    maxHeight: '80vh', 
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }}
                >
                  <div className="mb-3">
                    <Link href="/" className="btn btn-link text-decoration-none p-0">
                      <i className="bi bi-arrow-left me-2"></i>
                      <span style={{ color: '#666' }}>Quay lại trang chủ</span>
                    </Link>
                  </div>

                  {/* Login Form */}
                  <div
                    style={{
                      display: mode === 'login' ? 'block' : 'none',
                      animation: mode === 'login' ? 'fadeIn 0.5s ease' : 'none',
                    }}
                  >
                  <h2 className="fw-bold mb-2">Đăng Nhập</h2>
                  <p className="text-muted mb-4">Nhập thông tin để tiếp tục</p>

                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Email <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-light"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Mật khẩu <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="form-control bg-light"
                          placeholder="Nhập mật khẩu"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn bg-light"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
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
                      <Link href="/forgot-password" className="text-decoration-none small" style={{ color: '#FFC107' }}>
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <button 
                      type="submit" 
                      className="btn text-white w-100 fw-bold mb-3 shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #FFC107 0%, #FFB000 100%)',
                        padding: '14px',
                        fontSize: '16px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Đăng Nhập
                    </button>

                    <div className="text-center">
                      <p className="text-muted small mb-0">
                        Chưa có tài khoản?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('register')}
                          className="btn btn-link p-0 text-decoration-none fw-semibold"
                          style={{ color: '#FFC107' }}
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
                  <h2 className="fw-bold mb-2">Đăng Ký</h2>
                  <p className="text-muted mb-4">Tạo tài khoản mới</p>

                  <form onSubmit={handleRegisterSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Họ tên <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control bg-light"
                        placeholder="Nguyễn Văn A"
                        value={registerData.fullName}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        name="email"
                        className="form-control bg-light"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold small">Số điện thoại <span className="text-danger">*</span></label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control bg-light"
                          placeholder="0123456789"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold small">Ngày sinh</label>
                        <input
                          type="date"
                          name="birthDate"
                          className="form-control bg-light"
                          value={registerData.birthDate}
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Giới tính</label>
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

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control bg-light"
                        placeholder="Số nhà, tên đường"
                        value={registerData.address}
                        onChange={handleRegisterChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Thành phố</label>
                      <select
                        name="city"
                        className="form-select bg-light"
                        value={registerData.city}
                        onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                      >
                        <option value="">Chọn thành phố</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="danang">Đà Nẵng</option>
                        <option value="haiphong">Hải Phòng</option>
                        <option value="cantho">Cần Thơ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Mật khẩu <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="form-control bg-light"
                          placeholder="Tối thiểu 6 ký tự"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn bg-light"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          className="form-control bg-light"
                          placeholder="Nhập lại mật khẩu"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn bg-light"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        className="form-check-input"
                        id="agreeTerms"
                        checked={registerData.agreeTerms}
                        onChange={handleRegisterChange}
                      />
                      <label className="form-check-label small" htmlFor="agreeTerms">
                        Tôi đồng ý với <Link href="/terms" className="text-decoration-none">Điều khoản sử dụng</Link>
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      className="btn text-white w-100 fw-bold mb-3 shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                        padding: '14px',
                        fontSize: '16px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 107, 107, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Đăng Ký Ngay
                    </button>

                    <div className="text-center">
                      <p className="text-muted small mb-0">
                        Đã có tài khoản?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="btn btn-link p-0 text-decoration-none fw-semibold"
                          style={{ color: '#FF6B6B' }}
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Custom Scrollbar */
        .col-md-7 > div::-webkit-scrollbar {
          width: 6px;
        }
        
        .col-md-7 > div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .col-md-7 > div::-webkit-scrollbar-thumb {
          background: #FFC107;
          border-radius: 10px;
        }
        
        .col-md-7 > div::-webkit-scrollbar-thumb:hover {
          background: #FFB000;
        }
      `}</style>
    </div>
  );
}

