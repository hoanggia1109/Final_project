'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Eye,
  Activity,
  BarChart3,
  AlertTriangle,
  Clock,
  CheckCircle,
  UserCheck,
  FileText,
  LucideIcon
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalPosts: number; // Tổng số bài viết
  totalRevenue: number;
  onlineUsers: number;
  ordersToday: number;
  ordersPending: number;
  lowStockCount: number;
  outOfStockCount: number;
  revenueToday: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalPosts: 0,
    totalRevenue: 0,
    onlineUsers: 0,
    ordersToday: 0,
    ordersPending: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    revenueToday: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra quyền admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }

    // Load thống kê
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('Không có token, sử dụng dữ liệu mặc định');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Load tất cả thống kê song song
      const [
        dashboardRes,
        revenueRes,
        onlineUsersRes,
        ordersTodayRes,
        ordersPendingRes,
        lowStockRes,
        outOfStockRes
      ] = await Promise.all([
        fetch('http://localhost:5000/api/admin/dashboard', { headers }),
        fetch('http://localhost:5000/api/admin/revenue/daily', { headers }),
        fetch('http://localhost:5000/api/admin/users/online', { headers }),
        fetch('http://localhost:5000/api/admin/orders/today', { headers }),
        fetch('http://localhost:5000/api/admin/orders/pending', { headers }),
        fetch('http://localhost:5000/api/admin/products/low-stock', { headers }),
        fetch('http://localhost:5000/api/admin/products/out-of-stock', { headers })
      ]);

      const dashboardData = dashboardRes.ok ? await dashboardRes.json() : {};
      const revenueData = revenueRes.ok ? await revenueRes.json() : { tong_doanh_thu: 0 };
      const onlineUsersData = onlineUsersRes.ok ? await onlineUsersRes.json() : { total: 0 };
      const ordersTodayData = ordersTodayRes.ok ? await ordersTodayRes.json() : { count: 0, orders: [] };
      const ordersPendingData = ordersPendingRes.ok ? await ordersPendingRes.json() : { count: 0 };
      const lowStockData = lowStockRes.ok ? await lowStockRes.json() : { count: 0 };
      const outOfStockData = outOfStockRes.ok ? await outOfStockRes.json() : { count: 0 };

      setStats({
        totalProducts: dashboardData.sanpham || 0,
        totalOrders: dashboardData.donhang || 0,
        totalUsers: dashboardData.nguoidung || 0,
        totalPosts: dashboardData.baiviet || 0,
        totalRevenue: revenueData.tong_doanh_thu || 0,
        onlineUsers: onlineUsersData.total || 0,
        ordersToday: ordersTodayData.count || 0,
        ordersPending: ordersPendingData.count || 0,
        lowStockCount: lowStockData.count || 0,
        outOfStockCount: outOfStockData.count || 0,
        revenueToday: revenueData.tong_doanh_thu || 0,
      });

      // Set recent orders (lấy từ orders today, tối đa 5 đơn)
      if (ordersTodayData.orders && Array.isArray(ordersTodayData.orders)) {
        setRecentOrders(ordersTodayData.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    gradient
  }: { 
    title: string; 
    value: number | string; 
    icon: LucideIcon; 
    gradient: string;
  }) => (
    <div 
      className="stat-card h-100"
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(255, 107, 107, 0.08)',
        border: '1px solid #FFE5D9',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 107, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 107, 107, 0.08)';
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div 
          className="icon-wrapper"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)'
          }}
        >
          <Icon size={28} color="#fff" strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <p className="text-muted mb-2" style={{ fontSize: '0.9rem', fontWeight: '500' }}>{title}</p>
        <h2 className="fw-bold mb-0" style={{ color: '#2c3e50', fontSize: '2rem' }}>{value}</h2>
      </div>
    </div>
  );

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    gradient 
  }: { 
    title: string; 
    description: string; 
    icon: LucideIcon; 
    onClick: () => void; 
    gradient: string; 
  }) => (
    <div 
      className="quick-action-card h-100"
      onClick={onClick}
      style={{ 
        cursor: 'pointer', 
        transition: 'all 0.3s ease',
        background: '#fff',
        borderRadius: '16px',
        padding: '28px 20px',
        boxShadow: '0 4px 20px rgba(255, 107, 107, 0.08)',
        border: '2px solid #FFE5D9'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 107, 107, 0.15)';
        e.currentTarget.style.borderColor = '#FF8E53';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 107, 107, 0.08)';
        e.currentTarget.style.borderColor = '#FFE5D9';
      }}
    >
      <div className="text-center">
        <div 
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{ 
            width: '70px', 
            height: '70px', 
            borderRadius: '16px',
            background: gradient,
            boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
          }}
        >
          <Icon size={32} color="#fff" strokeWidth={2.5} />
        </div>
        <h5 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>{title}</h5>
        <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>{description}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <style jsx global>{`
          .admin-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%);
          }
        `}</style>
        <div className="admin-loading">
          <div className="text-center">
            <div className="spinner-border" style={{ width: '4rem', height: '4rem', color: '#FF6B6B', borderWidth: '4px' }}></div>
            <p className="mt-3" style={{ color: '#FF8E53', fontWeight: '600', fontSize: '1.1rem' }}>Đang tải dữ liệu...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #FFF9F0 0%, #ffffff 30%, #FFF5E8 100%);
          padding-top: 100px;
          padding-bottom: 60px;
        }

        .admin-header {
          margin-bottom: 40px;
          padding: 35px 0;
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.05), rgba(255, 142, 83, 0.05));
          border-radius: 20px;
          border: 2px solid #FFE5D9;
        }

        .admin-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .admin-subtitle {
          color: #666;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .section-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 25px;
          position: relative;
          padding-left: 20px;
        }

        .section-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 35px;
          background: linear-gradient(180deg, #FF6B6B, #FF8E53);
          border-radius: 3px;
        }

        .stats-grid {
          margin-bottom: 50px;
        }

        .actions-grid {
          margin-bottom: 50px;
        }

        .activity-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 2px solid #FFE5D9;
          box-shadow: 0 8px 30px rgba(255, 107, 107, 0.08);
          overflow: hidden;
        }

        .activity-header {
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          padding: 25px 30px;
          border-bottom: 2px solid #FFE5D9;
        }

        .activity-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .activity-body {
          padding: 30px;
        }

        .activity-body .table {
          margin-bottom: 0;
        }

        .activity-body .table thead th {
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          border-bottom: 2px solid #FFE5D9;
          color: #2c3e50;
          font-weight: 600;
          padding: 15px;
        }

        .activity-body .table tbody td {
          padding: 15px;
          vertical-align: middle;
        }

        .activity-body .table tbody tr:hover {
          background: #FFF9F0;
        }

        .empty-state {
          text-align: center;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #FFF5F0, #FFE5E0);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-text {
          font-size: 1.1rem;
          color: #999;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .admin-title {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .admin-dashboard {
            padding-top: 80px;
          }
        }
      `}</style>

      <div className="admin-dashboard">
        <div className="container-fluid">
          {/* Header */}
          <div className="admin-header text-center">
            <h1 className="admin-title">
              <i className="bi bi-speedometer2 me-3"></i>
              Admin Dashboard
            </h1>
            <p className="admin-subtitle">Chào mừng bạn đến với trang quản trị</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <h3 className="section-title">
              <BarChart3 size={24} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              Thống kê tổng quan
            </h3>
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Tổng sản phẩm"
                  value={stats.totalProducts}
                  icon={Package}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Đơn hàng"
                  value={stats.totalOrders}
                  icon={ShoppingCart}
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Khách hàng"
                  value={stats.totalUsers}
                  icon={Users}
                  gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Tổng bài viết"
                  value={stats.totalPosts}
                  icon={FileText}
                  gradient="linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
                />
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="stats-grid">
            <h3 className="section-title">
              <Activity size={24} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              Thống kê chi tiết
            </h3>
            <div className="row g-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Người dùng online"
                  value={stats.onlineUsers}
                  icon={UserCheck}
                  gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Đơn hàng hôm nay"
                  value={stats.ordersToday}
                  icon={Clock}
                  gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Đơn hàng chờ xử lý"
                  value={stats.ordersPending}
                  icon={AlertTriangle}
                  gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Sản phẩm tồn kho thấp"
                  value={stats.lowStockCount}
                  icon={AlertTriangle}
                  gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
                />
              </div>
            </div>
            <div className="row g-4 mt-2">
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Doanh thu hôm nay"
                  value={`${stats.revenueToday.toLocaleString('vi-VN')}₫`}
                  icon={DollarSign}
                  gradient="linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <StatCard
                  title="Sản phẩm hết hàng"
                  value={stats.outOfStockCount}
                  icon={Package}
                  gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="actions-grid">
            <h3 className="section-title">
              <Activity size={24} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              Thao tác nhanh
            </h3>
            <div className="row g-4">
              <div className="col-12 col-md-6 col-lg-3">
                <QuickActionCard
                  title="Quản lý sản phẩm"
                  description="Xem, thêm, sửa, xóa sản phẩm"
                  icon={Package}
                  onClick={() => router.push('/admin/products')}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <QuickActionCard
                  title="Thêm sản phẩm mới"
                  description="Tạo sản phẩm mới cho cửa hàng"
                  icon={ShoppingBag}
                  onClick={() => router.push('/admin/products/create')}
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <QuickActionCard
                  title="Quản lý người dùng"
                  description="Xem và quản lý người dùng"
                  icon={Users}
                  onClick={() => router.push('/admin/users')}
                  gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <QuickActionCard
                  title="Quản lý đơn hàng"
                  description="Xem và xử lý đơn hàng"
                  icon={ShoppingCart}
                  onClick={() => router.push('/admin/orders')}
                  gradient="linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <QuickActionCard
                  title="Quản lý tồn kho"
                  description="Theo dõi tồn kho sản phẩm"
                  icon={Package}
                  onClick={() => router.push('/admin/tonkho')}
                  gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <QuickActionCard
                  title="Người dùng online"
                  description={`${stats.onlineUsers} người đang online`}
                  icon={UserCheck}
                  onClick={() => router.push('/admin/users')}
                  gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <QuickActionCard
                  title="Thống kê chi tiết"
                  description="Xem báo cáo và phân tích"
                  icon={TrendingUp}
                  onClick={() => alert('Chức năng đang phát triển')}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-card">
            <div className="activity-header d-flex justify-content-between align-items-center">
              <h4 className="activity-title mb-0">
                <Eye size={22} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                Đơn hàng hôm nay
              </h4>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => router.push('/admin/orders')}
              >
                Xem tất cả
              </button>
            </div>
            <div className="activity-body">
              {recentOrders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Activity size={40} color="#FF8E53" strokeWidth={2} />
                  </div>
                  <p className="empty-text">Chưa có đơn hàng nào hôm nay</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order: any) => (
                        <tr key={order.id}>
                          <td>
                            <strong style={{ color: '#FF6B6B' }}>#{order.code}</strong>
                          </td>
                          <td>
                            {order.user?.ho_ten || 'N/A'}
                            <br />
                            <small className="text-muted">{order.user?.email || ''}</small>
                          </td>
                          <td>
                            <strong>{Number(order.tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫</strong>
                          </td>
                          <td>
                            <span 
                              className="badge"
                              style={{
                                background: order.trangthai === 'pending' ? '#ffc107' :
                                           order.trangthai === 'confirmed' ? '#17a2b8' :
                                           order.trangthai === 'shipping' ? '#007bff' :
                                           order.trangthai === 'delivered' ? '#28a745' :
                                           order.trangthai === 'cancelled' ? '#dc3545' : '#6c757d',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: '6px'
                              }}
                            >
                              {order.trangthai === 'pending' ? 'Chờ xác nhận' :
                               order.trangthai === 'confirmed' ? 'Đã xác nhận' :
                               order.trangthai === 'shipping' ? 'Đang giao' :
                               order.trangthai === 'delivered' ? 'Đã giao' :
                               order.trangthai === 'cancelled' ? 'Đã hủy' :
                               order.trangthai === 'returned' ? 'Đã trả' : order.trangthai}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : 'N/A'}
                            </small>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => router.push(`/admin/orders/${order.id}`)}
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

