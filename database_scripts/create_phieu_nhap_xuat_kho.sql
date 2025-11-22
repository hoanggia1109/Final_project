-- Tạo bảng phiếu nhập xuất kho
CREATE TABLE IF NOT EXISTS phieu_nhap_xuat_kho (
  id CHAR(36) PRIMARY KEY,
  bienthe_id CHAR(36) NOT NULL,
  loai ENUM('nhap', 'xuat') NOT NULL,
  soluong INT NOT NULL,
  soluong_truoc INT DEFAULT 0,
  soluong_sau INT DEFAULT 0,
  lydo VARCHAR(500),
  nguoi_thuc_hien CHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bienthe_id) REFERENCES sanpham_bienthe(id) ON DELETE CASCADE,
  FOREIGN KEY (nguoi_thuc_hien) REFERENCES nguoi_dung(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo index để tăng tốc độ truy vấn
CREATE INDEX idx_bienthe_id ON phieu_nhap_xuat_kho(bienthe_id);
CREATE INDEX idx_loai ON phieu_nhap_xuat_kho(loai);
CREATE INDEX idx_created_at ON phieu_nhap_xuat_kho(created_at);

