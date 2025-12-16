'use client';
import { API_BASE_URL } from '@/lib/api-config';

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
  newProductsCount: number; // Sản phẩm mới (7 ngày gần đây)
}

interface RevenueStats {
  from_date: string;
  to_date: string;
  tong_doanh_thu: number;
  so_don_hang: number;
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
    newProductsCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [dateRange, setDateRange] = useState({
    from_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 ngày trước
    to_date: new Date().toISOString().split('T')[0], // Hôm nay
  });
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  useEffect(() => {
    // Kiểm tra token và quyền admin
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      alert('Vui lòng đăng nhập!');
      router.push('/auth');
      return;
    }
    
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
        outOfStockRes,
        newProductsRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/dashboard`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch dashboard:', err);
          return { ok: false, json: async () => ({}) } as Response;
        }),
        fetch(`${API_BASE_URL}/api/admin/revenue/daily`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch revenue:', err);
          return { ok: false, json: async () => ({ tong_doanh_thu: 0 }) } as Response;
        }),
        fetch(`${API_BASE_URL}/api/admin/users/online`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch users:', err);
          return { ok: false, json: async () => ({ total: 0 }) } as Response;
        }),
        fetch(`${API_BASE_URL}/api/admin/orders/today`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch orders today:', err);
          return { ok: false, json: async () => ({ count: 0, orders: [] }) } as Response;
        }),
        fetch(`${API_BASE_URL}/api/admin/orders/pending`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch orders pending:', err);
          return { ok: false, json: async () => ({ count: 0 }) } as Response;
        }),
        fetch(`${API_BASE_URL}/api/admin/products/low-stock`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch low stock:', err);
          return { ok: false, json: async () => ({ count: 0 }) } as Response;
        }),
        fetch(`${API_BASE_URL}/api/admin/products/out-of-stock`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch out of stock:', err);
          return { ok: false, json: async () => ({ count: 0 }) } as Response;
        }),
        fetch(`${API_BASE_URL}/api/admin/products/new?days=7`, { headers }).catch(err => {
          console.error('❌ Lỗi fetch new products:', err);
          return { ok: false, json: async () => ({ count: 0 }) } as Response;
        })
      ]);

      // Kiểm tra response trước khi parse JSON
      const parseJsonSafely = async (res: Response) => {
        if (!res.ok) {
          const text = await res.text();
          console.error('❌ Response không OK:', res.status, text.substring(0, 100));
          
          // Nếu là lỗi 401 (Unauthorized), token không hợp lệ hoặc đã hết hạn
          if (res.status === 401) {
            console.warn('⚠️ Token không hợp lệ hoặc đã hết hạn. Đang đăng xuất...');
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            router.push('/auth');
            return {};
          }
          
          return {};
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error('❌ Response không phải JSON:', text.substring(0, 100));
          return {};
        }
        return res.json();
      };

      const dashboardData = await parseJsonSafely(dashboardRes);
      const revenueData = await parseJsonSafely(revenueRes);
      const onlineUsersData = await parseJsonSafely(onlineUsersRes);
      const ordersTodayData = await parseJsonSafely(ordersTodayRes);
      const ordersPendingData = await parseJsonSafely(ordersPendingRes);
      const lowStockData = await parseJsonSafely(lowStockRes);
      const outOfStockData = await parseJsonSafely(outOfStockRes);
      const newProductsData = await parseJsonSafely(newProductsRes);

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
        newProductsCount: newProductsData.count || 0,
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

  const loadRevenueStats = async () => {
    if (!dateRange.from_date || !dateRange.to_date) {
      return;
    }

    setLoadingRevenue(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/admin/revenue/range?from_date=${dateRange.from_date}&to_date=${dateRange.to_date}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRevenueStats(data);
      }
    } catch (error) {
      console.error('Lỗi tải thống kê doanh thu:', error);
    } finally {
      setLoadingRevenue(false);
    }
  };

  useEffect(() => {
    if (dateRange.from_date && dateRange.to_date) {
      loadRevenueStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.from_date, dateRange.to_date]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    gradient,
    onClick
  }: { 
    title: string; 
    value: number | string; 
    icon: LucideIcon; 
    gradient: string;
    onClick?: () => void;
  }) => (
    <div 
      className="stat-card h-100"
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(255, 107, 107, 0.08)',
        border: '1px solid #FFE5D9',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 107, 0.15)';
          e.currentTarget.style.borderColor = '#FF8E53';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 107, 107, 0.08)';
        e.currentTarget.style.borderColor = '#FFE5D9';
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

          {/* Dashboard Boxes - Thông tin quan trọng */}
          <div className="actions-grid">
            <h3 className="section-title">
              <Activity size={24} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              Thông tin quan trọng
            </h3>
            <div className="row g-4">
              {/* Sản phẩm mới */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  onClick={() => router.push('/admin/products')}
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <Package size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Sản phẩm mới</h5>
                    <h2 className="fw-bold mb-0" style={{ color: '#667eea', fontSize: '2rem' }}>{stats.newProductsCount}</h2>
                    <p className="text-muted small mb-0 mt-2">Trong 7 ngày gần đây</p>
                  </div>
                </div>
              </div>

              {/* Đơn hàng mới */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  onClick={() => router.push('/admin/orders')}
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
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <ShoppingCart size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Đơn hàng mới</h5>
                    <h2 className="fw-bold mb-0" style={{ color: '#f5576c', fontSize: '2rem' }}>{stats.ordersToday}</h2>
                    <p className="text-muted small mb-0 mt-2">Hôm nay</p>
                  </div>
                </div>
              </div>

              {/* Sản phẩm hết hàng */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  onClick={() => router.push('/admin/products')}
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
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <AlertTriangle size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Sản phẩm hết hàng</h5>
                    <h2 className="fw-bold mb-0" style={{ color: '#ff6b6b', fontSize: '2rem' }}>{stats.outOfStockCount}</h2>
                    <p className="text-muted small mb-0 mt-2">Cần nhập hàng</p>
                  </div>
                </div>
              </div>

              {/* Thống kê doanh thu theo thời gian */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  style={{ 
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '28px 20px',
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.08)',
                    border: '2px solid #FFE5D9'
                  }}
                >
                  <div className="text-center mb-3">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ 
                        width: '70px', 
                        height: '70px', 
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <DollarSign size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Thống kê doanh thu</h5>
                  </div>
                  
                  {/* Form chọn ngày */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">Từ ngày</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={dateRange.from_date}
                      onChange={(e) => setDateRange({ ...dateRange, from_date: e.target.value })}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">Đến ngày</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={dateRange.to_date}
                      onChange={(e) => setDateRange({ ...dateRange, to_date: e.target.value })}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Hiển thị kết quả */}
                  {loadingRevenue ? (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm text-primary"></div>
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

          {/* Dashboard Boxes */}
          <div className="actions-grid">
            <h3 className="section-title">
              <Activity size={24} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              Thông tin quan trọng
            </h3>
            <div className="row g-4">
              {/* Sản phẩm mới */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  onClick={() => router.push('/admin/products')}
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <Package size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Sản phẩm mới</h5>
                    <h2 className="fw-bold mb-0" style={{ color: '#667eea', fontSize: '2rem' }}>{stats.newProductsCount}</h2>
                    <p className="text-muted small mb-0 mt-2">Trong 7 ngày gần đây</p>
                  </div>
                </div>
              </div>

              {/* Đơn hàng mới */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  onClick={() => router.push('/admin/orders')}
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
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <ShoppingCart size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Đơn hàng mới</h5>
                    <h2 className="fw-bold mb-0" style={{ color: '#f5576c', fontSize: '2rem' }}>{stats.ordersToday}</h2>
                    <p className="text-muted small mb-0 mt-2">Hôm nay</p>
                  </div>
                </div>
              </div>

              {/* Sản phẩm hết hàng */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  onClick={() => router.push('/admin/products')}
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
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <AlertTriangle size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Sản phẩm hết hàng</h5>
                    <h2 className="fw-bold mb-0" style={{ color: '#ff6b6b', fontSize: '2rem' }}>{stats.outOfStockCount}</h2>
                    <p className="text-muted small mb-0 mt-2">Cần nhập hàng</p>
                  </div>
                </div>
              </div>

              {/* Thống kê doanh thu theo thời gian */}
              <div className="col-12 col-md-6 col-lg-3">
                <div 
                  className="h-100"
                  style={{ 
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '28px 20px',
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.08)',
                    border: '2px solid #FFE5D9'
                  }}
                >
                  <div className="text-center mb-3">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ 
                        width: '70px', 
                        height: '70px', 
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.25)'
                      }}
                    >
                      <DollarSign size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Thống kê doanh thu</h5>
                  </div>
                  
                  {/* Form chọn ngày */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">Từ ngày</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={dateRange.from_date}
                      onChange={(e) => setDateRange({ ...dateRange, from_date: e.target.value })}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">Đến ngày</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={dateRange.to_date}
                      onChange={(e) => setDateRange({ ...dateRange, to_date: e.target.value })}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Hiển thị kết quả */}
                  {loadingRevenue ? (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                  ) : revenueStats ? (
                    <div className="text-center">
                      <div className="mb-2">
                        <small className="text-muted d-block">Số đơn hàng</small>
                        <strong style={{ color: '#FF6B6B', fontSize: '1.3rem' }}>{revenueStats.so_don_hang}</strong>
                      </div>
                      <div>
                        <small className="text-muted d-block">Doanh thu</small>
                        <strong style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                          {revenueStats.tong_doanh_thu.toLocaleString('vi-VN')}₫
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted small">
                      Chọn khoảng thời gian để xem thống kê
                    </div>
                  )}
                </div>
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

