-- ========================================
-- SCRIPT KIỂM TRA VÀ TẠO DỮ LIỆU TEST CHO TỒN KHO
-- ========================================

-- Bước 1: Kiểm tra số lượng biến thể hiện có
SELECT 
  'So luong bien the hien co:' as thong_tin,
  COUNT(*) as so_luong 
FROM sanpham_bienthe;

-- Bước 2: Xem danh sách biến thể (nếu có)
SELECT 
  bt.id,
  bt.code,
  sp.tensp as ten_san_pham,
  bt.mausac,
  bt.kichthuoc,
  bt.chatlieu,
  bt.gia,
  bt.sl_tonkho
FROM sanpham_bienthe bt
LEFT JOIN san_pham sp ON bt.sanpham_id = sp.id
ORDER BY bt.created_at DESC
LIMIT 10;

-- Bước 3: Kiểm tra có sản phẩm nào không
SELECT 
  'So luong san pham:' as thong_tin,
  COUNT(*) as so_luong 
FROM san_pham;

-- Bước 4: Lấy 5 sản phẩm đầu tiên để tham khảo
SELECT 
  id,
  code,
  tensp,
  anhien
FROM san_pham
WHERE anhien = 1
LIMIT 5;

-- ========================================
-- NẾU KHÔNG CÓ BIẾN THỂ, HÃY THÊM DỮ LIỆU TEST
-- (Bỏ comment các dòng dưới đây và thay YOUR_PRODUCT_ID)
-- ========================================

/*
-- Lấy ID sản phẩm đầu tiên
SET @product_id = (SELECT id FROM san_pham LIMIT 1);

-- Thêm biến thể test
INSERT INTO sanpham_bienthe (id, sanpham_id, mausac, kichthuoc, chatlieu, gia, code, sl_tonkho) 
VALUES 
(UUID(), @product_id, 'Đỏ', 'L', 'Gỗ Sồi', 5000000, 'BT001', 100),
(UUID(), @product_id, 'Xanh', 'M', 'Gỗ Sồi', 4500000, 'BT002', 50),
(UUID(), @product_id, 'Vàng', 'S', 'Gỗ Thông', 4000000, 'BT003', 25),
(UUID(), @product_id, 'Trắng', 'L', 'Gỗ Tràm', 5500000, 'BT004', 0),
(UUID(), @product_id, 'Đen', 'XL', 'Gỗ Sồi', 6000000, 'BT005', 5);

-- Kiểm tra lại
SELECT 
  'Da them bien the thanh cong!' as thong_bao,
  COUNT(*) as so_bien_the_moi
FROM sanpham_bienthe;
*/

-- ========================================
-- HOẶC THÊM BIẾN THỂ CHO NHIỀU SẢN PHẨM
-- ========================================

/*
-- Thêm biến thể cho 3 sản phẩm đầu tiên
INSERT INTO sanpham_bienthe (id, sanpham_id, mausac, kichthuoc, chatlieu, gia, code, sl_tonkho)
SELECT 
  UUID(),
  sp.id,
  CASE 
    WHEN RAND() < 0.33 THEN 'Đỏ'
    WHEN RAND() < 0.66 THEN 'Xanh'
    ELSE 'Vàng'
  END as mausac,
  CASE 
    WHEN RAND() < 0.5 THEN 'L'
    ELSE 'M'
  END as kichthuoc,
  'Gỗ Sồi' as chatlieu,
  FLOOR(RAND() * 5000000) + 1000000 as gia,
  CONCAT('BT', LPAD(FLOOR(RAND() * 9999), 4, '0')) as code,
  FLOOR(RAND() * 100) as sl_tonkho
FROM san_pham sp
WHERE sp.anhien = 1
LIMIT 3;
*/

