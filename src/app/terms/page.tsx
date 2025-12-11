'use client';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="fw-bold mb-3" style={{ color: '#FF6B6B' }}>
              ĐIỀU KHOẢN SỬ DỤNG
            </h1>
            <p className="text-muted small">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="border-top pt-4">
            {/* Section 1 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                1. Giới thiệu
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Chào mừng bạn đến với website của chúng tôi. Bằng việc truy cập và sử dụng website này, 
                bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu dưới đây. 
                Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng website của chúng tôi.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                2. Định nghĩa
              </h3>
              <ul className="text-muted" style={{ lineHeight: '1.8' }}>
                <li><strong>&quot;Website&quot;</strong> hoặc <strong>&quot;Chúng tôi&quot;</strong> đề cập đến website bán nội thất này và các dịch vụ liên quan.</li>
                <li><strong>&quot;Bạn&quot;</strong> hoặc <strong>&quot;Người dùng&quot;</strong> đề cập đến cá nhân hoặc tổ chức truy cập và sử dụng website.</li>
                <li><strong>&quot;Sản phẩm&quot;</strong> đề cập đến các sản phẩm nội thất được bán trên website.</li>
                <li><strong>&quot;Dịch vụ&quot;</strong> bao gồm thiết kế, thi công và các dịch vụ liên quan đến nội thất.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                3. Đăng ký tài khoản
              </h3>
              <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                Khi đăng ký tài khoản trên website, bạn cam kết:
              </p>
              <ul className="text-muted" style={{ lineHeight: '1.8' }}>
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật.</li>
                <li>Bảo mật thông tin đăng nhập của bạn và chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của bạn.</li>
                <li>Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ hoạt động trái phép nào liên quan đến tài khoản của bạn.</li>
                <li>Không sử dụng tài khoản của người khác hoặc chia sẻ thông tin đăng nhập.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                4. Đặt hàng và thanh toán
              </h3>
              <ul className="text-muted" style={{ lineHeight: '1.8' }}>
                <li>Khi đặt hàng, bạn xác nhận rằng thông tin đặt hàng là chính xác và bạn có quyền sử dụng phương thức thanh toán đã chọn.</li>
                <li>Giá sản phẩm có thể thay đổi mà không cần thông báo trước, nhưng giá tại thời điểm đặt hàng sẽ được áp dụng.</li>
                <li>Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong trường hợp sản phẩm hết hàng, thông tin không hợp lệ, hoặc có dấu hiệu gian lận.</li>
                <li>Thanh toán có thể được thực hiện qua nhiều phương thức: tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng, hoặc các cổng thanh toán trực tuyến.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                5. Giao hàng và vận chuyển
              </h3>
              <ul className="text-muted" style={{ lineHeight: '1.8' }}>
                <li>Thời gian giao hàng sẽ được thông báo khi đặt hàng và có thể thay đổi tùy theo địa điểm giao hàng.</li>
                <li>Phí vận chuyển sẽ được tính dựa trên địa chỉ giao hàng và phương thức vận chuyển bạn chọn.</li>
                <li>Bạn có trách nhiệm kiểm tra sản phẩm khi nhận hàng. Nếu có bất kỳ vấn đề nào, vui lòng thông báo ngay cho chúng tôi.</li>
                <li>Chúng tôi không chịu trách nhiệm về thiệt hại do lỗi thông tin địa chỉ giao hàng do bạn cung cấp.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                6. Đổi trả và hoàn tiền
              </h3>
              <ul className="text-muted" style={{ lineHeight: '1.8' }}>
                <li>Bạn có quyền đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm có lỗi do nhà sản xuất hoặc không đúng với mô tả.</li>
                <li>Sản phẩm đổi trả phải còn nguyên vẹn, chưa sử dụng, còn đầy đủ phụ kiện và hóa đơn mua hàng.</li>
                <li>Phí vận chuyển đổi trả sẽ được xử lý theo chính sách cụ thể của từng trường hợp.</li>
                <li>Thời gian hoàn tiền có thể mất từ 5-10 ngày làm việc tùy theo phương thức thanh toán ban đầu.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                7. Bảo hành
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Tất cả sản phẩm được bảo hành theo chính sách của nhà sản xuất. Thời gian và điều kiện bảo hành 
                sẽ được ghi rõ trong hóa đơn mua hàng. Chúng tôi sẽ hỗ trợ bạn trong quá trình bảo hành sản phẩm.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                8. Quyền sở hữu trí tuệ
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Tất cả nội dung trên website bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, thiết kế, 
                và phần mềm đều thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép. Bạn không được sao chép, 
                sử dụng hoặc phân phối bất kỳ nội dung nào mà không có sự cho phép bằng văn bản của chúng tôi.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                9. Bảo mật thông tin
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Thông tin của bạn sẽ được sử dụng để xử lý đơn hàng, 
                cải thiện dịch vụ và gửi thông tin liên quan đến đơn hàng. Chúng tôi không bán, cho thuê hoặc chia sẻ 
                thông tin của bạn với bên thứ ba mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                10. Giới hạn trách nhiệm
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc 
                hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng website hoặc sản phẩm của chúng tôi. 
                Trong mọi trường hợp, trách nhiệm tối đa của chúng tôi sẽ không vượt quá giá trị đơn hàng của bạn.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                11. Thay đổi điều khoản
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay sau 
                khi được đăng tải trên website. Việc bạn tiếp tục sử dụng website sau khi có thay đổi được coi là 
                bạn đã chấp nhận các điều khoản mới.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                12. Luật áp dụng
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết 
                tại Tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-4">
              <h3 className="fw-semibold mb-3" style={{ color: '#FF8E53', fontSize: '1.3rem' }}>
                13. Liên hệ
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua:
              </p>
              <ul className="text-muted" style={{ lineHeight: '1.8' }}>
                <li>Email: support@shopnoithat.com</li>
                <li>Hotline: 1900-xxxx</li>
                <li>Địa chỉ: [Địa chỉ cửa hàng]</li>
              </ul>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="border-top pt-4 mt-4">
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center">
              <Link 
                href="/auth" 
                className="btn btn-outline-secondary"
                style={{ 
                  minWidth: '150px',
                  borderRadius: '8px'
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại đăng ký
              </Link>
              <button 
                onClick={() => window.print()} 
                className="btn"
                style={{ 
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  color: 'white',
                  minWidth: '150px',
                  borderRadius: '8px',
                  border: 'none'
                }}
              >
                <i className="bi bi-printer me-2"></i>
                In trang này
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .btn, .border-top:last-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

