'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Load cart từ localStorage
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Lưu cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (code === 'NOITHAT10') {
      setDiscount(10);
      alert('Mã giảm giá 10% đã được áp dụng!');
    } else if (code === 'FREESHIP') {
      setDiscount(5);
      alert('Mã miễn phí ship (5%) đã được áp dụng!');
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const shippingFee = subtotal > 5000000 ? 0 : 100000;
  const total = subtotal - discountAmount + shippingFee;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-cart-x" style={{ fontSize: '80px', color: '#FFC107' }}></i>
          </div>
          <h2 className="fw-bold mb-3">Giỏ hàng trống</h2>
          <p className="text-muted mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link
            href="/products"
            className="btn btn-warning text-white px-4 py-3 rounded-3"
            style={{ fontSize: '16px', fontWeight: '500' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Link
            href="/products"
            className="btn btn-outline-dark me-3"
            style={{ borderRadius: '12px' }}
          >
            <i className="bi bi-arrow-left"></i>
          </Link>
          <h1 className="fw-bold mb-0">Giỏ hàng của bạn</h1>
          <span className="badge bg-warning text-white ms-3" style={{ fontSize: '14px' }}>
            {cartItems.length} sản phẩm
          </span>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`${index !== 0 ? 'border-top pt-4' : ''} ${
                      index !== cartItems.length - 1 ? 'mb-4' : ''
                    }`}
                  >
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-md-2 col-4 mb-3 mb-md-0">
                        <div
                          className="position-relative rounded-3 overflow-hidden"
                          style={{
                            width: '100%',
                            paddingTop: '100%',
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          <Image
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="col-md-4 col-8 mb-3 mb-md-0">
                        <h5 className="fw-bold mb-2">{item.name}</h5>
                        <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                          <i className="bi bi-tag me-1"></i>
                          {item.category}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-md-3 col-6 mb-3 mb-md-0">
                        <div className="d-flex align-items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="btn btn-outline-secondary btn-sm"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                            }}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            className="form-control text-center mx-2"
                            style={{
                              width: '60px',
                              borderRadius: '8px',
                              fontWeight: '600',
                            }}
                            min="1"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="btn btn-outline-secondary btn-sm"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                            }}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="col-md-3 col-6">
                        <div className="d-flex flex-column align-items-end">
                          <p className="fw-bold text-warning mb-2" style={{ fontSize: '18px' }}>
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="btn btn-sm btn-outline-danger"
                            style={{ borderRadius: '8px' }}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-ticket-perforated text-warning me-2"></i>
                  Mã giảm giá
                </h5>
                <div className="row g-3">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã giảm giá"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <button
                      onClick={applyPromoCode}
                      className="btn btn-warning text-white w-100"
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    💡 Mã khả dụng: <span className="fw-semibold">NOITHAT10</span>,{' '}
                    <span className="fw-semibold">FREESHIP</span>
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Tóm tắt đơn hàng</h5>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tạm tính:</span>
                    <span className="fw-semibold">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  {discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Giảm giá ({discount}%):</span>
                      <span className="fw-semibold">-{discountAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Phí vận chuyển:</span>
                    <span className="fw-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-success">Miễn phí</span>
                      ) : (
                        `${shippingFee.toLocaleString('vi-VN')}₫`
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-top pt-3 mb-4">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold" style={{ fontSize: '18px' }}>
                      Tổng cộng:
                    </span>
                    <span className="fw-bold text-warning" style={{ fontSize: '24px' }}>
                      {total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-warning text-white w-100 py-3 mb-3"
                  style={{
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  Tiến hành thanh toán
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>

                <Link
                  href="/products"
                  className="btn btn-outline-secondary w-100 py-3"
                  style={{
                    borderRadius: '12px',
                    fontWeight: '600',
                  }}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Tiếp tục mua sắm
                </Link>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-shield-check text-success me-2" style={{ fontSize: '20px' }}></i>
                    <small className="text-muted">Thanh toán an toàn & bảo mật</small>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-truck text-warning me-2" style={{ fontSize: '20px' }}></i>
                    <small className="text-muted">Miễn phí vận chuyển từ 5 triệu</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-arrow-return-left text-info me-2" style={{ fontSize: '20px' }}></i>
                    <small className="text-muted">Đổi trả trong 7 ngày</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

