-- ========================================
-- THÊM NHIỀU BIẾN THỂ TEST ĐỂ THẤY PHÂN TRANG
-- Cần tối thiểu 21 biến thể để thấy phân trang (mặc định 20/trang)
-- ========================================

-- Bước 1: Kiểm tra số lượng biến thể hiện tại
SELECT 
  'So luong bien the hien co:' as thong_tin,
  COUNT(*) as so_luong 
FROM sanpham_bienthe;

-- Bước 2: Kiểm tra số lượng sản phẩm
SELECT 
  'So luong san pham:' as thong_tin,
  COUNT(*) as so_luong 
FROM san_pham
WHERE anhien = 1;

-- ========================================
-- THÊM 30 BIẾN THỂ TEST (Bỏ comment để chạy)
-- ========================================

/*
-- Lấy danh sách 5 sản phẩm đầu tiên
SET @sp1 = (SELECT id FROM san_pham WHERE anhien = 1 LIMIT 1);
SET @sp2 = (SELECT id FROM san_pham WHERE anhien = 1 LIMIT 1 OFFSET 1);
SET @sp3 = (SELECT id FROM san_pham WHERE anhien = 1 LIMIT 1 OFFSET 2);
SET @sp4 = (SELECT id FROM san_pham WHERE anhien = 1 LIMIT 1 OFFSET 3);
SET @sp5 = (SELECT id FROM san_pham WHERE anhien = 1 LIMIT 1 OFFSET 4);

-- Thêm 6 biến thể cho mỗi sản phẩm (5 x 6 = 30 biến thể)
INSERT INTO sanpham_bienthe (id, sanpham_id, mausac, kichthuoc, chatlieu, gia, code, sl_tonkho) 
VALUES 
-- Sản phẩm 1
(UUID(), @sp1, 'Nâu Đỏ', 'L', 'Gỗ Sồi', 5000000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp1, 'Trắng Kem', 'M', 'Gỗ Sồi', 4800000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp1, 'Đen Bóng', 'S', 'Gỗ Thông', 4500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp1, 'Xám Nhạt', 'XL', 'Gỗ Tràm', 5500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 50)),
(UUID(), @sp1, 'Be', 'L', 'Gỗ Sồi', 5200000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 30)),
(UUID(), @sp1, 'Vàng Gỗ', 'M', 'Gỗ Cao Su', 4600000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 0),

-- Sản phẩm 2
(UUID(), @sp2, 'Nâu Sẫm', 'L', 'Gỗ Óc Chó', 6000000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp2, 'Trắng Ngà', 'M', 'Gỗ Sồi', 5500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp2, 'Đen Nhám', 'S', 'Gỗ Thông', 5000000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp2, 'Xám Đậm', 'XL', 'Gỗ Tràm', 6500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 50)),
(UUID(), @sp2, 'Nâu Vàng', 'L', 'Gỗ Sồi', 5800000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 3),
(UUID(), @sp2, 'Xanh Nhạt', 'M', 'Gỗ Cao Su', 5200000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 8),

-- Sản phẩm 3
(UUID(), @sp3, 'Nâu Cafe', 'L', 'Gỗ Sồi', 4500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp3, 'Trắng Sữa', 'M', 'Gỗ Sồi', 4200000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp3, 'Đen Than', 'S', 'Gỗ Thông', 3800000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp3, 'Xám Bạc', 'XL', 'Gỗ Tràm', 5000000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 50)),
(UUID(), @sp3, 'Hồng Nhạt', 'L', 'Gỗ Sồi', 4700000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 15),
(UUID(), @sp3, 'Xanh Lá', 'M', 'Gỗ Cao Su', 4300000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 0),

-- Sản phẩm 4
(UUID(), @sp4, 'Nâu Óc Chó', 'L', 'Gỗ Óc Chó', 7000000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp4, 'Trắng Tinh', 'M', 'Gỗ Sồi', 6500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp4, 'Đen Tuyền', 'S', 'Gỗ Thông', 6000000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp4, 'Xám Ghi', 'XL', 'Gỗ Tràm', 7500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 50)),
(UUID(), @sp4, 'Vàng Đồng', 'L', 'Gỗ Sồi', 6800000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 25),
(UUID(), @sp4, 'Xanh Dương', 'M', 'Gỗ Cao Su', 6200000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 5),

-- Sản phẩm 5
(UUID(), @sp5, 'Nâu Nhạt', 'L', 'Gỗ Sồi', 3500000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp5, 'Trắng Xám', 'M', 'Gỗ Sồi', 3200000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp5, 'Đen Xám', 'S', 'Gỗ Thông', 2800000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 100)),
(UUID(), @sp5, 'Xám Trắng', 'XL', 'Gỗ Tràm', 4000000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), FLOOR(RAND() * 50)),
(UUID(), @sp5, 'Be Nhạt', 'L', 'Gỗ Sồi', 3700000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 12),
(UUID(), @sp5, 'Xanh Mint', 'M', 'Gỗ Cao Su', 3300000, CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')), 0);
*/

-- ========================================
-- HOẶC CÁCH NHANH HƠN: Thêm nhiều biến thể tự động
-- ========================================

/*
-- Thêm 50 biến thể test cho các sản phẩm có sẵn
INSERT INTO sanpham_bienthe (id, sanpham_id, mausac, kichthuoc, chatlieu, gia, code, sl_tonkho)
SELECT 
  UUID() as id,
  sp.id as sanpham_id,
  CASE FLOOR(RAND() * 10)
    WHEN 0 THEN 'Nâu'
    WHEN 1 THEN 'Trắng'
    WHEN 2 THEN 'Đen'
    WHEN 3 THEN 'Xám'
    WHEN 4 THEN 'Be'
    WHEN 5 THEN 'Vàng'
    WHEN 6 THEN 'Xanh'
    WHEN 7 THEN 'Đỏ'
    WHEN 8 THEN 'Hồng'
    ELSE 'Tím'
  END as mausac,
  CASE FLOOR(RAND() * 5)
    WHEN 0 THEN 'S'
    WHEN 1 THEN 'M'
    WHEN 2 THEN 'L'
    WHEN 3 THEN 'XL'
    ELSE 'XXL'
  END as kichthuoc,
  CASE FLOOR(RAND() * 4)
    WHEN 0 THEN 'Gỗ Sồi'
    WHEN 1 THEN 'Gỗ Thông'
    WHEN 2 THEN 'Gỗ Tràm'
    ELSE 'Gỗ Cao Su'
  END as chatlieu,
  FLOOR(RAND() * 5000000) + 1000000 as gia,
  CONCAT('BT-', LPAD(FLOOR(RAND() * 9999), 4, '0')) as code,
  FLOOR(RAND() * 100) as sl_tonkho
FROM san_pham sp
WHERE sp.anhien = 1
LIMIT 10; -- Lặp lại 5 lần để có 50 biến thể
*/

-- ========================================
-- SAU KHI CHẠY, KIỂM TRA LẠI
-- ========================================

-- Đếm số biến thể sau khi thêm
SELECT 
  'Tong so bien the sau khi them:' as ket_qua,
  COUNT(*) as so_luong 
FROM sanpham_bienthe;

-- Xem 10 biến thể mới nhất
SELECT 
  bt.id,
  sp.tensp as san_pham,
  bt.mausac,
  bt.kichthuoc,
  bt.sl_tonkho,
  bt.created_at
FROM sanpham_bienthe bt
LEFT JOIN san_pham sp ON bt.sanpham_id = sp.id
ORDER BY bt.created_at DESC
LIMIT 10;

