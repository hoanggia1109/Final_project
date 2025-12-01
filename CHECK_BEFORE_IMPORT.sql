-- File: CHECK_BEFORE_IMPORT.sql
-- Mục đích: Kiểm tra các bienthe_id đã tồn tại trước khi import hinh_anh
-- Chạy file này TRƯỚC khi import ADD_HINH_ANH.sql

-- Kiểm tra các biến thể sản phẩm cần thiết
SELECT 
    id,
    sanpham_id,
    mausac,
    code
FROM sanpham_bienthe 
WHERE id IN (
    '72a930e0-cba6-11f0-b006-58112242239b',
    '72b21ba9-cba6-11f0-b006-58112242239b',
    '72bb1761-cba6-11f0-b006-58112242239b',
    '72c6c757-cba6-11f0-b006-58112242239b',
    '72ce946a-cba6-11f0-b006-58112242239b',
    '72d6477d-cba6-11f0-b006-58112242239b',
    '72ebfd5d-cba6-11f0-b006-58112242239b'
);

-- Nếu kết quả trả về 7 dòng, có thể import ADD_HINH_ANH.sql
-- Nếu kết quả trả về ít hơn 7 dòng, cần import ADD_SANPHAM_BIENTHE.sql trước

