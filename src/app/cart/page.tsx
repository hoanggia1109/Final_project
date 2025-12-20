'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api-config';



interface CartItem {

  id: string;

  user_id: string;

  bienthe_id: string;

  soluong: number;  

  bienthe?: {

    id: string;

    gia: number;

    mausac?: string;

    kichthuoc?: string;

    sanpham?: {

      tensp: string;

      thumbnail: string;

    };

    images?: Array<{

      url: string;

    }>;

  };

}



export default function CartPage() {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [totalAmount, setTotalAmount] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);



  // Check authentication

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (!token) {

      setIsLoggedIn(false);

      setLoading(false);

      return;

    }

    setIsLoggedIn(true);

    loadCartFromAPI();

  }, []);



  // Load cart từ API backend

  const loadCartFromAPI = async () => {

    try {

      const token = localStorage.getItem('token');

      if (!token) {

        setLoading(false);

        return;

      }



      const response = await fetch(`${API_BASE_URL}/api/giohang`, {

        headers: {

          'Authorization': `Bearer ${token}`,
  
        },

      });



      if (!response.ok) {

        if (response.status === 401) {

          // Token expired or invalid

          localStorage.removeItem('token');

          setIsLoggedIn(false);

          setLoading(false);

          return;

        }

        throw new Error('Failed to load cart');

      }



      const data = await response.json();

      console.log('📦 Cart data:', data);

      

      setCartItems(data.san_pham || []);

      setTotalAmount(data.tong_tien || 0);

    } catch (error) {

      console.error(' Error loading cart:', error);

    } finally {

      setLoading(false);

    }

  };



  const updateQuantity = async (id: string, newQuantity: number) => {

    if (newQuantity < 1) return;



    try {

      const token = localStorage.getItem('token');

      if (!token) return;



      const response = await fetch(`${API_BASE_URL}/api/giohang/${id}`, {

        method: 'PUT',

        headers: {

          'Content-Type': 'application/json',

          'Authorization': `Bearer ${token}`,

        },

        body: JSON.stringify({ soluong: newQuantity }),

      });



      if (!response.ok) throw new Error('Failed to update quantity');



      // Update local state

      setCartItems(prev =>

        prev.map(item =>

          item.id === id ? { ...item, soluong: newQuantity } : item

        )

      );

      

      // Reload cart to get updated total

      await loadCartFromAPI();

      

      // Notify header to update cart count

      window.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {

      console.error(' Error updating quantity:', error);

      alert('Có lỗi khi cập nhật số lượng!');

    }

  };



  const removeItem = async (id: string) => {

    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;



    try {

      const token = localStorage.getItem('token');

      if (!token) return;



      const response = await fetch(`${API_BASE_URL}/api/giohang/${id}`, {

        method: 'DELETE',

        headers: {

          'Authorization': `Bearer ${token}`,

        },

      });



      if (!response.ok) throw new Error('Failed to remove item');



      // Update local state

      setCartItems(prev => prev.filter(item => item.id !== id));

      

      // Reload cart to get updated total

      await loadCartFromAPI();

      

      // Notify header to update cart count

      window.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {

      console.error(' Error removing item:', error);

      alert('Có lỗi khi xóa sản phẩm!');

    }

  };



  const subtotal = totalAmount;

  // Đồng bộ với backend: 30,000 VND mặc định, miễn phí nếu đơn hàng >= 5 triệu hoặc TPHCM
  const shippingFee = subtotal > 5000000 ? 0 : 30000;

  const total = subtotal + shippingFee;



  if (loading) {

    return (

      <div 

        className="min-vh-100 d-flex align-items-center justify-content-center"

        style={{

          background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',

        }}

      >

        <div className="text-center">

          <div 

            className="spinner-border mb-3" 

            role="status"

            style={{ 

              color: '#FF8E53',

              width: '3rem',

              height: '3rem'

            }}

          >

            <span className="visually-hidden">Loading...</span>

          </div>

          <div style={{ color: '#FF8E53', fontWeight: '500' }}>

            Đang tải giỏ hàng...

          </div>

        </div>

      </div>

    );

  }



  // Not logged in

  if (!isLoggedIn) {

    return (

      <div 

        className="min-vh-100 d-flex align-items-center justify-content-center"

        style={{

          background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',

        }}

      >

        <div className="text-center py-5">

          <div className="mb-4">

            <i className="bi bi-lock" style={{ fontSize: '80px', color: '#FF8E53' }}></i>

          </div>

          <h2 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>Vui lòng đăng nhập</h2>

          <p className="text-muted mb-4">Bạn cần đăng nhập để xem giỏ hàng</p>

          <Link

            href="/auth"

            className="btn text-white px-4 py-3 rounded-3"

            style={{ 

              fontSize: '16px', 

              fontWeight: '600',

              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',

              border: 'none',

              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',

            }}

          >

            <i className="bi bi-box-arrow-in-right me-2"></i>

            Đăng nhập ngay

          </Link>

        </div>

      </div>

    );

  }



  if (cartItems.length === 0) {

    return (

      <div 

        className="min-vh-100 d-flex align-items-center justify-content-center"

        style={{

          background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',

        }}

      >

        <div className="text-center py-5">

          <div className="mb-4">

            <i className="bi bi-cart-x" style={{ fontSize: '80px', color: '#FF8E53' }}></i>

          </div>

          <h2 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>Giỏ hàng trống</h2>

          <p className="text-muted mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>

          <Link

            href="/products"

            className="btn text-white px-4 py-3 rounded-3"

            style={{ 

              fontSize: '16px', 

              fontWeight: '600',

              background: 'linear-gradient(135deg, #FF8E53 0%, #FFA726 100%)',

              border: 'none',

              boxShadow: '0 4px 15px rgba(255, 142, 83, 0.3)',

            }}

          >

            <i className="bi bi-arrow-left me-2"></i>

            Tiếp tục mua sắm

          </Link>

        </div>

      </div>

    );

  }



  return (

    <div 

      className="min-vh-100 py-5"

      style={{

        background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',

      }}

    >

      <div className="container">

        {/* Header */}

        <div className="d-flex align-items-center mb-4">

          <Link

            href="/products"

            className="btn me-3"

            style={{ 

              borderRadius: '12px',

              background: 'linear-gradient(135deg, #FF8E53, #FFA726)',

              color: '#fff',

              border: 'none',

              boxShadow: '0 2px 8px rgba(255, 142, 83, 0.3)',

              padding: '10px 16px',

            }}

          >

            <i className="bi bi-arrow-left"></i>

          </Link>

          <h1 

            className="fw-bold mb-0"

            style={{

              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',

              WebkitBackgroundClip: 'text',

              WebkitTextFillColor: 'transparent'

            }}

          >

            Giỏ hàng của bạn

          </h1>

          <span 

            className="badge text-white ms-3" 

            style={{ 

              fontSize: '14px',

              background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',

              padding: '8px 16px',

              borderRadius: '20px',

            }}

          >

            {cartItems.length} sản phẩm

          </span>

        </div>



        <div className="row g-4">

          {/* Cart Items */}

          <div className="col-lg-8">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                {cartItems.map((item, index) => {

                  const productName = item.bienthe?.sanpham?.tensp || 'Sản phẩm';

                  const productImage = item.bienthe?.sanpham?.thumbnail || item.bienthe?.images?.[0]?.url || '/placeholder.jpg';

                  const productPrice = Number(item.bienthe?.gia || 0);

                  const quantity = item.soluong;

                  const color = item.bienthe?.mausac;

                  const size = item.bienthe?.kichthuoc;



                  return (

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

                              src={productImage}

                              alt={productName}

                              fill

                              style={{ objectFit: 'cover' }}

                            />

                          </div>

                        </div>



                        {/* Product Info */}

                        <div className="col-md-4 col-8 mb-3 mb-md-0">

                          <h5 className="fw-bold mb-2">{productName}</h5>

                          {(color || size) && (

                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>

                              {color && <span><i className="bi bi-palette me-1"></i>{color}</span>}

                              {color && size && <span className="mx-2">•</span>}

                              {size && <span><i className="bi bi-rulers me-1"></i>{size}</span>}

                            </p>

                          )}

                          <p className="mb-0 mt-1" style={{ fontSize: '14px', color: '#FF8E53', fontWeight: '600' }}>

                            {productPrice.toLocaleString('vi-VN')}₫ / sản phẩm

                          </p>

                        </div>



                        {/* Quantity Controls */}

                        <div className="col-md-3 col-6 mb-3 mb-md-0">

                          <div className="d-flex align-items-center">

                            <button

                              onClick={() => updateQuantity(item.id, quantity - 1)}

                              className="btn btn-sm"

                              style={{

                                width: '36px',

                                height: '36px',

                                borderRadius: '8px',

                                border: '2px solid #FF8E53',

                                color: '#FF8E53',

                              }}

                            >

                              <i className="bi bi-dash"></i>

                            </button>

                            <input

                              type="number"

                              value={quantity}

                              onChange={(e) =>

                                updateQuantity(item.id, parseInt(e.target.value) || 1)

                              }

                              className="form-control text-center mx-2"

                              style={{

                                width: '60px',

                                borderRadius: '8px',

                                fontWeight: '600',

                                border: '2px solid #e9ecef',

                              }}

                              min="1"

                            />

                            <button

                              onClick={() => updateQuantity(item.id, quantity + 1)}

                              className="btn btn-sm"

                              style={{

                                width: '36px',

                                height: '36px',

                                borderRadius: '8px',

                                border: '2px solid #FF8E53',

                                color: '#FF8E53',

                              }}

                            >

                              <i className="bi bi-plus"></i>

                            </button>

                          </div>

                        </div>



                        {/* Price & Remove */}

                        <div className="col-md-3 col-6">

                          <div className="d-flex flex-column align-items-end">

                            <p className="fw-bold mb-2" style={{ fontSize: '18px', color: '#FF6B6B' }}>

                              {(productPrice * quantity).toLocaleString('vi-VN')}₫

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

                  );

                })}

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



                <div className="mb-3">

                  <div 

                    className="p-3 rounded-3 d-flex align-items-center"

                    style={{

                      background: 'linear-gradient(135deg, #FFF5E8 0%, #FFE8D6 100%)',

                      border: '1px solid rgba(255, 142, 83, 0.2)',

                    }}

                  >

                    <i className="bi bi-tag-fill me-2" style={{ color: '#FF8E53', fontSize: '18px' }}></i>

                    <small className="text-muted mb-0" style={{ fontSize: '13px' }}>Mã giảm giá có thể áp dụng tại trang thanh toán</small>

                  </div>

                </div>



                <div className="border-top pt-3 mb-4">

                  <div className="d-flex justify-content-between">

                    <span className="fw-bold" style={{ fontSize: '18px' }}>

                      Tổng cộng:

                    </span>

                    <span 

                      className="fw-bold" 

                      style={{ 

                        fontSize: '24px',

                        background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',

                        WebkitBackgroundClip: 'text',

                        WebkitTextFillColor: 'transparent'

                      }}

                    >

                      {total.toLocaleString('vi-VN')}₫

                    </span>

                  </div>

                </div>



                <Link

                  href="/checkout"

                  className="btn text-white w-100 py-3 mb-3"

                  style={{

                    borderRadius: '12px',

                    fontWeight: '600',

                    fontSize: '16px',

                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',

                    border: 'none',

                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',

                    transition: 'all 0.3s ease',

                  }}

                  onMouseEnter={(e) => {

                    e.currentTarget.style.transform = 'translateY(-2px)';

                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';

                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.transform = 'translateY(0)';

                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';

                  }}

                >

                  Tiến hành thanh toán

                  <i className="bi bi-arrow-right ms-2"></i>

                </Link>



                <Link

                  href="/products"

                  className="btn btn-outline w-100 py-3"

                  style={{

                    borderRadius: '12px',

                    fontWeight: '600',

                    border: '2px solid #FF8E53',

                    color: '#FF8E53',

                  }}

                  onMouseEnter={(e) => {

                    e.currentTarget.style.background = 'linear-gradient(135deg, #FF8E53, #FFA726)';

                    e.currentTarget.style.color = '#fff';

                    e.currentTarget.style.borderColor = 'transparent';

                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.background = 'transparent';

                    e.currentTarget.style.color = '#FF8E53';

                    e.currentTarget.style.borderColor = '#FF8E53';

                  }}

                >

                  <i className="bi bi-arrow-left me-2"></i>

                  Tiếp tục mua sắm

                </Link>



                {/* Trust Badges */}

                <div className="mt-4 pt-4 border-top">

                  <div className="d-flex align-items-center mb-3">

                    <i className="bi bi-shield-check me-2" style={{ fontSize: '20px', color: '#28a745' }}></i>

                    <small className="text-muted">Thanh toán an toàn & bảo mật</small>

                  </div>

                  <div className="d-flex align-items-center mb-3">

                    <i className="bi bi-truck me-2" style={{ fontSize: '20px', color: '#FF8E53' }}></i>

                    <small className="text-muted">Miễn phí vận chuyển từ 5 triệu</small>

                  </div>

                  <div className="d-flex align-items-center">

                    <i className="bi bi-arrow-return-left me-2" style={{ fontSize: '20px', color: '#FF6B6B' }}></i>

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
        
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .d-flex.justify-content-between.align-items-center.mb-4 {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          
          .d-flex.justify-content-between.align-items-center.mb-4 h2 {
            font-size: 1.5rem !important;
          }
          
          .card {
            border-radius: 12px !important;
            margin-bottom: 1rem;
          }
          
          .card-body {
            padding: 1rem !important;
          }
          
          .row.g-3 > *,
          .row.g-4 > * {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .row.g-3 .col-md-6,
          .row.g-4 .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
            margin-bottom: 1rem;
          }
          
          .table {
            font-size: 0.85rem;
          }
          
          .table td,
          .table th {
            padding: 0.5rem;
          }
          
          .table img {
            width: 60px !important;
            height: 60px !important;
          }
          
          .d-flex.gap-2,
          .d-flex.gap-3 {
            flex-direction: column;
          }
          
          .d-flex.gap-2 .btn,
          .d-flex.gap-3 .btn {
            width: 100%;
            margin: 0 !important;
          }
          
          .form-control {
            font-size: 16px; /* Prevent zoom on iOS */
          }
          
          .input-group {
            flex-wrap: wrap;
          }
          
          .input-group .btn {
            width: 100%;
            margin-top: 0.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .card-body {
            padding: 0.75rem !important;
          }
          
          .table {
            font-size: 0.75rem;
          }
          
          .table img {
            width: 50px !important;
            height: 50px !important;
          }
          
          .table .d-flex {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

      `}</style>

    </div>

  );

}
