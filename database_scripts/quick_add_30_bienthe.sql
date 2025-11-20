-- ========================================
-- NHANH: THÊM 30 BIẾN THỂ TEST (Copy toàn bộ và chạy)
-- ========================================

-- Lấy 1 sản phẩm làm test
SET @product = (SELECT id FROM san_pham WHERE anhien = 1 LIMIT 1);

-- Kiểm tra có sản phẩm không
SELECT 
  CASE 
    WHEN @product IS NULL THEN 'KHONG CO SAN PHAM! Can them san pham truoc'
    ELSE CONCAT('San pham ID: ', @product)
  END as ket_qua;

-- Nếu có sản phẩm, thêm 30 biến thể
INSERT INTO sanpham_bienthe (id, sanpham_id, mausac, kichthuoc, chatlieu, gia, code, sl_tonkho) 
SELECT 
  UUID(),
  @product,
  CONCAT('Mau ', n.n),
  CASE MOD(n.n, 4) WHEN 0 THEN 'S' WHEN 1 THEN 'M' WHEN 2 THEN 'L' ELSE 'XL' END,
  CASE MOD(n.n, 3) WHEN 0 THEN 'Go Soi' WHEN 1 THEN 'Go Thong' ELSE 'Go Tram' END,
  3000000 + (n.n * 100000),
  CONCAT('BT', LPAD(n.n, 4, '0')),
  FLOOR(RAND() * 100)
FROM (
  SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
  UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
  UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
  UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
  UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25
  UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
) n
WHERE @product IS NOT NULL;

-- Kiểm tra kết quả
SELECT 
  'Da them bien the thanh cong!' as thong_bao,
  COUNT(*) as tong_so_bien_the
FROM sanpham_bienthe;

