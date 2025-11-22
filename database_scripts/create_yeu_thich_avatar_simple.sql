-- Thêm cột avatar vào bảng nguoi_dung (nếu chưa có)
ALTER TABLE nguoi_dung 
ADD COLUMN avatar VARCHAR(255) NULL AFTER sdt;

-- Tạo bảng yeu_thich (wishlist)
CREATE TABLE yeu_thich (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  sanpham_id CHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_wishlist (user_id, sanpham_id),
  INDEX idx_user_id (user_id),
  INDEX idx_sanpham_id (sanpham_id),
  CONSTRAINT fk_yeuthich_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
  CONSTRAINT fk_yeuthich_sanpham FOREIGN KEY (sanpham_id) REFERENCES san_pham(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

