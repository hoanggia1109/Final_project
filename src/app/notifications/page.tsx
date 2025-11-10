'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Đơn hàng đã được giao thành công',
      message: 'Đơn hàng #ORD-001 đã được giao thành công. Cảm ơn bạn đã mua sắm tại cửa hàng!',
      date: '2025-10-30T14:30:00',
      read: false
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Giảm giá 20% toàn bộ sản phẩm Sofa',
      message: 'Chương trình khuyến mãi lớn! Giảm ngay 20% cho tất cả sản phẩm Sofa. Áp dụng từ 01/11 đến 07/11.',
      date: '2025-10-29T10:00:00',
      read: false
    },
    {
      id: '3',
      type: 'system',
      title: 'Chào mừng bạn đến với cửa hàng!',
      message: 'Cảm ơn bạn đã đăng ký tài khoản. Chúc bạn có trải nghiệm mua sắm tuyệt vời!',
      date: '2025-10-28T09:00:00',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const typeConfig = {
    order: { icon: 'bag-check', color: '#28a745', label: 'Đơn hàng' },
    promotion: { icon: 'gift', color: '#FFC107', label: 'Khuyến mãi' },
    system: { icon: 'bell', color: '#17a2b8', label: 'Hệ thống' }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

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
                    className="list-group-item list-group-item-action border-0 active"
                    style={{
                      backgroundColor: '#FFF8E1',
                      color: '#FFC107',
                      borderRadius: '12px'
                    }}
                  >
                    <i className="bi bi-bell me-2"></i>
                    Thông báo
                    {unreadCount > 0 && (
                      <span className="badge bg-danger ms-2">{unreadCount}</span>
                    )}
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
                    <i className="bi bi-bell-fill text-warning me-2"></i>
                    Thông báo
                    {unreadCount > 0 && (
                      <span className="badge bg-danger ms-2">{unreadCount}</span>
                    )}
                  </h4>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`btn btn-sm ${filter === 'all' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
                      style={{ borderRadius: '12px' }}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`btn btn-sm ${filter === 'unread' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
                      style={{ borderRadius: '12px' }}
                    >
                      Chưa đọc ({unreadCount})
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="btn btn-sm btn-outline-success"
                        style={{ borderRadius: '12px' }}
                      >
                        <i className="bi bi-check-all me-1"></i>
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>
                </div>

                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-bell-slash" style={{ fontSize: '80px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3 mb-2">Không có thông báo nào</h5>
                    <p className="text-muted">
                      {filter === 'unread' 
                        ? 'Bạn đã đọc hết tất cả thông báo' 
                        : 'Chưa có thông báo mới'}
                    </p>
                  </div>
                ) : (
                  <div className="d-grid gap-3">
                    {filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`card border-0 ${notif.read ? 'bg-light' : 'bg-white'}`}
                        style={{
                          borderRadius: '16px',
                          border: notif.read ? 'none' : '2px solid #FFC107'
                        }}
                      >
                        <div className="card-body p-4">
                          <div className="d-flex">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: `${typeConfig[notif.type].color}20`,
                                flexShrink: 0
                              }}
                            >
                              <i
                                className={`bi bi-${typeConfig[notif.type].icon}`}
                                style={{
                                  fontSize: '24px',
                                  color: typeConfig[notif.type].color
                                }}
                              ></i>
                            </div>

                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <span
                                    className="badge mb-2"
                                    style={{
                                      backgroundColor: typeConfig[notif.type].color,
                                      fontSize: '11px'
                                    }}
                                  >
                                    {typeConfig[notif.type].label}
                                  </span>
                                  <h6 className="fw-bold mb-1">{notif.title}</h6>
                                </div>
                                <button
                                  onClick={() => deleteNotification(notif.id)}
                                  className="btn btn-sm btn-link text-muted p-0"
                                  style={{ fontSize: '18px' }}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>

                              <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                                {notif.message}
                              </p>

                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  {new Date(notif.date).toLocaleString('vi-VN')}
                                </small>
                                {!notif.read && (
                                  <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="btn btn-sm btn-outline-success"
                                    style={{ borderRadius: '8px' }}
                                  >
                                    <i className="bi bi-check2 me-1"></i>
                                    Đánh dấu đã đọc
                                  </button>
                                )}
                              </div>
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


























