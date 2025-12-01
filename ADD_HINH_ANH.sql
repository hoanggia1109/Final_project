-- phpMyAdmin SQL Dump
-- File: ADD_HINH_ANH.sql
-- Mục đích: Thêm dữ liệu hình ảnh mới vào bảng hinh_anh
-- Ngày tạo: 2025-11-27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Thêm dữ liệu vào bảng `hinh_anh`
-- Lưu ý: Đảm bảo các bienthe_id đã tồn tại trong bảng sanpham_bienthe
--

INSERT INTO `hinh_anh` (`id`, `bienthe_id`, `url`, `created_at`, `updated_at`) VALUES
('72ab4f86-cba6-11f0-b006-58112242239b', '72a930e0-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-ikea-1-tu-trang-fufutech-gia-re16-6877.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72ad6dc7-cba6-11f0-b006-58112242239b', '72a930e0-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-ikea-1-tu-trang-fufutech-gia-re9-4517.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72b435ef-cba6-11f0-b006-58112242239b', '72b21ba9-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-ikea-trang-2-tu7-1050.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72b6561d-cba6-11f0-b006-58112242239b', '72b21ba9-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-ikea-trang-2-tu8-0702.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72bd3bc8-cba6-11f0-b006-58112242239b', '72bb1761-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-lam-viec-doi-go-mdf-toi-uu-khong-gian-01-1745198700.webp.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72bf5270-cba6-11f0-b006-58112242239b', '72bb1761-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-lam-viec-doi-go-mdf-toi-uu-khong-gian-02-1745198700.webp.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72c17413-cba6-11f0-b006-58112242239b', '72bb1761-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-lam-viec-doi-go-mdf-toi-uu-khong-gian-05-1745198572.webp.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72c92819-cba6-11f0-b006-58112242239b', '72c6c757-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/combo-ban-lam-viec-fusmart-lien-gia-sach-space-y-va-ghe-cong-thai-hoc-olex-2-fufutech-3-4448.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72d0f1e5-cba6-11f0-b006-58112242239b', '72ce946a-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-lam-viec-chan-sat-co-hoc-keo-luu-tru-02-1745200410.webp.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72d8c0af-cba6-11f0-b006-58112242239b', '72d6477d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/z5565465615007e9e1f472ef5de323fdaee8809cfa2bd5-7035.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72db3462-cba6-11f0-b006-58112242239b', '72d6477d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/z55654656201557519f0ce57961c1aa8fb4467d0c53188-755811zon-6276.webp.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72dd9a36-cba6-11f0-b006-58112242239b', '72d6477d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/z55654656294764a191d73c8b6413a32dc520b8c6c8988-1874.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72dfe6a9-cba6-11f0-b006-58112242239b', '72d6477d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/z5565465639253234850bc940afc9b1c0e63378aeaa2a9-2488.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72e25302-cba6-11f0-b006-58112242239b', '72d6477d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/z557749235554064d113e47a7c2f54fe38e430d00207e6-9246.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72e48db7-cba6-11f0-b006-58112242239b', '72d6477d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/z55774923566698d92b9f30ba58f6ff4735b6a6a7d115d-6775.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72e6f555-cba6-11f0-b006-58112242239b', '72d6477d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/z5577492358311362ff129f86db6828bda95444f67e95e-1149.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72ee22e2-cba6-11f0-b006-58112242239b', '72ebfd5d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/0f5a7ca4-8e49-4ac8-a3f9-9d225795f6a2-1865.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72f04cc1-cba6-11f0-b006-58112242239b', '72ebfd5d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/2-6241.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72f28873-cba6-11f0-b006-58112242239b', '72ebfd5d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/5-1342.jpg', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72f4ff0a-cba6-11f0-b006-58112242239b', '72ebfd5d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/ban-gd-15-1400.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72f799b6-cba6-11f0-b006-58112242239b', '72ebfd5d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/blvg-39-6931.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28'),
('72f9cd36-cba6-11f0-b006-58112242239b', '72ebfd5d-cba6-11f0-b006-58112242239b', 'https://cdn.jsdelivr.net/gh/tien16-7/noithat-images@main/b%C3%A0n%20l%C3%A0m%20vi%E1%BB%87c/blvg-41-4243.jpg.webp', '2025-11-27 22:33:28', '2025-11-27 22:33:28');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

