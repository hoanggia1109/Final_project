'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div 
      className="min-vh-100 py-5"
      style={{
        background: 'linear-gradient(180deg, #FFF9F0 0%, #ffffff 50%, #FFF5E8 100%)',
        paddingTop: '120px',
      }}
    >
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Link 
            href="/" 
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
            Điều khoản sử dụng
          </h1>
        </div>

        {/* Content */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5">
            <div className="mb-4">
              <p className="text-muted mb-0">
                <small>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</small>
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                1. Giới thiệu
              </h3>
              <p className="text-muted mb-4">
                Chào mừng bạn đến với website của chúng tôi. Bằng việc truy cập và sử dụng website này, 
                bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu dưới đây. 
                Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng website của chúng tôi.
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                2. Định nghĩa
              </h3>
              <ul className="text-muted mb-4" style={{ paddingLeft: '20px' }}>
                <li><strong>"Website"</strong> hoặc <strong>"Chúng tôi"</strong> đề cập đến website này và các dịch vụ được cung cấp.</li>
                <li><strong>"Người dùng"</strong>, <strong>"Bạn"</strong> hoặc <strong>"Khách hàng"</strong> đề cập đến cá nhân hoặc tổ chức truy cập và sử dụng website.</li>
                <li><strong>"Sản phẩm"</strong> đề cập đến các hàng hóa được bán trên website.</li>
                <li><strong>"Dịch vụ"</strong> đề cập đến tất cả các dịch vụ được cung cấp thông qua website.</li>
              </ul>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                3. Đăng ký tài khoản
              </h3>
              <p className="text-muted mb-3">
                Để sử dụng một số tính năng của website, bạn có thể cần đăng ký tài khoản. Khi đăng ký, bạn cam kết:
              </p>
              <ul className="text-muted mb-4" style={{ paddingLeft: '20px' }}>
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật.</li>
                <li>Bảo mật mật khẩu và thông tin tài khoản của bạn.</li>
                <li>Chịu trách nhiệm cho tất cả các hoạt động xảy ra dưới tài khoản của bạn.</li>
                <li>Thông báo ngay lập tức cho chúng tôi về bất kỳ vi phạm bảo mật nào.</li>
              </ul>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                4. Mua hàng và thanh toán
              </h3>
              <p className="text-muted mb-3">
                Khi mua hàng trên website, bạn đồng ý:
              </p>
              <ul className="text-muted mb-4" style={{ paddingLeft: '20px' }}>
                <li>Cung cấp thông tin thanh toán chính xác và hợp lệ.</li>
                <li>Thanh toán đầy đủ giá trị đơn hàng theo các phương thức thanh toán được chấp nhận.</li>
                <li>Chấp nhận rằng giá cả có thể thay đổi mà không cần thông báo trước (trừ khi đã xác nhận đơn hàng).</li>
                <li>Chịu trách nhiệm về việc kiểm tra thông tin đơn hàng trước khi xác nhận.</li>
              </ul>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                5. Vận chuyển và giao hàng
              </h3>
              <p className="text-muted mb-3">
                Chúng tôi sẽ cố gắng giao hàng trong thời gian đã cam kết. Tuy nhiên:
              </p>
              <ul className="text-muted mb-4" style={{ paddingLeft: '20px' }}>
                <li>Thời gian giao hàng có thể thay đổi do các yếu tố ngoài tầm kiểm soát.</li>
                <li>Bạn chịu trách nhiệm cung cấp địa chỉ giao hàng chính xác và đầy đủ.</li>
                <li>Phí vận chuyển sẽ được tính theo chính sách hiện hành của chúng tôi.</li>
                <li>Miễn phí vận chuyển cho đơn hàng từ 5.000.000₫ trở lên (tùy theo khu vực).</li>
              </ul>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                6. Đổi trả và hoàn tiền
              </h3>
              <p className="text-muted mb-3">
                Chúng tôi áp dụng chính sách đổi trả và hoàn tiền như sau:
              </p>
              <ul className="text-muted mb-4" style={{ paddingLeft: '20px' }}>
                <li>Bạn có quyền đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng.</li>
                <li>Sản phẩm phải còn nguyên vẹn, chưa sử dụng, còn đầy đủ bao bì và phụ kiện.</li>
                <li>Chúng tôi sẽ xử lý yêu cầu đổi trả trong vòng 3-5 ngày làm việc sau khi nhận được sản phẩm.</li>
                <li>Phí vận chuyển đổi trả sẽ được tính theo quy định cụ thể.</li>
              </ul>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                7. Bảo mật thông tin
              </h3>
              <p className="text-muted mb-4">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Thông tin của bạn sẽ được xử lý 
                theo Chính sách Bảo mật của chúng tôi. Chúng tôi sử dụng các biện pháp bảo mật tiên tiến 
                để bảo vệ dữ liệu của bạn khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy.
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                8. Quyền sở hữu trí tuệ
              </h3>
              <p className="text-muted mb-4">
                Tất cả nội dung trên website, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, 
                hình ảnh, video, âm thanh, phần mềm và mã nguồn, đều thuộc quyền sở hữu của chúng tôi 
                hoặc các bên cấp phép. Bạn không được sao chép, phân phối, sửa đổi hoặc tạo ra các tác phẩm 
                phái sinh từ nội dung này mà không có sự cho phép bằng văn bản của chúng tôi.
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                9. Hành vi bị cấm
              </h3>
              <p className="text-muted mb-3">
                Bạn không được:
              </p>
              <ul className="text-muted mb-4" style={{ paddingLeft: '20px' }}>
                <li>Sử dụng website cho bất kỳ mục đích bất hợp pháp nào.</li>
                <li>Xâm nhập hoặc cố gắng xâm nhập vào hệ thống của website.</li>
                <li>Gửi hoặc truyền bất kỳ virus, mã độc hoặc phần mềm độc hại nào.</li>
                <li>Thu thập hoặc lưu trữ thông tin cá nhân của người dùng khác.</li>
                <li>Giả mạo danh tính hoặc cung cấp thông tin sai lệch.</li>
                <li>Can thiệp vào hoạt động bình thường của website.</li>
              </ul>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                10. Miễn trừ trách nhiệm
              </h3>
              <p className="text-muted mb-4">
                Website được cung cấp "như hiện tại" và "như có sẵn". Chúng tôi không đảm bảo rằng 
                website sẽ luôn hoạt động không bị gián đoạn hoặc không có lỗi. Chúng tôi không chịu 
                trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng website, 
                bao gồm nhưng không giới hạn ở thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc hậu quả.
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                11. Giới hạn trách nhiệm
              </h3>
              <p className="text-muted mb-4">
                Trong phạm vi tối đa được pháp luật cho phép, trách nhiệm của chúng tôi đối với bạn 
                sẽ không vượt quá số tiền bạn đã thanh toán cho sản phẩm hoặc dịch vụ gây ra thiệt hại.
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                12. Thay đổi điều khoản
              </h3>
              <p className="text-muted mb-4">
                Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực 
                ngay sau khi được đăng tải trên website. Việc bạn tiếp tục sử dụng website sau khi có 
                thay đổi được coi là bạn đã chấp nhận các điều khoản mới.
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                13. Luật áp dụng
              </h3>
              <p className="text-muted mb-4">
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh 
                từ hoặc liên quan đến các điều khoản này sẽ được giải quyết tại Tòa án có thẩm quyền 
                tại Việt Nam.
              </p>
            </div>

            <div className="content-section">
              <h3 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
                14. Liên hệ
              </h3>
              <p className="text-muted mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi:
              </p>
              <div className="text-muted mb-4" style={{ paddingLeft: '20px' }}>
                <p className="mb-2">
                  <i className="bi bi-envelope me-2" style={{ color: '#FF8E53' }}></i>
                  Email: support@example.com
                </p>
                <p className="mb-2">
                  <i className="bi bi-telephone me-2" style={{ color: '#FF8E53' }}></i>
                  Hotline: 1900-xxxx
                </p>
                <p className="mb-0">
                  <i className="bi bi-geo-alt me-2" style={{ color: '#FF8E53' }}></i>
                  Địa chỉ: [Địa chỉ của bạn]
                </p>
              </div>
            </div>

            <div className="border-top pt-4 mt-4">
              <div className="d-flex gap-3 justify-content-center">
                <Link
                  href="/"
                  className="btn"
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FF8E53, #FFA726)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    fontWeight: '600',
                  }}
                >
                  <i className="bi bi-house me-2"></i>
                  Về trang chủ
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #FF8E53',
                    color: '#FF8E53',
                    padding: '10px 24px',
                    fontWeight: '600',
                  }}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Liên hệ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .content-section {
          margin-bottom: 2.5rem;
        }
        
        .content-section:last-child {
          margin-bottom: 0;
        }
        
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .card-body {
            padding: 1.5rem !important;
          }
          
          h1 {
            font-size: 1.75rem !important;
          }
          
          h3 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
