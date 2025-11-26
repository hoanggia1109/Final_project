'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'succeeded' | 'processing' | 'failed'>('processing');

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
      const paymentIntentId = searchParams.get('payment_intent');

      if (!paymentIntentId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/cart');
          return;
        }

        // Xác minh thanh toán với backend
        const response = await fetch(`http://localhost:5000/api/thanhtoan/stripe/verify/${paymentIntentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data.status);
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
                      Thanh toán thành công!
                    </h2>
                    
                    <p className="text-muted mb-4">
                      Đơn hàng của bạn đã được thanh toán và đang được xử lý. 
                      Chúng tôi sẽ gửi thông tin chi tiết qua email của bạn.
                    </p>

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



