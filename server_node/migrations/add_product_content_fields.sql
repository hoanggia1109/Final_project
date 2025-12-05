-- Migration: Thêm các trường nội dung quan trọng cho sản phẩm
-- Mô tả chi tiết, Đặc điểm nổi bật, Thông số kỹ thuật

ALTER TABLE `san_pham`
ADD COLUMN IF NOT EXISTS `mota_chitiet` TEXT NULL COMMENT 'Mô tả chi tiết sản phẩm' AFTER `mota`,
ADD COLUMN IF NOT EXISTS `dacdiem_noibat` TEXT NULL COMMENT 'Đặc điểm nổi bật (JSON array)' AFTER `mota_chitiet`,
ADD COLUMN IF NOT EXISTS `thongsokythuat` TEXT NULL COMMENT 'Thông số kỹ thuật (JSON object)' AFTER `dacdiem_noibat`;

-- Nếu MySQL không hỗ trợ IF NOT EXISTS, dùng cách này:
-- ALTER TABLE `san_pham`
-- ADD COLUMN `mota_chitiet` TEXT NULL COMMENT 'Mô tả chi tiết sản phẩm' AFTER `mota`,
-- ADD COLUMN `dacdiem_noibat` TEXT NULL COMMENT 'Đặc điểm nổi bật (JSON array)' AFTER `mota_chitiet`,
-- ADD COLUMN `thongsokythuat` TEXT NULL COMMENT 'Thông số kỹ thuật (JSON object)' AFTER `dacdiem_noibat`;
