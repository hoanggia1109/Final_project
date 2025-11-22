'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

export default function BankingCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false); // CHANGED: State để hiển thị thông báo copy mã đơn hàng

  // CHANGED: Thông tin chuyển khoản ngân hàng
  const bankInfo = {
    bankName: 'Techcombank',
    accountNumber: '9390270900',
    accountHolder: 'Trần Nguyễn Phương Vy',
    branch: 'TPHCM',
    qrCode: '/banking-qr.jpeg', // CHANGED: Đường dẫn QR code - hỗ trợ cả JPEG và PNG
  };

  useEffect(() => {
    const loadOrder = async () => {
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
        const orderResponse = await fetch(`http://localhost:5001/api/donhang/${orderIdParam}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          setOrder(orderData);
        } else {
          setError('Không tìm thấy đơn hàng');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading order:', error);
        setError('Có lỗi xảy ra khi tải thông tin đơn hàng');
        setLoading(false);
      }
    };

    loadOrder();
  }, [searchParams, router]);

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    alert('Đã copy số tài khoản!');
  };

  const handleCopyAmount = () => {
    if (order) {
      const amount = order.tongtien_sau_giam.toLocaleString('vi-VN');
      navigator.clipboard.writeText(amount);
      alert('Đã copy số tiền!');
    }
  };

  // CHANGED: Hàm xác nhận đã chuyển khoản
  const handleConfirmTransfer = async () => {
    if (!orderId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập lại!');
        router.push('/auth');
        return;
      }

      const response = await fetch('http://localhost:5001/api/thanhtoan/banking/confirm-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xác nhận chuyển khoản');
      }

      alert('Xác nhận chuyển khoản thành công! Đơn hàng của bạn đang chờ được kiểm tra.');
      window.dispatchEvent(new Event('cartUpdated'));
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err) {
      console.error('Error confirming transfer:', err);
      alert('Lỗi khi xác nhận chuyển khoản: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

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
            Đang tải thông tin...
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
                  </div>
                </div>
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
            Chuyển khoản ngân hàng
          </h1>
        </div>

        {/* CHANGED: Chia thành 2 cột bằng nhau - Thông tin đơn hàng bên trái, Thông tin chuyển khoản bên phải */}
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

          {/* Cột phải: Thông tin chuyển khoản */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-bank me-2" style={{ color: '#FF8E53' }}></i>
                  Thông tin chuyển khoản
                </h5>

                <div className="alert alert-info mb-4" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Vui lòng chuyển khoản đúng số tiền:</strong> {order ? Number(order.tongtien_sau_giam || 0).toLocaleString('vi-VN') : '0'}₫
                  <br />
                  <small>Sau khi chuyển khoản, vui lòng chờ xác nhận từ chúng tôi (thường trong 1-2 giờ làm việc).</small>
                </div>

                {/* CHANGED: Layout 2 cột - Thông tin ngân hàng bên trái, QR code bên phải */}
                <div className="row g-4">
                  {/* Cột trái: Thông tin ngân hàng */}
                  <div className="col-md-6">
                    <div className="border rounded-4 p-4" style={{ background: '#f8f9fa' }}>
                      <h6 className="fw-bold mb-3" style={{ color: '#FF8E53' }}>
                        <i className="bi bi-bank2 me-2"></i>
                        Thông tin tài khoản
                      </h6>
                      
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Ngân hàng</small>
                        <div className="fw-bold" style={{ fontSize: '16px', color: '#333' }}>
                          {bankInfo.bankName}
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Số tài khoản</small>
                        <div className="d-flex align-items-center gap-2">
                          <div className="fw-bold" style={{ fontSize: '18px', color: '#FF6B6B', letterSpacing: '2px' }}>
                            {bankInfo.accountNumber}
                          </div>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleCopyAccountNumber}
                            style={{ padding: '4px 8px' }}
                            title="Copy số tài khoản"
                          >
                            <i className="bi bi-clipboard"></i>
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Chủ tài khoản</small>
                        <div className="fw-bold" style={{ fontSize: '16px', color: '#333' }}>
                          {bankInfo.accountHolder}
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Chi nhánh</small>
                        <div className="fw-semibold" style={{ fontSize: '15px', color: '#666' }}>
                          {bankInfo.branch}
                        </div>
                      </div>

                      {order && (
                        <div className="mt-4 pt-3 border-top">
                          <small className="text-muted d-block mb-1">Số tiền cần chuyển</small>
                          <div className="d-flex align-items-center gap-2">
                            <div 
                              className="fw-bold" 
                              style={{ 
                                fontSize: '20px',
                                background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}
                            >
                              {Number(order.tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫
                            </div>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={handleCopyAmount}
                              style={{ padding: '4px 8px' }}
                              title="Copy số tiền"
                            >
                              <i className="bi bi-clipboard"></i>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 p-3 rounded-3" style={{ background: '#fff3cd', border: '2px solid #ffc107' }}>
                        <small className="text-dark">
                          <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#ffc107' }}></i>
                          <strong>Lưu ý:</strong> Nội dung chuyển khoản vui lòng ghi: <strong>Mã đơn hàng {orderId?.substring(0, 8) || ''}</strong>
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Cột phải: QR Code */}
                  <div className="col-md-6">
                    <div className="text-center">
                      <h6 className="fw-bold mb-3" style={{ color: '#FF8E53' }}>
                        <i className="bi bi-qr-code me-2"></i>
                        Quét QR Code
                      </h6>
                      
                      {/* CHANGED: Container QR Code với fallback nếu không có ảnh */}
                      <div 
                        className="border rounded-4 p-3 mx-auto position-relative"
                        style={{
                          width: '280px',
                          height: '280px',
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        id="qr-code-container"
                      >
                        {/* CHANGED: QR Code - hỗ trợ cả JPEG (.jpeg, .jpg) và PNG (.png) */}
                        <Image
                          src={bankInfo.qrCode}
                          alt="QR Code chuyển khoản Techcombank"
                          width={280}
                          height={280}
                          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                          priority
                          onError={(e) => {
                            // CHANGED: Nếu không có ảnh QR, hiển thị placeholder
                            const container = document.getElementById('qr-code-container');
                            if (container) {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (!container.querySelector('.qr-placeholder')) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'qr-placeholder';
                                placeholder.innerHTML = `
                                  <div style="text-align: center; color: #999; padding: 20px;">
                                    <i class="bi bi-qr-code" style="font-size: 64px; display: block; margin-bottom: 10px; color: #ddd;"></i>
                                    <small style="display: block; margin-top: 10px;">Không tìm thấy ảnh QR code<br/>Vui lòng kiểm tra file: public/banking-qr.jpeg</small>
                                  </div>
                                `;
                                container.appendChild(placeholder);
                              }
                            }
                          }}
                        />
                      </div>
                      
                      <p className="text-muted mt-3" style={{ fontSize: '13px' }}>
                        Quét QR code bằng app ngân hàng để chuyển khoản nhanh chóng
                      </p>
                      <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
                        <small className="text-muted">
                          <i className="bi bi-check-circle me-1" style={{ color: '#28a745' }}></i>
                          VietQR
                        </small>
                        <small className="text-muted">
                          <i className="bi bi-check-circle me-1" style={{ color: '#28a745' }}></i>
                          Napas 247
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hướng dẫn */}
                <div className="mt-4 pt-4 border-top">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-list-check me-2" style={{ color: '#FF8E53' }}></i>
                    Hướng dẫn chuyển khoản
                  </h6>
                  <ol className="ps-3" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <li>Chuyển khoản đúng số tiền: <strong>{order ? Number(order.tongtien_sau_giam || 0).toLocaleString('vi-VN') : '0'}₫</strong></li>
                    <li>Ghi nội dung: <strong>Mã đơn hàng {orderId?.substring(0, 8) || ''}</strong></li>
                    <li>Chụp màn hình/ảnh biên lai chuyển khoản (nếu có)</li>
                    <li>Sau khi chuyển khoản, đơn hàng sẽ được xác nhận trong 1-2 giờ làm việc</li>
                    <li>Bạn sẽ nhận được email xác nhận khi đơn hàng được duyệt</li>
                  </ol>
                </div>

                {/* Buttons */}
                <div className="mt-4 d-flex gap-3 flex-column">
                  {/* CHANGED: Button xác nhận đã chuyển khoản */}
                  <button
                    type="button"
                    className="btn text-white w-100 py-3"
                    onClick={handleConfirmTransfer}
                    style={{
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
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
                    <i className="bi bi-check-circle me-2"></i>
                    Xác nhận đã chuyển khoản
                  </button>
                  
                  <div className="d-flex gap-3">
                    <Link
                      href="/orders"
                      className="btn btn-outline flex-grow-1 py-3"
                      style={{
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: '2px solid #FF8E53',
                        color: '#FF8E53',
                      }}
                    >
                      <i className="bi bi-box-seam me-2"></i>
                      Xem đơn hàng
                    </Link>
                    
                    <Link
                      href="/"
                      className="btn btn-outline flex-grow-1 py-3"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

