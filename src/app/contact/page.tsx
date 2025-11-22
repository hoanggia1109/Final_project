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
      const response = await fetch('http://localhost:5001/api/lienhe', {
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
          background: linear-gradient(180deg, #FAFAF8 0%, #FFFFFF 50%, #F8F8F6 100%);
          min-height: 100vh;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .contact-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: #2C2C2C;
          margin-bottom: 15px;
          position: relative;
          display: inline-block;
        }

        .contact-title::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #D4AF37, #F4D03F);
          border-radius: 2px;
        }

        .contact-subtitle {
          font-size: 1.15rem;
          color: #666;
          margin-top: 30px;
          font-weight: 400;
        }

        .contact-card {
          background: #FFFFFF;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .contact-info-section {
          background: linear-gradient(135deg, #2C2C2C 0%, #3D3D3D 100%);
          padding: 60px 40px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .contact-info-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.05));
          border-radius: 50%;
        }

        .section-title {
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .section-description {
          opacity: 0.9;
          line-height: 1.7;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 35px;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .info-item:hover {
          transform: translateX(8px);
        }

        .info-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #D4AF37, #F4D03F);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.4rem;
          color: #2C2C2C;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .info-content h5 {
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 1.1rem;
          color: #D4AF37;
        }

        .info-content p {
          margin: 4px 0;
          opacity: 0.95;
          line-height: 1.6;
          color: #E8E8E8;
          font-size: 0.95rem;
        }

        .contact-form-section {
          padding: 60px 50px;
          background: #FFFFFF;
        }

        .form-title {
          font-weight: 700;
          font-size: 2rem;
          color: #2C2C2C;
          margin-bottom: 30px;
        }

        .form-label {
          font-weight: 600;
          color: #2C2C2C;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .form-control-custom {
          padding: 14px 18px;
          border-radius: 12px;
          border: 2px solid #E8E8E8;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #FAFAFA;
        }

        .form-control-custom:focus {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
          outline: none;
          background: #FFFFFF;
        }

        .form-control-custom::placeholder {
          color: #999;
        }

        textarea.form-control-custom {
          min-height: 160px;
          resize: vertical;
        }

        .btn-submit {
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #2C2C2C;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          width: 100%;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
          background: linear-gradient(135deg, #E5C046 0%, #F4D03F 100%);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .alert-custom {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .alert-success {
          background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
          color: #2E7D32;
          border: 2px solid #81C784;
        }

        .alert-error {
          background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
          color: #C62828;
          border: 2px solid #EF9A9A;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 40px;
          position: relative;
          z-index: 1;
        }

        .social-link {
          width: 48px;
          height: 48px;
          background: rgba(212, 175, 55, 0.15);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
          font-size: 1.3rem;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: #D4AF37;
          border-color: #D4AF37;
          transform: translateY(-3px);
          color: #2C2C2C;
        }

        .back-link {
          color: #D4AF37;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #C4A034;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .contact-title {
            font-size: 2rem;
          }

          .contact-info-section,
          .contact-form-section {
            padding: 40px 25px;
          }

          .section-title,
          .form-title {
            font-size: 1.6rem;
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
                  <h3 className="section-title">
                    Thông tin liên hệ
                  </h3>
                  <p className="section-description">
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
                  <h3 className="form-title">
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
                    <Link href="/" className="back-link">
                      <i className="bi bi-arrow-left"></i>
                      <span>Quay về trang chủ</span>
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
