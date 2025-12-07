'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LocationSelector from '../component/LocationSelector';
import { validatePhone, validateRequired, validateMinLength, ValidationMessages } from '../utils/validation';

interface Address {
  id: string;
  hoten: string;
  sdt: string;
  diachichitiet: string;
  tinh_thanh: string;
  quan_huyen: string;
  phuong_xa: string;
  macdinh: number;
  loaidiachi?: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    hoten: '',
    sdt: '',
    diachichitiet: '',
    tinh_thanh: '',
    quan_huyen: '',
    phuong_xa: '',
    macdinh: false,
    loaidiachi: 'home'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load addresses');
      }

      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
      alert('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      hoten: address.hoten || '',
      sdt: address.sdt || '',
      diachichitiet: address.diachichitiet || '',
      tinh_thanh: address.tinh_thanh || '',
      quan_huyen: address.quan_huyen || '',
      phuong_xa: address.phuong_xa || '',
      macdinh: address.macdinh === 1,
      loaidiachi: address.loaidiachi || 'home'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      alert('Xóa địa chỉ thành công!');
      loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Không thể xóa địa chỉ');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ macdinh: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      alert('Đặt địa chỉ mặc định thành công!');
      loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Không thể đặt địa chỉ mặc định');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate hoten
    if (!validateRequired(formData.hoten)) {
      newErrors.hoten = ValidationMessages.required('họ và tên');
    } else if (!validateMinLength(formData.hoten, 2)) {
      newErrors.hoten = ValidationMessages.minLength('Họ và tên', 2);
    }

    // Validate sdt
    if (!validateRequired(formData.sdt)) {
      newErrors.sdt = ValidationMessages.required('số điện thoại');
    } else if (!validatePhone(formData.sdt)) {
      newErrors.sdt = ValidationMessages.phone;
    }

    // Validate diachichitiet
    if (!validateRequired(formData.diachichitiet)) {
      newErrors.diachichitiet = ValidationMessages.required('địa chỉ chi tiết');
    }

    // Validate tinh_thanh
    if (!validateRequired(formData.tinh_thanh)) {
      newErrors.tinh_thanh = ValidationMessages.required('tỉnh/thành phố');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập');
        return;
      }

      const payload = {
        hoten: formData.hoten,
        sdt: formData.sdt,
        diachichitiet: formData.diachichitiet,
        tinh_thanh: formData.tinh_thanh,
        quan_huyen: formData.quan_huyen,
        phuong_xa: formData.phuong_xa,
        macdinh: formData.macdinh ? 1 : 0,
        loaidiachi: formData.loaidiachi,
      };

      if (editingId) {
        // Update
        const response = await fetch(`/api/addresses/${editingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update address');
        }

        alert('Cập nhật địa chỉ thành công!');
      } else {
        // Add new
        const response = await fetch('/api/addresses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to create address');
        }

        alert('Thêm địa chỉ thành công!');
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        hoten: '',
        sdt: '',
        diachichitiet: '',
        tinh_thanh: '',
        quan_huyen: '',
        phuong_xa: '',
        macdinh: false,
        loaidiachi: 'home'
      });
      setErrors({});
      loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Không thể lưu địa chỉ');
    } finally {
      setSaving(false);
    }
  };

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
                    className="list-group-item list-group-item-action border-0 active"
                    style={{
                      backgroundColor: '#FFF8E1',
                      color: '#FFC107',
                      borderRadius: '12px',
                      marginBottom: '8px'
                    }}
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
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">
                    <i className="bi bi-geo-alt-fill text-success me-2"></i>
                    Địa chỉ của tôi
                  </h4>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        hoten: '',
                        sdt: '',
                        diachichitiet: '',
                        tinh_thanh: '',
                        quan_huyen: '',
                        phuong_xa: '',
                        macdinh: false,
                        loaidiachi: 'home'
                      });
                      setShowModal(true);
                    }}
                    className="btn btn-warning text-white"
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Thêm địa chỉ mới
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Đang tải...</span>
                    </div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-geo-alt" style={{ fontSize: '80px', color: '#dee2e6' }}></i>
                    <h5 className="mt-3 mb-2">Chưa có địa chỉ nào</h5>
                    <p className="text-muted">Thêm địa chỉ để giao hàng nhanh hơn</p>
                  </div>
                ) : (
                  <div className="d-grid gap-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="card border-0 bg-light"
                        style={{ borderRadius: '16px' }}
                      >
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="fw-bold mb-1">
                                {address.hoten}
                                {address.macdinh === 1 && (
                                  <span className="badge bg-warning text-white ms-2" style={{ fontSize: '11px' }}>
                                    Mặc định
                                  </span>
                                )}
                              </h6>
                              <p className="text-muted mb-0">
                                <i className="bi bi-telephone me-2"></i>
                                {address.sdt}
                              </p>
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => handleEdit(address)}
                                className="btn btn-sm btn-outline-warning"
                                style={{ borderRadius: '8px' }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(address.id)}
                                className="btn btn-sm btn-outline-danger"
                                style={{ borderRadius: '8px' }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <i className="bi bi-geo-alt me-2 text-success"></i>
                            <span>
                              {address.diachichitiet && `${address.diachichitiet}, `}
                              {address.phuong_xa && `${address.phuong_xa}, `}
                              {address.quan_huyen && `${address.quan_huyen}, `}
                              {address.tinh_thanh}
                            </span>
                          </div>

                          {address.macdinh !== 1 && (
                            <button
                              onClick={() => handleSetDefault(address.id)}
                              className="btn btn-sm btn-outline-success"
                              style={{ borderRadius: '8px' }}
                            >
                              <i className="bi bi-check-circle me-2"></i>
                              Đặt làm mặc định
                            </button>
                          )}
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

      {/* Modal */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex={-1} 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">

              <form onSubmit={handleSubmit} noValidate>
                {/* Thông báo lỗi tổng hợp */}
                {Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger d-flex align-items-start mb-3" role="alert" style={{ borderRadius: '12px' }}>
                    <i className="bi bi-exclamation-triangle-fill me-2 mt-1" style={{ fontSize: '1.2rem' }}></i>
                    <div>
                      <strong>Vui lòng kiểm tra lại thông tin:</strong>
                      <ul className="mb-0 mt-2" style={{ paddingLeft: '20px' }}>
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Họ và tên <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.hoten}
                      onChange={(e) => {
                        setFormData({ ...formData, hoten: e.target.value });
                        if (errors.hoten) setErrors({ ...errors, hoten: '' });
                      }}
                      required
                      style={{ 
                        padding: '12px 16px', 
                        borderRadius: '12px',
                        border: errors.hoten ? '2px solid #dc3545' : undefined
                      }}
                    />
                    {errors.hoten && (
                      <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                        {errors.hoten}
                      </small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Số điện thoại <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.sdt}
                      onChange={(e) => {
                        setFormData({ ...formData, sdt: e.target.value });
                        if (errors.sdt) setErrors({ ...errors, sdt: '' });
                      }}
                      required
                      style={{ 
                        padding: '12px 16px', 
                        borderRadius: '12px',
                        border: errors.sdt ? '2px solid #dc3545' : undefined
                      }}
                    />
                    {errors.sdt && (
                      <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                        {errors.sdt}
                      </small>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Địa chỉ <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.diachichitiet}
                      onChange={(e) => {
                        setFormData({ ...formData, diachichitiet: e.target.value });
                        if (errors.diachichitiet) setErrors({ ...errors, diachichitiet: '' });
                      }}
                      required
                      style={{ 
                        padding: '12px 16px', 
                        borderRadius: '12px',
                        border: errors.diachichitiet ? '2px solid #dc3545' : undefined
                      }}
                    />
                    {errors.diachichitiet && (
                      <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                        {errors.diachichitiet}
                      </small>
                    )}
                  </div>

                  <LocationSelector
                    selectedCity={formData.tinh_thanh}
                    selectedDistrict={formData.quan_huyen}
                    selectedWard={formData.phuong_xa}
                    onCityChange={(city) => {
                      setFormData(prev => ({ ...prev, tinh_thanh: city }));
                      if (errors.tinh_thanh) setErrors(prev => ({ ...prev, tinh_thanh: '' }));
                    }}
                    onDistrictChange={(district) => setFormData(prev => ({ ...prev, quan_huyen: district }))}
                    onWardChange={(ward) => setFormData(prev => ({ ...prev, phuong_xa: ward }))}
                    required
                  />
                  {errors.tinh_thanh && (
                    <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                      {errors.tinh_thanh}
                    </small>
                  )}

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="macdinh"
                        checked={formData.macdinh}
                        onChange={(e) => setFormData({ ...formData, macdinh: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="macdinh">
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline-secondary flex-fill"
                    style={{ borderRadius: '12px', padding: '12px' }}
                    disabled={saving}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning text-white flex-fill"
                    style={{ borderRadius: '12px', padding: '12px' }}
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm')}
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .d-flex.justify-content-between.align-items-center.mb-4 {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          
          .d-flex.justify-content-between.align-items-center.mb-4 h2 {
            font-size: 1.5rem !important;
          }
          
          .d-flex.justify-content-between.align-items-center.mb-4 .btn {
            width: 100%;
          }
          
          .card {
            border-radius: 12px !important;
            margin-bottom: 1rem;
          }
          
          .card-body {
            padding: 1rem !important;
          }
          
          .row.g-3 > *,
          .row.g-4 > * {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .row.g-3 .col-md-6,
          .row.g-4 .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
            margin-bottom: 1rem;
          }
          
          .modal-dialog {
            margin: 0.5rem;
            max-width: calc(100% - 1rem);
          }
          
          .modal-content {
            border-radius: 12px;
          }
          
          .modal-body {
            padding: 1rem !important;
          }
          
          .d-flex.gap-2,
          .d-flex.gap-3 {
            flex-direction: column;
          }
          
          .d-flex.gap-2 .btn,
          .d-flex.gap-3 .btn {
            width: 100%;
            margin: 0 !important;
          }
          
          .form-control,
          .form-select {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
        
        @media (max-width: 576px) {
          .card-body {
            padding: 0.75rem !important;
          }
          
          .modal-body {
            padding: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
















































