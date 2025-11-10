'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../component/StripePaymentForm';

// Khởi tạo Stripe từ publishable key (cần có NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) {
  console.warn(
    '⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY chưa được cấu hình. Stripe form sẽ không hiển thị.'
  );
}
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface CartItem {
  id: string;
  user_id: string;
  bienthe_id: string;
  soluong: number;
  bienthe?: {
    id: string;
    gia: number;
    mausac?: string;
    kichthuoc?: string;
    sanpham?: {
      tensp: string;
      thumbnail: string;
    };
    images?: Array<{
      url: string;
    }>;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Discount code states
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    giam: number;
    loai: string;
    giatrigiam: number;
  } | null>(null);
  const [applyingCode, setApplyingCode] = useState(false);
  const [discountError, setDiscountError] = useState('');
  
  // Stripe payment states
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  
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

  // Check authentication and load cart
  useEffect(() => {
    // Load cart từ API backend
    const loadCartFromAPI = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          router.push('/cart');
          return;
        }

        const response = await fetch('http://localhost:5000/api/giohang', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            setLoading(false);
            router.push('/cart');
            return;
          }
          throw new Error('Failed to load cart');
        }

        const data = await response.json();
        console.log('📦 Cart data from checkout:', data);
        
        const items = data.san_pham || [];
        
        // Nếu giỏ hàng trống, redirect về trang cart
          if (items.length === 0) {
            router.push('/cart');
            return;
          }
        
          setCartItems(items);
        setTotalAmount(data.tong_tien || 0);
      } catch (error) {
        console.error('❌ Error loading cart:', error);
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    loadCartFromAPI();
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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập lại!');
        router.push('/auth');
        return;
      }

      // Tạo đơn hàng
      const orderData = {
        ghichu: formData.note,
        tinh_thanh: formData.city,
        magiamgia_code: appliedDiscount?.code || null,
      };

      console.log('📤 Sending order data:', orderData);
      
      const response = await fetch('http://localhost:5000/api/donhang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.message || 'Không thể tạo đơn hàng');
      }

      const data = await response.json();
      console.log('✅ Order created:', data);
      const orderId = data.donhang.id;

      // Xử lý theo phương thức thanh toán
      if (formData.paymentMethod === 'stripe') {
        // Tạo payment intent với Stripe
        console.log('🔄 Creating Stripe payment intent for order:', orderId);
        
        const paymentResponse = await fetch('http://localhost:5000/api/thanhtoan/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ donhang_id: orderId }),
        });

        console.log('📥 Payment response status:', paymentResponse.status);

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          console.error('❌ Payment Intent Error:', errorData);
          throw new Error(errorData.message || errorData.error || 'Không thể tạo payment intent');
        }

        const paymentData = await paymentResponse.json();
        console.log('✅ Payment Intent created:', paymentData);
        setClientSecret(paymentData.clientSecret);
        setShowStripeForm(true);
        setProcessing(false);
      } else if (formData.paymentMethod === 'cod') {
        // Thanh toán COD
        await fetch('http://localhost:5000/api/thanhtoan/cod', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ donhang_id: orderId }),
        });

      alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      window.dispatchEvent(new Event('cartUpdated'));
        router.push('/orders');
      } else {
        // Banking
        alert('Tính năng chuyển khoản đang được phát triển!');
        setProcessing(false);
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      alert(`Lỗi: ${errorMessage}\n\nVui lòng kiểm tra:\n- Đã đăng nhập chưa?\n- Giỏ hàng có sản phẩm không?\n- Server có chạy không?`);
      setProcessing(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá!');
      return;
    }

    setApplyingCode(true);
    setDiscountError('');

    try {
      const response = await fetch('http://localhost:5000/api/magiamgia/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode.trim().toUpperCase(),
          tongtien: totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDiscountError(data.message || 'Mã giảm giá không hợp lệ!');
        setAppliedDiscount(null);
        return;
      }

      setAppliedDiscount({
        code: data.code,
        giam: data.giam,
        loai: data.loai,
        giatrigiam: data.giatrigiam,
      });
      setDiscountError('');
    } catch (error) {
      console.error('Error applying discount:', error);
      setDiscountError('Có lỗi xảy ra khi áp dụng mã giảm giá!');
      setAppliedDiscount(null);
    } finally {
      setApplyingCode(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  const subtotal = totalAmount;
  const shippingFee = subtotal > 5000000 ? 0 : 100000;
  const discount = appliedDiscount?.giam || 0;
  const total = subtotal + shippingFee - discount;

  if (loading) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',
        }}
      >
        <div className="text-center">
          <div 
            className="spinner-border mb-3" 
            role="status"
            style={{ 
              color: '#FF8E53',
              width: '3rem',
              height: '3rem'
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div style={{ color: '#FF8E53', fontWeight: '500' }}>
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 py-5"
      style={{
        background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Link 
            href="/cart" 
            className="btn me-3" 
            style={{ 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF8E53, #FFA726)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(255, 142, 83, 0.3)',
              padding: '10px 16px',
            }}
          >
            <i className="bi bi-arrow-left"></i>
          </Link>
          <h1 
            className="fw-bold mb-0"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Thanh toán
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Form Section */}
            <div className="col-lg-7">
              {/* Thông tin giao hàng */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-truck me-2" style={{ color: '#FF8E53' }}></i>
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
                    <i className="bi bi-credit-card me-2" style={{ color: '#FF8E53' }}></i>
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

                  <div className="form-check mb-3 p-3 border rounded-3" style={{ background: showStripeForm ? '#f0f8ff' : 'transparent' }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="stripe"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleChange}
                      disabled={showStripeForm}
                    />
                    <label className="form-check-label w-100" htmlFor="stripe">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-credit-card text-info me-2" style={{ fontSize: '24px' }}></i>
                        <div>
                          <div className="fw-semibold">
                            Thanh toán trực tuyến (Stripe)
                            <span className="badge bg-success ms-2" style={{ fontSize: '10px' }}>Khuyên dùng</span>
                          </div>
                          <small className="text-muted">Thanh toán an toàn bằng thẻ quốc tế</small>
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
                    {cartItems.map((item) => {
                      const productName = item.bienthe?.sanpham?.tensp || 'Sản phẩm';
                      const productImage = item.bienthe?.sanpham?.thumbnail || item.bienthe?.images?.[0]?.url || '/placeholder.jpg';
                      const productPrice = Number(item.bienthe?.gia || 0);
                      const quantity = item.soluong;
                      const color = item.bienthe?.mausac;
                      const size = item.bienthe?.kichthuoc;
                      
                      return (
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
                              src={productImage}
                              alt={productName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold mb-1" style={{ fontSize: '14px' }}>
                              {productName}
                            </div>
                            {(color || size) && (
                              <div className="text-muted mb-1" style={{ fontSize: '12px' }}>
                                {color && <span>{color}</span>}
                                {color && size && <span> • </span>}
                                {size && <span>{size}</span>}
                          </div>
                            )}
                          <div className="text-muted" style={{ fontSize: '13px' }}>
                              Số lượng: {quantity}
                          </div>
                        </div>
                        <div 
                          className="fw-bold"
                          style={{ color: '#FF8E53' }}
                        >
                            {(productPrice * quantity).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                      );
                    })}
                  </div>

                  {/* Discount Code */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">
                      <i className="bi bi-ticket-perforated me-2" style={{ color: '#FF6B6B' }}></i>
                      Mã giảm giá
                    </label>
                    {!appliedDiscount ? (
                      <div>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập mã giảm giá"
                            value={discountCode}
                            onChange={(e) => {
                              setDiscountCode(e.target.value.toUpperCase());
                              setDiscountError('');
                            }}
                            disabled={applyingCode}
                            style={{
                              padding: '12px 16px',
                              borderRadius: '12px 0 0 12px',
                              border: `2px solid ${discountError ? '#FF6B6B' : '#e9ecef'}`,
                              borderRight: 'none',
                            }}
                          />
                          <button
                            type="button"
                            className="btn"
                            onClick={handleApplyDiscount}
                            disabled={applyingCode || !discountCode.trim()}
                            style={{
                              background: 'linear-gradient(135deg, #FF8E53 0%, #FFA726 100%)',
                              color: '#fff',
                              fontWeight: '600',
                              padding: '12px 24px',
                              borderRadius: '0 12px 12px 0',
                              border: 'none',
                            }}
                          >
                            {applyingCode ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              'Áp dụng'
                            )}
                          </button>
                        </div>
                        {discountError && (
                          <div className="text-danger mt-2" style={{ fontSize: '13px' }}>
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {discountError}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                        style={{
                          background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                          border: '2px solid #28a745',
                        }}
                      >
                        <div>
                          <div className="fw-bold text-success">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            {appliedDiscount.code}
                          </div>
                          <small className="text-success">
                            Giảm {appliedDiscount.giam.toLocaleString('vi-VN')}₫
                          </small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          onClick={handleRemoveDiscount}
                          style={{ borderRadius: '8px' }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="border-top pt-3 mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Tạm tính:</span>
                      <span className="fw-semibold">{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Phí vận chuyển:</span>
                      <span className="fw-semibold">
                        {shippingFee === 0 ? (
                          <span className="text-success">Miễn phí</span>
                        ) : (
                          `${shippingFee.toLocaleString('vi-VN')}₫`
                        )}
                      </span>
                    </div>
                    {appliedDiscount && (
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-success">
                          <i className="bi bi-tag-fill me-1"></i>
                          Giảm giá:
                        </span>
                        <span className="fw-semibold text-success">
                          -{discount.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-top pt-3 mb-4">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold" style={{ fontSize: '18px' }}>
                        Tổng cộng:
                      </span>
                      <span 
                        className="fw-bold" 
                        style={{ 
                          fontSize: '24px',
                          background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        {total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  {/* Hiển thị Stripe payment form hoặc button đặt hàng */}
                  {showStripeForm && clientSecret ? (
                    <div className="mt-4">
                      <div className="alert alert-info" role="alert">
                        <i className="bi bi-info-circle me-2"></i>
                        Vui lòng điền thông tin thẻ để hoàn tất thanh toán
                      </div>
                      {stripePromise ? (
                        <Elements
                          stripe={stripePromise}
                          options={{
                            clientSecret,
                            appearance: {
                              theme: 'stripe',
                              variables: {
                                colorPrimary: '#FF6B6B',
                              },
                            },
                          }}
                          key={clientSecret}
                        >
                          <StripePaymentForm
                            onSuccess={() => {
                              alert('Thanh toán thành công!');
                              window.dispatchEvent(new Event('cartUpdated'));
                              router.push('/checkout/success');
                            }}
                            onError={(error) => {
                              console.error('Payment error:', error);
                              setShowStripeForm(false);
                              setProcessing(false);
                            }}
                          />
                        </Elements>
                      ) : (
                        <div className="alert alert-danger mt-3" role="alert">
                          <i className="bi bi-exclamation-circle me-2"></i>
                          Chưa cấu hình Stripe publishable key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY). Vui lòng kiểm tra file
                          <code className="ms-1">.env.local</code> và khởi động lại frontend.
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                  <button
                    type="submit"
                    className="btn text-white w-100 py-3"
                    disabled={processing}
                    style={{
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!processing) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                    }}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                            {formData.paymentMethod === 'stripe' ? 'Tiếp tục thanh toán' : 'Đặt hàng'}
                        <i className="bi bi-check-circle ms-2"></i>
                      </>
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Bằng việc đặt hàng, bạn đồng ý với{' '}
                      <a href="#" style={{ color: '#FF8E53', textDecoration: 'none' }}>
                        Điều khoản sử dụng
                      </a>
                    </small>
                  </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}














