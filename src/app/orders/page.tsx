'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Toast from '@/app/component/Toast';

interface OrderItem {
  id: string;
  soluong: number;
  gia: number;
  bienthe: {
    id: string;
    mausac?: string;
    kichthuoc?: string;
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
  tongtien: number;
  tongtien_sau_giam: number;
  giamgia: number;
  phi_van_chuyen: number;
  chitiet: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setToastMessage('Đã hủy đơn hàng thành công');
        setToastType('success');
        setShowToast(true);
        loadOrders();
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

  const handleBuyAgain = async (order: Order) => {
    // Add items to cart
    try {
      const token = localStorage.getItem('token');
      for (const item of order.chitiet) {
        await fetch('http://localhost:5001/api/giohang', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bienthe_id: item.bienthe.id,
            soluong: item.soluong
          })
        });
      }
      
      // Notify header to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
      
      setToastMessage('Đã thêm sản phẩm vào giỏ hàng');
      setToastType('success');
      setShowToast(true);
      
      setTimeout(() => router.push('/cart'), 1500);
    } catch (error) {
      console.error('Error buying again:', error);
      setToastMessage('Có lỗi xảy ra');
      setToastType('error');
      setShowToast(true);
    }
  };

  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: '#ffc107', icon: 'clock' },
    confirmed: { label: 'Đã xác nhận', color: '#17a2b8', icon: 'check-circle' },
    shipping: { label: 'Đang giao', color: '#007bff', icon: 'truck' },
    delivered: { label: 'Đã giao', color: '#28a745', icon: 'check-circle-fill' },
    cancelled: { label: 'Đã hủy', color: '#dc3545', icon: 'x-circle' },
    returned: { label: 'Đã trả hàng', color: '#6c757d', icon: 'arrow-counterclockwise' }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.trangthai === activeTab);

  // Count for each tab
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.trangthai === 'pending').length,
    confirmed: orders.filter(o => o.trangthai === 'confirmed').length,
    shipping: orders.filter(o => o.trangthai === 'shipping').length,
    delivered: orders.filter(o => o.trangthai === 'delivered').length,
    cancelled: orders.filter(o => o.trangthai === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

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
                      className="list-group-item list-group-item-action border-0 active"
                      style={{
                        backgroundColor: '#FFF8E1',
                        color: '#FFC107',
                        borderRadius: '12px',
                        marginBottom: '8px'
                      }}
                    >
                      <i className="bi bi-bag-check me-2"></i>
                      Đơn hàng
                    </Link>
                    <Link
                      href="/wishlist"
                      className="list-group-item list-group-item-action border-0"
                      style={{ borderRadius: '12px', marginBottom: '8px' }}
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
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">
                    <i className="bi bi-bag-check text-warning me-2"></i>
                    Đơn hàng của tôi
                  </h4>

                  {/* Tabs */}
                  <ul className="nav nav-pills mb-4 flex-nowrap overflow-auto" style={{ gap: '8px' }}>
                    {[
                      { key: 'all', label: 'Tất cả', count: counts.all },
                      { key: 'pending', label: 'Chờ xác nhận', count: counts.pending },
                      { key: 'confirmed', label: 'Đã xác nhận', count: counts.confirmed },
                      { key: 'shipping', label: 'Đang giao', count: counts.shipping },
                      { key: 'delivered', label: 'Đã giao', count: counts.delivered },
                      { key: 'cancelled', label: 'Đã hủy', count: counts.cancelled }
                    ].map((tab) => (
                      <li key={tab.key} className="nav-item">
                        <button
                          className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab.key as typeof activeTab)}
                          style={{
                            borderRadius: '12px',
                            backgroundColor: activeTab === tab.key ? '#FFC107' : 'transparent',
                            color: activeTab === tab.key ? 'white' : '#666',
                            border: 'none',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {tab.label}
                          {tab.count > 0 && (
                            <span className={`badge ${activeTab === tab.key ? 'bg-white text-dark' : 'bg-warning'} ms-2`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Orders List */}
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-inbox" style={{ fontSize: '64px', color: '#dee2e6' }}></i>
                      <p className="text-muted mt-3 mb-0">Chưa có đơn hàng nào</p>
                    </div>
                  ) : (
                    <div className="d-grid gap-3">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className="card border-0 bg-light"
                          style={{ borderRadius: '16px' }}
                        >
                          <div className="card-body p-4">
                            {/* Order Header */}
                            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <h6 className="fw-bold mb-0">Đơn hàng: {order.code}</h6>
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {
                                      navigator.clipboard.writeText(order.code);
                                      // CHANGED: Hiển thị thông báo copy thành công
                                      const toast = document.createElement('div');
                                      toast.className = 'position-fixed top-0 end-0 p-3';
                                      toast.style.zIndex = '9999';
                                      toast.innerHTML = `
                                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                                          <i class="bi bi-check-circle me-2"></i>
                                          Đã copy mã đơn hàng!
                                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                      `;
                                      document.body.appendChild(toast);
                                      setTimeout(() => toast.remove(), 2000);
                                    }}
                                    style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '12px' }}
                                    title="Copy mã đơn hàng"
                                  >
                                    <i className="bi bi-clipboard" style={{ fontSize: '12px' }}></i>
                                  </button>
                                </div>
                                <small className="text-muted">
                                  <i className="bi bi-calendar me-1"></i>
                                  {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                </small>
                              </div>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: statusConfig[order.trangthai].color,
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  fontSize: '13px'
                                }}
                              >
                                <i className={`bi bi-${statusConfig[order.trangthai].icon} me-1`}></i>
                                {statusConfig[order.trangthai].label}
                              </span>
                            </div>

                            {/* Order Items */}
                            {order.chitiet.map((item) => (
                              <div key={item.id} className="d-flex align-items-center mb-3">
                                <div
                                  className="position-relative rounded-3 overflow-hidden me-3"
                                  style={{
                                    width: '80px',
                                    height: '80px',
                                    flexShrink: 0,
                                    backgroundColor: 'white'
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
                                  <h6 className="fw-semibold mb-1">{item.bienthe.sanpham.tensp}</h6>
                                  <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                                    {item.bienthe.mausac && `Màu: ${item.bienthe.mausac}`}
                                    {item.bienthe.kichthuoc && ` | Size: ${item.bienthe.kichthuoc}`}
                                  </p>
                                  <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                                    Số lượng: {item.soluong}
                                  </p>
                                </div>
                                <div className="text-end">
                                  <div className="fw-bold text-warning">
                                    {Number(item.gia).toLocaleString('vi-VN')}₫
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Order Footer */}
                            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                              <div>
                                <span className="text-muted me-2">Tổng tiền:</span>
                                <span className="fw-bold text-warning" style={{ fontSize: '18px' }}>
                                  {Number(order.tongtien_sau_giam).toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                              <div className="d-flex gap-2">
                                {order.trangthai === 'pending' && (
                                  <button
                                    className="btn btn-outline-danger"
                                    style={{ borderRadius: '12px' }}
                                    onClick={() => handleCancelOrder(order.id)}
                                  >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Hủy đơn
                                  </button>
                                )}
                                {order.trangthai === 'delivered' && (
                                  <button
                                    className="btn btn-outline-warning"
                                    style={{ borderRadius: '12px' }}
                                    onClick={() => handleBuyAgain(order)}
                                  >
                                    <i className="bi bi-repeat me-2"></i>
                                    Mua lại
                                  </button>
                                )}
                                <Link
                                  href={`/orders/${order.id}`}
                                  className="btn btn-warning text-white"
                                  style={{ borderRadius: '12px' }}
                                >
                                  Xem chi tiết
                                </Link>
                              </div>
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
    </>
  );
}
