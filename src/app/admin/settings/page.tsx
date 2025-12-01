'use client';

import React from 'react';

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>Cài đặt</h2>
          <p className="text-muted mb-0">Quản lý cài đặt hệ thống</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-gear" style={{ fontSize: '4rem', color: '#FF8E53' }}></i>
            <p className="mt-3 text-muted">Trang cài đặt đang được phát triển</p>
          </div>
        </div>
      </div>
    </div>
  );
}

