'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface OrderDetail {
  id: string;
  code: string;
  user_id: string;
  tongtien: number;
  giamgia: number;
  tongtien_sau_giam: number;
  phi_van_chuyen: number;
  trangthai: string;
  trangthaithanhtoan: string;
  ghichu?: string;
  created_at: string;
  user?: {
    email: string;
    ho_ten?: string;
    sdt?: string;
  };
  diachi?: {
    ten: string;
    sdt: string;
    diachi_cu_the: string;
    phuong_xa: string;
    quan_huyen: string;
    tinh_thanh: string;
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
        thumbnail?: string;
      };
    };
  }>;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetail();
  }, []);

  const loadOrderDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/donhang/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load order');

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/donhang/${order.id}/trangthai`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ trangthai: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      alert('Cập nhật trạng thái thành công!');
      loadOrderDetail();
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

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Không tìm thấy đơn hàng</h3>
        <Link href="/admin/orders" className="btn btn-warning mt-3">
          Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link href="/admin/orders" className="btn btn-link text-decoration-none mb-2">
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại danh sách
          </Link>
          <h1 className="h3 mb-0 fw-bold">
            Chi tiết đơn hàng #{order.code}
          </h1>
          <small className="text-muted">
            Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
          </small>
        </div>
        <div>
          <span
            className="badge me-2"
            style={{
              backgroundColor: statusConfig[order.trangthai]?.color,
              fontSize: '1rem',
              padding: '0.5rem 1rem',
            }}
          >
            <i className={`bi bi-${statusConfig[order.trangthai]?.icon} me-2`}></i>
            {statusConfig[order.trangthai]?.label}
          </span>
          <span
            className="badge"
            style={{
              backgroundColor: paymentStatusConfig[order.trangthaithanhtoan]?.color,
              fontSize: '1rem',
              padding: '0.5rem 1rem',
            }}
          >
            {paymentStatusConfig[order.trangthaithanhtoan]?.label}
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Sản phẩm */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-box-seam me-2 text-warning"></i>
                Sản phẩm ({order.chitiet.length})
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">Sản phẩm</th>
                      <th className="py-3">Biến thể</th>
                      <th className="py-3">Đơn giá</th>
                      <th className="py-3">SL</th>
                      <th className="py-3">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.chitiet.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="position-relative rounded"
                              style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: '#f8f9fa',
                                flexShrink: 0,
                              }}
                            >
                              {item.bienthe.sanpham?.thumbnail && (
                                <Image
                                  src={item.bienthe.sanpham.thumbnail}
                                  alt={item.bienthe.sanpham?.tensp || 'Product'}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  className="rounded"
                                />
                              )}
                            </div>
                            <div>
                              <div className="fw-semibold">
                                {item.bienthe.sanpham?.tensp || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          {item.bienthe.mausac && (
                            <div>
                              <small className="text-muted">Màu: </small>
                              <span>{item.bienthe.mausac}</span>
                            </div>
                          )}
                          {item.bienthe.kichthuoc && (
                            <div>
                              <small className="text-muted">Size: </small>
                              <span>{item.bienthe.kichthuoc}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          {Number(item.gia).toLocaleString('vi-VN')}₫
                        </td>
                        <td className="py-3">
                          <span className="badge bg-secondary">{item.soluong}</span>
                        </td>
                        <td className="py-3">
                          <div className="fw-bold text-warning">
                            {(Number(item.gia) * item.soluong).toLocaleString('vi-VN')}₫
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {order.ghichu && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-chat-left-text me-2 text-warning"></i>
                  Ghi chú
                </h5>
              </div>
              <div className="card-body">
                <p className="mb-0">{order.ghichu}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Thông tin khách hàng */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-person me-2 text-warning"></i>
                Khách hàng
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted d-block">Tên:</small>
                <strong>{order.user?.ho_ten || 'N/A'}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Email:</small>
                <strong>{order.user?.email}</strong>
              </div>
              {order.user?.sdt && (
                <div>
                  <small className="text-muted d-block">SĐT:</small>
                  <strong>{order.user.sdt}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          {order.diachi && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-geo-alt me-2 text-warning"></i>
                  Địa chỉ giao hàng
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <strong>{order.diachi.ten}</strong>
                </div>
                <div className="mb-2">
                  <i className="bi bi-telephone me-2"></i>
                  {order.diachi.sdt}
                </div>
                <div className="text-muted">
                  {order.diachi.diachi_cu_the}, {order.diachi.phuong_xa}, {order.diachi.quan_huyen}, {order.diachi.tinh_thanh}
                </div>
              </div>
            </div>
          )}

          {/* Tổng tiền */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-receipt me-2 text-warning"></i>
                Thanh toán
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <strong>{order.tongtien.toLocaleString('vi-VN')}₫</strong>
              </div>
              {order.giamgia > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Giảm giá:</span>
                  <strong>-{order.giamgia.toLocaleString('vi-VN')}₫</strong>
                </div>
              )}
              <div className="d-flex justify-content-between mb-3">
                <span>Phí vận chuyển:</span>
                <strong>{order.phi_van_chuyen.toLocaleString('vi-VN')}₫</strong>
              </div>
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between">
                  <strong className="fs-5">Tổng cộng:</strong>
                  <strong className="fs-4 text-warning">
                    {order.tongtien_sau_giam.toLocaleString('vi-VN')}₫
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Cập nhật trạng thái */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-arrow-repeat me-2 text-warning"></i>
                Cập nhật trạng thái
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {order.trangthai === 'pending' && (
                  <button
                    className="btn btn-info text-white"
                    onClick={() => {
                      if (confirm('Xác nhận đơn hàng này?')) {
                        updateOrderStatus('confirmed');
                      }
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Xác nhận đơn hàng
                  </button>
                )}
                {order.trangthai === 'confirmed' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (confirm('Chuyển sang trạng thái đang giao?')) {
                        updateOrderStatus('shipping');
                      }
                    }}
                  >
                    <i className="bi bi-truck me-2"></i>
                    Bắt đầu giao hàng
                  </button>
                )}
                {order.trangthai === 'shipping' && (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      if (confirm('Xác nhận đã giao hàng thành công?')) {
                        updateOrderStatus('delivered');
                      }
                    }}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Đã giao hàng
                  </button>
                )}
                {order.trangthai !== 'cancelled' && order.trangthai !== 'delivered' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (confirm('Hủy đơn hàng này?')) {
                        updateOrderStatus('cancelled');
                      }
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


