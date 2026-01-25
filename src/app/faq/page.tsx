'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'list-ul' },
    { id: 'product', name: 'Sản phẩm', icon: 'box-seam' },
    { id: 'order', name: 'Đơn hàng', icon: 'cart' },
    { id: 'payment', name: 'Thanh toán', icon: 'credit-card' },
    { id: 'shipping', name: 'Vận chuyển', icon: 'truck' },
    { id: 'warranty', name: 'Bảo hành', icon: 'shield-check' },
    { id: 'return', name: 'Đổi trả', icon: 'arrow-left-right' },
  ];

  const faqs: FAQItem[] = [
    // Sản phẩm
    {
      id: 1,
      category: 'product',
      question: 'Làm thế nào để xem chi tiết sản phẩm?',
      answer: 'Bạn có thể click vào hình ảnh hoặc tên sản phẩm để xem thông tin chi tiết bao gồm mô tả, thông số kỹ thuật, giá cả và đánh giá từ khách hàng.'
    },
    {
      id: 2,
      category: 'product',
      question: 'Sản phẩm có đầy đủ màu sắc và kích thước không?',
      answer: 'Mỗi sản phẩm có nhiều biến thể về màu sắc và kích thước. Bạn có thể chọn các tùy chọn này khi xem chi tiết sản phẩm. Nếu sản phẩm tạm hết hàng, bạn có thể đặt hàng trước.'
    },
    {
      id: 3,
      category: 'product',
      question: 'Làm sao để biết sản phẩm còn hàng?',
      answer: 'Trạng thái tồn kho được hiển thị trên trang chi tiết sản phẩm. Nếu sản phẩm hết hàng, bạn sẽ thấy thông báo "Tạm hết hàng" và có thể đặt hàng trước.'
    },
    {
      id: 4,
      category: 'product',
      question: 'Sản phẩm có đúng như hình ảnh không?',
      answer: 'Chúng tôi cam kết hình ảnh sản phẩm được chụp thực tế và chính xác. Tuy nhiên, màu sắc có thể có sự khác biệt nhỏ do điều kiện ánh sáng và màn hình hiển thị.'
    },
    // Đơn hàng
    {
      id: 5,
      category: 'order',
      question: 'Làm thế nào để đặt hàng?',
      answer: 'Bạn có thể đặt hàng bằng cách: 1) Chọn sản phẩm và thêm vào giỏ hàng, 2) Kiểm tra giỏ hàng và điền thông tin giao hàng, 3) Chọn phương thức thanh toán và hoàn tất đơn hàng.'
    },
    {
      id: 6,
      category: 'order',
      question: 'Tôi có thể hủy đơn hàng sau khi đặt không?',
      answer: 'Bạn có thể hủy đơn hàng trong vòng 24 giờ sau khi đặt hàng (nếu đơn hàng chưa được xử lý). Vui lòng liên hệ hotline hoặc email để được hỗ trợ hủy đơn hàng.'
    },
    {
      id: 7,
      category: 'order',
      question: 'Làm sao để theo dõi đơn hàng?',
      answer: 'Sau khi đặt hàng, bạn sẽ nhận được mã đơn hàng. Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi" trên trang cá nhân hoặc liên hệ hotline với mã đơn hàng.'
    },
    {
      id: 8,
      category: 'order',
      question: 'Tôi có thể chỉnh sửa đơn hàng sau khi đặt không?',
      answer: 'Nếu đơn hàng chưa được xử lý, bạn có thể liên hệ chúng tôi để chỉnh sửa địa chỉ giao hàng hoặc thêm/xóa sản phẩm. Vui lòng gọi hotline hoặc gửi email với mã đơn hàng.'
    },
    // Thanh toán
    {
      id: 9,
      category: 'payment',
      question: 'Các hình thức thanh toán nào được chấp nhận?',
      answer: 'Chúng tôi chấp nhận thanh toán bằng: Tiền mặt khi nhận hàng (COD), Chuyển khoản ngân hàng, Thẻ tín dụng/ghi nợ (Visa, Mastercard), Ví điện tử (MoMo, ZaloPay), và Thanh toán qua Stripe.'
    },
    {
      id: 10,
      category: 'payment',
      question: 'Thanh toán có an toàn không?',
      answer: 'Tất cả các giao dịch thanh toán đều được mã hóa và bảo mật. Chúng tôi sử dụng công nghệ SSL và các cổng thanh toán uy tín để đảm bảo thông tin của bạn được an toàn tuyệt đối.'
    },
    {
      id: 11,
      category: 'payment',
      question: 'Khi nào tôi phải thanh toán?',
      answer: 'Với thanh toán online, bạn thanh toán ngay khi đặt hàng. Với COD, bạn thanh toán khi nhận hàng. Với chuyển khoản, bạn cần thanh toán trong vòng 24 giờ sau khi đặt hàng.'
    },
    {
      id: 12,
      category: 'payment',
      question: 'Tôi có thể đổi phương thức thanh toán sau khi đặt hàng không?',
      answer: 'Nếu đơn hàng chưa được xử lý, bạn có thể liên hệ chúng tôi để đổi phương thức thanh toán. Vui lòng gọi hotline hoặc gửi email với mã đơn hàng.'
    },
    // Vận chuyển
    {
      id: 13,
      category: 'shipping',
      question: 'Phí vận chuyển là bao nhiêu?',
      answer: 'Phí vận chuyển phụ thuộc vào địa điểm giao hàng và trọng lượng sản phẩm. Đơn hàng trên 2 triệu đồng được miễn phí vận chuyển trong nội thành. Bạn có thể xem phí vận chuyển chính xác khi đặt hàng.'
    },
    {
      id: 14,
      category: 'shipping',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng: Nội thành TP.HCM: 1-2 ngày, Tỉnh thành khác: 3-5 ngày, Vùng sâu vùng xa: 5-7 ngày. Thời gian có thể thay đổi tùy theo tình hình thực tế.'
    },
    {
      id: 15,
      category: 'shipping',
      question: 'Tôi có thể yêu cầu giao hàng vào giờ cụ thể không?',
      answer: 'Có, bạn có thể yêu cầu thời gian giao hàng cụ thể trong phần ghi chú khi đặt hàng. Chúng tôi sẽ cố gắng đáp ứng yêu cầu của bạn trong khả năng có thể.'
    },
    {
      id: 16,
      category: 'shipping',
      question: 'Sản phẩm có được lắp đặt miễn phí không?',
      answer: 'Chúng tôi cung cấp dịch vụ lắp đặt miễn phí cho các sản phẩm nội thất lớn trong nội thành TP.HCM. Đối với khu vực khác, phí lắp đặt sẽ được thông báo cụ thể.'
    },
    // Bảo hành
    {
      id: 17,
      category: 'warranty',
      question: 'Chính sách bảo hành như thế nào?',
      answer: 'Tất cả sản phẩm được bảo hành chính hãng từ 12-24 tháng tùy loại sản phẩm. Bảo hành bao gồm lỗi kỹ thuật và lỗi sản xuất. Bạn cần giữ hóa đơn và tem bảo hành để được hỗ trợ.'
    },
    {
      id: 18,
      category: 'warranty',
      question: 'Làm sao để yêu cầu bảo hành?',
      answer: 'Bạn có thể liên hệ hotline, email hoặc đến trực tiếp cửa hàng với hóa đơn và tem bảo hành. Chúng tôi sẽ kiểm tra và xử lý yêu cầu bảo hành trong vòng 3-5 ngày làm việc.'
    },
    {
      id: 19,
      category: 'warranty',
      question: 'Những trường hợp nào không được bảo hành?',
      answer: 'Không được bảo hành trong các trường hợp: Hư hỏng do sử dụng sai cách, tự ý sửa chữa, thiên tai, hỏa hoạn, hoặc hết thời hạn bảo hành.'
    },
    // Đổi trả
    {
      id: 20,
      category: 'return',
      question: 'Tôi có thể đổi/trả sản phẩm không?',
      answer: 'Bạn có thể đổi/trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện: Sản phẩm còn nguyên vẹn, chưa sử dụng, còn đầy đủ phụ kiện và hóa đơn.'
    },
    {
      id: 21,
      category: 'return',
      question: 'Phí đổi trả là bao nhiêu?',
      answer: 'Nếu sản phẩm lỗi hoặc không đúng như mô tả, chúng tôi sẽ miễn phí đổi trả. Nếu đổi trả do lý do khác, bạn sẽ chịu phí vận chuyển (nếu có).'
    },
    {
      id: 22,
      category: 'return',
      question: 'Thời gian xử lý đổi trả là bao lâu?',
      answer: 'Sau khi nhận được sản phẩm trả về và kiểm tra, chúng tôi sẽ xử lý đổi trả trong vòng 3-5 ngày làm việc. Tiền hoàn lại sẽ được chuyển về tài khoản của bạn trong vòng 7-10 ngày.'
    },
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="position-relative" style={{ height: '400px', overflow: 'hidden' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80"
            alt="Customer Support"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.85) 0%, rgba(255, 179, 0, 0.85) 100%)'
          }}
        />
        <div className="container position-relative h-100 d-flex align-items-center" style={{ zIndex: 2 }}>
          <div className="text-white">
            <h1 
              className="display-4 fw-bold mb-3" 
              style={{ 
                letterSpacing: '4px',
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              HỎI ĐÁP
            </h1>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: '60px', height: '3px', backgroundColor: '#FFC107' }}></div>
              <p className="mb-0 h5" style={{ letterSpacing: '2px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>Câu hỏi thường gặp</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F4F0 50%, #FAFAF8 100%)' }}>
        <div className="container">
          {/* Category Filter */}
          <div className="mb-5">
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`btn ${activeCategory === cat.id ? 'btn-warning' : 'btn-outline-secondary'} px-4 py-2`}
                  style={{
                    borderRadius: '25px',
                    transition: 'all 0.3s ease',
                    fontWeight: activeCategory === cat.id ? '600' : '400'
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <i className={`bi bi-${cat.icon} me-2`}></i>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="row">
            <div className="col-lg-8 mx-auto">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Không có câu hỏi nào trong danh mục này</p>
                </div>
              ) : (
                <div className="accordion" id="faqAccordion">
                  {filteredFAQs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className="card border-0 mb-3 shadow-sm"
                      style={{
                        borderRadius: '15px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div 
                        className="card-header bg-white border-0 p-0"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleItem(faq.id)}
                      >
                        <button
                          className="btn btn-link w-100 text-start text-decoration-none p-4"
                          style={{
                            color: '#2c3e50',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>
                              <i className={`bi bi-${categories.find(c => c.id === faq.category)?.icon} me-2 text-warning`}></i>
                              {faq.question}
                            </span>
                            <i 
                              className={`bi bi-chevron-${openItems.has(faq.id) ? 'up' : 'down'}`}
                              style={{ transition: 'transform 0.3s ease' }}
                            ></i>
                          </div>
                        </button>
                      </div>
                      <div
                        className={`collapse ${openItems.has(faq.id) ? 'show' : ''}`}
                        style={{
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="card-body p-4 pt-0" style={{ color: '#6c757d', lineHeight: '1.8' }}>
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="row mt-5">
            <div className="col-lg-8 mx-auto">
              <div 
                className="card border-0 shadow-lg p-5 text-center"
                style={{
                  background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)',
                  borderRadius: '20px',
                  color: 'white'
                }}
              >
                <h3 className="fw-bold mb-3">Vẫn chưa tìm thấy câu trả lời?</h3>
                <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link 
                    href="/contact" 
                    className="btn btn-light btn-lg px-4"
                    style={{ borderRadius: '25px' }}
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Liên hệ ngay
                  </Link>
                  <a 
                    href="tel:0909123456" 
                    className="btn btn-outline-light btn-lg px-4"
                    style={{ borderRadius: '25px' }}
                  >
                    <i className="bi bi-telephone me-2"></i>
                    Gọi hotline
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

