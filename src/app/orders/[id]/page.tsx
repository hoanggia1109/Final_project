'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Toast from '@/app/component/Toast';

interface OrderItem {
  id: string;
  soluong: number;
  gia: number;
  bienthe: {
    id: string;
    mausac?: string;
    kichthuoc?: string;
    chatlieu?: string;
    sanpham: {
      id: string;
      tensp: string;
      thumbnail?: string;
    };
  };
}

interface Order {
  id: string;
  code: string;
  created_at: string;
  trangthai: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled' | 'returned';
  trangthaithanhtoan: string;
  tongtien: number;
  tongtien_sau_giam: number;
  giamgia: number;
  phi_van_chuyen: number;
  ghichu?: string;
  magiamgia_code?: string;
  chitiet: OrderItem[];
  diachi?: {
    hoten: string;
    sdt: string;
    diachichitiet: string;
    phuong_xa: string;
    quan_huyen: string;
    tinh_thanh: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  useEffect(() => {
    loadOrderDetail();
  }, [params?.id]);

  const loadOrderDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/orders/${params?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setToastMessage('Không tìm thấy đơn hàng');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setToastMessage('Có lỗi xảy ra');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${order?.id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setToastMessage('Đã hủy đơn hàng thành công');
        setToastType('success');
        setShowToast(true);
        loadOrderDetail();
      } else {
        setToastMessage('Không thể hủy đơn hàng');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setToastMessage('Có lỗi xảy ra');
      setToastType('error');
      setShowToast(true);
    }
  };

  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: '#ffc107', icon: 'clock', bgLight: '#fff8e1' },
    confirmed: { label: 'Đã xác nhận', color: '#17a2b8', icon: 'check-circle', bgLight: '#e0f7fa' },
    shipping: { label: 'Đang giao', color: '#007bff', icon: 'truck', bgLight: '#e3f2fd' },
    delivered: { label: 'Đã giao', color: '#28a745', icon: 'check-circle-fill', bgLight: '#e8f5e9' },
    cancelled: { label: 'Đã hủy', color: '#dc3545', icon: 'x-circle', bgLight: '#ffebee' },
    returned: { label: 'Đã trả hàng', color: '#6c757d', icon: 'arrow-counterclockwise', bgLight: '#f5f5f5' }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
          <h3 className="mt-3">Không tìm thấy đơn hàng</h3>
          <Link href="/orders" className="btn btn-warning mt-3">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.trangthai];

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          {/* Back Button */}
          <Link 
            href="/orders" 
            className="btn btn-link text-decoration-none mb-4 p-0"
            style={{ color: '#666' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại danh sách đơn hàng
          </Link>

          {/* Order Status Banner */}
          <div 
            className="card border-0 shadow-sm mb-4" 
            style={{ 
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${status.bgLight} 0%, ${status.color}15 100%)`
            }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h4 className="fw-bold mb-2">
                    <i className={`bi bi-${status.icon} me-2`} style={{ color: status.color }}></i>
                    {status.label}
                  </h4>
                  <p className="mb-0 text-muted">
                    Đơn hàng <strong>{order.code}</strong> • Đặt ngày {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  {order.trangthai === 'pending' && (
                    <button 
                      className="btn btn-outline-danger"
                      style={{ borderRadius: '12px' }}
                      onClick={handleCancelOrder}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Hủy đơn hàng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Order Items */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Sản phẩm đã đặt</h5>
                  
                  {order.chitiet.map((item, index) => (
                    <div key={item.id}>
                      <div className="d-flex align-items-start mb-3">
                        <div
                          className="position-relative rounded-3 overflow-hidden me-3"
                          style={{
                            width: '100px',
                            height: '100px',
                            flexShrink: 0,
                            backgroundColor: '#f8f9fa'
                          }}
                        >
                          {item.bienthe.sanpham.thumbnail && (
                            <Image
                              src={item.bienthe.sanpham.thumbnail}
                              alt={item.bienthe.sanpham.tensp}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-semibold mb-2">{item.bienthe.sanpham.tensp}</h6>
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            {item.bienthe.mausac && (
                              <span className="badge bg-light text-dark border">
                                Màu: {item.bienthe.mausac}
                              </span>
                            )}
                            {item.bienthe.kichthuoc && (
                              <span className="badge bg-light text-dark border">
                                Size: {item.bienthe.kichthuoc}
                              </span>
                            )}
                            {item.bienthe.chatlieu && (
                              <span className="badge bg-light text-dark border">
                                {item.bienthe.chatlieu}
                              </span>
                            )}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">x {item.soluong}</span>
                            <span className="fw-bold text-warning">
                              {Number(item.gia).toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < order.chitiet.length - 1 && <hr />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Info */}
            <div className="col-lg-4">
              {/* Payment Summary */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Thông tin thanh toán</h5>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tổng tiền hàng:</span>
                    <span>{Number(order.tongtien).toLocaleString('vi-VN')}₫</span>
                  </div>

                  {order.giamgia > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>
                        Giảm giá
                        {order.magiamgia_code && (
                          <span className="badge bg-success-subtle text-success ms-2">
                            {order.magiamgia_code}
                          </span>
                        )}
                      </span>
                      <span>-{Number(order.giamgia).toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Phí vận chuyển:</span>
                    <span>{Number(order.phi_van_chuyen).toLocaleString('vi-VN')}₫</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Tổng thanh toán:</span>
                    <span className="fw-bold text-warning fs-5">
                      {Number(order.tongtien_sau_giam).toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  <div className="alert alert-info mb-0" style={{ fontSize: '14px' }}>
                    <i className="bi bi-info-circle me-2"></i>
                    Trạng thái thanh toán: <strong>{order.trangthaithanhtoan === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</strong>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {order.diachi && (
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">
                      <i className="bi bi-geo-alt text-warning me-2"></i>
                      Địa chỉ nhận hàng
                    </h5>
                    
                    <div className="mb-2">
                      <strong>{order.diachi.hoten}</strong>
                    </div>
                    <div className="mb-2 text-muted">
                      <i className="bi bi-telephone me-2"></i>
                      {order.diachi.sdt}
                    </div>
                    <div className="text-muted">
                      <i className="bi bi-house me-2"></i>
                      {order.diachi.diachichitiet}, {order.diachi.phuong_xa}, {order.diachi.quan_huyen}, {order.diachi.tinh_thanh}
                    </div>
                  </div>
                </div>
              )}

              {/* Note */}
              {order.ghichu && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">
                      <i className="bi bi-pencil-square text-warning me-2"></i>
                      Ghi chú
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      {order.ghichu}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

