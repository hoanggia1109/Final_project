-- Migration: Thêm cột chitiet_donhang_id vào bảng danh_gia
-- Chạy script này nếu bảng danh_gia chưa có cột chitiet_donhang_id

-- Kiểm tra và thêm cột nếu chưa tồn tại
ALTER TABLE `danh_gia` 
ADD COLUMN IF NOT EXISTS `chitiet_donhang_id` CHAR(36) NULL AFTER `user_id`;

-- Thêm index để tối ưu query
ALTER TABLE `danh_gia`
ADD INDEX IF NOT EXISTS `idx_chitiet_donhang_id` (`chitiet_donhang_id`);

-- Thêm foreign key constraint (nếu cần)
-- ALTER TABLE `danh_gia`
-- ADD CONSTRAINT `fk_danhgia_chitiet_donhang` 
-- FOREIGN KEY (`chitiet_donhang_id`) REFERENCES `chitiet_donhang` (`id`) 
-- ON DELETE SET NULL ON UPDATE CASCADE;    

