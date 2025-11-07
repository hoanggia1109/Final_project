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
  Eye
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
      // Load sản phẩm
      const productsRes = await fetch('http://localhost:5000/api/sanpham');
      const products = await productsRes.json();

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalOrders: 0, // TODO: Thêm API đơn hàng
        totalUsers: 0, // TODO: Thêm API users
        totalRevenue: 0, // TODO: Tính từ đơn hàng
      });
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
    color, 
    bgColor 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color: string; 
    bgColor: string; 
  }) => (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted small mb-1">{title}</p>
            <h3 className="fw-bold mb-0">{value}</h3>
          </div>
          <div 
            className="rounded-3 p-3"
            style={{ backgroundColor: bgColor }}
          >
            <Icon size={24} color={color} />
          </div>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    color 
  }: { 
    title: string; 
    description: string; 
    icon: any; 
    onClick: () => void; 
    color: string; 
  }) => (
    <div 
      className="card border-0 shadow-sm h-100 cursor-pointer"
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="card-body text-center p-4">
        <div 
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: `${color}20` 
          }}
        >
          <Icon size={28} color={color} />
        </div>
        <h5 className="fw-bold mb-2">{title}</h5>
        <p className="text-muted small mb-0">{description}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold text-dark mb-2">Admin Dashboard</h1>
        <p className="text-muted">Chào mừng bạn đến với trang quản trị</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            icon={Package}
            color="#3B82F6"
            bgColor="#DBEAFE"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Đơn hàng"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="#10B981"
            bgColor="#D1FAE5"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Khách hàng"
            value={stats.totalUsers}
            icon={Users}
            color="#F59E0B"
            bgColor="#FEF3C7"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Doanh thu"
            value={`${stats.totalRevenue.toLocaleString('vi-VN')}₫`}
            icon={DollarSign}
            color="#EF4444"
            bgColor="#FEE2E2"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h4 className="fw-bold mb-3">Thao tác nhanh</h4>
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <QuickActionCard
              title="Quản lý sản phẩm"
              description="Xem, thêm, sửa, xóa sản phẩm"
              icon={Package}
              onClick={() => router.push('/admin/products')}
              color="#3B82F6"
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <QuickActionCard
              title="Thêm sản phẩm mới"
              description="Tạo sản phẩm mới cho cửa hàng"
              icon={ShoppingBag}
              onClick={() => router.push('/admin/products/create')}
              color="#10B981"
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <QuickActionCard
              title="Quản lý đơn hàng"
              description="Xem và xử lý đơn hàng"
              icon={ShoppingCart}
              onClick={() => alert('Chức năng đang phát triển')}
              color="#F59E0B"
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <QuickActionCard
              title="Thống kê"
              description="Xem báo cáo và phân tích"
              icon={TrendingUp}
              onClick={() => alert('Chức năng đang phát triển')}
              color="#EF4444"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="fw-bold mb-0">Hoạt động gần đây</h5>
        </div>
        <div className="card-body">
          <div className="text-center py-5 text-muted">
            <Eye size={48} className="mb-3 opacity-50" />
            <p className="mb-0">Chưa có hoạt động nào</p>
          </div>
        </div>
      </div>
    </div>
  );
}

