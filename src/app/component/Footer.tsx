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

      {/* Style JSX: Chỉ dùng để làm đẹp hiệu ứng hover mà Bootstrap mặc định không có */}
      <style jsx>{`
        .footer-item {
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        .footer-item:hover {
          color: #ffc107 !important; /* Màu vàng khi di chuột vào */
          padding-left: 5px; /* Hiệu ứng trượt nhẹ sang phải */
        }
        
        .social-icon {
          width: 36px;
          height: 36px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .social-icon:hover {
          background-color: #ffc107;
          border-color: #ffc107 !important;
          color: #000 !important;
        }
      `}</style>
    </>
  );
}