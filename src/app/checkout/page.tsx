'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          if (items.length === 0) {
            router.push('/cart');
            return;
          }
          setCartItems(items);
        } else {
          router.push('/cart');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate API call
    setTimeout(() => {
      alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      router.push('/');
    }, 2000);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 5000000 ? 0 : 100000;
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Link href="/cart" className="btn btn-outline-dark me-3" style={{ borderRadius: '12px' }}>
            <i className="bi bi-arrow-left"></i>
          </Link>
          <h1 className="fw-bold mb-0">Thanh toán</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Form Section */}
            <div className="col-lg-7">
              {/* Thông tin giao hàng */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-truck text-warning me-2"></i>
                    Thông tin giao hàng
                  </h5>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="0123456789"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Địa chỉ <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Số nhà, tên đường"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Thành phố <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder="Hà Nội"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Quận/Huyện</label>
                      <input
                        type="text"
                        name="district"
                        className="form-control"
                        placeholder="Quận/Huyện"
                        value={formData.district}
                        onChange={handleChange}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Phường/Xã</label>
                      <input
                        type="text"
                        name="ward"
                        className="form-control"
                        placeholder="Phường/Xã"
                        value={formData.ward}
                        onChange={handleChange}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Ghi chú (tùy chọn)</label>
                      <textarea
                        name="note"
                        className="form-control"
                        placeholder="Ghi chú về đơn hàng, ví dụ: Giao hàng giờ hành chính"
                        value={formData.note}
                        onChange={handleChange}
                        rows={3}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-credit-card text-warning me-2"></i>
                    Phương thức thanh toán
                  </h5>

                  <div className="form-check mb-3 p-3 border rounded-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label w-100" htmlFor="cod">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-cash-coin text-success me-2" style={{ fontSize: '24px' }}></i>
                        <div>
                          <div className="fw-semibold">Thanh toán khi nhận hàng (COD)</div>
                          <small className="text-muted">Thanh toán bằng tiền mặt khi nhận hàng</small>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="form-check p-3 border rounded-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="banking"
                      value="banking"
                      checked={formData.paymentMethod === 'banking'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label w-100" htmlFor="banking">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-bank text-primary me-2" style={{ fontSize: '24px' }}></i>
                        <div>
                          <div className="fw-semibold">Chuyển khoản ngân hàng</div>
                          <small className="text-muted">Chuyển khoản trước, giao hàng sau</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Đơn hàng của bạn</h5>

                  {/* Products */}
                  <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {cartItems.map((item) => (
                      <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <div
                          className="position-relative rounded-3 overflow-hidden me-3"
                          style={{
                            width: '60px',
                            height: '60px',
                            flexShrink: 0,
                            backgroundColor: '#f8f9fa',
                          }}
                        >
                          <Image
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold mb-1" style={{ fontSize: '14px' }}>
                            {item.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: '13px' }}>
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                        <div className="fw-bold text-warning">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-top pt-3 mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Tạm tính:</span>
                      <span className="fw-semibold">{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Phí vận chuyển:</span>
                      <span className="fw-semibold">
                        {shippingFee === 0 ? (
                          <span className="text-success">Miễn phí</span>
                        ) : (
                          `${shippingFee.toLocaleString('vi-VN')}₫`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="border-top pt-3 mb-4">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold" style={{ fontSize: '18px' }}>
                        Tổng cộng:
                      </span>
                      <span className="fw-bold text-warning" style={{ fontSize: '24px' }}>
                        {total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning text-white w-100 py-3"
                    disabled={processing}
                    style={{
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
                    }}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        Đặt hàng
                        <i className="bi bi-check-circle ms-2"></i>
                      </>
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Bằng việc đặt hàng, bạn đồng ý với{' '}
                      <a href="#" className="text-warning text-decoration-none">
                        Điều khoản sử dụng
                      </a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}











