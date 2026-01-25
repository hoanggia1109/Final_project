const nodemailer = require('nodemailer');

// Cấu hình email transporter
// Sử dụng Gmail (hoặc có thể đổi sang service khác)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Email của bạn
    pass: process.env.EMAIL_PASSWORD || 'your-app-password' // App Password của Gmail
  }
});

// Hàm gửi email xác nhận đăng ký
const sendRegistrationEmail = async (userEmail, userName, verificationToken, frontendUrl = null) => {
  // Sử dụng frontendUrl từ parameter, hoặc từ env, hoặc fallback
  const baseUrl = frontendUrl || process.env.FRONTEND_URL || process.env.BASE_URL || 'http://localhost:3000';
  try {
    const mailOptions = {
      from: {
        name: 'DANNYdecor - Trang trí Nội thất',
        address: process.env.EMAIL_USER || 'noreply@dannydecor.com'
      },
      to: userEmail,
      subject: '🎉 Chào mừng bạn đến với DANNYdecor!',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác nhận đăng ký</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                        🎉 Chào mừng đến với DANNYdecor!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">
                        Xin chào ${userName || 'bạn'}! 👋
                      </h2>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                        Cảm ơn bạn đã đăng ký tài khoản tại <strong>DANNYdecor</strong> - Chuyên thiết kế và thi công nội thất.
                      </p>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                        Tài khoản của bạn đã được tạo thành công với email: <strong>${userEmail}</strong>
                      </p>
                      
                      <div style="background-color: #ffe6e6; border-left: 4px solid #ff4444; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="color: #cc0000; font-size: 15px; line-height: 1.6; margin: 0; font-weight: bold;">
                           Vui lòng xác thực email để kích hoạt tài khoản
                        </p>
                      </div>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0 30px 0;">
                        Click vào nút bên dưới để xác nhận email và kích hoạt tài khoản của bạn:
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${baseUrl}/auth/verify-email?token=${encodeURIComponent(verificationToken)}" 
                           style="display: inline-block; background: linear-gradient(135deg, #00c853 0%, #4caf50 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);">
                           Xác nhận Email
                        </a>
                      </div>
                      
                      <div style="background-color: #fff9e6; border-left: 4px solid #fda085; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0;">
                          <strong>✨ Sau khi xác thực, bạn có thể:</strong><br>
                          • Khám phá các sản phẩm nội thất đẳng cấp<br>
                          • Đặt hàng và theo dõi đơn hàng<br>
                          • Lưu sản phẩm yêu thích<br>
                          • Nhận tư vấn thiết kế miễn phí
                        </p>
                      </div>
                      
                      <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                        Link xác thực sẽ hết hạn sau 24 giờ.<br>
                        Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #333333; padding: 30px; text-align: center;">
                      <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">
                        <strong>DANNYdecor - Trang trí Nội thất</strong>
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                        Số Đường 3, KDC Vạn Phúc, Hiệp Bình Phước, Thủ Đức, TP. HCM
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                        HOTLINE: (028) 66 857 354 | Email: info@dannydecor.com
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        Website: <a href="https://dannydecor.com" style="color: #fda085; text-decoration: none;">dannydecor.com</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(' Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(' Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Hàm gửi email quên mật khẩu (có thể thêm sau)
const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'DANNYdecor - Trang trí Nội thất',
        address: process.env.EMAIL_USER || 'noreply@dannydecor.com'
      },
      to: userEmail,
      subject: ' Yêu cầu đặt lại mật khẩu',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <title>Đặt lại mật khẩu</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <tr>
                    <td>
                      <h2 style="color: #333333; margin: 0 0 20px 0;">Xin chào ${userName}!</h2>
                      <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0;">
                        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                      </p>
                      <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0;">
                        Vui lòng click vào nút bên dưới để đặt lại mật khẩu:
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background-color: #fda085; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-weight: bold;">
                          Đặt lại mật khẩu
                        </a>
                      </div>
                      <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0;">
                        Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(' Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(' Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Hàm gửi email xác nhận cho khách hàng khi liên hệ
const sendContactConfirmationEmail = async (customerEmail, customerName, subject, message) => {
  try {
    const mailOptions = {
      from: {
        name: 'DANNYdecor - Trang trí Nội thất',
        address: process.env.EMAIL_USER || 'noreply@dannydecor.com'
      },
      to: customerEmail,
      subject: '✅ Chúng tôi đã nhận được yêu cầu liên hệ của bạn!',
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác nhận liên hệ</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0; color: #2C2C2C; font-size: 32px; font-weight: bold;">
                        ✅ Cảm ơn bạn đã liên hệ!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">
                        Xin chào ${customerName || 'bạn'}! 👋
                      </h2>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                        Chúng tôi đã nhận được yêu cầu liên hệ của bạn và sẽ phản hồi trong thời gian sớm nhất.
                      </p>
                      
                      <div style="background-color: #f9f9f9; border-left: 4px solid #D4AF37; padding: 20px; margin: 25px 0; border-radius: 5px;">
                        <h3 style="color: #2C2C2C; font-size: 18px; margin: 0 0 15px 0;">
                          📋 Thông tin bạn đã gửi:
                        </h3>
                        <table width="100%" cellpadding="8" cellspacing="0" style="color: #666666; font-size: 15px; line-height: 1.6;">
                          <tr>
                            <td style="font-weight: bold; color: #333; width: 120px;">Họ tên:</td>
                            <td>${customerName || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">Email:</td>
                            <td>${customerEmail}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333;">Tiêu đề:</td>
                            <td>${subject || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: bold; color: #333; vertical-align: top;">Nội dung:</td>
                            <td style="white-space: pre-wrap;">${message || 'N/A'}</td>
                          </tr>
                        </table>
                      </div>
                      
                      <div style="background-color: #fff9e6; border-left: 4px solid #fda085; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0;">
                          <strong>⏰ Thời gian phản hồi dự kiến:</strong><br>
                          • Ngày thường: 2-4 giờ<br>
                          • Cuối tuần: 24 giờ<br>
                          • Liên hệ khẩn: Gọi hotline (028) 66 857 354
                        </p>
                      </div>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                        Trong thời gian chờ đợi, bạn có thể:
                      </p>
                      <ul style="color: #666666; font-size: 15px; line-height: 1.8; margin: 10px 0 20px 0; padding-left: 20px;">
                        <li>Khám phá <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" style="color: #D4AF37; text-decoration: none; font-weight: bold;">sản phẩm mới</a></li>
                        <li>Xem <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/promotions" style="color: #D4AF37; text-decoration: none; font-weight: bold;">khuyến mãi hot</a></li>
                        <li>Tham khảo <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects" style="color: #D4AF37; text-decoration: none; font-weight: bold;">dự án đã hoàn thành</a></li>
                      </ul>
                      
                      <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                        Email này được gửi tự động. Vui lòng không reply trực tiếp email này.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #333333; padding: 30px; text-align: center;">
                      <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">
                        <strong>DANNYdecor - Trang trí Nội thất</strong>
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                        Số Đường 3, KDC Vạn Phúc, Hiệp Bình Phước, Thủ Đức, TP. HCM
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                        HOTLINE: (028) 66 857 354 | Email: info@dannydecor.com
                      </p>
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        Website: <a href="https://dannydecor.com" style="color: #D4AF37; text-decoration: none;">dannydecor.com</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email xác nhận liên hệ đã được gửi:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận liên hệ:', error);
    return { success: false, error: error.message };
  }
};

// Hàm gửi thông báo cho admin khi có liên hệ mới
const sendContactNotificationToAdmin = async (customerData) => {
  try {
    const { hoten, email, sdt, tieude, noidung } = customerData;
    
    const mailOptions = {
      from: {
        name: 'DANNYdecor System',
        address: process.env.EMAIL_USER || 'noreply@dannydecor.com'
      },
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Email admin
      subject: `Thông báo liên hệ mới từ khách hàng: ${tieude}`,
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thông báo liên hệ mới</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2C2C2C 0%, #3D3D3D 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="margin: 0; color: #D4AF37; font-size: 28px; font-weight: bold;">
                        🔔 Liên hệ mới từ khách hàng
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="background-color: #fff9e6; border-left: 4px solid #D4AF37; padding: 15px; margin: 0 0 25px 0; border-radius: 5px;">
                        <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0; font-weight: bold;">
                          ⚠️ Vui lòng phản hồi khách hàng trong vòng 2-4 giờ
                        </p>
                      </div>
                      
                      <h2 style="color: #2C2C2C; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                        Thông tin khách hàng:
                      </h2>
                      
                      <table width="100%" cellpadding="10" cellspacing="0" style="color: #666666; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                        <tr style="background-color: #f9f9f9;">
                          <td style="font-weight: bold; color: #333; width: 150px; border: 1px solid #e0e0e0;">👤 Họ tên:</td>
                          <td style="border: 1px solid #e0e0e0;">${hoten || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; color: #333; border: 1px solid #e0e0e0;">📧 Email:</td>
                          <td style="border: 1px solid #e0e0e0;">
                            <a href="mailto:${email}" style="color: #D4AF37; text-decoration: none;">${email}</a>
                          </td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                          <td style="font-weight: bold; color: #333; border: 1px solid #e0e0e0;">📱 Số điện thoại:</td>
                          <td style="border: 1px solid #e0e0e0;">
                            <a href="tel:${sdt}" style="color: #D4AF37; text-decoration: none;">${sdt || 'Không có'}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-weight: bold; color: #333; border: 1px solid #e0e0e0;">⏰ Thời gian:</td>
                          <td style="border: 1px solid #e0e0e0;">${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
                        </tr>
                      </table>
                      
                      <h2 style="color: #2C2C2C; font-size: 20px; margin: 0 0 15px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                        Nội dung liên hệ:
                      </h2>
                      
                      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #e0e0e0;">
                        <p style="color: #333; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                          📌 ${tieude || 'N/A'}
                        </p>
                        <p style="color: #666666; font-size: 15px; line-height: 1.8; margin: 0; white-space: pre-wrap;">
                          ${noidung || 'N/A'}
                        </p>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0 0 0;">
                        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(tieude || 'Liên hệ')}" 
                           style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); color: #2C2C2C; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);">
                          ✉️ Phản hồi ngay
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 2px solid #e0e0e0;">
                      <p style="color: #666666; font-size: 12px; margin: 0;">
                        Email tự động từ hệ thống quản lý DANNYdecor
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Thông báo liên hệ đã được gửi cho admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Lỗi khi gửi thông báo cho admin:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Gửi email xác nhận đơn hàng
 * @param {string} to - Email người nhận
 * @param {Object} orderData - Thông tin đơn hàng
 * @param {string} orderData.code - Mã đơn hàng
 * @param {string} orderData.id - ID đơn hàng
 * @param {number} orderData.tongtien_sau_giam - Tổng tiền
 * @param {string} orderData.phuongthucthanhtoan - Phương thức thanh toán
 * @param {string} orderData.trangthaithanhtoan - Trạng thái thanh toán
 * @param {Array} orderData.chitiet - Chi tiết đơn hàng
 */
const sendOrderConfirmationEmail = async (to, orderData) => {
  try {
    const { code, id, tongtien_sau_giam, phuongthucthanhtoan, trangthaithanhtoan, chitiet } = orderData;
    
    // Tạo HTML email với thông tin đơn hàng
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
    
    // Tạo danh sách sản phẩm
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
            <p>Cảm ơn bạn đã đặt hàng tại DANNYdecor! Đơn hàng của bạn đã được nhận và đang được xử lý.</p>
            
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
            <p>© 2024 DANNYdecor - Trang trí Nội thất. Tất cả các quyền được bảo lưu.</p>
            <p>Email hỗ trợ: info@dannydecor.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: {
        name: 'DANNYdecor - Trang trí Nội thất',
        address: process.env.EMAIL_USER || 'noreply@dannydecor.com'
      },
      to: to,
      subject: `Xác nhận đơn hàng #${code}`,
      html: html,
    });

    console.log('✅ Order confirmation email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Gửi email khi thanh toán thành công (email duy nhất, gửi 1 lần)
 * @param {string} to - Email người nhận
 * @param {Object} orderData - Thông tin đơn hàng
 * @param {string} orderData.code - Mã đơn hàng
 * @param {string} orderData.id - ID đơn hàng
 * @param {number} orderData.tongtien_sau_giam - Tổng tiền
 * @param {string} orderData.phuongthucthanhtoan - Phương thức thanh toán
 * @param {Array} orderData.chitiet - Chi tiết đơn hàng (tùy chọn)
 */
const sendPaymentSuccessEmail = async (to, orderData) => {
  try {
    const { code, id, tongtien_sau_giam, phuongthucthanhtoan, chitiet } = orderData;
    const paymentMethodLabels = {
      'cod': 'Thanh toán khi nhận hàng (COD)',
      'stripe': 'Thanh toán bằng thẻ (Stripe)',
      'banking': 'Chuyển khoản ngân hàng',
      'vnpay': 'VNPay',
      'momo': 'MoMo'
    };
    
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
            <p>© 2024 DANNYdecor - Trang trí Nội thất. Tất cả các quyền được bảo lưu.</p>
            <p>Email hỗ trợ: info@dannydecor.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: {
        name: 'DANNYdecor - Trang trí Nội thất',
        address: process.env.EMAIL_USER || 'noreply@dannydecor.com'
      },
      to: to,
      subject: `Thanh toán thành công - Đơn hàng #${code}`,
      html: html,
    });

    console.log('✅ Payment success email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending payment success email:', error);
    return { success: false, error: error.message };
  }
};

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
const sendOrderStatusUpdateEmail = async (to, orderData) => {
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
        messageContent = '<p>Đơn hàng của bạn đã được giao thành công! Cảm ơn bạn đã tin tưởng và mua sắm tại DANNYdecor. Chúng tôi rất mong nhận được phản hồi từ bạn.</p>';
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
            <p>© 2024 DANNYdecor - Trang trí Nội thất. Tất cả các quyền được bảo lưu.</p>
            <p>Email hỗ trợ: info@dannydecor.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: {
        name: 'DANNYdecor - Trang trí Nội thất',
        address: process.env.EMAIL_USER || 'noreply@dannydecor.com'
      },
      to: to,
      subject: `Cập nhật trạng thái đơn hàng #${code} - ${status.label}`,
      html: html,
    });

    console.log('✅ Order status update email sent to:', to, '- Status:', trangthai);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationEmail,
  sendPasswordResetEmail,
  sendContactConfirmationEmail,
  sendContactNotificationToAdmin,
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendOrderStatusUpdateEmail
};

