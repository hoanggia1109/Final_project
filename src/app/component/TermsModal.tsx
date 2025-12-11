'use client';
import { useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  // Ngăn scroll body khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        .terms-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-in-out;
          padding: 20px;
        }

        .terms-modal-content {
          position: relative;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
          display: flex;
          flex-direction: column;
        }

        .terms-modal-header {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
          color: white;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .terms-modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .terms-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .terms-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .terms-modal-body {
          padding: 30px;
          overflow-y: auto;
          flex: 1;
        }

        .terms-section {
          margin-bottom: 30px;
        }

        .terms-section h3 {
          color: #FF8E53;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .terms-section p,
        .terms-section li {
          color: #666;
          line-height: 1.8;
          margin-bottom: 10px;
        }

        .terms-section ul {
          padding-left: 20px;
        }

        .terms-section strong {
          color: #333;
        }

        .terms-update-date {
          text-align: center;
          color: #999;
          font-size: 0.9rem;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom Scrollbar */
        .terms-modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .terms-modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .terms-modal-body::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FF8E53, #FF6B6B);
          border-radius: 10px;
        }

        .terms-modal-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #FF6B6B, #FFA726);
        }

        @media (max-width: 768px) {
          .terms-modal-content {
            max-height: 95vh;
          }

          .terms-modal-header {
            padding: 15px 20px;
          }

          .terms-modal-title {
            font-size: 1.2rem;
          }

          .terms-modal-body {
            padding: 20px;
          }

          .terms-section h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <div className="terms-modal-overlay" onClick={onClose}>
        <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="terms-modal-header">
            <h2 className="terms-modal-title">ĐIỀU KHOẢN SỬ DỤNG</h2>
            <button className="terms-close-btn" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Body */}
          <div className="terms-modal-body">
            <div className="terms-update-date">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>

            {/* Section 1 */}
            <section className="terms-section">
              <h3>1. Giới thiệu</h3>
              <p>
                Chào mừng bạn đến với website của chúng tôi. Bằng việc truy cập và sử dụng website này, 
                bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu dưới đây. 
                Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng website của chúng tôi.
              </p>
            </section>

            {/* Section 2 */}
            <section className="terms-section">
              <h3>2. Định nghĩa</h3>
              <ul>
                <li><strong>&quot;Website&quot;</strong> hoặc <strong>&quot;Chúng tôi&quot;</strong> đề cập đến website bán nội thất này và các dịch vụ liên quan.</li>
                <li><strong>&quot;Bạn&quot;</strong> hoặc <strong>&quot;Người dùng&quot;</strong> đề cập đến cá nhân hoặc tổ chức truy cập và sử dụng website.</li>
                <li><strong>&quot;Sản phẩm&quot;</strong> đề cập đến các sản phẩm nội thất được bán trên website.</li>
                <li><strong>&quot;Dịch vụ&quot;</strong> bao gồm thiết kế, thi công và các dịch vụ liên quan đến nội thất.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="terms-section">
              <h3>3. Đăng ký tài khoản</h3>
              <p>Khi đăng ký tài khoản trên website, bạn cam kết:</p>
              <ul>
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật.</li>
                <li>Bảo mật thông tin đăng nhập của bạn và chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của bạn.</li>
                <li>Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ hoạt động trái phép nào liên quan đến tài khoản của bạn.</li>
                <li>Không sử dụng tài khoản của người khác hoặc chia sẻ thông tin đăng nhập.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="terms-section">
              <h3>4. Đặt hàng và thanh toán</h3>
              <ul>
                <li>Khi đặt hàng, bạn xác nhận rằng thông tin đặt hàng là chính xác và bạn có quyền sử dụng phương thức thanh toán đã chọn.</li>
                <li>Giá sản phẩm có thể thay đổi mà không cần thông báo trước, nhưng giá tại thời điểm đặt hàng sẽ được áp dụng.</li>
                <li>Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong trường hợp sản phẩm hết hàng, thông tin không hợp lệ, hoặc có dấu hiệu gian lận.</li>
                <li>Thanh toán có thể được thực hiện qua nhiều phương thức: tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng, hoặc các cổng thanh toán trực tuyến.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="terms-section">
              <h3>5. Giao hàng và vận chuyển</h3>
              <ul>
                <li>Thời gian giao hàng sẽ được thông báo khi đặt hàng và có thể thay đổi tùy theo địa điểm giao hàng.</li>
                <li>Phí vận chuyển sẽ được tính dựa trên địa chỉ giao hàng và phương thức vận chuyển bạn chọn.</li>
                <li>Bạn có trách nhiệm kiểm tra sản phẩm khi nhận hàng. Nếu có bất kỳ vấn đề nào, vui lòng thông báo ngay cho chúng tôi.</li>
                <li>Chúng tôi không chịu trách nhiệm về thiệt hại do lỗi thông tin địa chỉ giao hàng do bạn cung cấp.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="terms-section">
              <h3>6. Đổi trả và hoàn tiền</h3>
              <ul>
                <li>Bạn có quyền đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm có lỗi do nhà sản xuất hoặc không đúng với mô tả.</li>
                <li>Sản phẩm đổi trả phải còn nguyên vẹn, chưa sử dụng, còn đầy đủ phụ kiện và hóa đơn mua hàng.</li>
                <li>Phí vận chuyển đổi trả sẽ được xử lý theo chính sách cụ thể của từng trường hợp.</li>
                <li>Thời gian hoàn tiền có thể mất từ 5-10 ngày làm việc tùy theo phương thức thanh toán ban đầu.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="terms-section">
              <h3>7. Bảo hành</h3>
              <p>
                Tất cả sản phẩm được bảo hành theo chính sách của nhà sản xuất. Thời gian và điều kiện bảo hành 
                sẽ được ghi rõ trong hóa đơn mua hàng. Chúng tôi sẽ hỗ trợ bạn trong quá trình bảo hành sản phẩm.
              </p>
            </section>

            {/* Section 8 */}
            <section className="terms-section">
              <h3>8. Quyền sở hữu trí tuệ</h3>
              <p>
                Tất cả nội dung trên website bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, thiết kế, 
                và phần mềm đều thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép. Bạn không được sao chép, 
                sử dụng hoặc phân phối bất kỳ nội dung nào mà không có sự cho phép bằng văn bản của chúng tôi.
              </p>
            </section>

            {/* Section 9 */}
            <section className="terms-section">
              <h3>9. Bảo mật thông tin</h3>
              <p>
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Thông tin của bạn sẽ được sử dụng để xử lý đơn hàng, 
                cải thiện dịch vụ và gửi thông tin liên quan đến đơn hàng. Chúng tôi không bán, cho thuê hoặc chia sẻ 
                thông tin của bạn với bên thứ ba mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật.
              </p>
            </section>

            {/* Section 10 */}
            <section className="terms-section">
              <h3>10. Giới hạn trách nhiệm</h3>
              <p>
                Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc 
                hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng website hoặc sản phẩm của chúng tôi. 
                Trong mọi trường hợp, trách nhiệm tối đa của chúng tôi sẽ không vượt quá giá trị đơn hàng của bạn.
              </p>
            </section>

            {/* Section 11 */}
            <section className="terms-section">
              <h3>11. Thay đổi điều khoản</h3>
              <p>
                Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay sau 
                khi được đăng tải trên website. Việc bạn tiếp tục sử dụng website sau khi có thay đổi được coi là 
                bạn đã chấp nhận các điều khoản mới.
              </p>
            </section>

            {/* Section 12 */}
            <section className="terms-section">
              <h3>12. Luật áp dụng</h3>
              <p>
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết 
                tại Tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            {/* Section 13 */}
            <section className="terms-section">
              <h3>13. Liên hệ</h3>
              <p>Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua:</p>
              <ul>
                <li>Email: support@shopnoithat.com</li>
                <li>Hotline: 1900-xxxx</li>
                <li>Địa chỉ: [Địa chỉ cửa hàng]</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

