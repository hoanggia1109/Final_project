'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import Image from 'next/image';

import { useParams, useRouter } from 'next/navigation';

import Toast from '@/app/component/Toast';



interface OrderItem {

  id: string;

  soluong: number;

  gia: number;

  bienthe: {

    id: string;

    mausac?: string;

    kichthuoc?: string;

    chatlieu?: string;

    sanpham: {

      id: string;

      tensp: string;

      thumbnail?: string;

    };

  };

}



interface Order {

  id: string;

  code: string;

  created_at: string;

  trangthai: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled' | 'returned';

  trangthaithanhtoan: string;

  phuongthucthanhtoan?: string;

  tongtien: number;

  tongtien_sau_giam: number;

  giamgia: number;

  phi_van_chuyen: number;

  ghichu?: string;

  ly_do_huy?: string; // Lý do hủy đơn hàng

  magiamgia_code?: string;

  chitiet: OrderItem[];

  diachi?: {

    hoten: string;

    sdt: string;

    diachichitiet: string;

    phuong_xa: string;

    quan_huyen: string;

    tinh_thanh: string;

  };

}



export default function OrderDetailPage() {

  const params = useParams();

  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const [copySuccess, setCopySuccess] = useState(false); // CHANGED: State để hiển thị thông báo copy mã đơn hàng

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [cancelReason, setCancelReason] = useState('');

  const [cancelling, setCancelling] = useState(false);

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);



  useEffect(() => {

    loadOrderDetail();

  }, [params?.id]);



  const loadOrderDetail = async () => {

    try {

      const token = localStorage.getItem('token');

      if (!token) {

        router.push('/login');

        return;

      }



      const response = await fetch(`/api/orders/${params?.id}`, {

        headers: {

          'Authorization': `Bearer ${token}`

        }

      });



      if (response.ok) {

        const data = await response.json();
        
        console.log('[Order Detail] Loaded order data:', data);

        setOrder(data);

      } else {

        setToastMessage('Không tìm thấy đơn hàng');

        setToastType('error');

        setShowToast(true);

      }

    } catch (error) {

      console.error('Error loading order:', error);

      setToastMessage('Có lỗi xảy ra');

      setToastType('error');

      setShowToast(true);

    } finally {

      setLoading(false);

    }

  };



  const handleCancelOrder = () => {

    setCancelReason('');

    setShowCancelModal(true);

  };



  const confirmCancelOrder = async () => {

    if (!cancelReason.trim()) {

      alert('Vui lòng nhập lý do hủy đơn hàng');

      return;

    }



    setCancelling(true);

    try {

      const token = localStorage.getItem('token');

      const response = await fetch(`/api/orders/${order?.id}/cancel`, {

        method: 'PUT',

        headers: {

          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json'

        },

        body: JSON.stringify({ ly_do_huy: cancelReason.trim() })

      });



      if (response.ok) {

        setToastMessage('Đã hủy đơn hàng thành công');

        setToastType('success');

        setShowToast(true);

        setShowCancelModal(false);

        setCancelReason('');

        loadOrderDetail();

      } else {

        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));

        setToastMessage(`Không thể hủy đơn hàng: ${errorData.error || 'Lỗi không xác định'}`);

        setToastType('error');

        setShowToast(true);

      }

    } catch (error) {

      console.error('Error cancelling order:', error);

      setToastMessage('Có lỗi xảy ra');

      setToastType('error');

      setShowToast(true);

    } finally {

      setCancelling(false);

    }

  };



  const handleSubmitReview = async () => {

    if (!selectedItemId || !reviewComment.trim()) {

      alert('Vui lòng nhập đánh giá');

      return;

    }



    setSubmittingReview(true);

    try {

      const token = localStorage.getItem('token');

      if (!token) {

        alert('Vui lòng đăng nhập lại');

        router.push('/login');

        return;

      }



      const formData = new FormData();

      formData.append('chitiet_donhang_id', selectedItemId);

      formData.append('rating', String(reviewRating));

      formData.append('binhluan', reviewComment.trim());

      

      // Thêm ảnh nếu có

      reviewImages.forEach((file) => {

        formData.append('images', file);

      });



      const response = await fetch('/api/reviews', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${token}`

        },

        body: formData

      });



      const data = await response.json();



      if (response.ok) {

        setToastMessage('Đánh giá thành công!');

        setToastType('success');

        setShowToast(true);

        setShowReviewModal(false);

        setSelectedItemId(null);

        setReviewRating(5);

        setReviewComment('');

        setReviewImages([]);

        // Reload order để cập nhật

        loadOrderDetail();

      } else {

        setToastMessage(data.error || 'Không thể tạo đánh giá');

        setToastType('error');

        setShowToast(true);

      }

    } catch (error) {

      console.error('Error submitting review:', error);

      setToastMessage('Có lỗi xảy ra');

      setToastType('error');

      setShowToast(true);

    } finally {

      setSubmittingReview(false);

    }

  };



  const statusConfig = {

    pending: { label: 'Chờ xác nhận', color: '#ffc107', icon: 'clock', bgLight: '#fff8e1' },

    confirmed: { label: 'Đã xác nhận', color: '#17a2b8', icon: 'check-circle', bgLight: '#e0f7fa' },

    shipping: { label: 'Đang giao', color: '#007bff', icon: 'truck', bgLight: '#e3f2fd' },

    delivered: { label: 'Đã giao', color: '#28a745', icon: 'check-circle-fill', bgLight: '#e8f5e9' },

    cancelled: { label: 'Đã hủy', color: '#dc3545', icon: 'x-circle', bgLight: '#ffebee' },

    returned: { label: 'Đã trả hàng', color: '#6c757d', icon: 'arrow-counterclockwise', bgLight: '#f5f5f5' }

  };



  if (loading) {

    return (

      <div className="min-vh-100 d-flex align-items-center justify-content-center">

        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>

      </div>

    );

  }



  if (!order) {

    return (

      <div className="min-vh-100 d-flex align-items-center justify-content-center">

        <div className="text-center">

          <i className="bi bi-exclamation-triangle" style={{ fontSize: '4rem', color: '#dc3545' }}></i>

          <h3 className="mt-3">Không tìm thấy đơn hàng</h3>

          <Link href="/orders" className="btn btn-warning mt-3">

            Quay lại danh sách đơn hàng

          </Link>

        </div>

      </div>

    );

  }



  const status = statusConfig[order.trangthai];



  return (

    <>

      {showToast && toastMessage && (

        <Toast

          message={toastMessage}

          type={toastType}

          onClose={() => setShowToast(false)}

        />

      )}



      <div className="bg-light min-vh-100 py-5">

        <div className="container">

          {/* Back Button */}

          <Link 

            href="/orders" 

            className="btn btn-link text-decoration-none mb-4 p-0"

            style={{ color: '#666' }}

          >

            <i className="bi bi-arrow-left me-2"></i>

            Quay lại danh sách đơn hàng

          </Link>



          {/* Order Status Banner */}

          <div 

            className="card border-0 shadow-sm mb-4" 

            style={{ 

              borderRadius: '16px',

              background: `linear-gradient(135deg, ${status.bgLight} 0%, ${status.color}15 100%)`

            }}

          >

            <div className="card-body p-4">

              <div className="row align-items-center">

                <div className="col-md-8">

                  <h4 className="fw-bold mb-2">

                    <i className={`bi bi-${status.icon} me-2`} style={{ color: status.color }}></i>

                    {status.label}

                  </h4>

                  <div className="mb-0">

                    <p className="text-muted mb-2">

                      <span className="d-flex align-items-center gap-2 flex-wrap">

                        <span>Đơn hàng <strong>{order.code}</strong> • Đặt ngày {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>

                        <button

                          className="btn btn-sm btn-outline-secondary"

                          onClick={() => {

                            navigator.clipboard.writeText(order.code);

                            setCopySuccess(true);

                            setTimeout(() => setCopySuccess(false), 2000);

                          }}

                          style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px' }}

                          title="Copy mã đơn hàng"

                        >

                          {copySuccess ? (

                            <i className="bi bi-check-circle text-success"></i>

                          ) : (

                            <i className="bi bi-clipboard"></i>

                          )}

                        </button>

                      </span>

                    </p>

                    {copySuccess && (

                      <small className="text-success d-block mb-2">

                        <i className="bi bi-check-circle me-1"></i>

                        Đã copy mã đơn hàng!

                      </small>

                    )}

                    {/* Hiển thị lý do hủy nếu đơn hàng bị hủy */}

                    {order.trangthai === 'cancelled' && order.ly_do_huy && (

                      <div className="mt-3 p-3 bg-white rounded" style={{ borderRadius: '12px', border: '1px solid #dc3545' }}>

                        <div className="d-flex align-items-start">

                          <i className="bi bi-info-circle text-danger me-2 mt-1"></i>

                          <div>

                            <strong className="text-danger d-block mb-1">Lý do hủy đơn hàng:</strong>

                            <p className="text-muted mb-0" style={{ whiteSpace: 'pre-wrap' }}>{order.ly_do_huy}</p>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

                <div className="col-md-4 text-md-end mt-3 mt-md-0">

                  {order.trangthai === 'pending' && (

                    <button 

                      className="btn btn-outline-danger"

                      style={{ borderRadius: '12px' }}

                      onClick={handleCancelOrder}

                    >

                      <i className="bi bi-x-circle me-2"></i>

                      Hủy đơn hàng

                    </button>

                  )}

                </div>

              </div>

            </div>

          </div>



          <div className="row">

            {/* Order Items */}

            <div className="col-lg-7 mb-4">

              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>

                <div className="card-body p-4">

                  <h5 className="fw-bold mb-4">Sản phẩm đã đặt</h5>

                  

                  {order.chitiet.map((item, index) => (

                    <div key={item.id}>

                      <div className="d-flex align-items-start mb-3">

                        <div

                          className="position-relative rounded-3 overflow-hidden me-3"

                          style={{

                            width: '100px',

                            height: '100px',

                            flexShrink: 0,

                            backgroundColor: '#f8f9fa'

                          }}

                        >

                          {item.bienthe.sanpham.thumbnail && (

                            <Image

                              src={item.bienthe.sanpham.thumbnail}

                              alt={item.bienthe.sanpham.tensp}

                              fill

                              style={{ objectFit: 'cover' }}

                            />

                          )}

                        </div>

                        <div className="flex-grow-1">

                          <h6 className="fw-semibold mb-2">{item.bienthe.sanpham.tensp}</h6>

                          <div className="d-flex flex-wrap gap-2 mb-2">

                            {item.bienthe.mausac && (

                              <span className="badge bg-light text-dark border">

                                Màu: {item.bienthe.mausac}

                              </span>

                            )}

                            {item.bienthe.kichthuoc && (

                              <span className="badge bg-light text-dark border">

                                Size: {item.bienthe.kichthuoc}

                              </span>

                            )}

                            {item.bienthe.chatlieu && (

                              <span className="badge bg-light text-dark border">

                                {item.bienthe.chatlieu}

                              </span>

                            )}

                          </div>

                          <div className="d-flex justify-content-between align-items-center">

                            <span className="text-muted">x {item.soluong}</span>

                            <span className="fw-bold text-warning">

                              {Number(item.gia).toLocaleString('vi-VN')}₫

                            </span>

                          </div>

                          {/* Review Button - chỉ hiển thị khi đơn hàng đã delivered */}
                          {order.trangthai === 'delivered' && (
                            <div className="mt-3">
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => {
                                  setSelectedItemId(item.id);
                                  setReviewRating(5);
                                  setReviewComment('');
                                  setReviewImages([]);
                                  setShowReviewModal(true);
                                }}
                                style={{ borderRadius: '8px' }}
                              >
                                <i className="bi bi-star me-2"></i>
                                Đánh giá sản phẩm
                              </button>
                            </div>
                          )}

                        </div>

                      </div>

                      {index < order.chitiet.length - 1 && <hr />}

                    </div>

                  ))}

                </div>

              </div>

            </div>



            {/* Order Summary & Info */}

            <div className="col-lg-5">

              {/* Payment Summary */}

              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>

                <div className="card-body p-4">

                  <h5 className="fw-bold mb-4">Thông tin thanh toán</h5>

                  

                  <div className="d-flex justify-content-between mb-2">

                    <span className="text-muted">Tổng tiền hàng:</span>

                    <span>{Number(order.tongtien).toLocaleString('vi-VN')}₫</span>

                  </div>



                  {order.giamgia > 0 && (

                    <div className="d-flex justify-content-between mb-2 text-success">

                      <span>

                        Giảm giá

                        {order.magiamgia_code && (

                          <span className="badge bg-success-subtle text-success ms-2">

                            {order.magiamgia_code}

                          </span>

                        )}

                      </span>

                      <span>-{Number(order.giamgia).toLocaleString('vi-VN')}₫</span>

                    </div>

                  )}



                  <div className="d-flex justify-content-between mb-2">

                    <span className="text-muted">Phí vận chuyển:</span>

                    <span>{Number(order.phi_van_chuyen).toLocaleString('vi-VN')}₫</span>

                  </div>



                  {/* CHANGED: Thêm thông tin hình thức thanh toán vào phần thông tin thanh toán */}

                  {order.phuongthucthanhtoan && (

                    <div className="d-flex justify-content-between mb-2">

                      <span className="text-muted">Hình thức thanh toán:</span>

                      <strong>

                        {order.phuongthucthanhtoan === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :

                         order.phuongthucthanhtoan === 'stripe' ? 'Thanh toán bằng thẻ (Stripe)' :

                         order.phuongthucthanhtoan === 'banking' ? 'Chuyển khoản ngân hàng' :

                         order.phuongthucthanhtoan}

                      </strong>

                    </div>

                  )}



                  {/* Thêm trạng thái thanh toán vào phần thông tin thanh toán */}

                  <div className="d-flex justify-content-between mb-2">

                    <span className="text-muted">Trạng thái thanh toán:</span>

                    <span className="badge" style={{ 

                      backgroundColor: order.trangthaithanhtoan === 'paid' ? '#28a74520' : order.trangthaithanhtoan === 'pending' ? '#dc354520' : order.trangthaithanhtoan === 'refunded' ? '#dc354520' : '#6c757d20',

                      color: order.trangthaithanhtoan === 'paid' ? '#28a745' : order.trangthaithanhtoan === 'pending' ? '#dc3545' : order.trangthaithanhtoan === 'refunded' ? '#dc3545' : '#6c757d',

                      padding: '6px 12px',

                      borderRadius: '8px',

                      fontWeight: '600'

                    }}>

                      {/* Đối với COD: chỉ hiển thị "Đã thanh toán" khi trạng thái thanh toán là "paid" VÀ đơn hàng đã được giao */}
                      {order.phuongthucthanhtoan === 'cod' && order.trangthaithanhtoan === 'paid' && order.trangthai === 'delivered' ? 'Đã thanh toán' :
                       order.phuongthucthanhtoan === 'cod' && order.trangthaithanhtoan === 'pending' ? 'Chưa thanh toán' :
                       order.phuongthucthanhtoan === 'cod' && order.trangthaithanhtoan === 'paid' && order.trangthai !== 'delivered' ? 'Chưa thanh toán' :
                       order.trangthaithanhtoan === 'paid' ? 'Đã thanh toán' : 
                       order.trangthaithanhtoan === 'pending' ? 'Chưa thanh toán' : 
                       order.trangthaithanhtoan === 'refunded' ? 'Đã hoàn tiền' : 
                       order.trangthaithanhtoan === 'failed' ? 'Thanh toán thất bại' :
                       order.trangthaithanhtoan === 'cancelled' ? 'Đã hủy thanh toán' :
                       order.trangthaithanhtoan || 'Chưa xác định'}

                    </span>

                  </div>



                  <hr />



                  <div className="d-flex justify-content-between mb-3">

                    <span className="fw-bold">Tổng thanh toán:</span>

                    <span className="fw-bold text-warning fs-5">

                      {Number(order.tongtien_sau_giam).toLocaleString('vi-VN')}₫

                    </span>

                  </div>



                  {/* CHANGED: Chỉ hiển thị button "Tiến hành thanh toán" khi:

                      - Hình thức thanh toán là chuyển khoản (phuongthucthanhtoan === 'banking')

                      - Trạng thái thanh toán là chưa thanh toán (trangthaithanhtoan === 'pending')

                      - Đơn hàng chưa bị hủy (trangthai !== 'cancelled')

                  */}

                  {order.phuongthucthanhtoan === 'banking' && 

                   order.trangthaithanhtoan === 'pending' && 

                   order.trangthai !== 'cancelled' && (

                    <button

                      className="btn btn-warning text-white w-100 py-2 mb-3"

                      style={{ borderRadius: '12px', fontWeight: '600' }}

                      onClick={() => {

                        router.push(`/checkout?orderId=${order.id}`);

                      }}

                    >

                      <i className="bi bi-credit-card me-2"></i>

                      Tiến hành thanh toán

                    </button>

                  )}



                  {/* CHANGED: Di chuyển button "Tiếp tục mua sắm" vào trong box */}

                  <div className="border-top pt-3 mt-3">

                    <Link

                      href="/products"

                      className="btn btn-outline-warning w-100 py-2"

                      style={{

                        borderRadius: '12px',

                        fontWeight: '600',

                        border: '2px solid #FF8E53',

                        color: '#FF8E53',

                        transition: 'all 0.3s ease',

                      }}

                      onMouseEnter={(e) => {

                        e.currentTarget.style.background = 'linear-gradient(135deg, #FF8E53, #FFA726)';

                        e.currentTarget.style.color = '#fff';

                        e.currentTarget.style.borderColor = 'transparent';

                        e.currentTarget.style.transform = 'translateY(-2px)';

                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 142, 83, 0.4)';

                      }}

                      onMouseLeave={(e) => {

                        e.currentTarget.style.background = 'transparent';

                        e.currentTarget.style.color = '#FF8E53';

                        e.currentTarget.style.borderColor = '#FF8E53';

                        e.currentTarget.style.transform = 'translateY(0)';

                        e.currentTarget.style.boxShadow = 'none';

                      }}

                    >

                      <i className="bi bi-cart-plus me-2"></i>

                      Tiếp tục mua sắm

                    </Link>

                  </div>

                </div>

              </div>



              {/* Delivery Address */}

              {order.diachi && (

                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>

                  <div className="card-body p-4">

                    <h5 className="fw-bold mb-4">

                      <i className="bi bi-geo-alt text-warning me-2"></i>

                      Địa chỉ nhận hàng

                    </h5>

                    

                    <div className="mb-2">

                      <strong>{order.diachi.hoten}</strong>

                    </div>

                    <div className="mb-2 text-muted">

                      <i className="bi bi-telephone me-2"></i>

                      {order.diachi.sdt}

                    </div>

                    <div className="text-muted">

                      <i className="bi bi-house me-2"></i>

                      {order.diachi.diachichitiet}, {order.diachi.phuong_xa}, {order.diachi.quan_huyen}, {order.diachi.tinh_thanh}

                    </div>

                  </div>

                </div>

              )}



              {/* Note */}

              {order.ghichu && (

                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>

                  <div className="card-body p-4">

                    <h5 className="fw-bold mb-3">

                      <i className="bi bi-pencil-square text-warning me-2"></i>

                      Ghi chú

                    </h5>

                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>

                      {order.ghichu}

                    </p>

                  </div>

                </div>

              )}



            </div>

          </div>

        </div>

      </div>



      {/* Modal nhập lý do hủy đơn hàng */}

      {showCancelModal && (

        <div 

          className="modal show d-block" 

          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}

          onClick={() => !cancelling && setShowCancelModal(false)}

        >

          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>

            <div className="modal-content" style={{ borderRadius: '16px' }}>

              <div className="modal-header border-0 pb-0">

                <h5 className="modal-title fw-bold">

                  <i className="bi bi-exclamation-triangle text-danger me-2"></i>

                  Xác nhận hủy đơn hàng

                </h5>

                <button 

                  type="button" 

                  className="btn-close" 

                  onClick={() => !cancelling && setShowCancelModal(false)}

                  disabled={cancelling}

                ></button>

              </div>

              <div className="modal-body pt-3">

                <p className="mb-3">Bạn có chắc muốn hủy đơn hàng <strong>{order?.code}</strong>?</p>

                <div className="mb-3">

                  <label htmlFor="cancelReason" className="form-label fw-semibold">

                    Lý do hủy đơn hàng <span className="text-danger">*</span>

                  </label>

                  <textarea

                    id="cancelReason"

                    className="form-control"

                    rows={4}

                    placeholder="Vui lòng nhập lý do hủy đơn hàng (ví dụ: Đổi ý, không còn nhu cầu, ...)"

                    value={cancelReason}

                    onChange={(e) => setCancelReason(e.target.value)}

                    disabled={cancelling}

                    style={{ borderRadius: '12px' }}

                  />

                </div>

              </div>

              <div className="modal-footer border-0 pt-0">

                <button

                  type="button"

                  className="btn btn-secondary"

                  onClick={() => setShowCancelModal(false)}

                  disabled={cancelling}

                  style={{ borderRadius: '12px' }}

                >

                  Hủy

                </button>

                <button

                  type="button"

                  className="btn btn-danger"

                  onClick={confirmCancelOrder}

                  disabled={cancelling || !cancelReason.trim()}

                  style={{ borderRadius: '12px' }}

                >

                  {cancelling ? (

                    <>

                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>

                      Đang xử lý...

                    </>

                  ) : (

                    <>

                      <i className="bi bi-x-circle me-2"></i>

                      Xác nhận hủy đơn

                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}



      {/* Modal đánh giá sản phẩm */}
      {showReviewModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !submittingReview) {
              setShowReviewModal(false);
            }
          }}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  Đánh giá sản phẩm
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !submittingReview && setShowReviewModal(false)}
                  disabled={submittingReview}
                />
              </div>
              <div className="modal-body">
                {/* Rating Stars */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-3">Đánh giá của bạn</label>
                  <div className="d-flex gap-2 align-items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setReviewRating(star)}
                        disabled={submittingReview}
                        style={{ fontSize: '2rem', lineHeight: 1 }}
                      >
                        <i 
                          className={`bi ${star <= reviewRating ? 'bi-star-fill' : 'bi-star'}`}
                          style={{ color: star <= reviewRating ? '#FFC107' : '#ddd' }}
                        />
                      </button>
                    ))}
                    <span className="ms-2 text-muted">({reviewRating}/5)</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">Nhận xét</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    disabled={submittingReview}
                    style={{ borderRadius: '12px', border: '2px solid #e0e0e0' }}
                  />
                </div>

                {/* Images Upload */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">Hình ảnh (tối đa 5 ảnh)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 5) {
                        alert('Chỉ được chọn tối đa 5 ảnh');
                        return;
                      }
                      setReviewImages(files.slice(0, 5));
                    }}
                    disabled={submittingReview}
                    style={{ borderRadius: '12px', border: '2px solid #e0e0e0' }}
                  />
                  {reviewImages.length > 0 && (
                    <div className="mt-3 d-flex gap-2 flex-wrap">
                      {reviewImages.map((file, idx) => (
                        <div key={idx} className="position-relative" style={{ width: '80px', height: '80px' }}>
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                            disabled={submittingReview}
                            style={{ padding: '2px 6px', fontSize: '12px' }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReviewModal(false)}
                  disabled={submittingReview}
                  style={{ borderRadius: '12px' }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewComment.trim()}
                  style={{ borderRadius: '12px' }}
                >
                  {submittingReview ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Gửi đánh giá
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}




    </>

  );

}
