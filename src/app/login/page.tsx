'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
    alert('Đăng nhập thành công!');
    router.push('/');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
          zIndex: 0,
        }}
      ></div>

      {/* Animated Shapes */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
        <div
          className="position-absolute rounded-circle"
          style={{
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(255,193,7,0.3) 0%, rgba(255,193,7,0.1) 100%)',
            top: '-150px',
            right: '-150px',
            animation: 'float 6s ease-in-out infinite',
          }}
        ></div>
        <div
          className="position-absolute rounded-circle"
          style={{
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(255,193,7,0.2) 0%, rgba(255,193,7,0.05) 100%)',
            bottom: '-100px',
            left: '-100px',
            animation: 'float 8s ease-in-out infinite',
          }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
              <div className="row g-0">
                {/* Left Side - Branding */}
                <div
                  className="col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center text-white p-5"
                  style={{
                    background: 'linear-gradient(135deg, #FFC107 0%, #FFB000 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div className="position-relative z-index-2 text-center">
                    {/* Logo */}
                    <div className="mb-4">
                      <div
                        className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
                        style={{ width: '100px', height: '100px' }}
                      >
                        <i className="bi bi-house-heart-fill" style={{ fontSize: '48px', color: '#FFC107' }}></i>
                      </div>
                    </div>

                    <h2 className="fw-bold mb-3">Chào mừng trở lại!</h2>
                    <p className="mb-4 opacity-75">
                      Đăng nhập để trải nghiệm dịch vụ thiết kế và thi công nội thất tốt nhất
                    </p>

                    {/* Features */}
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

                  {/* Decorative Pattern */}
                  <div
                    className="position-absolute"
                    style={{
                      width: '200%',
                      height: '200%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                      top: '-50%',
                      left: '-50%',
                      opacity: 0.3,
                    }}
                  ></div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-md-7 p-5">
                  <div className="mb-4">
                    <Link href="/" className="btn btn-link text-decoration-none p-0 mb-3">
                      <i className="bi bi-arrow-left me-2"></i>
                      <span style={{ color: '#666' }}>Quay lại trang chủ</span>
                    </Link>
                    <h2 className="fw-bold mb-2">Đăng Nhập</h2>
                    <p className="text-muted">Nhập thông tin để tiếp tục</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small text-dark">
                        Email <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          className="form-control border-start-0 bg-light"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{
                            padding: '12px 16px',
                            fontSize: '15px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small text-dark">
                        Mật khẩu <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="form-control border-start-0 border-end-0 bg-light"
                          placeholder="Nhập mật khẩu"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          style={{
                            padding: '12px 16px',
                            fontSize: '15px',
                          }}
                        />
                        <button
                          type="button"
                          className="btn bg-light border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          className="form-check-input"
                          id="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small text-muted" htmlFor="rememberMe">
                          Ghi nhớ đăng nhập
                        </label>
                      </div>
                      <Link href="/forgot-password" className="text-decoration-none small fw-semibold" style={{ color: '#FFC107' }}>
                        Quên mật khẩu?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-warning text-white w-100 py-3 fw-semibold mb-4"
                      style={{
                        fontSize: '16px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,193,7,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Đăng Nhập
                    </button>

                    {/* Divider */}
                    <div className="position-relative text-center my-4">
                      <hr />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                        hoặc tiếp tục với
                      </span>
                    </div>

                    {/* Social Login */}
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-outline-dark w-100 py-2"
                          style={{ borderRadius: '8px' }}
                        >
                          <i className="bi bi-google me-2"></i>
                          Google
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100 py-2"
                          style={{ borderRadius: '8px' }}
                        >
                          <i className="bi bi-facebook me-2"></i>
                          Facebook
                        </button>
                      </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <p className="text-muted small mb-0">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="text-decoration-none fw-semibold" style={{ color: '#FFC107' }}>
                          Đăng ký ngay
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}

