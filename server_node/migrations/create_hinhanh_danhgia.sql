-- Migration: Tạo bảng hinhanh_danhgia cho review images
-- Chạy script này nếu bảng hinhanh_danhgia chưa tồn tại

CREATE TABLE IF NOT EXISTS `hinhanh_danhgia` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `danhgia_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hinhanh_danhgia` (`danhgia_id`),
  CONSTRAINT `fk_hinhanh_danhgia` FOREIGN KEY (`danhgia_id`) REFERENCES `danh_gia` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

