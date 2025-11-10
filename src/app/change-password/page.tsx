'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pass_old: '',
    pass_new1: '',
    pass_new2: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new1: false,
    new2: false,
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để đổi mật khẩu!');
      router.push('/auth');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage(null);
  };

  const toggleShowPassword = (field: 'old' | 'new1' | 'new2') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.pass_old || !formData.pass_new1 || !formData.pass_new2) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }

    if (formData.pass_new1 !== formData.pass_new2) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp!' });
      return;
    }

    if (formData.pass_new1.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    if (formData.pass_old === formData.pass_new1) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải khác mật khẩu cũ!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/doipass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra!' });
        return;
      }

      setMessage({ 
        type: 'success', 
        text: 'Đổi mật khẩu thành công! Đang chuyển hướng...' 
      });
      
      setFormData({
        pass_old: '',
        pass_new1: '',
        pass_new2: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Không thể kết nối đến server!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div 
              className="card border-0 shadow-lg rounded-4"
              style={{
                background: '#ffffff',
              }}
            >
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                    }}
                  >
                    <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: '36px' }}></i>
                  </div>
                  <h3 className="fw-bold mb-2">Đổi mật khẩu</h3>
                  <p className="text-muted">
                    Cập nhật mật khẩu để bảo mật tài khoản của bạn
                  </p>
                </div>

                {/* Alert Messages */}
                {message && (
                  <div 
                    className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} rounded-3`}
                    role="alert"
                  >
                    <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}-fill me-2`}></i>
                    {message.text}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Old Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock me-2" style={{ color: '#4CAF50' }}></i>
                      Mật khẩu cũ <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPasswords.old ? 'text' : 'password'}
                        name="pass_old"
                        className="form-control form-control-lg"
                        placeholder="Nhập mật khẩu cũ"
                        value={formData.pass_old}
                        onChange={handleChange}
                        disabled={loading}
                        style={{
                          padding: '12px 48px 12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          fontSize: '16px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => toggleShowPassword('old')}
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        <i className={`bi bi-eye${showPasswords.old ? '-slash' : ''} text-muted`}></i>
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2" style={{ color: '#4CAF50' }}></i>
                      Mật khẩu mới <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPasswords.new1 ? 'text' : 'password'}
                        name="pass_new1"
                        className="form-control form-control-lg"
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        value={formData.pass_new1}
                        onChange={handleChange}
                        disabled={loading}
                        style={{
                          padding: '12px 48px 12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          fontSize: '16px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => toggleShowPassword('new1')}
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        <i className={`bi bi-eye${showPasswords.new1 ? '-slash' : ''} text-muted`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2" style={{ color: '#4CAF50' }}></i>
                      Xác nhận mật khẩu mới <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPasswords.new2 ? 'text' : 'password'}
                        name="pass_new2"
                        className="form-control form-control-lg"
                        placeholder="Nhập lại mật khẩu mới"
                        value={formData.pass_new2}
                        onChange={handleChange}
                        disabled={loading}
                        style={{
                          padding: '12px 48px 12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          fontSize: '16px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => toggleShowPassword('new2')}
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        <i className={`bi bi-eye${showPasswords.new2 ? '-slash' : ''} text-muted`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Security Tips */}
                  <div 
                    className="alert alert-info rounded-3 mb-4"
                    style={{ fontSize: '13px' }}
                  >
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <strong>Gợi ý:</strong> Sử dụng mật khẩu mạnh kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white mb-3"
                    disabled={loading}
                    style={{
                      background: loading 
                        ? '#cccccc' 
                        : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      padding: '14px',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        Đổi mật khẩu
                        <i className="bi bi-check-circle ms-2"></i>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link 
                      href="/" 
                      className="text-decoration-none text-muted"
                      style={{ fontWeight: '500' }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Quay về trang chủ
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



