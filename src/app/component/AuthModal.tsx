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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error khi user nhập
    // Clear field error khi user bắt đầu nhập
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (mode === 'login') {
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
      }
      if (!formData.password.trim()) {
        errors.password = 'Vui lòng nhập mật khẩu';
      } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    } else {
      // Register mode
      if (!formData.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ tên';
      }
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Số điện thoại không hợp lệ';
      }
      if (!formData.password.trim()) {
        errors.password = 'Vui lòng nhập mật khẩu';
      } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      if (!formData.confirmPassword.trim()) {
        errors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu không khớp';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        // ========== ĐĂNG NHẬP ==========
        const response = await fetch('http://localhost:5000/api/auth/dangnhap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Kiểm tra nếu email chưa xác thực
          if (data.requiresVerification) {
            setError(data.message + '\n\nVui lòng kiểm tra email và click vào link xác nhận để kích hoạt tài khoản.');
            setLoading(false);
            return;
          }
          throw new Error(data.message || 'Đăng nhập thất bại');
        }

        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', data.token);
        
        // Kiểm tra xem có user object không
        if (data.user) {
          const userName = data.user.fullName || data.user.email.split('@')[0];
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userRole', data.user.role || 'customer');
          
          console.log('💾 AuthModal - Đã lưu localStorage:', {
            token: data.token.substring(0, 20) + '...',
            email: data.user.email,
            name: userName,
            role: data.user.role || 'customer'
          });
        } else {
          // Fallback nếu backend không trả về user object
          const userName = formData.email.split('@')[0];
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userRole', 'customer');
          
          console.log('💾 AuthModal - Đã lưu localStorage (fallback):', {
            token: data.token.substring(0, 20) + '...',
            email: formData.email,
            name: userName,
            role: 'customer'
          });
        }

        console.log('✅ Đăng nhập thành công!');
        
        // Bắn event để Header cập nhật ngay trong cùng tab
        try { 
          window.dispatchEvent(new Event('loginSuccess'));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        
        alert('Đăng nhập thành công!');
        if (onLoginSuccess) onLoginSuccess();
        onClose();
        
        // Redirect theo role
        const userRole = localStorage.getItem('userRole');
        setTimeout(() => {
          if (userRole === 'admin') {
            window.location.href = '/admin';
          } else {
          window.location.reload();
          }
        }, 200);

      } else {
        // ========== ĐĂNG KÝ ==========
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu không khớp!');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/dangky', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone,
            ngaysinh: null,
            gioitinh: null,
            address: null,
            city: null,
            district: null,
            ward: null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Đăng ký thất bại');
        }

        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        // Chuyển sang mode login sau khi đăng ký thành công
        setMode('login');
        setFormData({
          email: formData.email, // Giữ lại email
          password: '',
          confirmPassword: '',
          fullName: '',
          phone: '',
        });
      }
    } catch (err: unknown) {
      console.error('❌ Lỗi đăng ký:', err);
      setError((err as Error).message || 'Có lỗi xảy ra khi đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
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

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
              <small>{error}</small>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
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
                disabled={loading}
                style={{
                  padding: '12px 16px',
                  border: fieldErrors.email ? '1px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
              {fieldErrors.email && (
                <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                  {fieldErrors.email}
                </small>
              )}
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
                disabled={loading}
                style={{
                  padding: '12px 16px',
                  border: fieldErrors.password ? '1px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
              {fieldErrors.password && (
                <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                  {fieldErrors.password}
                </small>
              )}
            </div>

            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Họ tên</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Nhập họ tên"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      padding: '12px 16px',
                      border: fieldErrors.fullName ? '1px solid #dc3545' : '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                  {fieldErrors.fullName && (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                      {fieldErrors.fullName}
                    </small>
                  )}
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
                    disabled={loading}
                    style={{
                      padding: '12px 16px',
                      border: fieldErrors.phone ? '1px solid #dc3545' : '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                  {fieldErrors.phone && (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                      {fieldErrors.phone}
                    </small>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      padding: '12px 16px',
                      border: fieldErrors.confirmPassword ? '1px solid #dc3545' : '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                  {fieldErrors.confirmPassword && (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '12px' }}>
                      {fieldErrors.confirmPassword}
                    </small>
                  )}
                </div>
              </>
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
              disabled={loading}
              style={{
                fontSize: '16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {mode === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                </>
              ) : (
                mode === 'login' ? 'Đăng nhập' : 'Đăng ký'
              )}
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
                disabled={loading}
              >
                <i className="bi bi-google me-2"></i>
                Tiếp tục với Google
              </button>
              <button
                type="button"
                className="btn btn-outline-primary py-2"
                style={{ borderRadius: '8px', fontSize: '15px' }}
                disabled={loading}
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
                  disabled={loading}
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

