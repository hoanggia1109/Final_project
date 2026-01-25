/**
 * Script thêm các cột còn thiếu vào bảng don_hang
 */

const { sequelize } = require('../database');

async function addMissingColumns() {
  try {
    console.log('🔄 Thêm các cột còn thiếu...\n');

    // Thêm cột giamgia (giảm giá)
    try {
      await sequelize.query(`
        ALTER TABLE don_hang 
        ADD COLUMN giamgia DECIMAL(15, 2) DEFAULT 0 AFTER tongtien
      `);
      console.log('✅ Thêm cột giamgia thành công');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('⚠️  Cột giamgia đã tồn tại');
      } else {
        console.error('❌ Lỗi:', err.message);
      }
    }

    // Thêm cột tongtien_sau_giam
    try {
      await sequelize.query(`
        ALTER TABLE don_hang 
        ADD COLUMN tongtien_sau_giam DECIMAL(15, 2) DEFAULT 0 AFTER giamgia
      `);
      console.log('✅ Thêm cột tongtien_sau_giam thành công');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('⚠️  Cột tongtien_sau_giam đã tồn tại');
      } else {
        console.error('❌ Lỗi:', err.message);
      }
    }

    console.log('\n🎉 Hoàn thành!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi:', error);
    process.exit(1);
  }
}

addMissingColumns();





























