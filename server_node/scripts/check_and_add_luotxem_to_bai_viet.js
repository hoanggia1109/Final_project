/**
 * Script kiểm tra và thêm cột luotxem vào bảng bai_viet
 * Chạy: node scripts/check_and_add_luotxem_to_bai_viet.js
 * Hoặc: npm run migrate:views
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAndAddLuotxem() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopnoithat',
    });

    console.log('✅ Đã kết nối database');

    // Kiểm tra xem cột đã tồn tại chưa
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'bai_viet' 
      AND COLUMN_NAME = 'luotxem'
    `, [process.env.DB_NAME || 'shopnoithat']);

    if (columns.length > 0) {
      console.log('✅ Cột luotxem đã tồn tại trong bảng bai_viet');
      return;
    }

    console.log('📝 Cột luotxem chưa tồn tại, đang thêm...');

    // Thêm cột luotxem
    await connection.execute(`
      ALTER TABLE \`bai_viet\` 
      ADD COLUMN \`luotxem\` INT(11) DEFAULT 0 AFTER \`hinh_anh\`
    `);

    console.log('✅ Đã thêm cột luotxem vào bảng bai_viet thành công!');

    // Kiểm tra lại
    const [verify] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'bai_viet' 
      AND COLUMN_NAME = 'luotxem'
    `, [process.env.DB_NAME || 'shopnoithat']);

    if (verify.length > 0) {
      console.log('✅ Xác nhận: Cột luotxem đã được thêm thành công');
      console.log(`   - Kiểu dữ liệu: ${verify[0].DATA_TYPE}`);
      console.log(`   - Giá trị mặc định: ${verify[0].COLUMN_DEFAULT}`);
    }

  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  Cột luotxem đã tồn tại (có thể đã được thêm trước đó)');
    } else {
      console.error('❌ Lỗi khi thêm cột luotxem:', error.message);
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Chạy script
checkAndAddLuotxem()
  .then(() => {
    console.log('✨ Hoàn thành!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Lỗi:', error);
    process.exit(1);
  });

