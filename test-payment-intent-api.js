/**
 * Test trực tiếp API tạo payment intent
 * Để xem lỗi cụ thể từ backend
 */

const fetch = require('node-fetch');

async function testPaymentIntent() {
  console.log('🧪 TEST STRIPE PAYMENT INTENT API\n');
  
  // Bước 1: Lấy token (cần user thật)
  console.log('Vui lòng cung cấp:');
  console.log('1. Token (từ localStorage)');
  console.log('2. Order ID (một đơn hàng bất kỳ)\n');
  
  // Giả sử có token và order ID
  const token = process.argv[2];
  const orderId = process.argv[3];
  
  if (!token || !orderId) {
    console.log('❌ Thiếu tham số!');
    console.log('\nCách dùng:');
    console.log('node test-payment-intent-api.js <TOKEN> <ORDER_ID>\n');
    console.log('Lấy token:');
    console.log('  1. Mở Console (F12)');
    console.log('  2. Gõ: localStorage.getItem("token")');
    console.log('  3. Copy token\n');
    console.log('Lấy order ID:');
    console.log('  1. Vào http://localhost:3000/orders');
    console.log('  2. Click vào đơn hàng');
    console.log('  3. Copy ID từ URL\n');
    process.exit(1);
  }
  
  console.log('📤 Gửi request tới backend...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/thanhtoan/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ donhang_id: orderId }),
    });
    
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Status Text:', response.statusText);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ THÀNH CÔNG!');
      console.log('Client Secret:', data.clientSecret?.substring(0, 30) + '...');
      console.log('Payment Intent ID:', data.paymentIntentId);
    } else {
      console.log('\n❌ LỖI TỪ SERVER:');
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ LỖI KẾT NỐI:');
    console.error(error.message);
    console.log('\n💡 Kiểm tra:');
    console.log('  - Backend có chạy không? (http://localhost:5000/api/sanpham)');
  }
}

testPaymentIntent();






