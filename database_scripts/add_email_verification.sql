-- Thêm cột xác thực email vào bảng nguoi_dung
ALTER TABLE `nguoi_dung` 
ADD COLUMN `email_verified` TINYINT(1) DEFAULT 0 COMMENT 'Email đã xác thực chưa (0=chưa, 1=rồi)',
ADD COLUMN `email_verification_token` VARCHAR(255) NULL COMMENT 'Token để xác thực email';

-- Kiểm tra kết quả
SELECT 
    id, 
    email, 
    email_verified, 
    email_verification_token,
    created_at 
FROM nguoi_dung 
LIMIT 5;

