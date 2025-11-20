'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import PromoModal from './PromoModal';

export default function IntroductionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      alt: 'Team Building Activities',
      category: 'team'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      alt: 'Company Events',
      category: 'event'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
      alt: 'Team Celebration',
      category: 'celebration'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      alt: 'Office Environment',
      category: 'office'
    },
  ];

  return (
    <div className="introduction-page">
      {/* Hero Section */}
      <section className="position-relative" style={{ height: '600px', overflow: 'hidden' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
            alt="Modern Meeting Room"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.2))' }}
        />
        <div className="container position-relative h-100 d-flex align-items-center" style={{ zIndex: 2 }}>
          <div className="text-white">
            <h1 
              className="display-2 fw-bold mb-4" 
              style={{ 
                letterSpacing: '8px',
                textTransform: 'uppercase',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              Meeting Room
            </h1>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ width: '60px', height: '3px', backgroundColor: '#FFC107' }}></div>
              <p className="mb-0 h5" style={{ letterSpacing: '3px' }}>GIỚI THIỆU</p>
            </div>
            <p className="lead mb-0" style={{ maxWidth: '600px', fontSize: '18px', lineHeight: '1.8' }}>
              Không gian làm việc hiện đại, sáng tạo và chuyên nghiệp
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-3">
            {galleryImages.map((image) => (
              <div key={image.id} className="col-6 col-md-3">
                <div 
                  className="position-relative overflow-hidden rounded shadow-sm"
                  style={{ 
                    height: '240px',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onClick={() => setSelectedImage(image.url)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: 'rgba(255, 193, 7, 0)',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0)';
                    }}
                  >
                    <i 
                      className="bi bi-zoom-in text-white"
                      style={{ 
                        fontSize: '36px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                    ></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left Column - Content */}
            <div className="col-lg-6">
              <div className="mb-4">
                <span 
                  className="badge bg-warning text-dark px-3 py-2 mb-3"
                  style={{ fontSize: '14px', letterSpacing: '1px' }}
                >
                  VỀ CHÚNG TÔI
                </span>
                <h2 className="display-5 fw-bold mb-4" style={{ lineHeight: '1.3' }}>
                  DANNYdecor - Đối tác thiết kế và thi công nội thất uy tín
                </h2>
              </div>

              <div className="mb-4">
                <p className="text-muted mb-3" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  <strong className="text-dark">DANNYdecor</strong> được thành lập từ <strong className="text-warning">10/2015</strong> với mong muốn được tạo ra những không gian nội thất mang giá trị chữa lành cho khách hàng.
                </p>
                <p className="text-muted mb-3" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Công ty TNHH Trang trí Nội thất và Xây dựng Vân Tây chuyên thiết kế và thi công các phòng văn phòng và các cơ sở kinh doanh (quán cà phê, nhà hàng, phòng tập gym, yoga, các cửa hàng, showroom...)
                </p>
                <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Với đội ngũ nhân viên trẻ, năng động và sáng tạo, chúng tôi luôn nỗ lực mang đến những giải pháp thiết kế tối ưu nhất cho không gian của khách hàng.
                </p>
              </div>

              {/* Stats */}
              <div className="row g-4 mb-4">
                <div className="col-6">
                  <div className="text-center p-4 bg-white rounded shadow-sm">
                    <h3 className="display-4 fw-bold text-warning mb-2">8+</h3>
                    <p className="text-muted mb-0">Năm kinh nghiệm</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-4 bg-white rounded shadow-sm">
                    <h3 className="display-4 fw-bold text-warning mb-2">500+</h3>
                    <p className="text-muted mb-0">Dự án hoàn thành</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-4 bg-white rounded shadow-sm">
                    <h3 className="display-4 fw-bold text-warning mb-2">300+</h3>
                    <p className="text-muted mb-0">Khách hàng tin tưởng</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-4 bg-white rounded shadow-sm">
                    <h3 className="display-4 fw-bold text-warning mb-2">50+</h3>
                    <p className="text-muted mb-0">Đối tác lâu dài</p>
                  </div>
                </div>
              </div>

              <Link 
                href="/contact" 
                className="btn btn-warning text-white btn-lg px-5 py-3 fw-semibold"
                style={{ letterSpacing: '1px' }}
              >
                Liên hệ ngay
              </Link>
            </div>

            {/* Right Column - Image */}
            <div className="col-lg-6">
              <div className="position-relative">
                <div 
                  className="rounded overflow-hidden shadow-lg"
                  style={{ transform: 'rotate(2deg)' }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
                    alt="DANNYdecor Office"
                    width={600}
                    height={700}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div 
                  className="position-absolute rounded overflow-hidden shadow-lg"
                  style={{ 
                    bottom: '-30px',
                    right: '-30px',
                    width: '60%',
                    transform: 'rotate(-3deg)',
                    border: '8px solid white'
                  }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600"
                    alt="Modern Workspace"
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Vision */}
            <div className="col-md-4">
              <div 
                className="card border-0 shadow-sm h-100 p-4"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,193,7,0.2)';
                  e.currentTarget.style.borderColor = '#FFC107';
                  e.currentTarget.style.borderWidth = '2px';
                  e.currentTarget.style.borderStyle = 'solid';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderWidth = '0';
                }}
              >
                <div className="text-center mb-4">
                  <i className="bi bi-eye-fill text-warning" style={{ fontSize: '56px' }}></i>
                </div>
                <h4 className="text-center fw-bold mb-3">Tầm Nhìn</h4>
                <p className="text-muted text-center" style={{ fontSize: '15px', lineHeight: '1.8' }}>
                  Trở thành công ty thiết kế và thi công nội thất hàng đầu Việt Nam, 
                  tạo ra những không gian sống và làm việc đẳng cấp, bền vững.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="col-md-4">
              <div 
                className="card border-0 shadow-sm h-100 p-4"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,193,7,0.2)';
                  e.currentTarget.style.borderColor = '#FFC107';
                  e.currentTarget.style.borderWidth = '2px';
                  e.currentTarget.style.borderStyle = 'solid';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderWidth = '0';
                }}
              >
                <div className="text-center mb-4">
                  <i className="bi bi-bullseye text-warning" style={{ fontSize: '56px' }}></i>
                </div>
                <h4 className="text-center fw-bold mb-3">Sứ Mệnh</h4>
                <p className="text-muted text-center" style={{ fontSize: '15px', lineHeight: '1.8' }}>
                  Mang đến những giải pháp thiết kế nội thất sáng tạo, 
                  tối ưu công năng và thẩm mỹ, nâng cao chất lượng cuộc sống.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="col-md-4">
              <div 
                className="card border-0 shadow-sm h-100 p-4"
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,193,7,0.2)';
                  e.currentTarget.style.borderColor = '#FFC107';
                  e.currentTarget.style.borderWidth = '2px';
                  e.currentTarget.style.borderStyle = 'solid';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderWidth = '0';
                }}
              >
                <div className="text-center mb-4">
                  <i className="bi bi-gem text-warning" style={{ fontSize: '56px' }}></i>
                </div>
                <h4 className="text-center fw-bold mb-3">Giá Trị Cốt Lõi</h4>
                <ul className="list-unstyled text-muted" style={{ fontSize: '15px' }}>
                  <li className="mb-2">✓ Sáng tạo trong thiết kế</li>
                  <li className="mb-2">✓ Chất lượng thi công</li>
                  <li className="mb-2">✓ Đội ngũ chuyên nghiệp</li>
                  <li className="mb-2">✓ Khách hàng là trọng tâm</li>
                  <li className="mb-2">✓ Phát triển bền vững</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-inline-block bg-warning mb-3" style={{ width: '60px', height: '3px' }}></div>
            <h2 className="display-5 fw-bold mb-3">Đội Ngũ Chuyên Nghiệp</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '16px' }}>
              Với đội ngũ kiến trúc sư, thiết kế viên và thợ thi công giàu kinh nghiệm, 
              chúng tôi cam kết mang đến những công trình chất lượng cao nhất.
            </p>
          </div>

          <div className="row g-4">
            {[
              { name: 'Nguyễn Văn A', role: 'Giám đốc điều hành', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
              { name: 'Trần Thị B', role: 'Trưởng phòng thiết kế', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
              { name: 'Lê Văn C', role: 'Trưởng phòng thi công', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
              { name: 'Phạm Thị D', role: 'Quản lý dự án', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' },
            ].map((member, idx) => (
              <div key={idx} className="col-md-3">
                <div 
                  className="card border-0 shadow-sm overflow-hidden"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="position-relative" style={{ height: '300px' }}>
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body text-center py-4">
                    <h5 className="fw-bold mb-1">{member.name}</h5>
                    <p className="text-warning mb-0" style={{ fontSize: '14px' }}>{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-5 position-relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}></div>
        <div className="container position-relative text-center text-white py-5" style={{ zIndex: 2 }}>
          <h2 className="display-4 fw-bold mb-4">Sẵn sàng bắt đầu dự án của bạn?</h2>
          <p className="lead mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Hãy để chúng tôi biến ý tưởng của bạn thành hiện thực với những thiết kế độc đáo và chuyên nghiệp
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link href="/contact" className="btn btn-warning btn-lg text-white px-5 py-3 fw-semibold">
              Liên hệ tư vấn
            </Link>
            <Link href="/portfolio" className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold">
              Xem portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.9)', 
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="position-relative" style={{ maxWidth: '90%', maxHeight: '90vh' }}>
            <Image
              src={selectedImage}
              alt="Gallery Image"
              width={1200}
              height={800}
              style={{ objectFit: 'contain', maxHeight: '90vh', width: 'auto' }}
            />
            <button
              className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
              style={{ width: '50px', height: '50px' }}
              onClick={() => setSelectedImage(null)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

