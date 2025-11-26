-- TEST DATA cho Final Project
-- Chạy script này để tạo dữ liệu test

USE shopnoithat;


-- 1. Test Users

-- Password cho tất cả: 123456
-- Hash: $2a$10$8pZ9qKqrXwKq4NqH0KfUHO7R9Kf3K7qH0KfUHO7R9Kf3K (example)

INSERT INTO nguoi_dung (id, email, password, ho_ten, sdt, ngaysinh, gioitinh, role, trangthai) VALUES
('test-user-001', 'customer1@test.com', '$2a$10$8pZ9qKqrXwKq4NqH0KfUHO7R9Kf3K7qH0KfUHO7R9Kf3K', 'Nguyễn Văn A', '0123456789', '1990-01-01', 'male', 'customer', 1),
('test-user-002', 'customer2@test.com', '$2a$10$8pZ9qKqrXwKq4NqH0KfUHO7R9Kf3K7qH0KfUHO7R9Kf3K', 'Trần Thị B', '0987654321', '1995-05-15', 'female', 'customer', 1),
('test-user-003', 'customer3@test.com', '$2a$10$8pZ9qKqrXwKq4NqH0KfUHO7R9Kf3K7qH0KfUHO7R9Kf3K', 'Lê Văn C', '0912345678', '1992-08-20', 'male', 'customer', 1),
('test-admin-001', 'admin@test.com', '$2a$10$8pZ9qKqrXwKq4NqH0KfUHO7R9Kf3K7qH0KfUHO7R9Kf3K', 'Admin Test', '0900000000', '1985-01-01', 'male', 'admin', 1);


-- 2. Test Địa Chỉ

INSERT INTO dia_chi (id, user_id, hoten, sdt, diachichitiet, phuong_xa, quan_huyen, tinh_thanh, macdinh, loaidiachi) VALUES
('test-addr-001', 'test-user-001', 'Nguyễn Văn A', '0123456789', '123 Đường ABC', 'Phường 1', 'Quận 1', 'TP. Hồ Chí Minh', 1, 'home'),
('test-addr-002', 'test-user-001', 'Nguyễn Văn A', '0123456789', '456 Đường XYZ', 'Phường 2', 'Quận 3', 'TP. Hồ Chí Minh', 0, 'office'),
('test-addr-003', 'test-user-002', 'Trần Thị B', '0987654321', '789 Đường DEF', 'Phường Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', 1, 'home');


-- 3. Test Mã Giảm Giá

INSERT INTO ma_giam_gia (id, code, mota, loai, giatrigiam, trangthai, ngaybatdau, ngayketthuc, soluong, giatri_toithieu) VALUES
-- Mã đang hoạt động
('test-voucher-001', 'GIAMGIA10', 'Giảm 10% tối đa 100k', 'percent', 10, 1, '2025-01-01', '2025-12-31', 100, 500000),
('test-voucher-002', 'FREESHIP', 'Miễn phí ship', 'freeship', 30000, 1, '2025-01-01', '2025-12-31', 50, 300000),
('test-voucher-003', 'GIAM50K', 'Giảm 50k cho đơn 1tr', 'cash', 50000, 1, '2025-01-01', '2025-12-31', 100, 1000000),

-- Mã hết hạn (để test)
('test-voucher-004', 'EXPIRED', 'Mã hết hạn', 'percent', 20, 1, '2024-01-01', '2024-12-31', 100, 0),

-- Mã hết số lượng (để test)
('test-voucher-005', 'SOLDOUT', 'Mã hết lượt', 'percent', 15, 1, '2025-01-01', '2025-12-31', 0, 0);


-- 4. Test Wishlist

-- Note: Cần có sản phẩm trong DB trước
-- Giả sử có sản phẩm với ID: sp-001, sp-002, sp-003

-- INSERT INTO yeu_thich (id, user_id, sanpham_id) VALUES
-- ('test-wish-001', 'test-user-001', 'sp-001'),
-- ('test-wish-002', 'test-user-001', 'sp-002'),
-- ('test-wish-003', 'test-user-002', 'sp-003');


-- 5. Test Orders (với các trạng thái khác nhau)

-- Note: Cần có biến thể sản phẩm trong DB trước

-- Đơn chờ xác nhận
-- INSERT INTO don_hang (id, code, user_id, diachi_id, trangthai, trangthaithanhtoan, phuongthucthanhtoan, tongtien, tongtien_sau_giam, phi_van_chuyen) VALUES
-- ('test-order-001', 'DH001', 'test-user-001', 'test-addr-001', 'pending', 'pending', 'cod', 1500000, 1500000, 30000);

-- Đơn đã xác nhận
-- ('test-order-002', 'DH002', 'test-user-001', 'test-addr-001', 'confirmed', 'pending', 'cod', 2000000, 2000000, 30000);

-- Đơn đang giao
-- ('test-order-003', 'DH003', 'test-user-001', 'test-addr-001', 'shipping', 'pending', 'cod', 1000000, 1000000, 30000);

-- Đơn đã giao
-- ('test-order-004', 'DH004', 'test-user-002', 'test-addr-003', 'delivered', 'paid', 'cod', 3000000, 2700000, 30000);

-- Đơn đã hủy
-- ('test-order-005', 'DH005', 'test-user-001', 'test-addr-001', 'cancelled', 'cancelled', 'cod', 500000, 500000, 30000);


-- 6. Kiểm Tra Dữ Liệu

SELECT 'Test Users:' as Info;
SELECT email, ho_ten, role FROM nguoi_dung WHERE email LIKE '%@test.com';

SELECT 'Test Addresses:' as Info;
SELECT COUNT(*) as total FROM dia_chi WHERE user_id LIKE 'test-user-%';

SELECT 'Test Vouchers:' as Info;
SELECT code, mota, trangthai, ngayketthuc FROM ma_giam_gia WHERE id LIKE 'test-voucher-%';

SELECT 'Test Wishlist:' as Info;
SELECT COUNT(*) as total FROM yeu_thich WHERE user_id LIKE 'test-user-%';

SELECT 'Test Orders:' as Info;
SELECT code, trangthai FROM don_hang WHERE user_id LIKE 'test-user-%';


-- 7. Cleanup Script (Xóa dữ liệu test)

/*
-- Uncomment để xóa tất cả dữ liệu test

DELETE FROM yeu_thich WHERE user_id LIKE 'test-user-%';
DELETE FROM chitiet_donhang WHERE donhang_id LIKE 'test-order-%';
DELETE FROM don_hang WHERE user_id LIKE 'test-user-%';
DELETE FROM dia_chi WHERE user_id LIKE 'test-user-%';
DELETE FROM nguoi_dung WHERE email LIKE '%@test.com';
DELETE FROM ma_giam_gia WHERE id LIKE 'test-voucher-%';

SELECT 'Test data cleaned!' as Status;
*/


-- 8. Hash Password (sử dụng Node.js)

/*
Để tạo password hash cho test users, chạy code này trong Node.js:

const bcrypt = require('bcryptjs');
const password = '123456';
bcrypt.hash(password, 10).then(hash => {
  console.log(hash);
});

Sau đó thay hash vào INSERT statements ở trên
*/

