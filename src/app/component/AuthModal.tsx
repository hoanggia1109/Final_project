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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error khi user nhập
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
                required
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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

