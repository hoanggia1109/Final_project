'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    hoten: '',
    email: '',
    sdt: '',
    tieude: '',
    noidung: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.hoten || !formData.email || !formData.tieude || !formData.noidung) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ các trường bắt buộc!' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Email không hợp lệ!' });
      return;
    }

    // Phone validation (optional)
    if (formData.sdt && !/^[0-9]{10,11}$/.test(formData.sdt)) {
      setMessage({ type: 'error', text: 'Số điện thoại không hợp lệ (10-11 số)!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/lienhe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        text: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.' 
      });
      
      // Reset form
      setFormData({
        hoten: '',
        email: '',
        sdt: '',
        tieude: '',
        noidung: '',
      });

    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Không thể kết nối đến server!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        .contact-container {
          padding-top: 100px;
          padding-bottom: 80px;
          background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%);
          min-height: 100vh;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .contact-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 15px;
          position: relative;
          display: inline-block;
        }

        .contact-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #FF6B6B, #FF8E53);
          border-radius: 2px;
        }

        .contact-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin-top: 25px;
        }

        .contact-card {
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(255, 107, 107, 0.1);
          overflow: hidden;
        }

        .contact-info-section {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
          padding: 50px 40px;
          color: #fff;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 30px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          transform: translateX(10px);
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.3rem;
        }

        .info-content h5 {
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }

        .info-content p {
          margin: 0;
          opacity: 0.95;
          line-height: 1.6;
        }

        .contact-form-section {
          padding: 50px 40px;
        }

        .form-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .form-control-custom {
          padding: 14px 18px;
          border-radius: 12px;
          border: 2px solid #FFE5D9;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          border-color: #FF8E53;
          box-shadow: 0 0 0 3px rgba(255, 142, 83, 0.1);
          outline: none;
        }

        .form-control-custom::placeholder {
          color: #bbb;
        }

        textarea.form-control-custom {
          min-height: 150px;
          resize: vertical;
        }

        .btn-submit {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
          color: #fff;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.05rem;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          width: 100%;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .alert-custom {
          padding: 15px 20px;
          border-radius: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        }

        .alert-success {
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          color: #155724;
          border: 2px solid #c3e6cb;
        }

        .alert-error {
          background: linear-gradient(135deg, #f8d7da, #f5c6cb);
          color: #721c24;
          border: 2px solid #f5c6cb;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .social-link {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px);
          color: #fff;
        }

        @media (max-width: 768px) {
          .contact-title {
            font-size: 2rem;
          }

          .contact-info-section,
          .contact-form-section {
            padding: 30px 25px;
          }
        }
      `}</style>

      <div className="contact-container">
        <div className="container">
          {/* Header */}
          <div className="contact-header">
            <h1 className="contact-title">Liên hệ với chúng tôi</h1>
            <p className="contact-subtitle">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>

          {/* Contact Card */}
          <div className="contact-card">
            <div className="row g-0">
              {/* Contact Info */}
              <div className="col-lg-5">
                <div className="contact-info-section">
                  <h3 className="mb-4" style={{ fontWeight: '700', fontSize: '1.8rem' }}>
                    Thông tin liên hệ
                  </h3>
                  <p className="mb-4" style={{ opacity: 0.9, lineHeight: '1.7' }}>
                    Hãy liên hệ với chúng tôi qua các kênh dưới đây hoặc điền form bên cạnh
                  </p>

                  {/* Phone */}
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div className="info-content">
                      <h5>Điện thoại</h5>
                      <p>+84 123 456 789</p>
                      <p>+84 987 654 321</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div className="info-content">
                      <h5>Email</h5>
                      <p>support@shopnoithat.com</p>
                      <p>info@shopnoithat.com</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="info-content">
                      <h5>Địa chỉ</h5>
                      <p>123 Đường ABC, Quận 1</p>
                      <p>TP. Hồ Chí Minh, Việt Nam</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="bi bi-clock-fill"></i>
                    </div>
                    <div className="info-content">
                      <h5>Giờ làm việc</h5>
                      <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                      <p>Thứ 7: 8:00 - 12:00</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="social-links">
                    <a href="#" className="social-link" title="Facebook">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="social-link" title="Instagram">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="social-link" title="Twitter">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="social-link" title="YouTube">
                      <i className="bi bi-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-7">
                <div className="contact-form-section">
                  <h3 className="mb-4" style={{ fontWeight: '700', fontSize: '1.8rem', color: '#2c3e50' }}>
                    Gửi tin nhắn cho chúng tôi
                  </h3>

                  {/* Alert Messages */}
                  {message && (
                    <div className={`alert-custom alert-${message.type === 'success' ? 'success' : 'error'}`}>
                      <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}-fill`} style={{ fontSize: '1.3rem' }}></i>
                      <span>{message.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Họ và tên <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="hoten"
                          className="form-control-custom form-control"
                          placeholder="Nhập họ và tên"
                          value={formData.hoten}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control-custom form-control"
                          placeholder="Nhập email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          name="sdt"
                          className="form-control-custom form-control"
                          placeholder="Nhập số điện thoại"
                          value={formData.sdt}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>

                      {/* Subject */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Tiêu đề <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="tieude"
                          className="form-control-custom form-control"
                          placeholder="Nhập tiêu đề"
                          value={formData.tieude}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>

                      {/* Message */}
                      <div className="col-12">
                        <label className="form-label">
                          Nội dung <span className="text-danger">*</span>
                        </label>
                        <textarea
                          name="noidung"
                          className="form-control-custom form-control"
                          placeholder="Nhập nội dung tin nhắn..."
                          value={formData.noidung}
                          onChange={handleChange}
                          disabled={loading}
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send-fill me-2"></i>
                              Gửi tin nhắn
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Back to Home */}
                  <div className="text-center mt-4">
                    <Link 
                      href="/" 
                      className="text-decoration-none"
                      style={{ color: '#FF6B6B', fontWeight: '500' }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Quay về trang chủ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

