/**
 * EMAIL.JS - Email Utility Functions
 * 
 * Cung cấp các hàm gửi email:
 * - sendOrderConfirmationEmail: Email xác nhận đơn hàng
 * - sendPaymentSuccessEmail: Email thanh toán thành công
 * - sendOrderStatusUpdateEmail: Email cập nhật trạng thái đơn hàng
 */

const nodemailer = require("nodemailer");
const constants = require("../../config/constants");

// Tạo transporter cho email từ config
const transporter = nodemailer.createTransport({
  service: constants.EMAIL.SERVICE || "gmail",
  auth: {
    user: constants.EMAIL.USER || process.env.EMAIL_USER,
    pass: constants.EMAIL.PASSWORD || process.env.EMAIL_PASSWORD,
  },
});

/**
 * CHANGED: Gửi email xác nhận đơn hàng
 * @param {string} to - Email người nhận
 * @param {Object} orderData - Thông tin đơn hàng
 * @param {string} orderData.code - Mã đơn hàng
 * @param {string} orderData.id - ID đơn hàng
 * @param {number} orderData.tongtien_sau_giam - Tổng tiền
 * @param {string} orderData.phuongthucthanhtoan - Phương thức thanh toán
 * @param {string} orderData.trangthaithanhtoan - Trạng thái thanh toán
 * @param {Array} orderData.chitiet - Chi tiết đơn hàng
 */
async function sendOrderConfirmationEmail(to, orderData) {
  try {
    const { code, id, tongtien_sau_giam, phuongthucthanhtoan, trangthaithanhtoan, chitiet } = orderData;
    
    // CHANGED: Tạo HTML email với thông tin đơn hàng
    const paymentMethodLabels = {
      'cod': 'Thanh toán khi nhận hàng (COD)',
      'stripe': 'Thanh toán bằng thẻ (Stripe)',
      'banking': 'Chuyển khoản ngân hàng',
      'vnpay': 'VNPay',
      'momo': 'MoMo'
    };

    const paymentStatusLabels = {
      'pending': 'Chờ thanh toán',
      'paid': 'Đã thanh toán',
      'failed': 'Thanh toán thất bại',
      'refunded': 'Đã hoàn tiền',
      'cancelled': 'Đã hủy'
    };

    // CHANGED: Tạo danh sách sản phẩm
    let productsList = '';
    if (chitiet && chitiet.length > 0) {
      productsList = chitiet.map((item, index) => {
        const productName = item.bienthe?.sanpham?.tensp || 'Sản phẩm';
        const quantity = item.soluong || 0;
        const price = Number(item.gia || 0);
        const total = price * quantity;
        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${index + 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${productName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${price.toLocaleString('vi-VN')}₫</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${total.toLocaleString('vi-VN')}₫</td>
          </tr>
        `;
      }).join('');
    } else {
      productsList = '<tr><td colspan="5" style="padding: 8px; text-align: center;">Không có sản phẩm</td></tr>';
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B6B, #FF8E53); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .order-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .order-code { font-size: 24px; font-weight: bold; color: #FF8E53; text-align: center; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
          td { padding: 8px; }
          .total { text-align: right; font-size: 18px; font-weight: bold; color: #FF6B6B; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Xác nhận đơn hàng</h1>
          </div>
          <div class="content">
            <p>Xin chào,</p>
            <p>Cảm ơn bạn đã đặt hàng tại Shop Nội Thất! Đơn hàng của bạn đã được nhận và đang được xử lý.</p>
            
            <div class="order-info">
              <p style="text-align: center; margin: 10px 0;">
                <strong>Mã đơn hàng:</strong>
              </p>
              <div class="order-code">${code}</div>
            </div>

            <div class="order-info">
              <h3 style="margin-top: 0;">Thông tin đơn hàng</h3>
              <p><strong>Mã đơn hàng:</strong> ${code}</p>
              <p><strong>Phương thức thanh toán:</strong> ${paymentMethodLabels[phuongthucthanhtoan] || phuongthucthanhtoan}</p>
              <p><strong>Trạng thái thanh toán:</strong> ${paymentStatusLabels[trangthaithanhtoan] || trangthaithanhtoan}</p>
              <p><strong>Tổng tiền:</strong> ${Number(tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫</p>
            </div>

            <div class="order-info">
              <h3 style="margin-top: 0;">Chi tiết sản phẩm</h3>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th style="text-align: center;">Số lượng</th>
                    <th style="text-align: right;">Đơn giá</th>
                    <th style="text-align: right;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsList}
                </tbody>
              </table>
              <div class="total">
                Tổng cộng: ${Number(tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫
              </div>
            </div>

            <p>Chúng tôi sẽ cập nhật trạng thái đơn hàng của bạn qua email. Vui lòng kiểm tra email thường xuyên.</p>
            <p>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
          </div>
          <div class="footer">
            <p>© 2024 Shop Nội Thất. Tất cả các quyền được bảo lưu.</p>
            <p>Email hỗ trợ: tnpv2709@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: constants.EMAIL.FROM || `Shop Nội Thất <${constants.EMAIL.USER}>`,
      to: to,
      subject: `Xác nhận đơn hàng #${code}`,
      html: html,
    });

    console.log('Order confirmation email sent to:', to);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
}

/**
 * CHANGED: Gửi email khi thanh toán thành công (email duy nhất, gửi 1 lần)
 * @param {string} to - Email người nhận
 * @param {Object} orderData - Thông tin đơn hàng
 * @param {string} orderData.code - Mã đơn hàng
 * @param {string} orderData.id - ID đơn hàng
 * @param {number} orderData.tongtien_sau_giam - Tổng tiền
 * @param {string} orderData.phuongthucthanhtoan - Phương thức thanh toán
 * @param {Array} orderData.chitiet - Chi tiết đơn hàng (tùy chọn)
 */
async function sendPaymentSuccessEmail(to, orderData) {
  try {
    const { code, id, tongtien_sau_giam, phuongthucthanhtoan, chitiet } = orderData;

    const paymentMethodLabels = {
      'cod': 'Thanh toán khi nhận hàng (COD)',
      'stripe': 'Thanh toán bằng thẻ (Stripe)',
      'banking': 'Chuyển khoản ngân hàng',
      'vnpay': 'VNPay',
      'momo': 'MoMo'
    };

    // CHANGED: Tạo danh sách sản phẩm nếu có
    let productsList = '';
    if (chitiet && chitiet.length > 0) {
      productsList = chitiet.map((item, index) => {
        const productName = item.bienthe?.sanpham?.tensp || 'Sản phẩm';
        const quantity = item.soluong || 0;
        const price = Number(item.gia || 0);
        const total = price * quantity;
        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${index + 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${productName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${price.toLocaleString('vi-VN')}₫</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${total.toLocaleString('vi-VN')}₫</td>
          </tr>
        `;
      }).join('');
    } else {
      productsList = '<tr><td colspan="5" style="padding: 8px; text-align: center;">Không có sản phẩm</td></tr>';
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .success-icon { text-align: center; font-size: 48px; margin: 20px 0; color: #4CAF50; }
          .order-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .order-code { font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
          td { padding: 8px; }
          .total { text-align: right; font-size: 18px; font-weight: bold; color: #FF6B6B; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thanh toán thành công!</h1>
          </div>
          <div class="content">
            <div class="success-icon">✓</div>
            <p style="text-align: center; font-size: 18px; font-weight: bold; color: #4CAF50;">Cảm ơn bạn đã thanh toán!</p>
            
            <div class="order-info">
              <p style="text-align: center; margin: 10px 0;">
                <strong>Mã đơn hàng:</strong>
              </p>
              <div class="order-code">${code}</div>
            </div>

            <div class="order-info">
              <h3 style="margin-top: 0;">Thông tin đơn hàng</h3>
              <p><strong>Mã đơn hàng:</strong> ${code}</p>
              <p><strong>Phương thức thanh toán:</strong> ${paymentMethodLabels[phuongthucthanhtoan] || phuongthucthanhtoan}</p>
              <p><strong>Số tiền đã thanh toán:</strong> ${Number(tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫</p>
              <p><strong>Trạng thái:</strong> <span style="color: #4CAF50; font-weight: bold;">Đã thanh toán</span></p>
            </div>

            ${chitiet && chitiet.length > 0 ? `
            <div class="order-info">
              <h3 style="margin-top: 0;">Chi tiết sản phẩm</h3>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th style="text-align: center;">Số lượng</th>
                    <th style="text-align: right;">Đơn giá</th>
                    <th style="text-align: right;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsList}
                </tbody>
              </table>
              <div class="total">
                Tổng cộng: ${Number(tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫
              </div>
            </div>
            ` : ''}

            <p>Đơn hàng của bạn đã được thanh toán thành công và đang được xử lý. Chúng tôi sẽ gửi hàng cho bạn sớm nhất có thể.</p>
            <p>Bạn có thể theo dõi trạng thái đơn hàng tại trang <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders">Đơn hàng của tôi</a>.</p>
          </div>
          <div class="footer">
            <p>© 2024 Shop Nội Thất. Tất cả các quyền được bảo lưu.</p>
            <p>Email hỗ trợ: tnpv2709@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: constants.EMAIL.FROM || `Shop Nội Thất <${constants.EMAIL.USER}>`,
      to: to,
      subject: `Thanh toán thành công - Đơn hàng #${code}`,
      html: html,
    });

    console.log('Payment success email sent to:', to);
    return true;
  } catch (error) {
    console.error('Error sending payment success email:', error);
    return false;
  }
}

/**
 * Gửi email cập nhật trạng thái đơn hàng
 * @param {string} to - Email người nhận
 * @param {Object} orderData - Thông tin đơn hàng
 * @param {string} orderData.code - Mã đơn hàng
 * @param {string} orderData.trangthai - Trạng thái đơn hàng mới (pending, confirmed, shipping, delivered, cancelled, returned)
 * @param {string} orderData.trangthai_cu - Trạng thái đơn hàng cũ (optional)
 * @param {number} orderData.tongtien_sau_giam - Tổng tiền
 * @param {Array} orderData.chitiet - Chi tiết đơn hàng (optional)
 */
async function sendOrderStatusUpdateEmail(to, orderData) {
  try {
    const { code, trangthai, trangthai_cu, tongtien_sau_giam, chitiet } = orderData;
    
    // Mapping trạng thái sang tiếng Việt
    const statusLabels = {
      'pending': { label: 'Chờ xác nhận', color: '#ffc107', icon: '⏳' },
      'confirmed': { label: 'Đã xác nhận', color: '#17a2b8', icon: '✓' },
      'shipping': { label: 'Đang giao hàng', color: '#007bff', icon: '🚚' },
      'delivered': { label: 'Đã giao hàng', color: '#28a745', icon: '✅' },
      'cancelled': { label: 'Đã hủy', color: '#dc3545', icon: '❌' },
      'returned': { label: 'Đã trả hàng', color: '#6c757d', icon: '↩️' }
    };

    const status = statusLabels[trangthai] || { label: trangthai, color: '#666', icon: '📦' };

    // Tạo danh sách sản phẩm nếu có
    let productsList = '';
    if (chitiet && chitiet.length > 0) {
      productsList = chitiet.map((item, index) => {
        const productName = item.bienthe?.sanpham?.tensp || 'Sản phẩm';
        const quantity = item.soluong || 0;
        const price = Number(item.gia || 0);
        const total = price * quantity;
        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${index + 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${productName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${price.toLocaleString('vi-VN')}₫</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${total.toLocaleString('vi-VN')}₫</td>
          </tr>
        `;
      }).join('');
    }

    // Nội dung thông báo tùy theo trạng thái
    let messageContent = '';
    switch(trangthai) {
      case 'confirmed':
        messageContent = '<p>Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị để giao hàng. Chúng tôi sẽ thông báo cho bạn khi đơn hàng được vận chuyển.</p>';
        break;
      case 'shipping':
        messageContent = '<p>Đơn hàng của bạn đang được vận chuyển. Vui lòng chuẩn bị sẵn số tiền và kiểm tra hàng hóa khi nhận hàng.</p>';
        break;
      case 'delivered':
        messageContent = '<p>Đơn hàng của bạn đã được giao thành công! Cảm ơn bạn đã tin tưởng và mua sắm tại Shop Nội Thất. Chúng tôi rất mong nhận được phản hồi từ bạn.</p>';
        break;
      case 'cancelled':
        messageContent = '<p>Đơn hàng của bạn đã bị hủy. Nếu bạn đã thanh toán, tiền sẽ được hoàn lại trong 3-5 ngày làm việc. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.</p>';
        break;
      case 'returned':
        messageContent = '<p>Đơn hàng của bạn đã được xử lý trả hàng. Chúng tôi sẽ kiểm tra và hoàn tiền cho bạn trong thời gian sớm nhất.</p>';
        break;
      default:
        messageContent = '<p>Trạng thái đơn hàng của bạn đã được cập nhật. Vui lòng kiểm tra thông tin chi tiết bên dưới.</p>';
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${status.color} 0%, ${status.color}dd 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .status-badge { 
            display: inline-block; 
            padding: 10px 20px; 
            background: ${status.color}; 
            color: white; 
            border-radius: 20px; 
            font-size: 18px; 
            font-weight: bold;
            margin: 15px 0;
          }
          .order-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .order-code { font-size: 24px; font-weight: bold; color: ${status.color}; text-align: center; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
          td { padding: 8px; }
          .total { text-align: right; font-size: 18px; font-weight: bold; color: #FF6B6B; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .icon { font-size: 48px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">${status.icon}</div>
            <h1 style="margin: 10px 0;">Cập nhật trạng thái đơn hàng</h1>
          </div>
          <div class="content">
            <p>Xin chào,</p>
            ${messageContent}
            
            <div class="order-info">
              <p style="text-align: center; margin: 10px 0;">
                <strong>Mã đơn hàng:</strong>
              </p>
              <div class="order-code">${code}</div>
              <div style="text-align: center; margin-top: 15px;">
                <span class="status-badge">${status.label}</span>
              </div>
            </div>

            ${chitiet && chitiet.length > 0 ? `
            <div class="order-info">
              <h3 style="margin-top: 0;">Chi tiết đơn hàng</h3>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th style="text-align: center;">Số lượng</th>
                    <th style="text-align: right;">Đơn giá</th>
                    <th style="text-align: right;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsList}
                </tbody>
              </table>
              ${tongtien_sau_giam ? `
              <div class="total">
                Tổng cộng: ${Number(tongtien_sau_giam || 0).toLocaleString('vi-VN')}₫
              </div>
              ` : ''}
            </div>
            ` : ''}

            <p>Bạn có thể theo dõi trạng thái đơn hàng tại trang <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders">Đơn hàng của tôi</a>.</p>
            <p>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
          </div>
          <div class="footer">
            <p>© 2024 Shop Nội Thất. Tất cả các quyền được bảo lưu.</p>
            <p>Email hỗ trợ: tnpv2709@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: constants.EMAIL.FROM || `Shop Nội Thất <${constants.EMAIL.USER}>`,
      to: to,
      subject: `Cập nhật trạng thái đơn hàng #${code} - ${status.label}`,
      html: html,
    });

    console.log('Order status update email sent to:', to, '- Status:', trangthai);
    return true;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return false;
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendOrderStatusUpdateEmail,
};

