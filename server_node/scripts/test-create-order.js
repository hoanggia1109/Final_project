/**
 * Script test tạo đơn hàng
 * 
 * Chạy: node scripts/test-create-order.js
 */

const { 
  sequelize,
  UserModel,
  GioHangModel,
  SanPhamBienTheModel,
  SanPhamModel,
  DonHangModel
} = require('../database');

async function testCreateOrder() {
  try {
    console.log('🧪 Bắt đầu test tạo đơn hàng...\n');

    // 1. Tìm một user để test (lấy user đầu tiên)
    const user = await UserModel.findOne();
    if (!user) {
      console.error('❌ Không tìm thấy user nào trong database!');
      console.log('💡 Vui lòng đăng ký một tài khoản trước');
      process.exit(1);
    }

    console.log('✅ Tìm thấy user:', user.email);
    console.log('   User ID:', user.id);

    // 2. Kiểm tra giỏ hàng của user
    const cartItems = await GioHangModel.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: SanPhamBienTheModel,
          as: 'bienthe',
          include: [{ model: SanPhamModel, as: 'sanpham' }]
        }
      ]
    });

    console.log('\n📦 Giỏ hàng của user:');
    if (cartItems.length === 0) {
      console.log('   ⚠️  Giỏ hàng trống!');
      console.log('   💡 Vui lòng thêm sản phẩm vào giỏ hàng trước khi test');
      process.exit(1);
    }

    cartItems.forEach(item => {
      const productName = item.bienthe?.sanpham?.tensp || 'N/A';
      const price = item.bienthe?.gia || 0;
      const quantity = item.soluong || 0;
      console.log(`   - ${productName}: ${quantity} x ${price.toLocaleString('vi-VN')}₫`);
    });

    // 3. Tính tổng tiền
    let total = 0;
    for (const item of cartItems) {
      total += Number(item.bienthe?.gia || 0) * Number(item.soluong || 0);
    }

    console.log('\n💰 Tổng tiền hàng:', total.toLocaleString('vi-VN'), '₫');

    // 4. Kiểm tra cấu trúc bảng don_hang
    console.log('\n🔍 Kiểm tra cấu trúc bảng don_hang...');
    const [columns] = await sequelize.query('SHOW COLUMNS FROM don_hang');
    
    const requiredColumns = [
      'tongtien',
      'giamgia',
      'tongtien_sau_giam',
      'phi_van_chuyen',
      'magiamgia_code',
      'phuongthucthanhtoan'
    ];

    let missingColumns = [];
    requiredColumns.forEach(col => {
      const exists = columns.some(c => c.Field === col);
      if (exists) {
        console.log(`   ✅ ${col}`);
      } else {
        console.log(`   ❌ ${col} - THIẾU!`);
        missingColumns.push(col);
      }
    });

    if (missingColumns.length > 0) {
      console.error('\n❌ Thiếu các cột:', missingColumns.join(', '));
      console.log('💡 Chạy: node scripts/add-missing-columns.js');
      process.exit(1);
    }

    // 5. Test tạo đơn hàng
    console.log('\n🚀 Test tạo đơn hàng...');
    
    const { v4: uuidv4 } = require('uuid');
    const phiVanChuyen = 100000;
    const tongSauGiam = total + phiVanChuyen;

    try {
      const order = await DonHangModel.create({
        id: uuidv4(),
        code: 'TEST_OD' + Date.now(),
        user_id: user.id,
        tongtien: total,
        giamgia: 0,
        tongtien_sau_giam: tongSauGiam,
        phi_van_chuyen: phiVanChuyen,
        magiamgia_id: null,
        magiamgia_code: null,
        diachi_id: null,
        ghichu: 'Test order',
        trangthai: 'pending',
        trangthaithanhtoan: 'pending',
        phuongthucthanhtoan: 'cod',
      });

      console.log('✅ Tạo đơn hàng thành công!');
      console.log('   Order ID:', order.id);
      console.log('   Order Code:', order.code);
      console.log('   Tổng tiền:', order.tongtien_sau_giam);

      // Xóa đơn hàng test
      await DonHangModel.destroy({ where: { id: order.id } });
      console.log('\n🧹 Đã xóa đơn hàng test');

    } catch (error) {
      console.error('\n❌ Lỗi khi tạo đơn hàng:');
      console.error('   Message:', error.message);
      
      if (error.original) {
        console.error('   SQL Error:', error.original.sqlMessage);
        console.error('   SQL:', error.original.sql);
      }
      
      process.exit(1);
    }

    console.log('\n🎉 Test hoàn thành thành công!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Lỗi test:', error);
    process.exit(1);
  }
}

testCreateOrder();







