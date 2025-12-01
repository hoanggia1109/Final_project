/**
 * Script để chạy migration SQL
 * 
 * Usage: node scripts/run-migration.js <migration-file>
 * Example: node scripts/run-migration.js migrations/add_ly_do_huy_to_donhang.sql
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration(migrationFile) {
  try {
    // Đọc file migration
    const migrationPath = path.join(__dirname, '..', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ File migration không tồn tại: ${migrationPath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`📄 Đang chạy migration: ${migrationFile}`);
    console.log('─'.repeat(50));

    // Kết nối database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopnoithat',
      multipleStatements: true, // Cho phép chạy nhiều câu lệnh SQL
    });

    console.log('✅ Đã kết nối database');

    // Chạy migration
    const [results] = await connection.query(sql);
    
    console.log('✅ Migration đã chạy thành công!');
    console.log('─'.repeat(50));
    
    // Hiển thị kết quả
    if (Array.isArray(results)) {
      results.forEach((result, index) => {
        if (result.status) {
          console.log(`📊 Kết quả ${index + 1}:`, result.status);
        }
      });
    }

    await connection.end();
    console.log('✅ Đã đóng kết nối database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi chạy migration:', error.message);
    if (error.sql) {
      console.error('SQL:', error.sql);
    }
    process.exit(1);
  }
}

// Lấy tên file migration từ command line
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Vui lòng cung cấp tên file migration');
  console.log('Usage: node scripts/run-migration.js <migration-file>');
  console.log('Example: node scripts/run-migration.js migrations/add_ly_do_huy_to_donhang.sql');
  process.exit(1);
}

runMigration(migrationFile);

