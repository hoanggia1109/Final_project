'use client';
import Link from 'next/link';

export default function Footer() {
  const servicesCol1 = [
    { name: 'Văn phòng', href: '/van-phong' },
    { name: 'Thiết kế cửa hàng', href: '/thiet-ke-cua-hang' },
    { name: 'Gym, Spa', href: '/gym-spa' },
    { name: 'Nhà hàng', href: '/nha-hang' },
    { name: 'Quán cà phê', href: '/quan-ca-phe' },
    { name: 'Quán trà sữa', href: '/quan-tra-sua' },
    { name: 'Showroom', href: '/showroom' },
    { name: 'Cách tính vực khác', href: '/cach-tinh-vuc-khac' },
  ];

  const servicesCol2 = [
    { name: 'Chính sách bảo hành', href: '/chinh-sach-bao-hanh' },
    { name: 'Điều khoản dịch vụ', href: '/dieu-khoan-dich-vu' },
    { name: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
  ];

  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row g-4">
          {/* Column 1 - Company Info */}
          <div className="col-md-3">
            {/* Logo */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-white text-dark px-2 py-1 fw-bold me-2" style={{ fontSize: '20px' }}>
                  DN
                </div>
                <span className="text-white" style={{ fontSize: '12px' }}>BRAND</span>
              </div>
            </div>

            {/* Company Description */}
            <p className="mb-4" style={{ fontSize: '13px', lineHeight: '1.7', color: '#aaa' }}>
              Công ty TNHH Trang trí Nội thất và Xây dựng Vân Tây
              <br /><br />
              chuyên thiết kế và thi công văn phòng và các cơ sở kinh doanh (quán cà phê, nhà hàng, phòng tập gym, yoga, các cửa hàng, showroom...)
            </p>

            {/* Social Icons */}
            <div className="d-flex gap-2">
              <a 
                href="#" 
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFC107';
                  e.currentTarget.style.borderColor = '#FFC107';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#fff';
                }}
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a 
                href="#" 
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFC107';
                  e.currentTarget.style.borderColor = '#FFC107';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#fff';
                }}
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Column 2 - Contact Info */}
          <div className="col-md-3">
            <h5 className="text-uppercase fw-bold mb-4" style={{ fontSize: '16px', color: '#FFC107' }}>
              LIÊN HỆ NGAY ĐỂ ĐƯỢC TƯ VẤN
            </h5>
            
            <div className="mb-3">
              <p className="mb-2" style={{ fontSize: '13px', color: '#aaa' }}>
                DANNYdecor rất hân hạnh được phục vụ quý khách tại văn phòng của chúng tôi:
              </p>
              <p className="mb-0 fw-semibold" style={{ fontSize: '13px', lineHeight: '1.7' }}>
                Số Đường 3, KDC Vạn Phúc, Hiệp Bình Phước, Thủ Đức, TP. HCM
              </p>
            </div>

            <div className="mb-3">
              <p className="mb-1 fw-bold text-warning" style={{ fontSize: '14px' }}>
                HOTLINE: (028) 66 857 354
              </p>
            </div>

            <div className="mb-2">
              <p className="mb-1" style={{ fontSize: '13px' }}>
                Email: <a href="mailto:info@dannydecor.com" className="text-warning text-decoration-none">info@dannydecor.com</a>
              </p>
            </div>

            <div>
              <p className="mb-1" style={{ fontSize: '13px' }}>
                Web: <a href="https://dannydecor.com" className="text-warning text-decoration-none">dannydecor.com</a>
              </p>
            </div>
          </div>

          {/* Column 3 - Services */}
          <div className="col-md-3">
            <h5 className="text-lowercase fw-bold mb-4" style={{ fontSize: '16px', color: '#FFC107' }}>
              Thiết kế
            </h5>
            <ul className="list-unstyled">
              {servicesCol1.map((service, idx) => (
                <li key={idx} className="mb-2">
                  <Link 
                    href={service.href} 
                    className="text-decoration-none"
                    style={{ 
                      fontSize: '13px', 
                      color: '#aaa',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FFC107'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#aaa'; }}
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Policies */}
          <div className="col-md-3">
            <h5 className="text-lowercase fw-bold mb-4" style={{ fontSize: '16px', color: '#FFC107' }}>
                Chính sách điều khoản
            </h5>
            <ul className="list-unstyled">
              {servicesCol2.map((service, idx) => (
                <li key={idx} className="mb-2">
                  <Link 
                    href={service.href} 
                    className="text-decoration-none"
                    style={{ 
                      fontSize: '13px', 
                      color: '#aaa',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FFC107'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#aaa'; }}
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-top border-secondary mt-5 pt-3">
          <p className="text-center mb-0" style={{ fontSize: '13px', color: '#777' }}>
            Dannydecor © 2022 , All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

