-- File: CHECK_FOREIGN_KEYS.sql
-- Mục đích: Kiểm tra các thuonghieu_id và danhmuc_id có sẵn trong database

-- Kiểm tra các thương hiệu có sẵn
SELECT 
    'THUONG_HIEU' as bang,
    id,
    tenbrand as ten,
    code
FROM thuong_hieu 
WHERE anhien = 1
ORDER BY thutu;

-- Kiểm tra các danh mục có sẵn
SELECT 
    'DANH_MUC' as bang,
    id,
    tendm as ten,
    code
FROM danh_muc 
WHERE anhien = 1
ORDER BY id;

-- Kiểm tra ID cụ thể cần dùng
SELECT 
    'KIEM_TRA_THUONG_HIEU' as thong_tin,
    CASE 
        WHEN EXISTS (SELECT 1 FROM thuong_hieu WHERE id = 'ea89dd8d-c6c8-11f0-b3e2-58112242239b') 
        THEN 'TON_TAI' 
        ELSE 'KHONG_TON_TAI' 
    END as ket_qua;

SELECT 
    'KIEM_TRA_DANH_MUC' as thong_tin,
    CASE 
        WHEN EXISTS (SELECT 1 FROM danh_muc WHERE id = 'ed37be1c-c6cb-11f0-b3e2-58112242239b') 
        THEN 'TON_TAI' 
        ELSE 'KHONG_TON_TAI' 
    END as ket_qua;

-- Lấy ID thương hiệu đầu tiên (IKEA) để dùng tạm
SELECT 
    'ID_THUONG_HIEU_DE_DUNG' as thong_tin,
    id as thuonghieu_id,
    tenbrand
FROM thuong_hieu 
WHERE code = 'TH001' OR tenbrand LIKE '%IKEA%'
LIMIT 1;

-- Lấy ID danh mục "Bàn làm việc" hoặc danh mục đầu tiên
SELECT 
    'ID_DANH_MUC_DE_DUNG' as thong_tin,
    id as danhmuc_id,
    tendm
FROM danh_muc 
WHERE tendm LIKE '%Bàn%' OR tendm LIKE '%bàn%'
LIMIT 1;







