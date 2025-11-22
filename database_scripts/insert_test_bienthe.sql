-- Kiểm tra xem có biến thể nào không
SELECT COUNT(*) as so_bienthe FROM sanpham_bienthe;

-- Nếu không có, hãy chèn dữ liệu test
-- Trước tiên kiểm tra có sản phẩm nào không
SELECT id, tensp FROM san_pham LIMIT 5;

-- Ví dụ: Thêm biến thể cho sản phẩm đầu tiên
-- (Thay 'YOUR_PRODUCT_ID' bằng ID sản phẩm thực tế từ query trên)

-- INSERT INTO sanpham_bienthe (id, sanpham_id, mausac, kichthuoc, chatlieu, gia, code, sl_tonkho) 
-- VALUES 
-- (UUID(), 'YOUR_PRODUCT_ID', 'Đỏ', 'L', 'Cotton', 500000, 'BT001', 100),
-- (UUID(), 'YOUR_PRODUCT_ID', 'Xanh', 'M', 'Cotton', 500000, 'BT002', 50),
-- (UUID(), 'YOUR_PRODUCT_ID', 'Vàng', 'S', 'Cotton', 500000, 'BT003', 25);

-- Hoặc nếu đã có biến thể, hãy xem dữ liệu:
SELECT 
  bt.id,
  bt.code,
  bt.mausac,
  bt.kichthuoc,
  bt.sl_tonkho,
  sp.tensp
FROM sanpham_bienthe bt
JOIN san_pham sp ON bt.sanpham_id = sp.id
LIMIT 10;

