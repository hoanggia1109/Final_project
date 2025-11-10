'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Vui lòng nhập email!' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Email không hợp lệ!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/quenpass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra!' });
        return;
      }

      setMessage({ 
        type: 'success', 
        text: 'Đã gửi mật khẩu mới qua email! Vui lòng kiểm tra hộp thư của bạn.' 
      });
      setEmail('');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth');
      }, 3000);

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
                      background: 'linear-gradient(135deg, #FF8E53 0%, #FFA726 100%)',
                    }}
                  >
                    <i className="bi bi-key-fill text-white" style={{ fontSize: '36px' }}></i>
                  </div>
                  <h3 className="fw-bold mb-2">Quên mật khẩu?</h3>
                  <p className="text-muted">
                    Nhập email của bạn và chúng tôi sẽ gửi mật khẩu mới cho bạn
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
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2" style={{ color: '#FF8E53' }}></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage(null);
                      }}
                      disabled={loading}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        fontSize: '16px',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white mb-3"
                    disabled={loading}
                    style={{
                      background: loading 
                        ? '#cccccc' 
                        : 'linear-gradient(135deg, #FF8E53 0%, #FFA726 100%)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      padding: '14px',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(255, 142, 83, 0.3)',
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi mật khẩu mới
                        <i className="bi bi-send ms-2"></i>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link 
                      href="/auth" 
                      className="text-decoration-none"
                      style={{ color: '#FF8E53', fontWeight: '500' }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Help */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-2">
                <i className="bi bi-info-circle me-2"></i>
                Bạn cần hỗ trợ?
              </p>
              <Link 
                href="/contact" 
                className="text-decoration-none"
                style={{ color: '#FF8E53', fontWeight: '500' }}
              >
                Liên hệ với chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


