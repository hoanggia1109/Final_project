-- Migration: Thêm cột ly_do_huy vào bảng don_hang

-- Cột này dùng để lưu lý do hủy đơn hàng (khi đơn hàng bị hủy)



-- Kiểm tra xem cột đã tồn tại chưa, nếu chưa thì thêm vào

SET @dbname = DATABASE();

SET @tablename = 'don_hang';

SET @columnname = 'ly_do_huy';

SET @preparedStatement = (SELECT IF(

  (

    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS

    WHERE

      (table_name = @tablename)

      AND (table_schema = @dbname)

      AND (column_name = @columnname)

  ) > 0,

  'SELECT "Column already exists, skipping..." AS status;',

  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT NULL AFTER trangthai;')

));

PREPARE alterIfNotExists FROM @preparedStatement;

EXECUTE alterIfNotExists;

DEALLOCATE PREPARE alterIfNotExists;



-- Hoàn thành migration

SELECT 'Migration completed successfully! Cột ly_do_huy đã được thêm vào bảng don_hang.' AS status;

