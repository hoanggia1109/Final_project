'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../../component/StripePaymentForm';

// Khởi tạo Stripe từ publishable key
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) {
  console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY chưa được cấu hình. Stripe form sẽ không hiển thị.');
}
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface OrderItem {
  id: string;
  soluong: number;
  gia: number;
  tonggia: number;
  bienthe?: {
    id: string;
    mausac?: string;
    kichthuoc?: string;
    sanpham?: {
      id: string;
      tensp: string;
      thumbnail?: string;
    };
  };
}

interface Order {
  id: string;
  code: string;
  tongtien: number;
  tongtien_sau_giam: number;
  giamgia: number;
  phi_van_chuyen: number;
  chitiet: OrderItem[];
}

export default function StripeCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false); // CHANGED: State để hiển thị thông báo copy mã đơn hàng

  useEffect(() => {
    const initPayment = async () => {
      // Lấy orderId từ URL params
      const orderIdParam = searchParams.get('orderId');
      
      if (!orderIdParam) {
        setError('Không tìm thấy mã đơn hàng. Vui lòng quay lại trang thanh toán.');
        setLoading(false);
        return;
      }

      setOrderId(orderIdParam);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth');
          return;
        }

        // Load thông tin đơn hàng
        console.log('Loading order details:', orderIdParam);
        const orderResponse = await fetch(`/api/orders/${orderIdParam}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          setOrder(orderData);
        }

        // Tạo Payment Intent cho đơn hàng
        console.log('Creating Payment Intent for order:', orderIdParam);
        
        const response = await fetch('http://localhost:5001/api/thanhtoan/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ donhang_id: orderIdParam }),
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            const text = await response.text();
            console.error('Failed to parse error response:', text);
            throw new Error(`Lỗi từ server (${response.status}): ${response.statusText}`);
          }
          
          console.error('Payment Intent Error:', errorData);
          
          let errorMessage = 'Không thể tạo payment intent';
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Payment Intent created:', data);
        
        if (!data.clientSecret) {
          throw new Error('Không nhận được client secret từ server');
        }
        
        setClientSecret(data.clientSecret);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing payment:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi khởi tạo thanh toán');
        setLoading(false);
      }
    };

    initPayment();
  }, [searchParams, router]);

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
            Đang chuẩn bị thanh toán...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center py-5"
        style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-5 text-center">
                  <div 
                    className="mb-4"
                    style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto',
                      background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i className="bi bi-x-lg" style={{ fontSize: '40px', color: 'white' }}></i>
                  </div>
                  
                  <h2 className="fw-bold mb-3" style={{ color: '#f44336' }}>
                    Có lỗi xảy ra
                  </h2>
                  
                  <p className="text-muted mb-4">{error}</p>

                  <div className="d-flex gap-3 justify-content-center">
                    <Link
                      href="/checkout"
                      className="btn text-white px-4 py-3"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                      }}
                    >
                      Quay lại thanh toán
                    </Link>
                    
                    <Link
                      href="/cart"
                      className="btn btn-outline px-4 py-3"
                      style={{
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: '2px solid #FF8E53',
                        color: '#FF8E53',
                      }}
                    >
                      Về giỏ hàng
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center py-5"
        style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-circle me-2"></i>
                {!stripePromise 
                  ? 'Chưa cấu hình Stripe publishable key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY). Vui lòng kiểm tra file .env.local và khởi động lại frontend.'
                  : 'Không thể khởi tạo thanh toán. Vui lòng thử lại.'}
              </div>
            </div>
          </div>
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
            href="/checkout" 
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
            Thanh toán bằng thẻ
          </h1>
        </div>

        {/* CHANGED: Chia thành 2 cột bằng nhau - Thông tin đơn hàng bên trái, Form thanh toán bên phải */}
        <div className="row g-4">
          {/* Cột trái: Thông tin đơn hàng */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-receipt me-2" style={{ color: '#FF8E53' }}></i>
                  Thông tin đơn hàng
                </h5>

                {orderId && (
                  <div className="mb-3 pb-3 border-bottom">
                    <small className="text-muted d-block mb-2">Mã đơn hàng</small>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <strong style={{ color: '#FF8E53', fontSize: '16px', flex: 1 }}>{orderId}</strong>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(orderId);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                        style={{ padding: '4px 12px', borderRadius: '8px' }}
                        title="Copy mã đơn hàng"
                      >
                        {copySuccess ? (
                          <i className="bi bi-check-circle text-success"></i>
                        ) : (
                          <i className="bi bi-clipboard"></i>
                        )}
                      </button>
                    </div>
                    {copySuccess && (
                      <small className="text-success d-block mb-3">
                        <i className="bi bi-check-circle me-1"></i>
                        Đã copy mã đơn hàng!
                      </small>
                    )}
                    {/* CHANGED: Thêm QR code cho mã đơn hàng */}
                    <div className="text-center mt-3 pt-3 border-top">
                      <small className="text-muted d-block mb-2">Quét QR code để lưu mã đơn hàng</small>
                      <div className="d-inline-block p-2 bg-white rounded-3" style={{ border: '2px solid #e9ecef' }}>
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderId)}`}
                          alt="QR Code mã đơn hàng"
                          width={150}
                          height={150}
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {order && order.chitiet && order.chitiet.length > 0 ? (
                  <>
                    {/* Danh sách sản phẩm */}
                    <div className="mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {order.chitiet.map((item) => {
                        const productName = item.bienthe?.sanpham?.tensp || 'Sản phẩm';
                        const productImage = item.bienthe?.sanpham?.thumbnail || '/placeholder.jpg';
                        const productPrice = Number(item.gia || 0);
                        const quantity = item.soluong;
                        const color = item.bienthe?.mausac;
                        const size = item.bienthe?.kichthuoc;
                        
                        return (
                          <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                            <div
                              className="position-relative rounded-3 overflow-hidden me-3"
                              style={{
                                width: '80px',
                                height: '80px',
                                flexShrink: 0,
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
                            <div className="flex-grow-1">
                              <div className="fw-semibold mb-1" style={{ fontSize: '14px' }}>
                                {productName}
                              </div>
                              {(color || size) && (
                                <div className="text-muted mb-1" style={{ fontSize: '12px' }}>
                                  {color && <span>{color}</span>}
                                  {color && size && <span> • </span>}
                                  {size && <span>{size}</span>}
                                </div>
                              )}
                              <div className="text-muted" style={{ fontSize: '13px' }}>
                                Số lượng: {quantity}
                              </div>
                              <div className="fw-bold mt-1" style={{ color: '#FF8E53', fontSize: '15px' }}>
                                {productPrice.toLocaleString('vi-VN')}₫
                              </div>
                            </div>
                            <div 
                              className="fw-bold"
                              style={{ color: '#FF6B6B', fontSize: '16px' }}
                            >
                              {(productPrice * quantity).toLocaleString('vi-VN')}₫
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tổng tiền */}
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Tạm tính:</span>
                        <span className="fw-semibold">{Number(order.tongtien || 0).toLocaleString('vi-VN')}₫</span>
                      </div>
                      {order.giamgia > 0 && (
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-success">
                            <i className="bi bi-tag-fill me-1"></i>
                            Giảm giá:
                          </span>
                          <span className="fw-semibold text-success">
                            -{Number(order.giamgia || 0).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Phí vận chuyển:</span>
                        <span className="fw-semibold">
                          {Number(order.phi_van_chuyen || 0) === 0 ? (
                            <span className="text-success">Miễn phí</span>
                          ) : (
                            `${Number(order.phi_van_chuyen || 0).toLocaleString('vi-VN')}₫`
                          )}
                        </span>
                      </div>
                      <div className="border-top pt-3 mt-3">
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
                            {Number(order.tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-box-seam" style={{ fontSize: '48px', color: '#ccc' }}></i>
                    <p className="text-muted mt-3">Đang tải thông tin đơn hàng...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Form thanh toán Stripe */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-credit-card me-2" style={{ color: '#FF8E53' }}></i>
                  Thông tin thanh toán
                </h5>

                <div className="alert alert-info mb-4" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  Vui lòng điền thông tin thẻ để hoàn tất thanh toán
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#FF6B6B',
                      },
                    },
                  }}
                  key={clientSecret}
                >
                  <StripePaymentForm
                    onSuccess={async () => {
                      console.log('Payment successful!');
                      
                      // CHANGED: Cập nhật trạng thái ngay lập tức trước khi redirect
                      // Đảm bảo trạng thái là 'paid' khi success page load
                      if (orderId) {
                        try {
                          const token = localStorage.getItem('token');
                          if (token) {
                            console.log('Updating order status to paid...', orderId);
                            const response = await fetch('http://localhost:5001/api/thanhtoan/stripe/confirm-payment', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                              body: JSON.stringify({ orderId: orderId }),
                            });

                            if (response.ok) {
                              const result = await response.json();
                              console.log('Order status updated to paid:', result);
                            } else {
                              const error = await response.json();
                              console.error('Failed to update order status:', error);
                            }
                          }
                        } catch (error) {
                          console.error('Error updating order status:', error);
                          // Vẫn redirect dù có lỗi (webhook sẽ xử lý)
                        }
                      }
                      
                      window.dispatchEvent(new Event('cartUpdated'));
                      
                      // CHANGED: Đợi một chút để đảm bảo trạng thái đã được cập nhật
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      if (orderId) {
                        router.push(`/checkout/success?orderId=${orderId}`);
                      } else {
                        router.push('/checkout/success');
                      }
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                      alert('Thanh toán thất bại: ' + error);
                    }}
                  />
                </Elements>

                {/* Security Info */}
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex align-items-center justify-content-center gap-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-shield-check me-2" style={{ fontSize: '20px', color: '#28a745' }}></i>
                      <small className="text-muted">Thanh toán an toàn & bảo mật</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-lock me-2" style={{ fontSize: '20px', color: '#FF8E53' }}></i>
                      <small className="text-muted">Mã hóa SSL/TLS</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
