'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      address: '123 Đường ABC',
      city: 'Hà Nội',
      district: 'Cầu Giấy',
      ward: 'Dịch Vọng',
      isDefault: true
    }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    isDefault: false
  });

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      ward: address.ward,
      isDefault: address.isDefault
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update
      setAddresses(addresses.map(addr =>
        addr.id === editingId ? { ...formData, id: addr.id } : addr
      ));
    } else {
      // Add new
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString()
      };
      setAddresses([...addresses, newAddress]);
    }
    
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      isDefault: false
    });
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
                        name: '',
                        phone: '',
                        address: '',
                        city: '',
                        district: '',
                        ward: '',
                        isDefault: false
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

                {addresses.length === 0 ? (
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
                                {address.name}
                                {address.isDefault && (
                                  <span className="badge bg-warning text-white ms-2" style={{ fontSize: '11px' }}>
                                    Mặc định
                                  </span>
                                )}
                              </h6>
                              <p className="text-muted mb-0">
                                <i className="bi bi-telephone me-2"></i>
                                {address.phone}
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
                              {address.address}, {address.ward}, {address.district}, {address.city}
                            </span>
                          </div>

                          {!address.isDefault && (
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
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, zIndex: 1050 }}
            onClick={() => setShowModal(false)}
          ></div>

          <div
            className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow-lg"
            style={{
              zIndex: 1051,
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h5>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-close"
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Họ và tên</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ padding: '12px 16px', borderRadius: '12px' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      style={{ padding: '12px 16px', borderRadius: '12px' }}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Địa chỉ</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      style={{ padding: '12px 16px', borderRadius: '12px' }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Thành phố</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      style={{ padding: '12px 16px', borderRadius: '12px' }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Quận/Huyện</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      required
                      style={{ padding: '12px 16px', borderRadius: '12px' }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Phường/Xã</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      required
                      style={{ padding: '12px 16px', borderRadius: '12px' }}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="isDefault">
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
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning text-white flex-fill"
                    style={{ borderRadius: '12px', padding: '12px' }}
                  >
                    {editingId ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}





























