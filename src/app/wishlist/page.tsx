'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist từ localStorage
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const addToCart = (item: WishlistItem) => {
    // Add to cart logic
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((i: { id: string }) => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Đã thêm vào giỏ hàng!');
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Tài khoản</h5>
                <div className="list-group list-group-flush">
                  <Link
                    href="/profile"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px', marginBottom: '8px' }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Tài khoản của tôi
                  </Link>
                  <Link
                    href="/orders"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px', marginBottom: '8px' }}
                  >
                    <i className="bi bi-bag-check me-2"></i>
                    Đơn hàng
                  </Link>
                  <Link
                    href="/wishlist"
                    className="list-group-item list-group-item-action border-0 active"
                    style={{
                      backgroundColor: '#FFF8E1',
                      color: '#FFC107',
                      borderRadius: '12px',
                      marginBottom: '8px'
                    }}
                  >
                    <i className="bi bi-heart me-2"></i>
                    Yêu thích
                  </Link>
                  <Link
                    href="/addresses"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px', marginBottom: '8px' }}
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    Địa chỉ
                  </Link>
                  <Link
                    href="/notifications"
                    className="list-group-item list-group-item-action border-0"
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="bi bi-bell me-2"></i>
                    Thông báo
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">
                    <i className="bi bi-heart-fill text-danger me-2"></i>
                    Sản phẩm yêu thích
                    <span className="badge bg-danger ms-2">{wishlist.length}</span>
                  </h4>
                  {wishlist.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?')) {
                          setWishlist([]);
                          localStorage.removeItem('wishlist');
                        }
                      }}
                      className="btn btn-outline-danger"
                      style={{ borderRadius: '12px' }}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-heart" style={{ fontSize: '80px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3 mb-2">Danh sách yêu thích trống</h5>
                    <p className="text-muted mb-4">Bạn chưa có sản phẩm yêu thích nào</p>
                    <Link
                      href="/products"
                      className="btn btn-warning text-white px-4 py-3"
                      style={{ borderRadius: '12px', fontWeight: '600' }}
                    >
                      <i className="bi bi-search me-2"></i>
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="row g-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="col-md-6 col-lg-4">
                        <div
                          className="card border-0 h-100 shadow-sm"
                          style={{
                            borderRadius: '16px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          }}
                        >
                          {/* Image */}
                          <div className="position-relative">
                            <div
                              className="position-relative overflow-hidden"
                              style={{
                                paddingTop: '100%',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '16px 16px 0 0'
                              }}
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="btn btn-danger position-absolute top-0 end-0 m-3 rounded-circle"
                              style={{ width: '40px', height: '40px', padding: 0 }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                            {/* Stock Badge */}
                            {!item.inStock && (
                              <div
                                className="position-absolute bottom-0 start-0 m-3 badge bg-danger"
                                style={{ fontSize: '12px' }}
                              >
                                Hết hàng
                              </div>
                            )}
                          </div>

                          <div className="card-body p-3">
                            <p className="text-muted small mb-1">
                              <i className="bi bi-tag me-1"></i>
                              {item.category}
                            </p>
                            <h6 className="fw-bold mb-2">{item.name}</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold text-warning" style={{ fontSize: '18px' }}>
                                {item.price.toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                            <button
                              onClick={() => addToCart(item)}
                              disabled={!item.inStock}
                              className="btn btn-warning text-white w-100 mt-3"
                              style={{ borderRadius: '12px', fontWeight: '600' }}
                            >
                              {item.inStock ? (
                                <>
                                  <i className="bi bi-cart-plus me-2"></i>
                                  Thêm vào giỏ
                                </>
                              ) : (
                                'Hết hàng'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


