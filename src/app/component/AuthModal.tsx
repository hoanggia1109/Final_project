'use client';
import { useState } from 'react';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onLoginSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Login:', { email: formData.email, password: formData.password });
      alert('Đăng nhập thành công!');
      if (onLoginSuccess) onLoginSuccess();
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
      }
      console.log('Register:', formData);
      alert('Đăng ký thành công!');
      if (onLoginSuccess) onLoginSuccess();
    }
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
        style={{
          opacity: 0.5,
          zIndex: 1050,
        }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow-lg"
        style={{
          zIndex: 1051,
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'modalSlideIn 0.3s ease-out',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-close position-absolute top-0 end-0 m-3"
          style={{ zIndex: 1 }}
        ></button>

        <div className="p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-inline-block bg-warning mb-3" style={{ width: '50px', height: '3px' }}></div>
            <h2 className="fw-bold mb-2">
              {mode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
            </h2>
            <p className="text-muted small">
              {mode === 'login' 
                ? 'Chào mừng bạn quay trở lại!' 
                : 'Tạo tài khoản để trải nghiệm dịch vụ của chúng tôi'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Nhập họ và tên"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>

            {mode === 'register' && (
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                />
              </div>
            )}

            {/* Forgot Password Link (Login only) */}
            {mode === 'login' && (
              <div className="text-end mb-3">
                <Link href="/forgot-password" className="text-decoration-none small" style={{ color: '#FFC107' }}>
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-warning text-white w-100 py-3 fw-semibold mb-3"
              style={{
                fontSize: '16px',
                borderRadius: '8px',
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
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>

            {/* Divider */}
            <div className="position-relative text-center my-4">
              <hr />
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                hoặc
              </span>
            </div>

            {/* Social Login Buttons */}
            <div className="d-grid gap-2 mb-3">
              <button
                type="button"
                className="btn btn-outline-dark py-2"
                style={{ borderRadius: '8px', fontSize: '15px' }}
              >
                <i className="bi bi-google me-2"></i>
                Tiếp tục với Google
              </button>
              <button
                type="button"
                className="btn btn-outline-primary py-2"
                style={{ borderRadius: '8px', fontSize: '15px' }}
              >
                <i className="bi bi-facebook me-2"></i>
                Tiếp tục với Facebook
              </button>
            </div>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="text-muted small mb-0">
                {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="btn btn-link p-0 text-decoration-none fw-semibold"
                  style={{ color: '#FFC107' }}
                >
                  {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Animation */}
        <style jsx>{`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}</style>
      </div>
    </>
  );
}

