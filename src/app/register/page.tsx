'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }
    
    try {
      // ✅ GỌI API THẬT
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

      console.log('✅ Đăng ký thành công:', data);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/login');
    } catch (error) {
      console.error('❌ Lỗi đăng ký:', error);
      alert((error as Error).message || 'Có lỗi xảy ra khi đăng ký!');
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Background Image with Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
        }}
      ></div>

      {/* Animated Shapes */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <div
          className="position-absolute rounded-circle"
          style={{
            width: '400px',
            height: '400px',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '-200px',
            left: '-200px',
            animation: 'float 7s ease-in-out infinite',
          }}
        ></div>
        <div
          className="position-absolute rounded-circle"
          style={{
            width: '250px',
            height: '250px',
            background: 'rgba(255, 255, 255, 0.08)',
            bottom: '-125px',
            right: '-125px',
            animation: 'float 9s ease-in-out infinite',
          }}
        ></div>
      </div>

      {/* Register Card */}
      <div className="container position-relative" style={{ zIndex: 10, padding: '20px' }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-9">
            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
              <div className="row g-0">
                {/* Left Side - Branding */}
                <div
                  className="col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center text-white p-5"
                  style={{
                    background: 'linear-gradient(135deg, #FFB000 0%, #FFC107 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div className="position-relative z-index-2 text-center">
                    {/* Illustration */}
                    <div className="mb-4">
                      <div
                        className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
                        style={{ width: '100px', height: '100px' }}
                      >
                        <i className="bi bi-person-plus-fill" style={{ fontSize: '48px', color: '#FFC107' }}></i>
                      </div>
                    </div>

                    <h2 className="fw-bold mb-3">Tham gia cùng chúng tôi!</h2>
                    <p className="mb-4 opacity-75">
                      Tạo tài khoản để khám phá thế giới nội thất đẳng cấp
                    </p>

                    {/* Benefits */}
                    <div className="text-start">
                      <div className="d-flex align-items-start mb-3">
                        <i className="bi bi-gift-fill me-3 mt-1" style={{ fontSize: '20px' }}></i>
                        <div>
                          <div className="fw-semibold">Ưu đãi đặc biệt</div>
                          <small className="opacity-75">Giảm giá cho thành viên mới</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mb-3">
                        <i className="bi bi-stars me-3 mt-1" style={{ fontSize: '20px' }}></i>
                        <div>
                          <div className="fw-semibold">Tư vấn miễn phí</div>
                          <small className="opacity-75">Hỗ trợ thiết kế 1-1</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-start">
                        <i className="bi bi-shield-check me-3 mt-1" style={{ fontSize: '20px' }}></i>
                        <div>
                          <div className="fw-semibold">Bảo mật tuyệt đối</div>
                          <small className="opacity-75">Thông tin được mã hóa</small>
                        </div>
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

                {/* Right Side - Register Form */}
                <div className="col-md-7 p-5">
                  <div className="mb-4">
                    <Link href="/" className="btn btn-link text-decoration-none p-0 mb-3">
                      <i className="bi bi-arrow-left me-2"></i>
                      <span style={{ color: '#666' }}>Quay lại trang chủ</span>
                    </Link>
                    <h2 className="fw-bold mb-2">Đăng Ký</h2>
                    <p className="text-muted">Tạo tài khoản mới</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Full Name Input */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-dark">
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control border-start-0 bg-light"
                          placeholder="Nguyễn Văn A"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          style={{ padding: '12px 16px', fontSize: '15px' }}
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
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
                          style={{ padding: '12px 16px', fontSize: '15px' }}
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-dark">
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-phone text-muted"></i>
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control border-start-0 bg-light"
                          placeholder="0123456789"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          style={{ padding: '12px 16px', fontSize: '15px' }}
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
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
                          placeholder="Tối thiểu 6 ký tự"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                          style={{ padding: '12px 16px', fontSize: '15px' }}
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

                    {/* Confirm Password Input */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small text-dark">
                        Xác nhận mật khẩu <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-shield-check text-muted"></i>
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          className="form-control border-start-0 border-end-0 bg-light"
                          placeholder="Nhập lại mật khẩu"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          style={{ padding: '12px 16px', fontSize: '15px' }}
                        />
                        <button
                          type="button"
                          className="btn bg-light border-start-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="form-check mb-4">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        className="form-check-input"
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                        Tôi đồng ý với{' '}
                        <Link href="/terms" className="text-decoration-none" style={{ color: '#FFC107' }}>
                          Điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link href="/privacy" className="text-decoration-none" style={{ color: '#FFC107' }}>
                          Chính sách bảo mật
                        </Link>
                      </label>
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
                      Đăng Ký
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                      <p className="text-muted small mb-0">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-decoration-none fw-semibold" style={{ color: '#FFC107' }}>
                          Đăng nhập ngay
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
      <style>{`
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
