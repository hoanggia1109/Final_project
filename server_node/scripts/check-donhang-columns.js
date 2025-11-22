/**
 * Script kiểm tra các cột trong bảng don_hang
 */

const { sequelize } = require('../database');

async function checkColumns() {
  try {
    const [results] = await sequelize.query(`
      SHOW COLUMNS FROM don_hang
    `);

    console.log('\n📋 Các cột trong bảng don_hang:\n');
    results.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    console.log('\n✅ Kiểm tra hoàn tất!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkColumns();
























