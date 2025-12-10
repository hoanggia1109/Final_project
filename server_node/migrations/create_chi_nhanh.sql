-- Tạo bảng chi_nhanh
CREATE TABLE IF NOT EXISTS `chi_nhanh` (
  `id` CHAR(36) PRIMARY KEY,
  `tenchinhanh` VARCHAR(255) NOT NULL,
  `diachi` TEXT NOT NULL,
  `quan` VARCHAR(100) NOT NULL,
  `thanhpho` VARCHAR(100) NOT NULL,
  `sdt` VARCHAR(20) NOT NULL,
  `email` VARCHAR(255) NULL,
  `giomocua` VARCHAR(10) NULL,
  `giodongcua` VARCHAR(10) NULL,
  `giomocua_cn` VARCHAR(10) NULL,
  `giodongcua_cn` VARCHAR(10) NULL,
  `hinhanh` VARCHAR(500) NULL,
  `mapurl` TEXT NULL,
  `thutu` INT DEFAULT 0,
  `anhien` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo index cho các trường thường dùng
CREATE INDEX `idx_anhien` ON `chi_nhanh` (`anhien`);
CREATE INDEX `idx_thutu` ON `chi_nhanh` (`thutu`);
CREATE INDEX `idx_thanhpho` ON `chi_nhanh` (`thanhpho`);

-- Thêm dữ liệu mẫu cho chi nhánh
INSERT INTO `chi_nhanh` (
  `id`,
  `tenchinhanh`,
  `diachi`,
  `quan`,
  `thanhpho`,
  `sdt`,
  `email`,
  `giomocua`,
  `giodongcua`,
  `giomocua_cn`,
  `giodongcua_cn`,
  `hinhanh`,
  `mapurl`,
  `thutu`,
  `anhien`,
  `created_at`,
  `updated_at`
) VALUES
(
  UUID(),
  'DANNYdecor - Showroom Quận 1',
  '123 Đường Nguyễn Huệ, Phường Bến Nghé',
  'Quận 1',
  'TP. Hồ Chí Minh',
  '0909 123 456',
  'quan1@dannydecor.com',
  '08:00',
  '21:00',
  '09:00',
  '20:00',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890!2d106.7000000!3d10.7769000',
  1,
  1,
  NOW(),
  NOW()
),
(
  UUID(),
  'DANNYdecor - Showroom Quận 7',
  '456 Đường Nguyễn Thị Thập, Phường Tân Phú',
  'Quận 7',
  'TP. Hồ Chí Minh',
  '0909 123 457',
  'quan7@dannydecor.com',
  '08:00',
  '21:00',
  '09:00',
  '20:00',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890!2d106.7200000!3d10.7300000',
  2,
  1,
  NOW(),
  NOW()
),
(
  UUID(),
  'DANNYdecor - Showroom Thủ Đức',
  '789 Đường Võ Văn Ngân, Phường Linh Chiểu',
  'Thủ Đức',
  'TP. Hồ Chí Minh',
  '0909 123 458',
  'thuduc@dannydecor.com',
  '08:00',
  '20:00',
  '09:00',
  '19:00',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890!2d106.7500000!3d10.8500000',
  3,
  1,
  NOW(),
  NOW()
),
(
  UUID(),
  'DANNYdecor - Showroom Hà Nội',
  '321 Đường Láng, Phường Láng Thượng',
  'Đống Đa',
  'Hà Nội',
  '0909 123 459',
  'hanoi@dannydecor.com',
  '08:00',
  '20:00',
  '09:00',
  '19:00',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1234567890!2d105.8000000!3d21.0300000',
  4,
  1,
  NOW(),
  NOW()
);

