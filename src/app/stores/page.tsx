'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api-config';

interface Store {
  id: string;
  tenchinhanh: string;
  diachi: string;
  quan: string;
  thanhpho: string;
  sdt: string;
  email: string;
  giomocua: string;
  giodongcua: string;
  giomocua_cn: string;
  giodongcua_cn: string;
  hinhanh: string | null;
  mapurl: string | null;
}

export default function StoresPage() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chinhanh`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStores(data);
      } else {
        console.error('API did not return array:', data);
        setStores([]);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stores-page">
      {/* Hero Section */}
      <section className="position-relative" style={{ height: '400px', overflow: 'hidden' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
            alt="Furniture Showroom"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.85) 0%, rgba(255, 179, 0, 0.85) 100%)'
          }}
        />
        <div className="container position-relative h-100 d-flex align-items-center" style={{ zIndex: 2 }}>
          <div className="text-white">
            <h1 
              className="display-4 fw-bold mb-3" 
              style={{ 
                letterSpacing: '4px',
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              HỆ THỐNG CỬA HÀNG
            </h1>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: '60px', height: '3px', backgroundColor: '#FFC107' }}></div>
              <p className="mb-0 h5" style={{ letterSpacing: '2px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>Đến thăm showroom của chúng tôi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stores List */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F4F0 50%, #FAFAF8 100%)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
              Tìm cửa hàng gần bạn
            </h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Chúng tôi có {stores.length} showroom trên toàn quốc, sẵn sàng phục vụ bạn
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Chưa có chi nhánh nào</p>
            </div>
          ) : (
            <div className="row g-4">
              {stores.map((store) => (
                <div key={store.id} className="col-12 col-lg-6">
                  <div 
                  className="card border-0 shadow-lg h-100"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                  }}
                  onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
                >
                  {/* Store Image */}
                  <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                    {store.hinhanh ? (
                      <Image
                        src={store.hinhanh}
                        alt={store.tenchinhanh}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span 
                        className="badge bg-warning text-dark px-3 py-2"
                        style={{ fontSize: '0.9rem', borderRadius: '15px' }}
                      >
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {store.quan}
                      </span>
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
                      {store.tenchinhanh}
                    </h4>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start mb-2">
                        <i className="bi bi-geo-alt-fill text-warning me-2 mt-1" style={{ fontSize: '1.2rem' }}></i>
                        <div>
                          <p className="mb-0 fw-semibold">{store.diachi}</p>
                          <p className="mb-0 text-muted small">{store.quan}, {store.thanhpho}</p>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-telephone-fill text-primary me-2"></i>
                          <a 
                            href={`tel:${store.sdt.replace(/\s/g, '')}`}
                            className="text-decoration-none text-dark"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {store.sdt}
                          </a>
                        </div>
                      </div>
                      {store.email && (
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-envelope-fill text-danger me-2"></i>
                            <a 
                              href={`mailto:${store.email}`}
                              className="text-decoration-none text-dark small"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Email
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {(store.giomocua || store.giomocua_cn) && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-clock-fill text-info me-2"></i>
                          <span className="fw-semibold">Giờ mở cửa:</span>
                        </div>
                        <div className="ps-4">
                          {store.giomocua && store.giodongcua && (
                            <p className="mb-1 small">Thứ 2 - Thứ 6: <strong>{store.giomocua} - {store.giodongcua}</strong></p>
                          )}
                          {store.giomocua_cn && store.giodongcua_cn && (
                            <p className="mb-0 small">Thứ 7 - Chủ nhật: <strong>{store.giomocua_cn} - {store.giodongcua_cn}</strong></p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                      {store.mapurl ? (
                        <a
                          href={store.mapurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary flex-fill"
                          style={{ borderRadius: '10px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bi bi-map me-2"></i>
                          Xem bản đồ
                        </a>
                      ) : (
                        <button
                          className="btn btn-outline-primary flex-fill"
                          style={{ borderRadius: '10px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStore(selectedStore === store.id ? null : store.id);
                          }}
                        >
                          <i className="bi bi-map me-2"></i>
                          Xem bản đồ
                        </button>
                      )}
                      <a
                        href={`tel:${store.sdt.replace(/\s/g, '')}`}
                        className="btn btn-warning flex-fill"
                        style={{ borderRadius: '10px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="bi bi-telephone me-2"></i>
                        Gọi ngay
                      </a>
                    </div>
                  </div>

                  {/* Expanded Map Section */}
                  {selectedStore === store.id && store.mapurl && (
                    <div 
                      className="border-top"
                      style={{
                        animation: 'slideDown 0.3s ease',
                        maxHeight: '400px',
                        overflow: 'hidden'
                      }}
                    >
                      <div className="p-3">
                        <h6 className="fw-bold mb-3">Vị trí trên bản đồ</h6>
                        <div 
                          className="rounded overflow-hidden"
                          style={{ height: '300px' }}
                        >
                          <iframe
                            src={store.mapurl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Section */}
          <div className="row mt-5">
            <div className="col-lg-8 mx-auto">
              <div 
                className="card border-0 shadow-lg p-5 text-center"
                style={{
                  background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)',
                  borderRadius: '20px',
                  color: 'white'
                }}
              >
                <h3 className="fw-bold mb-3">Cần hỗ trợ thêm?</h3>
                <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link 
                    href="/contact" 
                    className="btn btn-light btn-lg px-4"
                    style={{ borderRadius: '25px' }}
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Liên hệ
                  </Link>
                  <a 
                    href="tel:0909123456" 
                    className="btn btn-outline-light btn-lg px-4"
                    style={{ borderRadius: '25px' }}
                  >
                    <i className="bi bi-telephone me-2"></i>
                    Hotline: 0909 123 456
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 400px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

