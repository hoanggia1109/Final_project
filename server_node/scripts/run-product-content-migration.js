const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopnoithat',
      multipleStatements: true
    });

    console.log('✅ Đã kết nối database');

    // Đọc file migration
    const fs = require('fs');
    const path = require('path');
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../migrations/add_product_content_fields.sql'),
      'utf8'
    );

    // Chạy migration (bỏ qua IF NOT EXISTS vì MySQL không hỗ trợ)
    const sql = `
      -- Kiểm tra và thêm cột mota_chitiet
      SET @dbname = DATABASE();
      SET @tablename = 'san_pham';
      SET @columnname = 'mota_chitiet';
      SET @preparedStatement = (SELECT IF(
        (
          SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
          WHERE
            (table_name = @tablename)
            AND (table_schema = @dbname)
            AND (column_name = @columnname)
        ) > 0,
        'SELECT 1',
        CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT NULL COMMENT "Mô tả chi tiết sản phẩm" AFTER mota')
      ));
      PREPARE alterIfNotExists FROM @preparedStatement;
      EXECUTE alterIfNotExists;
      DEALLOCATE PREPARE alterIfNotExists;

      -- Kiểm tra và thêm cột dacdiem_noibat
      SET @columnname = 'dacdiem_noibat';
      SET @preparedStatement = (SELECT IF(
        (
          SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
          WHERE
            (table_name = @tablename)
            AND (table_schema = @dbname)
            AND (column_name = @columnname)
        ) > 0,
        'SELECT 1',
        CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT NULL COMMENT "Đặc điểm nổi bật (JSON array)" AFTER mota_chitiet')
      ));
      PREPARE alterIfNotExists FROM @preparedStatement;
      EXECUTE alterIfNotExists;
      DEALLOCATE PREPARE alterIfNotExists;

      -- Kiểm tra và thêm cột thongsokythuat
      SET @columnname = 'thongsokythuat';
      SET @preparedStatement = (SELECT IF(
        (
          SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
          WHERE
            (table_name = @tablename)
            AND (table_schema = @dbname)
            AND (column_name = @columnname)
        ) > 0,
        'SELECT 1',
        CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT NULL COMMENT "Thông số kỹ thuật (JSON object)" AFTER dacdiem_noibat')
      ));
      PREPARE alterIfNotExists FROM @preparedStatement;
      EXECUTE alterIfNotExists;
      DEALLOCATE PREPARE alterIfNotExists;
    `;

    await connection.query(sql);
    console.log('✅ Migration đã chạy thành công!');
    console.log('✅ Đã thêm các trường: mota_chitiet, dacdiem_noibat, thongsokythuat');

  } catch (error) {
    console.error('❌ Lỗi khi chạy migration:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();


