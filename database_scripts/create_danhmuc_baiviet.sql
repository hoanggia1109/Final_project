-- Tạo bảng Danh mục Bài viết
CREATE TABLE IF NOT EXISTS danhmuc_baiviet (
  id CHAR(36) PRIMARY KEY,
  tendanhmuc VARCHAR(255) NOT NULL,
  mota TEXT,
  anhien TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm một số dữ liệu mẫu (optional)
INSERT INTO danhmuc_baiviet (id, tendanhmuc, mota, anhien) VALUES
(UUID(), 'Tin tức', 'Tin tức và sự kiện mới nhất của công ty', 1),
(UUID(), 'Khuyến mãi', 'Các chương trình khuyến mãi đặc biệt', 1),
(UUID(), 'Hướng dẫn', 'Hướng dẫn sử dụng sản phẩm', 1),
(UUID(), 'Kiến thức', 'Kiến thức về nội thất và thiết kế', 1);


