-- Script tạo bảng yeu_thich nếu chưa có

USE shopnoithat;

-- Xóa bảng cũ nếu có (để tạo lại từ đầu)
-- DROP TABLE IF EXISTS yeu_thich;

-- Tạo bảng yeu_thich
CREATE TABLE IF NOT EXISTS yeu_thich (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  sanpham_id CHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_wishlist (user_id, sanpham_id),
  INDEX idx_user_id (user_id),
  INDEX idx_sanpham_id (sanpham_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kiểm tra đã tạo thành công
SELECT 'Checking if table was created...' as Status;
SHOW TABLES LIKE 'yeu_thich';

-- Xem cấu trúc bảng
SELECT 'Table structure:' as Info;
DESCRIBE yeu_thich;

-- Thêm một số dữ liệu test (nếu muốn)
/*
INSERT INTO yeu_thich (id, user_id, sanpham_id) VALUES
('test-wish-001', 'your-user-id-here', 'your-product-id-here');
*/

SELECT '✅ Table yeu_thich created successfully!' as Result;

