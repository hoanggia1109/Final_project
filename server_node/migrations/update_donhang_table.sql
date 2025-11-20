-- Migration: Cập nhật bảng don_hang để hỗ trợ Stripe payment và sửa tên cột

-- 1. Thêm các cột mới
ALTER TABLE don_hang 
ADD COLUMN IF NOT EXISTS magiamgia_code VARCHAR(50) AFTER magiamgia_id;

ALTER TABLE don_hang 
ADD COLUMN IF NOT EXISTS phuongthucthanhtoan ENUM('cod','stripe','vnpay','momo','banking') AFTER trangthaithanhtoan;

ALTER TABLE don_hang 
ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255) AFTER phuongthucthanhtoan;

ALTER TABLE don_hang 
ADD COLUMN IF NOT EXISTS ngaythanhtoan DATETIME AFTER payment_intent_id;

-- 2. Đổi tên cột (nếu cần)
-- Kiểm tra xem cột có tồn tại không trước khi đổi tên
-- Nếu bạn đang dùng tên cũ là tongtien_saugiam, chạy câu lệnh này:
ALTER TABLE don_hang 
CHANGE COLUMN tongtien_saugiam tongtien_sau_giam DECIMAL(15, 2) DEFAULT 0;

-- Nếu bạn muốn giữ tên cũ, thì bỏ qua dòng trên và cập nhật code thay vì database

-- 3. Thêm index cho payment_intent_id (để tìm kiếm nhanh)
CREATE INDEX IF NOT EXISTS idx_payment_intent_id ON don_hang(payment_intent_id);

-- Hoàn thành migration
SELECT 'Migration completed successfully!' AS status;










