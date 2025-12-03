'use client';

export default function Footer() {
  // Danh sách sản phẩm (Chỉ để chữ hiển thị)
  const products = [
    'Sofa phòng khách',
    'Bàn trà - Kệ Tivi',
    'Bộ bàn ghế ăn',
    'Giường ngủ hiện đại',
    'Tủ quần áo',
    'Bàn trang điểm',
    'Nội thất văn phòng',
    'Đồ trang trí (Decor)'
  ];

  // Danh sách hỗ trợ
  const supports = [
    'Hướng dẫn mua hàng',
    'Chính sách bảo hành',
    'Chính sách đổi trả',
    'Vận chuyển & Lắp đặt',
    'Hình thức thanh toán',
    'Bảo mật thông tin'
  ];

  return (
    <>
      <footer className="bg-dark text-white pt-5 pb-4 footer-container">
        <div className="container">
          <div className="row g-4">
            
            {/* Cột 1: Thương hiệu */}
            <div className="col-lg-4 col-md-6">
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-white text-dark fw-bold px-2 py-1 me-2 rounded-1" style={{ fontSize: '20px' }}>
                    DN
                  </div>
                  <span className="fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '18px' }}>
                    Nội thất Danny
                  </span>
                </div>
                <p className="text-white-50 small mb-4" style={{ lineHeight: '1.8' }}>
                  Nâng tầm không gian sống của bạn với những sản phẩm nội thất chất lượng, 
                  thiết kế hiện đại và tinh tế. Chúng tôi cam kết mang lại sự hài lòng tuyệt đối.
                </p>
                
                {/* Social Icons - Giữ nguyên vẻ đẹp nhưng code gọn hơn */}
                <div className="d-flex gap-2">
                  {['facebook', 'instagram', 'tiktok', 'youtube'].map((icon, index) => (
                    <div key={index} className="social-icon d-flex align-items-center justify-content-center rounded-circle border border-secondary text-white">
                      <i className={`bi bi-${icon}`}></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột 2: Danh mục Sản phẩm */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-warning fw-bold text-uppercase mb-4" style={{ fontSize: '16px' }}>
                Sản phẩm
              </h5>
              <ul className="list-unstyled">
                {products.map((item, index) => (
                  <li key={index} className="mb-2">
                    <span className="footer-item text-white-50">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 3: Hỗ trợ khách hàng */}
            <div className="col-lg-2 col-md-6">
              <h5 className="text-warning fw-bold text-uppercase mb-4" style={{ fontSize: '16px' }}>
                Hỗ trợ
              </h5>
              <ul className="list-unstyled">
                {supports.map((item, index) => (
                  <li key={index} className="mb-2">
                    <span className="footer-item text-white-50">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 4: Liên hệ */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-warning fw-bold text-uppercase mb-4" style={{ fontSize: '16px' }}>
                Liên hệ
              </h5>
              <ul className="list-unstyled small text-white-50">
                <li className="mb-3 d-flex">
                  <i className="bi bi-geo-alt-fill text-warning me-2 mt-1"></i>
                  <span>Số Đường 3, KDC Vạn Phúc, Hiệp Bình Phước, Thủ Đức, TP. HCM</span>
                </li>
                <li className="mb-3 d-flex">
                  <i className="bi bi-telephone-fill text-warning me-2 mt-1"></i>
                  <div>
                    <span className="d-block text-white fw-bold fs-6">(028) 66 857 354</span>
                    <span className="small">Hỗ trợ 24/7</span>
                  </div>
                </li>
                <li className="d-flex">
                  <i className="bi bi-envelope-fill text-warning me-2 mt-1"></i>
                  <span>info@noithatdanny.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-top border-secondary mt-5 pt-3 text-center">
            <p className="small text-secondary mb-0">
              © 2024 <b>Nội thất Danny</b>. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Style JSX: Responsive và hiệu ứng hover */}
      <style jsx>{`
        .footer-container {
          padding-top: 3.5rem !important;
          padding-bottom: 2rem !important;
          background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%) !important;
        }

        .footer-item {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 14px;
          display: inline-block;
          position: relative;
        }
        .footer-item:hover {
          color: #ffc107 !important;
          padding-left: 8px;
          transform: translateX(5px);
        }
        .footer-item::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: #ffc107;
          transition: width 0.3s ease;
        }
        .footer-item:hover::before {
          width: 20px;
        }
        
        .social-icon {
          width: 38px;
          height: 38px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          font-size: 16px;
          position: relative;
          overflow: hidden;
        }
        .social-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 193, 7, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }
        .social-icon:hover::before {
          width: 100%;
          height: 100%;
        }
        .social-icon:hover {
          background-color: #ffc107;
          border-color: #ffc107 !important;
          color: #000 !important;
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
        }
        .social-icon i {
          position: relative;
          z-index: 1;
        }

        /* Mobile First - Base styles for mobile */
        @media (max-width: 575.98px) {
          .footer-container {
            padding-top: 2.5rem !important;
            padding-bottom: 1.5rem !important;
          }

          .footer-container .container {
            padding-left: 20px;
            padding-right: 20px;
          }

          /* Brand section mobile - chỉ logo và tên căn giữa */
          .footer-container .col-lg-4 {
            margin-bottom: 2.5rem;
            text-align: left;
          }

          .footer-container .col-lg-4 .d-flex {
            justify-content: flex-start;
            margin-bottom: 1rem;
          }

          .footer-container .col-lg-4 .bg-white {
            font-size: 18px !important;
            padding: 8px 12px !important;
            box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
          }

          .footer-container .col-lg-4 span {
            font-size: 16px !important;
            letter-spacing: 1.5px !important;
          }

          .footer-container .col-lg-4 p {
            font-size: 13px !important;
            text-align: left;
            line-height: 1.7;
            margin-bottom: 1.25rem;
            color: rgba(255, 255, 255, 0.7) !important;
          }

          /* Social icons mobile */
          .footer-container .d-flex.gap-2 {
            justify-content: flex-start;
            margin-top: 0;
          }

          .social-icon {
            width: 42px !important;
            height: 42px !important;
            font-size: 18px !important;
          }

          /* Column titles mobile */
          .footer-container h5 {
            font-size: 15px !important;
            margin-bottom: 1.25rem !important;
            text-align: left;
            letter-spacing: 0.5px;
          }

          /* List items mobile - giữ text-align left */
          .footer-container .col-lg-3,
          .footer-container .col-lg-2 {
            text-align: left;
            margin-bottom: 2rem;
          }

          .footer-container ul {
            margin-bottom: 0;
          }

          .footer-item {
            font-size: 13.5px !important;
            line-height: 1.8;
          }

          /* Contact info mobile */
          .footer-container .col-lg-3 ul li {
            align-items: flex-start;
            text-align: left;
            margin-bottom: 1rem;
          }

          .footer-container .col-lg-3 ul li i {
            margin-top: 2px;
            font-size: 16px;
            flex-shrink: 0;
          }

          .footer-container .col-lg-3 ul li span {
            word-break: break-word;
            line-height: 1.6;
            font-size: 13px;
          }

          .footer-container .col-lg-3 ul li .d-block {
            font-size: 14px !important;
          }

          /* Copyright mobile */
          .footer-container .border-top {
            margin-top: 2.5rem !important;
            padding-top: 1.25rem !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }

          .footer-container .border-top p {
            font-size: 12px !important;
            line-height: 1.6;
          }
        }

        /* Tablet - 576px to 767px */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .footer-container {
            padding-top: 3rem !important;
            padding-bottom: 2rem !important;
          }

          .footer-container .col-md-6 {
            margin-bottom: 2.5rem;
          }

          .footer-container h5 {
            font-size: 15px !important;
            margin-bottom: 1.5rem !important;
          }

          .footer-item {
            font-size: 14px;
            line-height: 1.8;
          }

          .footer-container .col-lg-3 ul li {
            flex-wrap: wrap;
            margin-bottom: 1.25rem;
          }

          .footer-container .col-lg-3 ul li span {
            word-break: break-word;
            line-height: 1.7;
          }

          .social-icon {
            width: 40px;
            height: 40px;
          }
        }

        /* Small Desktop - 768px to 991px */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .footer-container {
            padding-top: 3.25rem !important;
            padding-bottom: 2rem !important;
          }

          .footer-container .col-md-6 {
            margin-bottom: 2rem;
          }

          .footer-container h5 {
            font-size: 15.5px !important;
            margin-bottom: 1.5rem !important;
          }

          .footer-item {
            font-size: 14px;
            line-height: 1.8;
          }

          .social-icon {
            width: 38px;
            height: 38px;
          }
        }

        /* Large Desktop - 992px and up */
        @media (min-width: 992px) {
          .footer-container {
            padding-top: 4rem !important;
            padding-bottom: 2.5rem !important;
          }

          .footer-container h5 {
            font-size: 16px;
            margin-bottom: 1.75rem;
            letter-spacing: 0.5px;
          }

          .footer-item {
            font-size: 14px;
            line-height: 1.9;
          }

          .social-icon {
            width: 40px;
            height: 40px;
            font-size: 17px;
          }
        }

        /* Extra Large Desktop - 1200px and up */
        @media (min-width: 1200px) {
          .footer-container {
            padding-top: 4.5rem !important;
            padding-bottom: 3rem !important;
          }

          .footer-container .container {
            max-width: 1140px;
          }
        }

        /* Touch devices - better tap targets */
        @media (hover: none) and (pointer: coarse) {
          .footer-item {
            padding: 6px 0;
            min-height: 36px;
            display: flex;
            align-items: center;
          }

          .social-icon {
            min-width: 44px;
            min-height: 44px;
          }
        }

        /* Print styles */
        @media print {
          .footer-container {
            background: white !important;
            color: black !important;
          }

          .social-icon {
            display: none;
          }
        }
      `}</style>
    </>
  );
}