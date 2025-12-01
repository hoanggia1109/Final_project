'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  code: string;
  user_id: string;
  tongtien: number;
  giamgia: number;
  tongtien_sau_giam: number;
  phi_van_chuyen: number;
  trangthai: string;
  trangthaithanhtoan: string;
  phuongthucthanhtoan?: string;
  ghichu?: string;
  ly_do_huy?: string;
  created_at: string;
  user?: {
    email: string;
    ho_ten?: string;
    sdt?: string;
  };
  chitiet: Array<{
    id: string;
    soluong: number;
    gia: number;
    bienthe: {
      mausac?: string;
      kichthuoc?: string;
      sanpham?: {
        tensp: string;
      };
    };
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch('http://localhost:5000/api/donhang/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load orders');

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/donhang/${orderId}/trangthai`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ trangthai: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      alert('Cập nhật trạng thái thành công!');
      loadOrders(); // Reload danh sách
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    pending: { label: 'Chờ xác nhận', color: '#ffc107', icon: 'clock' },
    confirmed: { label: 'Đã xác nhận', color: '#17a2b8', icon: 'check-circle' },
    shipping: { label: 'Đang giao', color: '#007bff', icon: 'truck' },
    delivered: { label: 'Đã giao', color: '#28a745', icon: 'check-circle-fill' },
    cancelled: { label: 'Đã hủy', color: '#dc3545', icon: 'x-circle' },
  };

  const paymentStatusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chưa thanh toán', color: '#ffc107' },
    paid: { label: 'Đã thanh toán', color: '#28a745' },
    COD: { label: 'COD', color: '#17a2b8' },
    failed: { label: 'Thất bại', color: '#dc3545' },
  };

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' || order.trangthai === filterStatus;
    const matchSearch = order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       order.user?.ho_ten?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 fw-bold">
            <i className="bi bi-box-seam me-2 text-warning"></i>
            Quản lý đơn hàng
          </h1>
          <p className="text-muted mb-0">Tổng: {filteredOrders.length} đơn hàng</p>
        </div>
        <button
          onClick={loadOrders}
          className="btn btn-warning"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm theo mã đơn, email, tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="col-md-6">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="py-3">Khách hàng</th>
                  <th className="py-3">Sản phẩm</th>
                  <th className="py-3">Tổng tiền</th>
                  <th className="py-3">Thanh toán</th>
                  <th className="py-3">Trạng thái</th>
                  <th className="py-3">Ngày đặt</th>
                  <th className="py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-2 mb-0">Không có đơn hàng nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      {/* Mã đơn */}
                      <td className="px-4 py-3">
                        <div className="fw-bold">{order.code}</div>
                      </td>

                      {/* Khách hàng */}
                      <td className="py-3">
                        <div>
                          <div className="fw-semibold">
                            {order.user?.ho_ten || 'N/A'}
                          </div>
                          <small className="text-muted">{order.user?.email}</small>
                          {order.user?.sdt && (
                            <div>
                              <small className="text-muted">
                                <i className="bi bi-telephone me-1"></i>
                                {order.user.sdt}
                              </small>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Sản phẩm */}
                      <td className="py-3">
                        <div>
                          {order.chitiet.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-truncate" style={{ maxWidth: '200px' }}>
                              <small>
                                {item.bienthe.sanpham?.tensp} x{item.soluong}
                              </small>
                            </div>
                          ))}
                          {order.chitiet.length > 2 && (
                            <small className="text-muted">
                              +{order.chitiet.length - 2} sản phẩm khác
                            </small>
                          )}
                        </div>
                      </td>

                      {/* Tổng tiền */}
                      <td className="py-3">
                        <div className="fw-bold text-warning">
                          {Number(order.tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫
                        </div>
                        {Number(order.giamgia || 0) > 0 && (
                          <small className="text-muted">
                            Giảm: {Number(order.giamgia || 0).toLocaleString('vi-VN')}₫
                          </small>
                        )}
                      </td>

                      {/* Thanh toán */}
                      <td className="py-3">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: paymentStatusConfig[order.trangthaithanhtoan]?.color || '#6c757d',
                            fontSize: '0.75rem',
                          }}
                        >
                          {paymentStatusConfig[order.trangthaithanhtoan]?.label || order.trangthaithanhtoan}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3">
                        <select
                          className="form-select form-select-sm"
                          value={order.trangthai}
                          onChange={(e) => {
                            if (confirm(`Xác nhận chuyển sang trạng thái "${statusConfig[e.target.value].label}"?`)) {
                              updateOrderStatus(order.id, e.target.value);
                            }
                          }}
                          style={{
                            borderColor: statusConfig[order.trangthai]?.color,
                            color: statusConfig[order.trangthai]?.color,
                            fontWeight: '600',
                          }}
                        >
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>
                              {config.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Ngày đặt */}
                      <td className="py-3">
                        <small className="text-muted">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                          <br />
                          {new Date(order.created_at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </small>
                      </td>

                      {/* Actions */}
                      <td className="py-3 text-center">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="btn btn-sm btn-outline-warning"
                        >
                          <i className="bi bi-eye" style={{ fontSize: '18px' }}></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mt-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter(o => o.trangthai === status).length;
          return (
            <div key={status} className="col-md-2-4 col-sm-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className={`bi bi-${config.icon}`} style={{ fontSize: '2rem', color: config.color }}></i>
                  <h3 className="mt-2 mb-0">{count}</h3>
                  <small className="text-muted">{config.label}</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .col-md-2-4 {
          flex: 0 0 auto;
          width: 20%;
        }
        @media (max-width: 768px) {
          .col-md-2-4 {
            width: 50%;
          }
        }
      `}</style>
    </div>
  );
}

