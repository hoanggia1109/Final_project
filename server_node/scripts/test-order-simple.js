/**
 * Script test đơn giản - tạo đơn hàng test
 */

const { sequelize, DonHangModel, UserModel } = require('../database');

async function test() {
  try {
    console.log('🧪 Test tạo đơn hàng đơn giản...\n');

    // Lấy user đầu tiên
    const user = await UserModel.findOne();
    if (!user) {
      console.error('❌ Không có user trong database');
      process.exit(1);
    }

    console.log('✅ User:', user.email);

    // Test tạo đơn hàng
    const { v4: uuidv4 } = require('uuid');
    
    const orderData = {
      id: uuidv4(),
      code: 'TEST_' + Date.now(),
      user_id: user.id,
      tongtien: 1000000,
      giamgia: 0,
      tongtien_sau_giam: 1100000,
      phi_van_chuyen: 100000,
      magiamgia_code: null,
      trangthai: 'pending',
      trangthaithanhtoan: 'pending',
      phuongthucthanhtoan: 'cod',
      ghichu: 'Test order'
    };

    console.log('\n📝 Dữ liệu đơn hàng:', orderData);

    try {
      const order = await DonHangModel.create(orderData);
      console.log('\n✅ Tạo đơn hàng thành công!');
      console.log('   ID:', order.id);
      console.log('   Code:', order.code);

      // Xóa đơn test
      await DonHangModel.destroy({ where: { id: order.id } });
      console.log('\n🧹 Đã xóa đơn test');
      console.log('\n🎉 TEST THÀNH CÔNG!\n');
      
    } catch (err) {
      console.error('\n❌ LỖI KHI TẠO ĐƠN HÀNG:');
      console.error('Message:', err.message);
      
      if (err.original) {
        console.error('\nSQL Error:', err.original.sqlMessage);
        console.error('SQL State:', err.original.sqlState);
        console.error('Error Code:', err.original.code);
        
        if (err.original.sql) {
          console.error('\nSQL Query:', err.original.sql);
        }
      }
      
      if (err.errors) {
        console.error('\nValidation Errors:');
        err.errors.forEach(e => {
          console.error(`  - ${e.path}: ${e.message}`);
        });
      }
      
      process.exit(1);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Lỗi:', error);
    process.exit(1);
  }
}

test();

