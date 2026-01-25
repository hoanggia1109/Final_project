"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const BRAND = {
  accent: "#FFC107",      // vàng/amber làm điểm nhấn
  accentDark: "#FFB300",
  primary: "#1F2937",     // chữ chính (slate/dark)
  muted: "#6B7280",       // text phụ
  bgSoft: "#FBFBFB"       // nền nhẹ
};

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (sectionId) {
            setVisibleSections((prev) => new Set([...prev, sectionId]));
          }
        }
      });
    }, observerOptions);

    const refs = Object.values(sectionRefs.current);
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const setSectionRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div style={{ color: BRAND.primary, fontFamily: 'var(--font-didot), Didot, "Bodoni MT", "Libre Bodoni", Georgia, serif' }}>
      {/* HERO */}
      <section
        className="py-5"
        style={{
          background: `linear-gradient(180deg, rgba(31,41,55,0.05), ${BRAND.bgSoft})`
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div 
              className="col-lg-6 mb-4"
              ref={setSectionRef('hero-text')}
              data-section-id="hero-text"
              style={{
                opacity: visibleSections.has('hero-text') ? 1 : 0,
                transform: visibleSections.has('hero-text') ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease'
              }}
            >
              <h1
                className="display-5 fw-bold mb-3"
                style={{ color: BRAND.primary, letterSpacing: "1px" }}
              >
                Nội Thất Văn Phòng Chuyên Nghiệp
              </h1>
              <p className="lead mb-4" style={{ color: BRAND.muted }}>
                Cung cấp bàn ghế văn phòng, workstation, tủ hồ sơ, ghế xoay, sofa
                và các thiết bị nội thất chất lượng cao — phù hợp cho mọi mô hình doanh nghiệp.
              </p>

              <div className="d-flex gap-3">
                <Link
                  href="/products"
                  className="btn"
                  style={{
                    background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentDark})`,
                    color: "#111",
                    padding: "10px 20px",
                    borderRadius: 10,
                    fontWeight: 600,
                    boxShadow: "0 8px 24px rgba(255,193,7,0.15)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,193,7,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,193,7,0.15)";
                  }}
                >
                  Xem Sản Phẩm
                </Link>

                <Link
                  href="/contact"
                  className="btn"
                  style={{
                    border: `2px solid ${BRAND.accent}`,
                    color: BRAND.accentDark,
                    background: "transparent",
                    padding: "8px 18px",
                    borderRadius: 10,
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = BRAND.accent;
                    e.currentTarget.style.color = "#111";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = BRAND.accentDark;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Liên Hệ Báo Giá
                </Link>
              </div>
            </div>

            <div 
              className="col-lg-6 text-center"
              ref={setSectionRef('hero-image')}
              data-section-id="hero-image"
              style={{
                opacity: visibleSections.has('hero-image') ? 1 : 0,
                transform: visibleSections.has('hero-image') ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s'
              }}
            >
              <div 
                style={{ 
                  borderRadius: 12, 
                  overflow: "hidden", 
                  boxShadow: "0 10px 30px rgba(31,41,55,0.08)",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
                  width={780}
                  height={520}
                  alt="Nội thất văn phòng hiện đại"
                  style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY INTRO */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div 
            className="text-center mb-5"
            ref={setSectionRef('company-intro')}
            data-section-id="company-intro"
            style={{
              opacity: visibleSections.has('company-intro') ? 1 : 0,
              transform: visibleSections.has('company-intro') ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease'
            }}
          >
            <div style={{ width: 72, height: 6, background: BRAND.accent, margin: "0 auto 18px", borderRadius: 4 }} />
            <h2 className="fw-bold mb-3" style={{ color: BRAND.primary }}>
              DANNY Office — Nhà Cung Cấp Nội Thất Văn Phòng
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 920, color: BRAND.muted }}>
              Chúng tôi chuyên phân phối bàn ghế nhân viên, workstation, ghế xoay, tủ hồ sơ,
              bàn họp, sofa và quầy lễ tân. Sản phẩm đa dạng, có sẵn kho và hỗ trợ lắp đặt toàn quốc.
            </p>
          </div>

          <div className="row g-4 text-center">
            {[
              {
                num: "1000+",
                text: "Mẫu sản phẩm có sẵn",
                img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop"
              },
              {
                num: "8+ năm",
                text: "Kinh nghiệm cung cấp nội thất",
                img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop"
              },
              {
                num: "500+",
                text: "Doanh nghiệp đồng hành",
                img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
              },
              {
                num: "Toàn quốc",
                text: "Giao hàng & lắp đặt tận nơi",
                img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="col-md-3"
                ref={setSectionRef(`stats-${i}`)}
                data-section-id={`stats-${i}`}
                style={{
                  opacity: visibleSections.has(`stats-${i}`) ? 1 : 0,
                  transform: visibleSections.has(`stats-${i}`) ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`
                }}
              >
                <div 
                  style={{ 
                    borderRadius: 12, 
                    overflow: "hidden", 
                    marginBottom: 12,
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Image
                    src={item.img}
                    width={420}
                    height={280}
                    alt={item.text}
                    style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                  />
                </div>

                <h3 style={{ marginBottom: 4, color: BRAND.primary }}>{item.num}</h3>
                <p style={{ margin: 0, color: BRAND.muted }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT TYPES */}
      <section className="py-5" style={{ background: BRAND.bgSoft }}>
        <div className="container">
          <h2 
            className="fw-bold text-center mb-4" 
            ref={setSectionRef('products-title')}
            data-section-id="products-title"
            style={{
              color: BRAND.primary,
              opacity: visibleSections.has('products-title') ? 1 : 0,
              transform: visibleSections.has('products-title') ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease'
            }}
          >
            Sản Phẩm Cung Cấp
          </h2>

          <div className="row g-4">
            {[
              {
                name: "Bàn ghế nhân viên",
                img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
              },
              {
                name: "Workstation – Module",
                img: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf"
              },
              {
                name: "Ghế xoay văn phòng",
                img: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1000&auto=format&fit=crop"
              },
              {
                name: "Bàn họp – Bàn giám đốc",
                img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop"
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="col-md-3"
                ref={setSectionRef(`product-${i}`)}
                data-section-id={`product-${i}`}
                style={{
                  opacity: visibleSections.has(`product-${i}`) ? 1 : 0,
                  transform: visibleSections.has(`product-${i}`) ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`
                }}
              >
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 8px 30px rgba(31,41,55,0.06)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(31,41,55,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(31,41,55,0.06)";
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <Image
                      src={item.img}
                      width={600}
                      height={380}
                      alt={item.name}
                      style={{ 
                        width: "100%", 
                        height: 180, 
                        objectFit: "cover", 
                        display: "block",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </div>
                  <div style={{ padding: "18px 14px", textAlign: "center" }}>
                    <h5 style={{ margin: 0, color: BRAND.primary }}>{item.name}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION / MISSION / VALUES */}
      <section className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <h2 
            className="fw-bold text-center mb-5" 
            ref={setSectionRef('vision-title')}
            data-section-id="vision-title"
            style={{
              color: BRAND.primary,
              opacity: visibleSections.has('vision-title') ? 1 : 0,
              transform: visibleSections.has('vision-title') ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease'
            }}
          >
            Tầm Nhìn • Sứ Mệnh • Giá Trị
          </h2>

          <div className="row g-4">
            {[
              {
                title: "Tầm nhìn",
                desc: "Trở thành nhà cung cấp nội thất văn phòng được tin chọn hàng đầu tại Việt Nam.",
                img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop"
              },
              {
                title: "Sứ mệnh",
                desc: "Cung cấp sản phẩm chất lượng, tối ưu chi phí và nâng cao trải nghiệm làm việc cho doanh nghiệp.",
                img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&auto=format&fit=crop"
              },
              {
                title: "Giá trị cốt lõi",
                desc: "Minh bạch – Chất lượng – Nhanh chóng – Tận tâm – Bền vững.",
                img: "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1000&auto=format&fit=crop"
              }
            ].map((v, i) => (
              <div 
                key={i} 
                className="col-md-4"
                ref={setSectionRef(`vision-${i}`)}
                data-section-id={`vision-${i}`}
                style={{
                  opacity: visibleSections.has(`vision-${i}`) ? 1 : 0,
                  transform: visibleSections.has(`vision-${i}`) ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`
                }}
              >
                <div 
                  style={{ 
                    borderRadius: 12, 
                    overflow: "hidden", 
                    background: "#fff", 
                    boxShadow: "0 8px 30px rgba(31,41,55,0.06)",
                    transition: "all 0.3s ease",
                    height: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(31,41,55,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(31,41,55,0.06)";
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <Image
                      src={v.img}
                      width={800}
                      height={380}
                      alt={v.title}
                      style={{ 
                        width: "100%", 
                        height: 180, 
                        objectFit: "cover", 
                        display: "block",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </div>
                  <div style={{ padding: 20 }}>
                    <h4 style={{ marginBottom: 8, color: BRAND.primary }}>{v.title}</h4>
                    <p style={{ color: BRAND.muted }}>{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* TEAM */}
     <section className="py-5" style={{ background: "#f7f8fa" }}>
  <div className="container">

    <div 
      className="text-center mb-5"
      ref={setSectionRef('team-title')}
      data-section-id="team-title"
      style={{
        opacity: visibleSections.has('team-title') ? 1 : 0,
        transform: visibleSections.has('team-title') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}
    >
      <h2 className="fw-bold" style={{ color: "#1f2937" }}>Đội Ngũ Của Chúng Tôi</h2>
      <p style={{ color: "#6b7280" }}>
        Những người đồng hành cùng chất lượng sản phẩm & dịch vụ.
      </p>
    </div>

    <div className="row justify-content-center g-4">

      {[
        { name: "Công Tiến", role: "Giám đốc kinh doanh", img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6" },
        { name: "Phương Vy", role: "Quản lý kho & vận hành", img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39" },
        { name: "Hoàng Gia", role: "Trưởng bộ phận tư vấn", img: "https://images.unsplash.com/photo-1520174691701-bc555a3404ca" },
        { name: " Triết Giang", role: "Chăm sóc khách hàng", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" },
        { name: "Kế  Phát", role: "Kế toán", img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6" },
      ].map((m, i) => (
        <div 
          key={i} 
          className="col-md-2"
          ref={setSectionRef(`team-${i}`)}
          data-section-id={`team-${i}`}
          style={{
            opacity: visibleSections.has(`team-${i}`) ? 1 : 0,
            transform: visibleSections.has(`team-${i}`) ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
            transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`
          }}
        >
          <div
            className="p-4 rounded-4 shadow-sm d-flex flex-column align-items-center"
            style={{
              background: "#fff",
              height: "100%",
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.06)";
            }}
          >
            <div
              style={{
                width: 140,
                height: 150,
                borderRadius: "50%",
                overflow: "hidden",
                marginBottom: 10,
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Image
                src={m.img}
                width={140}
                height={150}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt={m.name}
              />
            </div>

            <h5 className="fw-bold mb-1" style={{ color: "#111827" }}>{m.name}</h5>
            <p className="m-0" style={{ color: "#6b7280", textAlign: "center" }}>{m.role}</p>

          </div>
        </div>
      ))}

    </div>
  </div>
</section>


      {/* CTA */}
      <section 
        className="py-5" 
        style={{ background: `linear-gradient(90deg, rgba(255,193,7,0.12), rgba(255,193,7,0.04))` }}
        ref={setSectionRef('cta')}
        data-section-id="cta"
      >
        <div 
          className="container text-center"
          style={{
            opacity: visibleSections.has('cta') ? 1 : 0,
            transform: visibleSections.has('cta') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}
        >
          <h2 className="fw-bold mb-3" style={{ color: BRAND.primary }}>Cần tư vấn hoặc báo giá?</h2>
          <p style={{ color: BRAND.muted, maxWidth: 760, margin: "0 auto 20px" }}>
            Liên hệ ngay — chúng tôi sẵn sàng hỗ trợ đo đạc, báo giá và lắp đặt tận nơi cho doanh nghiệp của bạn.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link
              href="/contact"
              className="btn"
              style={{
                background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentDark})`,
                color: "#111",
                padding: "12px 26px",
                borderRadius: 12,
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(255,193,7,0.18)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(255,193,7,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,193,7,0.18)";
              }}
            >
              Liên Hệ Ngay
            </Link>

            <Link
              href="/products"
              className="btn"
              style={{
                border: `2px solid ${BRAND.accent}`,
                color: BRAND.primary,
                background: "transparent",
                padding: "10px 22px",
                borderRadius: 12,
                fontWeight: 700,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = BRAND.accent;
                e.currentTarget.style.color = "#111";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = BRAND.primary;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Xem Danh Mục Sản Phẩm
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ background: "#111827", color: "#E6E7EA", padding: "28px 0" }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <strong style={{ color: "#fff" }}>DANNY Office</strong>
            <div style={{ color: BRAND.muted, marginTop: 6 }}>Cung cấp nội thất văn phòng — Giao hàng & lắp đặt toàn quốc</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ color: BRAND.muted }}>Email: hello@noithatdanny.io.vn</div>
            <div style={{ color: BRAND.muted, marginTop: 6 }}>Hotline: 0123 456 789</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
