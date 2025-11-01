'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled'>('all');
  
  // Mock data - thay bằng API call
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2025-10-30',
      status: 'delivered',
      total: 15000000,
      items: [
        {
          id: '1',
          name: 'Sofa Modern 3 chỗ ngồi',
          image: '/placeholder.jpg',
          quantity: 1,
          price: 15000000
        }
      ]
    }
  ]);

  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: '#ffc107', icon: 'clock' },
    processing: { label: 'Đang xử lý', color: '#17a2b8', icon: 'hourglass-split' },
    shipping: { label: 'Đang giao', color: '#007bff', icon: 'truck' },
    delivered: { label: 'Đã giao', color: '#28a745', icon: 'check-circle' },
    cancelled: { label: 'Đã hủy', color: '#dc3545', icon: 'x-circle' }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

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
                <ul className="nav nav-pills mb-4" style={{ gap: '8px' }}>
                  {[
                    { key: 'all', label: 'Tất cả', count: orders.length },
                    { key: 'pending', label: 'Chờ xác nhận', count: 0 },
                    { key: 'processing', label: 'Đang xử lý', count: 0 },
                    { key: 'shipping', label: 'Đang giao', count: 0 },
                    { key: 'delivered', label: 'Đã giao', count: 1 },
                    { key: 'cancelled', label: 'Đã hủy', count: 0 }
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
                          fontWeight: '500'
                        }}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <span className="badge bg-white text-dark ms-2">
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
                            <div>
                              <h6 className="fw-bold mb-1">Đơn hàng: {order.id}</h6>
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(order.date).toLocaleDateString('vi-VN')}
                              </small>
                            </div>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: statusConfig[order.status].color,
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '13px'
                              }}
                            >
                              <i className={`bi bi-${statusConfig[order.status].icon} me-1`}></i>
                              {statusConfig[order.status].label}
                            </span>
                          </div>

                          {/* Order Items */}
                          {order.items.map((item) => (
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
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-semibold mb-1">{item.name}</h6>
                                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                                  Số lượng: {item.quantity}
                                </p>
                              </div>
                              <div className="text-end">
                                <div className="fw-bold text-warning">
                                  {item.price.toLocaleString('vi-VN')}₫
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Order Footer */}
                          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <div>
                              <span className="text-muted me-2">Tổng tiền:</span>
                              <span className="fw-bold text-warning" style={{ fontSize: '18px' }}>
                                {order.total.toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                            <div className="d-flex gap-2">
                              {order.status === 'delivered' && (
                                <button
                                  className="btn btn-outline-warning"
                                  style={{ borderRadius: '12px' }}
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
  );
}

