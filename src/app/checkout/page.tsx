'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { validateEmail, validatePhone, validateRequired, ValidationMessages } from '../utils/validation';
import { API_BASE_URL } from '@/lib/api-config';
// CHANGED: Đã xóa import Stripe components vì chuyển sang trang riêng /checkout/stripe

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
  
  // CHANGED: Đã xóa Stripe form states vì chuyển sang trang riêng /checkout/stripe
  
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
  const [savedAddresses, setSavedAddresses] = useState<Array<{
    id: string;
    hoten?: string;
    sdt?: string;
    diachichitiet?: string;
    tinh_thanh?: string;
    quan_huyen?: string;
    phuong_xa?: string;
    macdinh?: number;
  }>>([]);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check authentication and load cart
  useEffect(() => {
    // Load cart và thông tin user từ API backend
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          router.push('/cart');
          return;
        }

        // Load cart
        const cartResponse = await fetch(`${API_BASE_URL}/api/giohang`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!cartResponse.ok) {
          if (cartResponse.status === 401) {
            localStorage.removeItem('token');
            setLoading(false);
            router.push('/cart');
            return;
          }
          throw new Error('Failed to load cart');
        }

        const cartData = await cartResponse.json();
        console.log('Cart data from checkout:', cartData);
        
        const items = cartData.san_pham || [];
        
        // Nếu giỏ hàng trống, redirect về trang cart
        if (items.length === 0) {
          router.push('/cart');
          return;
        }
        
        setCartItems(items);
        setTotalAmount(cartData.tong_tien || 0);

        // Load thông tin user và địa chỉ
        try {
          // Load profile
          const profileResponse = await fetch(`${API_BASE_URL}/api/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('Profile data:', profileData);
            
            // API trả về trong object user
            const userInfo = profileData.user || profileData;
            
            // Điền thông tin user vào form
            setFormData(prev => ({
              ...prev,
              fullName: userInfo.ho_ten || prev.fullName,
              email: userInfo.email || prev.email,
              phone: userInfo.sdt || prev.phone,
            }));
          }

          // Load địa chỉ mặc định
          const addressesResponse = await fetch(`${API_BASE_URL}/api/diachi`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (addressesResponse.ok) {
            const addressesData = await addressesResponse.json();
            console.log('Addresses data:', addressesData);
            
            if (Array.isArray(addressesData) && addressesData.length > 0) {
              setSavedAddresses(addressesData);
              
              // Tìm địa chỉ mặc định hoặc lấy địa chỉ đầu tiên
              const defaultAddress = addressesData.find((addr: { macdinh?: number }) => addr.macdinh === 1) || addressesData[0];

              if (defaultAddress) {
                setFormData(prev => ({
                  ...prev,
                  fullName: defaultAddress.hoten || prev.fullName,
                  phone: defaultAddress.sdt || prev.phone,
                  address: defaultAddress.diachichitiet || prev.address,
                  city: defaultAddress.tinh_thanh || prev.city,
                  district: defaultAddress.quan_huyen || prev.district,
                  ward: defaultAddress.phuong_xa || prev.ward,
                }));
              }
            }
          }
        } catch (error) {
          console.error('Error loading user info:', error);
          // Không block checkout nếu không load được thông tin user
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate fullName
    if (!validateRequired(formData.fullName)) {
      newErrors.fullName = ValidationMessages.required('họ và tên');
    }

    // Validate email
    if (!validateRequired(formData.email)) {
      newErrors.email = ValidationMessages.required('email');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = ValidationMessages.email;
    }

    // Validate phone
    if (!validateRequired(formData.phone)) {
      newErrors.phone = ValidationMessages.required('số điện thoại');
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = ValidationMessages.phone;
    }

    // Validate address
    if (!validateRequired(formData.address)) {
      newErrors.address = ValidationMessages.required('địa chỉ');
    }

    // Validate city
    if (!validateRequired(formData.city)) {
      newErrors.city = ValidationMessages.required('thành phố');
    }

    // District và ward là optional nhưng nếu có thì phải validate
    // (có thể bỏ qua nếu không bắt buộc)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }
    
    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập lại!');
        router.push('/auth');
        return;
      }

      // Tạo đơn hàng
      // CHANGED: Gửi đầy đủ thông tin địa chỉ để backend có thể lưu vào đơn hàng
      const orderData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        ghichu: formData.note,
        tinh_thanh: formData.city,
        magiamgia_code: appliedDiscount?.code || null,
        phuongthucthanhtoan: formData.paymentMethod, // CHANGED: Gửi phương thức thanh toán (cod, stripe, banking)
      };

      // CHANGED: Đã xóa emoji/sticker khỏi console logs
      console.log('Sending order data:', orderData);
      
      const response = await fetch(`${API_BASE_URL}/api/donhang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Không thể tạo đơn hàng');
      }

      const data = await response.json();
      console.log('Order created:', data);
      const orderId = data.donhang.id;

      // Xử lý theo phương thức thanh toán
      if (formData.paymentMethod === 'stripe') {
        // CHANGED: Đã xóa emoji/sticker khỏi console logs
        // Tạo payment intent với Stripe
        console.log('Creating Stripe payment intent for order:', orderId);
        
        const paymentResponse = await fetch(`${API_BASE_URL}/api/thanhtoan/stripe/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ donhang_id: orderId }),
        });

        console.log('Payment response status:', paymentResponse.status);

        if (!paymentResponse.ok) {
          let errorData;
          try {
            errorData = await paymentResponse.json();
          } catch {
            const text = await paymentResponse.text();
            console.error('Failed to parse error response:', text);
            throw new Error(`Lỗi từ server (${paymentResponse.status}): ${paymentResponse.statusText}`);
          }
          
          console.error('Payment Intent Error:', {
            status: paymentResponse.status,
            statusText: paymentResponse.statusText,
            error: errorData
          });
          
          // Tạo thông báo lỗi chi tiết hơn
          let errorMessage = 'Không thể tạo payment intent';
          
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.type) {
            errorMessage = `Lỗi Stripe (${errorData.type}): ${errorData.error || errorData.message || 'Không xác định'}`;
          }
          
          // Thêm thông tin debug nếu có
          if (errorData.code) {
            errorMessage += ` (Code: ${errorData.code})`;
          }
          
          throw new Error(errorMessage);
        }

        // CHANGED: Đã xóa emoji/sticker khỏi console logs
        // CHANGED: Redirect sang trang riêng để điền thông tin thẻ thay vì hiển thị inline
        const paymentData = await paymentResponse.json();
        console.log('Payment Intent created:', paymentData);
        
        // CHANGED: Redirect sang trang Stripe checkout thay vì hiển thị form inline
        setProcessing(false);
        router.push(`/checkout/stripe?orderId=${orderId}`);
      } else if (formData.paymentMethod === 'cod') {
        // Thanh toán COD - Trạng thái thanh toán sẽ là "pending" cho đến khi đơn hàng được giao
        // Giỏ hàng sẽ được xóa tự động khi admin cập nhật đơn hàng sang "delivered" (trạng thái thanh toán tự động chuyển thành "paid")
        alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/orders');
      } else if (formData.paymentMethod === 'banking') {
        // CHANGED: Redirect sang trang banking payment thay vì alert
        console.log('=== BANKING PAYMENT SELECTED ===');
        console.log('Payment method:', formData.paymentMethod);
        console.log('Order ID:', orderId);
        console.log('Redirecting to banking checkout page...');
        
        // CHANGED: Set processing false trước khi redirect
        setProcessing(false);
        
        // CHANGED: Redirect sang trang banking
        router.push(`/checkout/banking?orderId=${orderId}`);
        return; // CHANGED: Return ngay để tránh xử lý tiếp và không chạy code phía dưới
      } else {
        // CHANGED: Xử lý các phương thức thanh toán khác (nếu có)
        console.warn('Unknown payment method:', formData.paymentMethod);
        setProcessing(false);
        alert('Phương thức thanh toán không hợp lệ');
        return;
      }
    } catch (error) {
      // CHANGED: Đã xóa emoji/sticker khỏi console logs
      console.error('Error creating order:', error);
      
      // CHANGED: Xử lý error message chi tiết hơn với try-catch để tránh lỗi
      let errorMessage = 'Có lỗi xảy ra';
      try {
        if (error instanceof Error) {
          errorMessage = error.message || 'Có lỗi xảy ra';
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && typeof error === 'object') {
          // CHANGED: Kiểm tra các thuộc tính có thể có của error object
          if ('message' in error && error.message) {
            errorMessage = String(error.message);
          } else if ('error' in error && error.error) {
            errorMessage = String(error.error);
          } else if ('msg' in error && error.msg) {
            errorMessage = String(error.msg);
          }
        }
      } catch (parseError) {
        // CHANGED: Nếu không parse được error, dùng message mặc định
        console.error('Error parsing error message:', parseError);
        errorMessage = 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
      }
      
      // CHANGED: Log error details an toàn hơn
      try {
        console.error('Full error details:', {
          message: errorMessage,
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 3)
          } : error
        });
      } catch (logError) {
        console.error('Error logging error details:', logError);
      }
      
      // CHANGED: Hiển thị alert với thông báo lỗi chi tiết
      try {
        alert(
          `Lỗi: ${errorMessage}\n\n` +
          `Vui lòng kiểm tra:\n` +
          `- Đã đăng nhập chưa?\n` +
          `- Giỏ hàng có sản phẩm không?\n` +
          `- Server có chạy không?\n` +
          `- Thông tin địa chỉ đã điền đầy đủ chưa?\n\n` +
          `Chi tiết: ${errorMessage}`
        );
      } catch (alertError) {
        console.error('Error showing alert:', alertError);
      }
      
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
      const response = await fetch(`${API_BASE_URL}/api/magiamgia/apply`, {
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
  // Đồng bộ với backend: 30,000 VND mặc định, miễn phí nếu đơn hàng >= 5 triệu hoặc TPHCM
  // Lưu ý: Backend sẽ tính lại phí vận chuyển dựa trên tỉnh thành, nhưng hiển thị tạm thời 30,000 VND
  const shippingFee = subtotal > 5000000 ? 0 : 30000;
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
        paddingTop: '120px', // Thêm padding-top để tránh bị đè với header
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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

        <form onSubmit={handleSubmit} noValidate>
          {/* Thông báo lỗi tổng hợp */}
          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert" style={{ borderRadius: '12px' }}>
              <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: '1.2rem' }}></i>
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

          <div className="row g-4">
            {/* Form Section */}
            <div className="col-lg-7">
              {/* Thông tin giao hàng */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-truck me-2" style={{ color: '#FF8E53' }}></i>
                      Thông tin giao hàng
                    </h5>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setShowAddressSelector(!showAddressSelector)}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-bookmark me-2"></i>
                        Chọn từ địa chỉ đã lưu
                      </button>
                    )}
                  </div>

                  {/* Danh sách địa chỉ đã lưu */}
                  {showAddressSelector && savedAddresses.length > 0 && (
                    <div className="mb-4 p-3 border rounded-3" style={{ background: '#f8f9fa' }}>
                      <h6 className="fw-semibold mb-3">Địa chỉ đã lưu:</h6>
                      <div className="row g-2">
                        {savedAddresses.map((addr) => (
                          <div key={addr.id} className="col-12">
                            <button
                              type="button"
                              className="btn btn-outline-secondary w-100 text-start"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  fullName: addr.hoten || prev.fullName,
                                  phone: addr.sdt || prev.phone,
                                  address: addr.diachichitiet || prev.address,
                                  city: addr.tinh_thanh || prev.city,
                                  district: addr.quan_huyen || prev.district,
                                  ward: addr.phuong_xa || prev.ward,
                                }));
                                setShowAddressSelector(false);
                              }}
                              style={{ borderRadius: '8px', padding: '12px' }}
                            >
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="fw-semibold">{addr.hoten || 'N/A'}</div>
                                  <small className="text-muted d-block">
                                    {addr.diachichitiet}, {addr.phuong_xa}, {addr.quan_huyen}, {addr.tinh_thanh}
                                  </small>
                                  {addr.sdt && (
                                    <small className="text-muted d-block mt-1">
                                      <i className="bi bi-telephone me-1"></i>
                                      {addr.sdt}
                                    </small>
                                  )}
                                </div>
                                {addr.macdinh === 1 && (
                                  <span className="badge bg-success">Mặc định</span>
                                )}
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <Link
                          href="/addresses"
                          className="btn btn-sm btn-link text-primary"
                          style={{ textDecoration: 'none' }}
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Thêm địa chỉ mới
                        </Link>
                      </div>
                    </div>
                  )}

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
                          border: errors.fullName ? '2px solid #dc3545' : '2px solid #e9ecef',
                        }}
                      />
                      {errors.fullName && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                          {errors.fullName}
                        </small>
                      )}
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
                          border: errors.email ? '2px solid #dc3545' : '2px solid #e9ecef',
                        }}
                      />
                      {errors.email && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                          {errors.email}
                        </small>
                      )}
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
                          border: errors.phone ? '2px solid #dc3545' : '2px solid #e9ecef',
                        }}
                      />
                      {errors.phone && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                          {errors.phone}
                        </small>
                      )}
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
                          border: errors.address ? '2px solid #dc3545' : '2px solid #e9ecef',
                        }}
                      />
                      {errors.address && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                          {errors.address}
                        </small>
                      )}
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
                          border: errors.city ? '2px solid #dc3545' : '2px solid #e9ecef',
                        }}
                      />
                      {errors.city && (
                        <small className="text-danger d-block mt-1" style={{ fontSize: '13px' }}>
                          {errors.city}
                        </small>
                      )}
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

                  <div className="form-check mb-3 p-3 border rounded-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="stripe"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleChange}
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
              <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '120px', zIndex: 10 }}>
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

                  {/* CHANGED: Đã xóa Stripe form inline vì chuyển sang trang riêng /checkout/stripe */}
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
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <style jsx global>{`
        @media (max-width: 992px) {
          .row.g-4 .col-lg-7,
          .row.g-4 .col-lg-5 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0;
          }
          
          /* Đảm bảo sticky card không bị đè với header trên mobile */
          .sticky-top {
            position: relative !important;
            top: auto !important;
          }
          
          .d-flex.align-items-center.mb-4 {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          
          .d-flex.align-items-center.mb-4 h1 {
            font-size: 1.5rem !important;
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
          
          .btn-lg {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            width: 100%;
          }
          
          .form-control,
          .form-select {
            font-size: 16px; /* Prevent zoom on iOS */
          }
          
          .table {
            font-size: 0.85rem;
          }
          
          .table td,
          .table th {
            padding: 0.5rem;
          }
          
          .d-flex.justify-content-between {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .d-flex.gap-3 {
            flex-direction: column;
            gap: 0.75rem !important;
          }
          
          .d-flex.gap-3 .btn {
            width: 100%;
            margin: 0 !important;
          }
        }
        
        @media (max-width: 576px) {
          .py-5 {
            padding-top: 100px !important; /* Đảm bảo có đủ không gian cho header trên mobile */
            padding-bottom: 1rem !important;
          }
          
          .card-body {
            padding: 0.75rem !important;
          }
          
          h5 {
            font-size: 1.1rem !important;
          }
          
          .table {
            font-size: 0.75rem;
          }
          
          .table img {
            width: 50px !important;
            height: 50px !important;
          }
        }
      `}</style>
    </div>
  );
}














