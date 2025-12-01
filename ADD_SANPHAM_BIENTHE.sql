-- phpMyAdmin SQL Dump
-- File: ADD_SANPHAM_BIENTHE.sql
-- Mục đích: Thêm dữ liệu biến thể sản phẩm mới vào bảng sanpham_bienthe
-- Ngày tạo: 2025-11-27
-- Lưu ý: Import file ADD_SAN_PHAM.sql TRƯỚC khi import file này

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Thêm dữ liệu vào bảng `sanpham_bienthe`
-- Lưu ý: Đảm bảo các sanpham_id đã tồn tại trong bảng san_pham
--

INSERT INTO `sanpham_bienthe` (`id`, `sanpham_id`, `mausac`, `kichthuoc`, `chatlieu`, `sl_tonkho`, `gia`, `code`, `created_at`, `updated_at`) VALUES
('72a930e0-cba6-11f0-b006-58112242239b', '72a6f904-cba6-11f0-b006-58112242239b', 'Trắng', 'Tiêu chuẩn', 'Gỗ MDF', 50, '2200000.00', 'BTIKEA01', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72b21ba9-cba6-11f0-b006-58112242239b', '72afd2a8-cba6-11f0-b006-58112242239b', 'Full Trắng', '1m6 x 0.7m', 'Gỗ CN Cao Cấp', 30, '3200000.00', 'BTIKEA02', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72bb1761-cba6-11f0-b006-58112242239b', '72b8be3e-cba6-11f0-b006-58112242239b', 'Vân Gỗ', '2m4 x 0.6m', 'Gỗ MDF + Sắt', 20, '3500000.00', 'BTDOI01', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72c6c757-cba6-11f0-b006-58112242239b', '72c41bbe-cba6-11f0-b006-58112242239b', 'Đen/Trắng', 'Tiêu chuẩn', 'Combo', 40, '3500000.00', 'BTCOMBO1', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72ce946a-cba6-11f0-b006-58112242239b', '72cbf3dd-cba6-11f0-b006-58112242239b', 'Nâu Gỗ', '1m2 x 0.6m', 'Sắt + Gỗ', 100, '1200000.00', 'BTCSHK01', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72d6477d-cba6-11f0-b006-58112242239b', '72d3a68d-cba6-11f0-b006-58112242239b', 'Nhiều màu', '1m2 x 0.6m', 'Gỗ CN', 100, '850000.00', 'BTZALO01', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72ebfd5d-cba6-11f0-b006-58112242239b', '72e98ff5-cba6-11f0-b006-58112242239b', 'Đa dạng', 'Tiêu chuẩn', 'Gỗ CN', 100, '1500000.00', 'BTMISC', '2025-11-27 22:33:28', '2025-11-27 22:33:28');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

