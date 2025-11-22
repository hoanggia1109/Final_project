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
  LucideIcon
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
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
      
      // Load dashboard stats
      const dashboardRes = await fetch('http://localhost:5001/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        console.log('Dashboard data:', dashboardData);
        setStats({
          totalProducts: dashboardData.sanpham || 0,
          totalOrders: dashboardData.donhang || 0,
          totalUsers: dashboardData.nguoidung || 0,
          totalRevenue: 0, // TODO: Tính từ đơn hàng
        });
      } else {
        console.error('Dashboard API failed, using fallback');
        // Fallback: Load sản phẩm trực tiếp
        const productsRes = await fetch('http://localhost:5001/api/sanpham');
        const products = await productsRes.json();

        setStats({
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
        });
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
          padding: 60px 30px;
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
                  title="Doanh thu"
                  value={`${stats.totalRevenue.toLocaleString('vi-VN')}₫`}
                  icon={DollarSign}
                  gradient="linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
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
                  title="Thống kê chi tiết"
                  description="Xem báo cáo và phân tích"
                  icon={TrendingUp}
                  onClick={() => alert('Chức năng đang phát triển')}
                  gradient="linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-card">
            <div className="activity-header">
              <h4 className="activity-title">
                <Eye size={22} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                Hoạt động gần đây
              </h4>
            </div>
            <div className="activity-body">
              <div className="empty-state">
                <div className="empty-icon">
                  <Activity size={40} color="#FF8E53" strokeWidth={2} />
                </div>
                <p className="empty-text">Chưa có hoạt động nào</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

