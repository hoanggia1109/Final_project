// CHANGED: Helper function để gửi email xác nhận đơn hàng
const nodemailer = require("nodemailer");

// CHANGED: Tạo transporter cho email (sử dụng cùng config với quên mật khẩu)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "tnpv2709@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "anvb vlod twoq xvvy",
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
      from: "Shop Nội Thất <tnpv2709@gmail.com>",
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
      from: "Shop Nội Thất <tnpv2709@gmail.com>",
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

module.exports = {
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
};

