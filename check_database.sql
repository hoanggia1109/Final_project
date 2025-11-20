-- Script kiểm tra database cho Profile & Wishlist

USE shopnoithat;

-- ============================================
-- 1. Kiểm tra bảng yeu_thich có tồn tại không
-- ============================================
SELECT 'Checking yeu_thich table...' as Status;
SHOW TABLES LIKE 'yeu_thich';

-- Nếu bảng tồn tại, xem cấu trúc
SELECT 'Table structure:' as Info;
DESCRIBE yeu_thich;

-- ============================================
-- 2. Kiểm tra cột avatar trong bảng nguoi_dung
-- ============================================
SELECT 'Checking avatar column...' as Status;
SHOW COLUMNS FROM nguoi_dung LIKE 'avatar';

-- ============================================
-- 3. Kiểm tra dữ liệu
-- ============================================
SELECT 'Sample data from yeu_thich:' as Info;
SELECT * FROM yeu_thich LIMIT 5;

SELECT 'Sample users:' as Info;
SELECT id, email, ho_ten, avatar FROM nguoi_dung LIMIT 5;

-- ============================================
-- 4. Kiểm tra khóa ngoại (foreign keys)
-- ============================================
SELECT 'Checking foreign keys...' as Status;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_NAME = 'yeu_thich'
    AND TABLE_SCHEMA = 'shopnoithat';

-- ============================================
-- 5. Tổng Kết
-- ============================================
SELECT 
    'Summary:' as Info,
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
     WHERE TABLE_SCHEMA = 'shopnoithat' AND TABLE_NAME = 'yeu_thich') as yeu_thich_exists,
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'shopnoithat' AND TABLE_NAME = 'nguoi_dung' AND COLUMN_NAME = 'avatar') as avatar_column_exists;

