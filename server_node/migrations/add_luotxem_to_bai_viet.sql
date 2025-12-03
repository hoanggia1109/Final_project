-- Migration: Thêm cột luotxem vào bảng bai_viet
-- Date: 2025-01-XX
-- Description: Thêm cột lượt xem cho bài viết để theo dõi số lượt xem
-- 
-- CÁCH CHẠY:
-- 1. Mở MySQL/MariaDB command line hoặc phpMyAdmin
-- 2. Chọn database: USE shopnoithat;
-- 3. Chạy script này
--
-- LƯU Ý: Nếu cột đã tồn tại, script sẽ báo lỗi. Có thể bỏ qua lỗi đó.

-- Kiểm tra và thêm cột luotxem vào bảng bai_viet
-- Nếu cột đã tồn tại, sẽ báo lỗi nhưng không ảnh hưởng đến database

ALTER TABLE `bai_viet` 
ADD COLUMN `luotxem` INT(11) DEFAULT 0 AFTER `hinh_anh`;

-- Thêm index để tối ưu truy vấn (optional, có thể comment nếu không cần)
-- ALTER TABLE `bai_viet` ADD INDEX `idx_luotxem` (`luotxem`);

-- Kiểm tra kết quả
-- SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = DATABASE() 
--   AND TABLE_NAME = 'bai_viet' 
--   AND COLUMN_NAME = 'luotxem';

