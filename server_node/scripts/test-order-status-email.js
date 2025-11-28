/**
 * TEST SCRIPT - Gửi email cập nhật trạng thái đơn hàng
 * 
 * Script này giúp test tính năng gửi email cập nhật trạng thái đơn hàng
 * 
 * Usage:
 *   node scripts/test-order-status-email.js <orderId> <status>
 * 
 * Example:
 *   node scripts/test-order-status-email.js abc123 confirmed
 */

require('dotenv').config();
const { sendOrderStatusUpdateEmail } = require('../routes/utils/email');

async function testOrderStatusEmail() {
  try {
    // Lấy tham số từ command line
    const orderId = process.argv[2];
    const status = process.argv[3] || 'confirmed';
    const testEmail = process.argv[4] || 'test@example.com';

    if (!orderId) {
      console.log('Usage: node scripts/test-order-status-email.js <orderId> <status> [email]');
      console.log('');
      console.log('Example:');
      console.log('  node scripts/test-order-status-email.js abc123 confirmed');
      console.log('  node scripts/test-order-status-email.js abc123 shipping customer@email.com');
      process.exit(1);
    }

    console.log('========================================');
    console.log('TEST GỬI EMAIL CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG');
    console.log('========================================\n');

    console.log('Thông tin test:');
    console.log(`- Order ID: ${orderId}`);
    console.log(`- Trạng thái mới: ${status}`);
    console.log(`- Email nhận: ${testEmail}\n`);

    // Dữ liệu test mẫu
    const testData = {
      code: orderId,
      trangthai: status,
      trangthai_cu: 'pending',
      tongtien_sau_giam: 1000000,
      chitiet: [
        {
          soluong: 2,
          gia: 500000,
          bienthe: {
            sanpham: {
              tensp: 'Bàn làm việc hiện đại'
            }
          }
        }
      ]
    };

    console.log('Đang gửi email...\n');

    // Gửi email test
    const result = await sendOrderStatusUpdateEmail(testEmail, testData);

    if (result) {
      console.log('✅ Email đã được gửi thành công!');
      console.log(`📧 Email đã gửi đến: ${testEmail}`);
      console.log(`📦 Mã đơn hàng: ${orderId}`);
      console.log(`🔄 Trạng thái: ${status}`);
    } else {
      console.log('❌ Gửi email thất bại. Kiểm tra console log để biết chi tiết lỗi.');
      process.exit(1);
    }

    console.log('\n========================================');
    console.log('Kiểm tra hộp thư của bạn để xem email!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Lỗi khi test:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Chạy test
testOrderStatusEmail();

