// Script để kiểm tra và thêm cột chitiet_donhang_id vào bảng danh_gia
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAndAddColumn() {
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
      AND TABLE_NAME = 'danh_gia' 
      AND COLUMN_NAME = 'chitiet_donhang_id'
    `, [process.env.DB_NAME || 'shopnoithat']);

    if (columns.length > 0) {
      console.log('✅ Cột chitiet_donhang_id đã tồn tại trong bảng danh_gia');
      return;
    }

    console.log('⚠️  Cột chitiet_donhang_id chưa tồn tại. Đang thêm...');

    // Thêm cột
    await connection.execute(`
      ALTER TABLE \`danh_gia\` 
      ADD COLUMN \`chitiet_donhang_id\` CHAR(36) NULL AFTER \`user_id\`
    `);

    console.log('✅ Đã thêm cột chitiet_donhang_id');

    // Thêm index
    try {
      await connection.execute(`
        ALTER TABLE \`danh_gia\`
        ADD INDEX \`idx_chitiet_donhang_id\` (\`chitiet_donhang_id\`)
      `);
      console.log('✅ Đã thêm index cho chitiet_donhang_id');
    } catch (err) {
      if (err.message.includes('Duplicate key name')) {
        console.log('ℹ️  Index đã tồn tại');
      } else {
        throw err;
      }
    }

    console.log('✅ Hoàn tất!');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkAndAddColumn();









