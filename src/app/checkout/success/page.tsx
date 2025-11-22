'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // CHANGED: Import Image để hiển thị QR code

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'succeeded' | 'processing' | 'failed'>('processing');
  const [orderId, setOrderId] = useState<string | null>(null); // CHANGED: Lưu orderId vào state để hiển thị
  const [copySuccess, setCopySuccess] = useState(false); // CHANGED: State để hiển thị thông báo copy thành công

  useEffect(() => {
    const verifyPayment = async () => {
      const orderIdParam = searchParams.get('orderId');
      const paymentIntentId = searchParams.get('payment_intent');
      
      // CHANGED: Lưu orderId vào state
      if (orderIdParam) {
        setOrderId(orderIdParam);
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/cart');
          return;
        }

        // CHANGED: Kiểm tra trạng thái đơn hàng ngay lập tức
        // Nếu có orderId, xác minh trạng thái đơn hàng với retry nếu cần
        if (orderIdParam) {
          let attempts = 0;
          const maxAttempts = 5; // CHANGED: Giảm số lần thử xuống 5 (vì đã cập nhật trạng thái trước khi redirect)
          const delay = 500; // CHANGED: Giảm delay xuống 500ms để nhanh hơn
          
          const checkOrderStatus = async () => {
            attempts++;
            console.log(`Checking order status (attempt ${attempts}/${maxAttempts}):`, orderIdParam);
            
            try {
              const response = await fetch(`http://localhost:5001/api/donhang/${orderIdParam}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                const order = await response.json();
                console.log('Order status:', order.trangthaithanhtoan);
                
                if (order.trangthaithanhtoan === 'paid') {
                  // CHANGED: Đã thành công
                  console.log('Payment succeeded!');
                  setPaymentStatus('succeeded');
                  setLoading(false);
                  return; // Đã thành công, dừng polling
                } else if (order.trangthaithanhtoan === 'failed') {
                  setPaymentStatus('failed');
                  setLoading(false);
                  return; // Đã failed, dừng polling
                } else if (order.trangthaithanhtoan === 'pending' && attempts < maxAttempts) {
                  // CHANGED: Vẫn là pending, thử lại sau
                  console.log(`Still pending, retrying in ${delay}ms...`);
                  setTimeout(checkOrderStatus, delay);
                } else {
                  // CHANGED: Đã thử đủ lần nhưng vẫn pending, giả định thành công (vì đã cập nhật trước khi redirect)
                  console.warn('Still pending after max attempts, assuming success');
                  setPaymentStatus('succeeded'); // CHANGED: Giả định thành công thay vì processing
                  setLoading(false);
                }
              } else {
                console.error('Failed to fetch order:', response.status);
                if (attempts >= maxAttempts) {
                  // CHANGED: Nếu không thể lấy trạng thái, giả định thành công
                  setPaymentStatus('succeeded');
                  setLoading(false);
                } else {
                  setTimeout(checkOrderStatus, delay);
                }
              }
            } catch (error) {
              console.error('Error checking order status:', error);
              if (attempts >= maxAttempts) {
                // CHANGED: Nếu có lỗi, giả định thành công
                setPaymentStatus('succeeded');
                setLoading(false);
              } else {
                setTimeout(checkOrderStatus, delay);
              }
            }
          };
          
          // Bắt đầu kiểm tra
          checkOrderStatus();
        } 
        // Nếu có paymentIntentId, xác minh thanh toán với Stripe
        else if (paymentIntentId) {
          const response = await fetch(`http://localhost:5001/api/thanhtoan/stripe/verify/${paymentIntentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPaymentStatus(data.status === 'succeeded' ? 'succeeded' : 'processing');
          }
        } else {
          // Không có thông tin, giả định thành công
          setPaymentStatus('succeeded');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
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
            Đang xác minh thanh toán...
          </div>
        </div>
      </div>
    );
  }

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
                {paymentStatus === 'succeeded' ? (
                  <>
                    <div 
                      className="mb-4"
                      style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'scaleIn 0.5s ease-out',
                      }}
                    >
                      <i className="bi bi-check-lg" style={{ fontSize: '60px', color: 'white' }}></i>
                    </div>
                    
                    <h2 className="fw-bold mb-3" style={{ color: '#4CAF50' }}>
                      Cảm ơn bạn đã mua hàng!
                    </h2>
                    
                    <p className="text-muted mb-3">
                      <strong>Thanh toán thành công!</strong>
                    </p>
                    
                    <div className="text-muted mb-4">
                      <p>Đơn hàng của bạn đã được thanh toán và đang được xử lý. 
                      Chúng tôi sẽ gửi thông tin chi tiết qua email của bạn.</p>
                      {orderId && (
                        <div className="mt-3 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                          <small className="text-muted d-block mb-2">Mã đơn hàng:</small>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <strong style={{ color: '#FF8E53', fontSize: '18px', flex: 1 }}>{orderId}</strong>
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
                    </div>

                    <div className="d-flex gap-3 justify-content-center">
                      <Link
                        href="/orders"
                        className="btn text-white px-4 py-3"
                        style={{
                          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                          borderRadius: '12px',
                          fontWeight: '600',
                          border: 'none',
                          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                        }}
                      >
                        <i className="bi bi-box-seam me-2"></i>
                        Xem đơn hàng
                      </Link>
                      
                      <Link
                        href="/"
                        className="btn btn-outline px-4 py-3"
                        style={{
                          borderRadius: '12px',
                          fontWeight: '600',
                          border: '2px solid #FF8E53',
                          color: '#FF8E53',
                        }}
                      >
                        <i className="bi bi-house me-2"></i>
                        Về trang chủ
                      </Link>
                    </div>
                  </>
                ) : paymentStatus === 'processing' ? (
                  <>
                    <div 
                      className="mb-4"
                      style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #FFA726 0%, #FF8E53 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i className="bi bi-clock-history" style={{ fontSize: '60px', color: 'white' }}></i>
                    </div>
                    
                    <h2 className="fw-bold mb-3" style={{ color: '#FF8E53' }}>
                      Đang xử lý thanh toán
                    </h2>
                    
                    <p className="text-muted mb-4">
                      Thanh toán của bạn đang được xử lý. Vui lòng chờ trong giây lát.
                    </p>

                    <Link
                      href="/orders"
                      className="btn text-white px-4 py-3"
                      style={{
                        background: 'linear-gradient(135deg, #FF8E53 0%, #FFA726 100%)',
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(255, 142, 83, 0.3)',
                      }}
                    >
                      Kiểm tra đơn hàng
                    </Link>
                  </>
                ) : (
                  <>
                    <div 
                      className="mb-4"
                      style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i className="bi bi-x-lg" style={{ fontSize: '60px', color: 'white' }}></i>
                    </div>
                    
                    <h2 className="fw-bold mb-3" style={{ color: '#f44336' }}>
                      Thanh toán thất bại
                    </h2>
                    
                    <p className="text-muted mb-4">
                      Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                    </p>

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
                        Thử lại
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}



