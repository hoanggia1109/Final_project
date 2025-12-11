const mysql = require('mysql2/promise');
require('dotenv').config();

async function createHinhanhDanhgiaTable() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopnoithat',
    });

    console.log('✅ Đã kết nối database');

    // Kiểm tra xem bảng đã tồn tại chưa
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'hinhanh_danhgia'
    `, [process.env.DB_NAME || 'shopnoithat']);

    if (tables.length > 0) {
      console.log('✅ Bảng hinhanh_danhgia đã tồn tại');
      return;
    }

    console.log('⏳ Đang tạo bảng hinhanh_danhgia...');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`hinhanh_danhgia\` (
        \`id\` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`danhgia_id\` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`url\` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`fk_hinhanh_danhgia\` (\`danhgia_id\`),
        CONSTRAINT \`fk_hinhanh_danhgia\` FOREIGN KEY (\`danhgia_id\`) REFERENCES \`danh_gia\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('🎉 Đã tạo bảng hinhanh_danhgia thành công!');

  } catch (error) {
    console.error('❌ Lỗi khi tạo bảng hinhanh_danhgia:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Đã đóng kết nối database');
    }
  }
}

createHinhanhDanhgiaTable();



















