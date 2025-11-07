'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderFormData {
  // Thông tin khách hàng
  fullName: string;
  email: string;
  phone: string;
  
  // Địa chỉ giao hàng
  address: string;
  city: string;
  district: string;
  ward: string;
  
  // Ghi chú
  note: string;
  
  // Phương thức thanh toán
  paymentMethod: 'cod' | 'bank' | 'momo';
}

export default function OrderPage() {
  // Giả lập giỏ hàng (trong thực tế sẽ lấy từ Context/Redux)
  const [cartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Bàn làm việc hiện đại',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400',
      price: 2500000,
      quantity: 1
    },
    {
      id: 2,
      name: 'Ghế văn phòng cao cấp',
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
      price: 1800000,
      quantity: 2
    }
  ]);

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  // Tính tổng tiền
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 50000; // Phí ship cố định
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng nhập
    if (errors[name as keyof OrderFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.city.trim()) newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    if (!formData.district.trim()) newErrors.district = 'Vui lòng chọn quận/huyện';
    if (!formData.ward.trim()) newErrors.ward = 'Vui lòng chọn phường/xã';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Order submitted:', { formData, cartItems, total });
      alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      // Trong thực tế sẽ gọi API để tạo đơn hàng
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Trang chủ</Link></li>
              <li className="breadcrumb-item"><Link href="/cart">Giỏ hàng</Link></li>
              <li className="breadcrumb-item active">Đặt hàng</li>
            </ol>
          </nav>
          <h2 className="fw-bold">ĐẶT HÀNG</h2>
        </div>

        <div className="row g-4">
          {/* Form đặt hàng - Bên trái */}
          <div className="col-lg-7">
            <form onSubmit={handleSubmit}>
              {/* Thông tin khách hàng */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <i className="bi bi-person-circle me-2 text-warning"></i>
                    Thông tin khách hàng
                  </h5>
                  
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="0123456789"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <i className="bi bi-geo-alt-fill me-2 text-warning"></i>
                    Địa chỉ giao hàng
                  </h5>
                  
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Tỉnh/Thành phố <span className="text-danger">*</span>
                      </label>
                      <select
                        name="city"
                        className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                        value={formData.city}
                        onChange={handleChange}
                      >
                        <option value="">Chọn tỉnh/thành</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="danang">Đà Nẵng</option>
                        <option value="binhduong">Bình Dương</option>
                        <option value="dongnai">Đồng Nai</option>
                      </select>
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Quận/Huyện <span className="text-danger">*</span>
                      </label>
                      <select
                        name="district"
                        className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                        value={formData.district}
                        onChange={handleChange}
                      >
                        <option value="">Chọn quận/huyện</option>
                        <option value="q1">Quận 1</option>
                        <option value="q2">Quận 2</option>
                        <option value="q3">Quận 3</option>
                        <option value="thuduc">TP. Thủ Đức</option>
                        <option value="binhtan">Bình Tân</option>
                      </select>
                      {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Phường/Xã <span className="text-danger">*</span>
                      </label>
                      <select
                        name="ward"
                        className={`form-select ${errors.ward ? 'is-invalid' : ''}`}
                        value={formData.ward}
                        onChange={handleChange}
                      >
                        <option value="">Chọn phường/xã</option>
                        <option value="p1">Phường 1</option>
                        <option value="p2">Phường 2</option>
                        <option value="p3">Phường 3</option>
                        <option value="hiepbinhphuoc">Hiệp Bình Phước</option>
                      </select>
                      {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Địa chỉ cụ thể <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        placeholder="Số nhà, tên đường..."
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Ghi chú đơn hàng</label>
                      <textarea
                        name="note"
                        className="form-control"
                        rows={3}
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                        value={formData.note}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <i className="bi bi-credit-card me-2 text-warning"></i>
                    Phương thức thanh toán
                  </h5>

                  <div className="d-flex flex-column gap-3">
                    {/* COD */}
                    <div className="form-check p-3 border rounded" style={{ cursor: 'pointer' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label w-100" htmlFor="cod" style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <strong>Thanh toán khi nhận hàng (COD)</strong>
                            <p className="text-muted small mb-0 mt-1">Thanh toán bằng tiền mặt khi nhận hàng</p>
                          </div>
                          <i className="bi bi-cash-coin fs-3 text-success"></i>
                        </div>
                      </label>
                    </div>

                    {/* Chuyển khoản */}
                    <div className="form-check p-3 border rounded" style={{ cursor: 'pointer' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="bank"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label w-100" htmlFor="bank" style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <strong>Chuyển khoản ngân hàng</strong>
                            <p className="text-muted small mb-0 mt-1">Chuyển khoản qua tài khoản ngân hàng</p>
                          </div>
                          <i className="bi bi-bank fs-3 text-primary"></i>
                        </div>
                      </label>
                    </div>

                    {/* MoMo */}
                    <div className="form-check p-3 border rounded" style={{ cursor: 'pointer' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="momo"
                        value="momo"
                        checked={formData.paymentMethod === 'momo'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label w-100" htmlFor="momo" style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <strong>Ví điện tử MoMo</strong>
                            <p className="text-muted small mb-0 mt-1">Thanh toán qua ví MoMo</p>
                          </div>
                          <i className="bi bi-wallet2 fs-3 text-danger"></i>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Tóm tắt đơn hàng - Bên phải */}
          <div className="col-lg-5">
            <div className="card shadow-sm sticky-top" style={{ top: '100px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <i className="bi bi-cart-check me-2 text-warning"></i>
                  Đơn hàng của bạn
                </h5>

                {/* Danh sách sản phẩm */}
                <div className="mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                      <div className="position-relative" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <span 
                          className="position-absolute top-0 end-0 badge bg-warning text-dark"
                          style={{ transform: 'translate(30%, -30%)' }}
                        >
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>{item.name}</h6>
                        <p className="text-danger fw-bold mb-0">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tóm tắt giá */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tạm tính:</span>
                    <span className="fw-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Phí vận chuyển:</span>
                    <span className="fw-semibold">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-3 border-top">
                    <span className="fw-bold fs-5">Tổng cộng:</span>
                    <span className="fw-bold fs-5 text-danger">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Nút đặt hàng */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-warning text-white w-100 py-3 mt-4 fw-bold"
                  style={{ fontSize: '1.1rem' }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  ĐẶT HÀNG NGAY
                </button>

                {/* Chính sách */}
                <div className="mt-4 p-3 bg-light rounded">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-shield-check text-success mt-1"></i>
                    <small className="text-muted">Đảm bảo hoàn tiền 100% nếu sản phẩm lỗi</small>
                  </div>
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-truck text-primary mt-1"></i>
                    <small className="text-muted">Giao hàng nhanh chóng trong 2-5 ngày</small>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-headset text-warning mt-1"></i>
                    <small className="text-muted">Hỗ trợ 24/7 qua hotline</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

