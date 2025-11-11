/**
 * Script để migrate bảng don_hang
 * Thêm các cột mới cho Stripe payment
 * 
 * Chạy: node scripts/migrate-donhang.js
 */

const { sequelize } = require('../database');

async function migrate() {
  try {
    console.log('🔄 Bắt đầu migration bảng don_hang...\n');

    // 1. Thêm cột magiamgia_code
    try {
      await sequelize.query(`
        ALTER TABLE don_hang 
        ADD COLUMN magiamgia_code VARCHAR(50) AFTER magiamgia_id
      `);
      console.log('✅ Thêm cột magiamgia_code thành công');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('⚠️  Cột magiamgia_code đã tồn tại');
      } else {
        throw err;
      }
    }

    // 2. Thêm cột phuongthucthanhtoan
    try {
      await sequelize.query(`
        ALTER TABLE don_hang 
        ADD COLUMN phuongthucthanhtoan ENUM('cod','stripe','vnpay','momo','banking') AFTER trangthaithanhtoan
      `);
      console.log('✅ Thêm cột phuongthucthanhtoan thành công');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('⚠️  Cột phuongthucthanhtoan đã tồn tại');
      } else {
        throw err;
      }
    }

    // 3. Thêm cột payment_intent_id
    try {
      await sequelize.query(`
        ALTER TABLE don_hang 
        ADD COLUMN payment_intent_id VARCHAR(255) AFTER phuongthucthanhtoan
      `);
      console.log('✅ Thêm cột payment_intent_id thành công');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('⚠️  Cột payment_intent_id đã tồn tại');
      } else {
        throw err;
      }
    }

    // 4. Thêm cột ngaythanhtoan
    try {
      await sequelize.query(`
        ALTER TABLE don_hang 
        ADD COLUMN ngaythanhtoan DATETIME AFTER payment_intent_id
      `);
      console.log('✅ Thêm cột ngaythanhtoan thành công');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('⚠️  Cột ngaythanhtoan đã tồn tại');
      } else {
        throw err;
      }
    }

    // 5. Đổi tên cột tongtien_saugiam -> tongtien_sau_giam
    try {
      // Kiểm tra xem cột nào tồn tại
      const [results] = await sequelize.query(`
        SHOW COLUMNS FROM don_hang LIKE 'tongtien%'
      `);
      
      const hasOldColumn = results.some(col => col.Field === 'tongtien_saugiam');
      const hasNewColumn = results.some(col => col.Field === 'tongtien_sau_giam');

      if (hasOldColumn && !hasNewColumn) {
        await sequelize.query(`
          ALTER TABLE don_hang 
          CHANGE COLUMN tongtien_saugiam tongtien_sau_giam DECIMAL(15, 2) DEFAULT 0
        `);
        console.log('✅ Đổi tên cột tongtien_saugiam -> tongtien_sau_giam thành công');
      } else if (hasNewColumn) {
        console.log('⚠️  Cột tongtien_sau_giam đã tồn tại');
      } else if (!hasOldColumn && !hasNewColumn) {
        // Tạo cột mới nếu chưa có
        await sequelize.query(`
          ALTER TABLE don_hang 
          ADD COLUMN tongtien_sau_giam DECIMAL(15, 2) DEFAULT 0 AFTER giamgia
        `);
        console.log('✅ Tạo cột tongtien_sau_giam thành công');
      }
    } catch (err) {
      console.error('❌ Lỗi khi xử lý cột tongtien_sau_giam:', err.message);
    }

    // 6. Thêm index
    try {
      await sequelize.query(`
        CREATE INDEX idx_payment_intent_id ON don_hang(payment_intent_id)
      `);
      console.log('✅ Thêm index idx_payment_intent_id thành công');
    } catch (err) {
      if (err.message.includes('Duplicate key')) {
        console.log('⚠️  Index idx_payment_intent_id đã tồn tại');
      } else {
        // Không báo lỗi nếu không tạo được index
        console.log('⚠️  Không thể tạo index:', err.message);
      }
    }

    console.log('\n🎉 Migration hoàn thành!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi migration:', error);
    process.exit(1);
  }
}

migrate();







