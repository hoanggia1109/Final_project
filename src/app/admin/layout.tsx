'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Kiểm tra quyền admin
    const userRole = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    if (userRole !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }

    setUserName(name || 'Admin');
  }, [router]);

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      router.push('/');
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      active: pathname === '/admin',
    },
    {
      title: 'Sản phẩm',
      icon: Package,
      path: '/admin/products',
      active: pathname?.startsWith('/admin/products'),
    },
    {
      title: 'Đơn hàng',
      icon: ShoppingCart,
      path: '/admin/orders',
      active: pathname?.startsWith('/admin/orders'),
    },
    {
      title: 'Khách hàng',
      icon: Users,
      path: '/admin/customers',
      active: pathname?.startsWith('/admin/customers'),
    },
    {
      title: 'Cài đặt',
      icon: Settings,
      path: '/admin/settings',
      active: pathname?.startsWith('/admin/settings'),
    },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Sidebar */}
      <aside
        className="bg-dark text-white d-flex flex-column"
        style={{
          width: sidebarOpen ? '260px' : '80px',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        {/* Logo & Toggle */}
        <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
          {sidebarOpen ? (
            <>
              <h4 className="fw-bold mb-0 text-warning">Admin Panel</h4>
              <button
                onClick={() => setSidebarOpen(false)}
                className="btn btn-link text-white p-0"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-link text-white p-0 mx-auto"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <p className="mb-0 fw-semibold small">{userName}</p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-grow-1 py-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`d-flex align-items-center gap-3 px-3 py-3 text-decoration-none ${
                item.active
                  ? 'bg-warning text-dark'
                  : 'text-white-50 hover-bg-secondary'
              }`}
              style={{
                transition: 'all 0.2s ease',
                borderLeft: item.active ? '4px solid #FFC107' : '4px solid transparent',
              }}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <>
                  <span className="flex-grow-1">{item.title}</span>
                  {item.active && <ChevronRight size={16} />}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top border-secondary">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: sidebarOpen ? '260px' : '80px',
          transition: 'margin-left 0.3s ease',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {/* Top Bar */}
        <header
          className="bg-white shadow-sm sticky-top"
          style={{ zIndex: 999 }}
        >
          <div className="px-4 py-3 d-flex align-items-center justify-content-between">
            <div>
              <h5 className="mb-0 fw-bold text-dark">
                {menuItems.find((item) => item.active)?.title || 'Admin'}
              </h5>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link href="/" className="btn btn-outline-primary btn-sm">
                Về trang chủ
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4">{children}</div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        .hover-bg-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

