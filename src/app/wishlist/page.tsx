'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface WishlistItem {
  id: string;
  sanpham_id: string;
  sanpham: {
    id: string;
    tensp: string;
    code: string;
    thumbnail: string;
    bienthe: Array<{
      id: string;
      gia: number;
      sl_tonkho: number;
      mausac?: string;
      kichthuoc?: string;
      images?: Array<{ url: string }>;
    }>;
    danhmuc?: {
      tendm: string;
    };
  };
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (sanpham_id: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch(`/api/wishlist/${sanpham_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      // Cập nhật UI ngay lập tức
      setWishlist(prev => prev.filter(item => item.sanpham_id !== sanpham_id));
      alert('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Không thể xóa sản phẩm');
    }
  };

  const clearWishlist = async () => {
    if (!confirm('Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear wishlist');
      }

      setWishlist([]);
      alert('Đã xóa tất cả sản phẩm yêu thích');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      alert('Không thể xóa danh sách');
    }
  };

  const addToCart = async (item: WishlistItem) => {
    try {
      // Lấy biến thể đầu tiên
      const bienthe = item.sanpham.bienthe?.[0];
      if (!bienthe) {
        alert('Sản phẩm không có biến thể');
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bienthe_id: bienthe.id,
          soluong: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      alert('Đã thêm vào giỏ hàng!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Không thể thêm vào giỏ hàng');
    }
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
                      onClick={clearWishlist}
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
                    {wishlist.map((item) => {
                      const bienthe = item.sanpham?.bienthe?.[0];
                      const price = bienthe?.gia || 0;
                      const stock = bienthe?.sl_tonkho || 0;
                      const inStock = stock > 0;
                      const rawImageUrl = item.sanpham?.thumbnail || bienthe?.images?.[0]?.url || '';
                      
                      // Format image URL correctly
                      const getImageUrl = (url: string) => {
                        if (!url) return '';
                        // If already full URL, return as is
                        if (url.startsWith('http://') || url.startsWith('https://')) {
                          return url;
                        }
                        // If relative path, add backend URL
                        return `http://localhost:5000${url.startsWith('/') ? url : '/' + url}`;
                      };
                      
                      const imageUrl = getImageUrl(rawImageUrl);
                      
                      return (
                        <div key={item.id} className="col-md-6 col-lg-4">
                          <div
                            className="card border-0 h-100 shadow-sm"
                            style={{
                              borderRadius: '16px',
                              transition: 'all 0.3s ease'
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
                            <Link href={`/products/${item.sanpham_id}`} className="text-decoration-none">
                              <div className="position-relative">
                                <div
                                  className="position-relative overflow-hidden"
                                  style={{
                                    paddingTop: '100%',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '16px 16px 0 0'
                                  }}
                                >
                                  {imageUrl ? (
                                    <Image
                                      src={imageUrl}
                                      alt={item.sanpham?.tensp || 'Product'}
                                      fill
                                      style={{ objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                      <i className="bi bi-image text-muted" style={{ fontSize: '48px' }}></i>
                                    </div>
                                  )}
                                </div>
                                {/* Remove Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeFromWishlist(item.sanpham_id);
                                  }}
                                  className="btn btn-danger position-absolute top-0 end-0 m-3 rounded-circle"
                                  style={{ width: '40px', height: '40px', padding: 0 }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                                {/* Stock Badge */}
                                {!inStock && (
                                  <div
                                    className="position-absolute bottom-0 start-0 m-3 badge bg-danger"
                                    style={{ fontSize: '12px' }}
                                  >
                                    Hết hàng
                                  </div>
                                )}
                              </div>
                            </Link>

                            <div className="card-body p-3">
                              <p className="text-muted small mb-1">
                                <i className="bi bi-tag me-1"></i>
                                {item.sanpham?.danhmuc?.tendm || 'Chưa phân loại'}
                              </p>
                              <Link href={`/products/${item.sanpham_id}`} className="text-decoration-none text-dark">
                                <h6 className="fw-bold mb-2" style={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {item.sanpham?.tensp || 'Sản phẩm'}
                                </h6>
                              </Link>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-bold text-warning" style={{ fontSize: '18px' }}>
                                  {price.toLocaleString('vi-VN')}₫
                                </span>
                                <small className="text-muted">
                                  <i className="bi bi-box-seam me-1"></i>
                                  Còn {stock}
                                </small>
                              </div>
                              <button
                                onClick={() => addToCart(item)}
                                disabled={!inStock}
                                className="btn btn-warning text-white w-100 mt-2"
                                style={{ borderRadius: '12px', fontWeight: '600' }}
                              >
                                {inStock ? (
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
                      );
                    })}
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











