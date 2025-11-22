/**
 * Script để sửa lỗi "unknown column avt in field list"
 * Kiểm tra và đổi tên cột từ avt -> avatar nếu cần
 */

const { sequelize } = require('../database');

async function fixAvatarColumn() {
  try {
    console.log('🔍 Kiểm tra cấu trúc bảng nguoi_dung...\n');

    // Kiểm tra các cột liên quan đến avatar
    const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM nguoi_dung WHERE Field LIKE '%av%'
    `);

    console.log('📋 Các cột liên quan đến avatar:', columns);

    const hasAvt = columns.some(col => col.Field === 'avt');
    const hasAvatar = columns.some(col => col.Field === 'avatar');

    if (hasAvt && !hasAvatar) {
      console.log('\n🔧 Tìm thấy cột "avt" nhưng không có "avatar"');
      console.log('   Đang đổi tên cột avt -> avatar...');

      await sequelize.query(`
        ALTER TABLE nguoi_dung 
        CHANGE COLUMN avt avatar VARCHAR(255) NULL
      `);

      console.log('✅ Đổi tên cột thành công!');
    } else if (!hasAvt && !hasAvatar) {
      console.log('\n➕ Không tìm thấy cột avatar/avt');
      console.log('   Đang tạo cột avatar mới...');

      await sequelize.query(`
        ALTER TABLE nguoi_dung 
        ADD COLUMN avatar VARCHAR(255) NULL AFTER sdt
      `);

      console.log('✅ Tạo cột avatar thành công!');
    } else if (hasAvatar) {
      console.log('\n✅ Cột "avatar" đã tồn tại, không cần sửa');
    } else {
      console.log('\n⚠️  Có cả "avt" và "avatar", cần kiểm tra lại');
    }

    // Kiểm tra lại sau khi sửa
    const [finalColumns] = await sequelize.query(`
      SHOW COLUMNS FROM nguoi_dung WHERE Field = 'avatar'
    `);

    if (finalColumns.length > 0) {
      console.log('\n✅ Kết quả cuối cùng:');
      console.log('   ', finalColumns[0]);
    }

    console.log('\n✅ Hoàn thành!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    console.error('   Stack:', err.stack);
    process.exit(1);
  }
}

fixAvatarColumn();

