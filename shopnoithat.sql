
CREATE DATABASE shopnoithat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopnoithat;

CREATE TABLE nguoi_dung (
  id CHAR(36) PRIMARY KEY,
  ngaysinh DATE,
  gioitinh TINYINT CHECK (gioitinh IN (0,1)),
  role ENUM('admin','customer') DEFAULT 'customer',
  trangthai TINYINT DEFAULT 1,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  code VARCHAR(50) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE dia_chi (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  hoten VARCHAR(100),
  sdt VARCHAR(20),
  phuong_xa VARCHAR(100),
  quan_huyen VARCHAR(100),
  tinh_thanh VARCHAR(100),
  diachichitiet VARCHAR(255),
  loaidiachi ENUM('home','office','other'),
  macdinh TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_diachi_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE
);


CREATE TABLE danh_muc (
  id CHAR(36) PRIMARY KEY,
  tendm VARCHAR(100) NOT NULL,
  mota TEXT,
  anhien TINYINT DEFAULT 1,
  image VARCHAR(255),
  code VARCHAR(50) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE thuong_hieu (
  id CHAR(36) PRIMARY KEY,
  tenbrand VARCHAR(100) NOT NULL,
  logo VARCHAR(255),
  thutu INT,
  anhien TINYINT DEFAULT 1,
  code VARCHAR(50) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE san_pham (
  id CHAR(36) PRIMARY KEY,
  tensp VARCHAR(200) NOT NULL,
  mota TEXT,
  ngay DATE,
  trangthai TINYINT DEFAULT 1,
  luotban INT DEFAULT 0,
  anhien TINYINT DEFAULT 1,
  luotxem INT DEFAULT 0,
  thuonghieu_id CHAR(36),
  danhmuc_id CHAR(36),
  slug VARCHAR(255) UNIQUE,
  thumbnail VARCHAR(255),
  code VARCHAR(50) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sanpham_thuonghieu FOREIGN KEY (thuonghieu_id) REFERENCES thuong_hieu(id) ON DELETE SET NULL,
  CONSTRAINT fk_sanpham_danhmuc FOREIGN KEY (danhmuc_id) REFERENCES danh_muc(id) ON DELETE SET NULL
);

CREATE TABLE sanpham_bienthe (
  id CHAR(36) PRIMARY KEY,
  sanpham_id CHAR(36) NOT NULL,
  mausac VARCHAR(50),
  kichthuoc VARCHAR(100),
  chatlieu VARCHAR(100),
  sl_tonkho INT,
  gia DECIMAL(15,2),
  code VARCHAR(50) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bienthe_sanpham FOREIGN KEY (sanpham_id) REFERENCES san_pham(id) ON DELETE CASCADE
);

CREATE TABLE hinh_anh (
  id CHAR(36) PRIMARY KEY,
  bienthe_id CHAR(36) NOT NULL,
  url VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_hinhanh_bienthe FOREIGN KEY (bienthe_id) REFERENCES sanpham_bienthe(id) ON DELETE CASCADE
);


CREATE TABLE ma_giam_gia (
  id CHAR(36) PRIMARY KEY,
  mota TEXT,
  loai VARCHAR(50),
  giatrigiam DECIMAL(15,2),
  trangthai TINYINT DEFAULT 1,
  ngaybatdau DATE,
  ngayketthuc DATE,
  soluong INT,
  giatri_toithieu DECIMAL(15,2),
  code VARCHAR(50) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE don_hang (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) ,
  ngaymua DATETIME,
  tongtien DECIMAL(15,2),
  trangthai VARCHAR(50),
  ghichu TEXT,
  phi_van_chuyen DECIMAL(15,2),
  magiaodich VARCHAR(100),
  magiamgia_id CHAR(36),
  diachi_id CHAR(36),
  thoidiemthanhtoan DATETIME,
  trangthaithanhtoan ENUM('pending','paid','failed','refunded','cancelled'),
  code VARCHAR(50) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_donhang_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL,
  CONSTRAINT fk_donhang_diachi FOREIGN KEY (diachi_id) REFERENCES dia_chi(id) ON DELETE SET NULL,
  CONSTRAINT fk_donhang_magiamgia FOREIGN KEY (magiamgia_id) REFERENCES ma_giam_gia(id) ON DELETE SET NULL
);

CREATE TABLE chitiet_donhang (
  id CHAR(36) PRIMARY KEY,
  donhang_id CHAR(36) NOT NULL,
  bienthe_id CHAR(36) NOT NULL,
  soluong INT,
  gia DECIMAL(15,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ctdh_donhang FOREIGN KEY (donhang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
  CONSTRAINT fk_ctdh_bienthe FOREIGN KEY (bienthe_id) REFERENCES sanpham_bienthe(id) ON DELETE CASCADE
);


CREATE TABLE danhmuc_baiviet (
  id CHAR(36) PRIMARY KEY,
  tendanhmuc VARCHAR(100),
  mota TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bai_viet (
  id CHAR(36) PRIMARY KEY,
  tieude VARCHAR(200),
  anhien TINYINT DEFAULT 1,
  noidung TEXT,
  hinh_anh VARCHAR(255),
  danhmuc_baiviet_id CHAR(36),
  user_id CHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bv_danhmuc FOREIGN KEY (danhmuc_baiviet_id) REFERENCES danhmuc_baiviet(id) ON DELETE SET NULL,
  CONSTRAINT fk_bv_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);


CREATE TABLE danh_gia (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  bienthe_id CHAR(36) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  binhluan TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dg_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
  CONSTRAINT fk_dg_bienthe FOREIGN KEY (bienthe_id) REFERENCES sanpham_bienthe(id) ON DELETE CASCADE
);

-- =======================
-- BẢNG GIỎ HÀNG
-- =======================
CREATE TABLE gio_hang (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    bienthe_id CHAR(36) NOT NULL,
    soluong INT DEFAULT 1 CHECK (soluong > 0),
    tongtien DECIMAL(15,2) NOT NULL,  -- giá tại thời điểm thêm vào giỏ
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_giohang_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    CONSTRAINT fk_giohang_bienthe FOREIGN KEY (bienthe_id) REFERENCES sanpham_bienthe(id) ON DELETE CASCADE
);

-- =========================================
-- NGƯỜI DÙNG
-- =========================================
INSERT INTO nguoi_dung (id, ngaysinh, gioitinh, role, trangthai, email, password, code)
VALUES
(UUID(), '1998-05-10', 1, 'admin', 1, 'admin@shopnoithat.vn', '123456', 'AD001'),
(UUID(), '2000-02-14', 0, 'customer', 1, 'user1@gmail.com', '123456', 'US001'),
(UUID(), '1995-09-20', 1, 'customer', 1, 'user2@gmail.com', '123456', 'US002');

SET @u1 = (SELECT id FROM nguoi_dung WHERE email='user1@gmail.com');
SET @u2 = (SELECT id FROM nguoi_dung WHERE email='user2@gmail.com');

-- =========================================
-- ĐỊA CHỈ
-- =========================================
INSERT INTO dia_chi (id, user_id, hoten, sdt, phuong_xa, quan_huyen, tinh_thanh, diachichitiet, loaidiachi, macdinh)
VALUES
(UUID(), @u1, 'Nguyễn Văn A', '0909123456', 'Phường 1', 'Quận 3', 'TP.HCM', '12 Nguyễn Đình Chiểu', 'home', 1),
(UUID(), @u1, 'Nguyễn Văn A', '0909123456', 'Phường 5', 'Quận 10', 'TP.HCM', '23 Điện Biên Phủ', 'office', 0),
(UUID(), @u2, 'Trần Thị B', '0912345678', 'Phường 7', 'Quận Bình Thạnh', 'TP.HCM', '45 Phan Đăng Lưu', 'home', 1),
(UUID(), @u2, 'Trần Thị B', '0912345678', 'Phường 2', 'Quận 1', 'TP.HCM', '89 Hai Bà Trưng', 'office', 0),
(UUID(), (SELECT id FROM nguoi_dung WHERE role='admin'), 'Admin Kho', '0988888888', 'Phường 9', 'Gò Vấp', 'TP.HCM', 'Kho trung tâm', 'other', 1);

-- =========================================
-- DANH MỤC SẢN PHẨM
-- =========================================
INSERT INTO danh_muc (id, tendm, mota, anhien, image, code)
VALUES
(UUID(),'Ghế','Sofa phòng khách hiện đại',1,'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg','DM001'),
(UUID(),'Bàn ăn','Bàn ăn gỗ tự nhiên',1,'https://images.pexels.com/photos/159839/furniture-table-chair-room-159839.jpeg','DM002'),
(UUID(),'Tủ quần áo','Tủ gỗ cao cấp',1,'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg','DM003'),
(UUID(),'Kệ trang trí','Kệ gỗ, kim loại trang trí',1,'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg','DM004'),
(UUID(),'Đèn trang trí','Đèn treo, đèn sàn, đèn bàn',1,'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg','DM005'),
(UUID(),'Giường ngủ','Giường gỗ sồi cao cấp',1,'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg','DM006'),
(UUID(),'Thảm trải sàn','Thảm trang trí',1,'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg','DM007'),
(UUID(),'Nội thất văn phòng','Bàn, ghế, tủ hồ sơ',1,'https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg','DM008');

-- =========================================
-- THƯƠNG HIỆU
-- =========================================
INSERT INTO thuong_hieu (id, tenbrand, logo, thutu, anhien, code)
VALUES
(UUID(),'IKEA','https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg',1,1,'TH001'),
(UUID(),'AConcept','https://upload.wikimedia.org/wikipedia/commons/9/91/Aconcept_logo.png',2,1,'TH002'),
(UUID(),'Hòa Phát','https://upload.wikimedia.org/wikipedia/commons/0/0e/Hoaphat_logo.png',3,1,'TH003'),
(UUID(),'Nhà Xinh','https://upload.wikimedia.org/wikipedia/commons/7/7e/Nhaxinh_logo.png',4,1,'TH004'),
(UUID(),'VHome','https://upload.wikimedia.org/wikipedia/commons/d/d9/Home_Logo.png',5,1,'TH005'),
(UUID(),'DecorPro','https://upload.wikimedia.org/wikipedia/commons/5/57/Design_icon.svg',6,1,'TH006'),
(UUID(),'LuxHome','https://upload.wikimedia.org/wikipedia/commons/5/5a/Home_logo.png',7,1,'TH007'),
(UUID(),'Lazio','https://upload.wikimedia.org/wikipedia/commons/9/99/Furniture_logo.png',8,1,'TH008');

-- =========================================
-- MÃ GIẢM GIÁ
-- =========================================
INSERT INTO ma_giam_gia (id, mota, loai, giatrigiam, trangthai, ngaybatdau, ngayketthuc, soluong, giatri_toithieu, code)
VALUES
(UUID(),'Giảm 10% cho đơn hàng đầu tiên','percent',10,1,'2025-01-01','2025-12-31',100,500000,'SALE10'),
(UUID(),'Giảm 20% cho đơn trên 1 triệu','percent',20,1,'2025-01-01','2025-12-31',50,1000000,'SALE20'),
(UUID(),'Freeship toàn quốc','ship',0,1,'2025-01-01','2025-12-31',500,0,'FREESHIP');

-- =========================================
-- SẢN PHẨM
-- =========================================
INSERT INTO san_pham 
(id, tensp, mota, ngay, trangthai, luotban, anhien, luotxem, thuonghieu_id, danhmuc_id, slug, thumbnail, code, created_at, updated_at)
VALUES
(UUID(), 'Sofa vải nỉ Bắc Âu', 
'Thiết kế tối giản, chân gỗ tự nhiên, chất liệu vải nỉ cao cấp mang lại cảm giác êm ái cho phòng khách hiện đại.',
CURDATE(), 1, 150, 1, 1020, 
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Ghế Sofa'),
'sofa-vai-ni-bac-au',
'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
'SP001', NOW(), NOW()),

(UUID(), 'Bàn ăn gỗ sồi 6 ghế',
'Bàn ăn làm từ gỗ sồi tự nhiên, bề mặt phủ dầu chống trầy, phù hợp cho gia đình 4–6 người.',
CURDATE(), 1, 90, 1, 860,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-an-go-soi-6-ghe',
'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg',
'SP002', NOW(), NOW()),

(UUID(), 'Tủ quần áo cánh trượt Hòa Phát',
'Tủ 3 ngăn lớn, thiết kế trượt tiết kiệm không gian, màu trắng sữa sang trọng.',
CURDATE(), 1, 120, 1, 930,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-quan-ao-canh-truot-hoa-phat',
'https://images.pexels.com/photos/6585766/pexels-photo-6585766.jpeg',
'SP003', NOW(), NOW()),

(UUID(), 'Kệ trang trí kim loại 5 tầng',
'Khung sắt sơn tĩnh điện, kệ gỗ công nghiệp MDF, chịu lực tốt, phù hợp phòng khách hoặc văn phòng.',
CURDATE(), 1, 85, 1, 740,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Kệ trang trí'),
'ke-trang-tri-kim-loai-5-tang',
'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg',
'SP004', NOW(), NOW()),

(UUID(), 'Đèn trần 3 vòng LED hiện đại',
'Đèn trần LED cao cấp, thiết kế vòng tròn xoắn tinh tế, ánh sáng vàng ấm, tiết kiệm điện năng.',
CURDATE(), 1, 130, 1, 1240,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-tran-3-vong-led-hien-dai',
'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg',
'SP005', NOW(), NOW()),

(UUID(), 'Giường ngủ gỗ sồi Bắc Âu',
'Giường gỗ sồi tự nhiên, khung chắc chắn, đầu giường bo tròn an toàn, phù hợp không gian tối giản.',
CURDATE(), 1, 175, 1, 1450,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Giường ngủ'),
'giuong-ngu-go-soi-bac-au',
'https://images.pexels.com/photos/6585760/pexels-photo-6585760.jpeg',
'SP006', NOW(), NOW()),

(UUID(), 'Thảm trải sàn họa tiết Scandinavia',
'Thảm dệt máy cao cấp, chống trơn trượt, phù hợp cho phòng khách hoặc phòng ngủ phong cách Bắc Âu.',
CURDATE(), 1, 65, 1, 620,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Xinh'),
(SELECT id FROM danh_muc WHERE tendm='Thảm trải sàn'),
'tham-trai-san-scandinavia',
'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
'SP007', NOW(), NOW()),

(UUID(), 'Ghế công thái học Ergo Pro',
'Ghế có tựa lưng lưới, điều chỉnh độ ngả, hỗ trợ thắt lưng, thích hợp làm việc dài giờ.',
CURDATE(), 1, 300, 1, 1650,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-cong-thai-hoc-ergo-pro',
'https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg',
'SP008', NOW(), NOW()),

(UUID(), 'Đèn ngủ gốm sứ nghệ thuật',
'Đèn bàn gốm cao cấp, chụp vải cotton, ánh sáng dịu nhẹ giúp không gian thư giãn hơn.',
CURDATE(), 1, 70, 1, 850,
(SELECT id FROM thuong_hieu WHERE tenbrand='Lazio'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ngu-gom-su-nghe-thuat',
'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
'SP009', NOW(), NOW()),

(UUID(), 'Tủ đầu giường 2 ngăn kéo',
'Tủ nhỏ tiện dụng, thiết kế tối giản, chất liệu MDF phủ melamine chống trầy, gam màu trắng sáng.',
CURDATE(), 1, 110, 1, 980,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Giường ngủ'),
'tu-dau-giuong-2-ngan-keo',
'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg',
'SP010', NOW(), NOW());
INSERT INTO san_pham 
(id, tensp, mota, ngay, trangthai, luotban, anhien, luotxem, thuonghieu_id, danhmuc_id, slug, thumbnail, code, created_at, updated_at)
VALUES

(UUID(), 'Sofa da thật AConcept 3 chỗ ngồi',
'Sofa da bò cao cấp, khung gỗ sồi, đệm mút êm ái, phù hợp cho không gian phòng khách sang trọng.',
CURDATE(), 1, 210, 1, 1480,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Ghế Sofa'),
'sofa-da-that-aconcept-3-cho',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP011', NOW(), NOW()),

(UUID(), 'Ghế thư giãn VHome nệm nhung',
'Ghế thư giãn nệm nhung cao cấp, chân kim loại mạ vàng, phong cách hiện đại tối giản.',
CURDATE(), 1, 180, 1, 1320,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Ghế Sofa'),
'ghe-thu-gian-vhome-nem-nhung',
'https://images.pexels.com/photos/157382/pexels-photo-157382.jpeg',
'SP012', NOW(), NOW()),

(UUID(), 'Bàn ăn mặt đá tròn 4 ghế',
'Mặt bàn đá marble trắng vân tự nhiên, khung thép sơn tĩnh điện, dễ lau chùi, sang trọng.',
CURDATE(), 1, 95, 1, 970,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-an-mat-da-tron-4-ghe',
'https://images.pexels.com/photos/4207785/pexels-photo-4207785.jpeg',
'SP013', NOW(), NOW()),

(UUID(), 'Bàn ăn mở rộng IKEA Norden',
'Bàn có thể gấp gọn, gỗ công nghiệp phủ veneer sồi, màu sáng thanh lịch.',
CURDATE(), 1, 130, 1, 1100,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-an-mo-rong-ikea-norden',
'https://images.pexels.com/photos/5849394/pexels-photo-5849394.jpeg',
'SP014', NOW(), NOW()),

(UUID(), 'Tủ quần áo cửa lùa hiện đại Gotrust',
'Tủ gỗ MDF chống ẩm, cửa lùa tiết kiệm không gian, ngăn chứa đồ rộng rãi.',
CURDATE(), 1, 140, 1, 960,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-quan-ao-cua-lua-gotrust',
'https://images.pexels.com/photos/6585768/pexels-photo-6585768.jpeg',
'SP015', NOW(), NOW()),

(UUID(), 'Tủ quần áo 4 cánh Hòa Phát gỗ công nghiệp',
'Tủ rộng 2m, màu vân gỗ óc chó, tay nắm inox, thích hợp cho phòng ngủ lớn.',
CURDATE(), 1, 190, 1, 990,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-quan-ao-4-canh-hoa-phat',
'https://images.pexels.com/photos/7061412/pexels-photo-7061412.jpeg',
'SP016', NOW(), NOW()),

(UUID(), 'Kệ sách treo tường gỗ công nghiệp',
'Thiết kế đơn giản, tiết kiệm không gian, phù hợp với phòng nhỏ, sơn PU mịn.',
CURDATE(), 1, 75, 1, 640,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Kệ trang trí'),
'ke-sach-treo-tuong-go-cong-nghiep',
'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg',
'SP017', NOW(), NOW()),

(UUID(), 'Kệ trang trí zigzag 5 tầng Lazio',
'Phong cách hiện đại, cấu trúc ziczac độc đáo, phù hợp với phòng khách hoặc phòng làm việc.',
CURDATE(), 1, 120, 1, 870,
(SELECT id FROM thuong_hieu WHERE tenbrand='Lazio'),
(SELECT id FROM danh_muc WHERE tendm='Kệ trang trí'),
'ke-trang-tri-zigzag-lazio',
'https://images.pexels.com/photos/1282315/pexels-photo-1282315.jpeg',
'SP018', NOW(), NOW()),

(UUID(), 'Đèn sàn đứng chân gỗ Bắc Âu',
'Chụp vải trắng, chân gỗ tự nhiên, ánh sáng ấm dịu, tạo điểm nhấn trang trí tinh tế.',
CURDATE(), 1, 90, 1, 710,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-san-dung-chan-go-bac-au',
'https://images.pexels.com/photos/271635/pexels-photo-271635.jpeg',
'SP019', NOW(), NOW()),

(UUID(), 'Đèn treo trần hình nón VHome',
'Đèn kim loại sơn tĩnh điện, ánh sáng vàng, phù hợp phòng ăn và quán café nhỏ.',
CURDATE(), 1, 115, 1, 860,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-treo-tran-hinh-non-vhome',
'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg',
'SP020', NOW(), NOW()),

(UUID(), 'Giường ngủ bọc nệm nhung cao cấp',
'Khung gỗ tự nhiên, đầu giường bọc nệm êm ái, tạo điểm nhấn sang trọng cho không gian nghỉ ngơi.',
CURDATE(), 1, 250, 1, 1120,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Giường ngủ'),
'giuong-ngu-boc-nem-nhung-cao-cap',
'https://images.pexels.com/photos/6585761/pexels-photo-6585761.jpeg',
'SP021', NOW(), NOW()),

(UUID(), 'Giường tầng trẻ em IKEA Smastad',
'Giường tầng kết hợp bàn học và tủ chứa đồ, thiết kế thông minh cho không gian nhỏ.',
CURDATE(), 1, 160, 1, 980,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Giường ngủ'),
'giuong-tang-tre-em-ikea-smastad',
'https://images.pexels.com/photos/6585769/pexels-photo-6585769.jpeg',
'SP022', NOW(), NOW()),

(UUID(), 'Thảm lông ngắn trang trí Gotrust',
'Thảm lông mịn, dễ vệ sinh, không rụng, phù hợp phòng khách hoặc phòng ngủ.',
CURDATE(), 1, 60, 1, 690,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Thảm trải sàn'),
'tham-long-ngan-trang-tri-gotrust',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP023', NOW(), NOW()),

(UUID(), 'Thảm họa tiết hình học hiện đại',
'Thảm dệt họa tiết độc đáo, tông màu xám – vàng phù hợp với phong cách scandinavian.',
CURDATE(), 1, 55, 1, 740,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Xinh'),
(SELECT id FROM danh_muc WHERE tendm='Thảm trải sàn'),
'tham-hoa-tiet-hinh-hoc-hien-dai',
'https://images.pexels.com/photos/1957474/pexels-photo-1957474.jpeg',
'SP024', NOW(), NOW()),

(UUID(), 'Ghế giám đốc da thật Hòa Phát',
'Ghế da cao cấp, khung kim loại chắc chắn, tựa lưng cong hỗ trợ tư thế chuẩn.',
CURDATE(), 1, 280, 1, 1390,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-giam-doc-da-that-hoa-phat',
'https://images.pexels.com/photos/813692/pexels-photo-813692.jpeg',
'SP025', NOW(), NOW()),

(UUID(), 'Ghế xoay văn phòng VHome Mesh',
'Tựa lưng lưới, điều chỉnh chiều cao linh hoạt, bánh xe êm ái, phù hợp môi trường làm việc năng động.',
CURDATE(), 1, 300, 1, 1200,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-xoay-van-phong-vhome-mesh',
'https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg',
'SP026', NOW(), NOW()),

(UUID(), 'Đèn bàn học LED chống cận',
'Đèn học LED 3 chế độ sáng, chống chói, tiết kiệm điện năng, thân đèn uốn linh hoạt.',
CURDATE(), 1, 90, 1, 720,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ban-hoc-led-chong-can',
'https://images.pexels.com/photos/619419/pexels-photo-619419.jpeg',
'SP027', NOW(), NOW()),

(UUID(), 'Đèn ngủ mây tre đan thủ công',
'Sản phẩm thủ công 100%, ánh sáng vàng ấm, mang nét gần gũi tự nhiên.',
CURDATE(), 1, 60, 1, 680,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Xinh'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ngu-may-tre-dan-thu-cong',
'https://images.pexels.com/photos/1966626/pexels-photo-1966626.jpeg',
'SP028', NOW(), NOW()),

(UUID(), 'Sofa góc chữ L LuxHome nỉ nhung',
'Sofa góc tiện nghi, khung gỗ tự nhiên, đệm dày êm ái, dễ tháo rửa vệ sinh.',
CURDATE(), 1, 145, 1, 1340,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Ghế Sofa'),
'sofa-goc-chu-l-luxhome-ni-nhung',
'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg',
'SP029', NOW(), NOW()),

(UUID(), 'Tủ đầu giường gỗ óc chó 2 tầng',
'Tủ gỗ óc chó tự nhiên, phủ bóng mịn, 2 ngăn kéo rộng rãi, gam màu trầm ấm.',
CURDATE(), 1, 115, 1, 910,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Giường ngủ'),
'tu-dau-giuong-go-oc-cho',
'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
'SP030', NOW(), NOW()),

(UUID(), 'Ghế xoay lưng cao Hòa Phát HP-301',
'Ghế lưng cao bọc da PU cao cấp, có thể điều chỉnh độ ngả, bánh xe xoay 360 độ, phù hợp văn phòng hiện đại.',
CURDATE(), 1, 240, 1, 1500,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-xoay-lung-cao-hoa-phat-hp301',
'https://images.pexels.com/photos/813692/pexels-photo-813692.jpeg',
'SP031', NOW(), NOW()),

(UUID(), 'Ghế lưới công thái học IKEA Markus',
'Tựa lưng lưới thoáng khí, hỗ trợ cột sống, có thể điều chỉnh chiều cao linh hoạt.',
CURDATE(), 1, 300, 1, 1800,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-luoi-cong-thai-hoc-ikea-markus',
'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg',
'SP032', NOW(), NOW()),

(UUID(), 'Ghế họp văn phòng VHome HB-02',
'Ghế khung thép mạ, đệm mút bọc nỉ, thích hợp cho phòng họp hoặc phòng chờ.',
CURDATE(), 1, 110, 1, 740,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-hop-van-phong-vhome-hb02',
'https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg',
'SP033', NOW(), NOW()),

(UUID(), 'Ghế nhân viên da công nghiệp AConcept',
'Ghế có tay vịn, khung thép mạ crom, nệm da mềm mại, kiểu dáng thanh lịch.',
CURDATE(), 1, 200, 1, 950,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-nhan-vien-da-cong-nghiep-aconcept',
'https://images.pexels.com/photos/813693/pexels-photo-813693.jpeg',
'SP034', NOW(), NOW()),

(UUID(), 'Ghế quản lý LuxHome LX-88',
'Tựa đầu cong theo dáng người, đệm mút đàn hồi cao, nâng đỡ lưng hiệu quả khi làm việc lâu.',
CURDATE(), 1, 180, 1, 880,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-quan-ly-luxhome-lx88',
'https://images.pexels.com/photos/159839/furniture-table-chair-room-159839.jpeg',
'SP035', NOW(), NOW()),

(UUID(), 'Ghế training gấp gọn Gotrust',
'Khung sắt sơn tĩnh điện, nệm bọc simili, gấp gọn tiện lợi cho phòng họp hoặc hội thảo.',
CURDATE(), 1, 150, 1, 790,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-training-gap-gon-gotrust',
'https://images.pexels.com/photos/813694/pexels-photo-813694.jpeg',
'SP036', NOW(), NOW()),

(UUID(), 'Ghế lưng lưới trắng Lazio Comfort',
'Màu trắng trang nhã, tựa cong lưng, khung nhựa ABS bền bỉ, phù hợp phòng làm việc sáng tạo.',
CURDATE(), 1, 130, 1, 820,
(SELECT id FROM thuong_hieu WHERE tenbrand='Lazio'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-lung-luoi-trang-lazio-comfort',
'https://images.pexels.com/photos/813695/pexels-photo-813695.jpeg',
'SP037', NOW(), NOW()),

(UUID(), 'Ghế giám đốc cao cấp Gotrust GX-01',
'Da bò thật, tay gỗ cong, trục nâng thủy lực, thiết kế sang trọng dành cho lãnh đạo.',
CURDATE(), 1, 250, 1, 970,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-giam-doc-cao-cap-gotrust',
'https://images.pexels.com/photos/813696/pexels-photo-813696.jpeg',
'SP038', NOW(), NOW()),

(UUID(), 'Sofa tiếp khách IKEA Klippan 2 chỗ',
'Sofa nhỏ gọn, vỏ vải tháo rời giặt được, phù hợp khu vực tiếp khách văn phòng.',
CURDATE(), 1, 95, 1, 720,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Ghế Sofa'),
'sofa-tiep-khach-ikea-klippan',
'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
'SP039', NOW(), NOW()),

(UUID(), 'Sofa đôi da công nghiệp LuxHome',
'Màu nâu cà phê, khung gỗ sồi, nệm mút dày, dùng trong phòng họp hoặc khu vực tiếp khách.',
CURDATE(), 1, 115, 1, 750,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Ghế Sofa'),
'sofa-doi-da-cong-nghiep-luxhome',
'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg',
'SP040', NOW(), NOW()),

(UUID(), 'Bàn làm việc gỗ sồi AConcept 1m2',
'Chân sắt sơn tĩnh điện, mặt gỗ veneer, phù hợp không gian làm việc hiện đại.',
CURDATE(), 1, 140, 1, 940,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-lam-viec-go-soi-aconcept',
'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg',
'SP041', NOW(), NOW()),

(UUID(), 'Bàn làm việc chữ L Hòa Phát 1m6',
'Bàn chữ L góc phải, mặt melamine chống trầy, màu vân gỗ sáng, ngăn kéo tiện dụng.',
CURDATE(), 1, 190, 1, 990,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-lam-viec-chu-l-hoa-phat',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP042', NOW(), NOW()),

(UUID(), 'Bàn làm việc đôi có vách ngăn Gotrust',
'Bàn đôi 2 chỗ ngồi, có vách ngăn mica mờ, giúp tạo không gian riêng tư khi làm việc.',
CURDATE(), 1, 100, 1, 860,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-lam-viec-doi-gotrust',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP043', NOW(), NOW()),

(UUID(), 'Bàn giám đốc LuxHome LX-Executive',
'Kích thước 2m x 0.9m, tủ phụ bên hông, veneer walnut, phù hợp không gian lãnh đạo.',
CURDATE(), 1, 170, 1, 1120,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-giam-doc-luxhome-lx-executive',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP044', NOW(), NOW()),

(UUID(), 'Bàn họp tròn IKEA Conference 8 người',
'Mặt bàn MDF chống ẩm, khung thép sơn đen, thiết kế đơn giản nhưng tinh tế.',
CURDATE(), 1, 85, 1, 740,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-hop-tron-ikea-conference',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP045', NOW(), NOW()),

(UUID(), 'Tủ tài liệu Hòa Phát 2 buồng TL-02',
'Tủ gỗ công nghiệp 2 buồng, cửa kính, thích hợp cho văn phòng nhỏ.',
CURDATE(), 1, 120, 1, 830,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-tai-lieu-hoa-phat-tl02',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP046', NOW(), NOW()),

(UUID(), 'Tủ hồ sơ văn phòng Gotrust 3 tầng',
'Chất liệu sắt sơn tĩnh điện, khóa an toàn, phù hợp phòng hành chính.',
CURDATE(), 1, 95, 1, 700,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-ho-so-van-phong-gotrust',
'https://images.pexels.com/photos/7061412/pexels-photo-7061412.jpeg',
'SP047', NOW(), NOW()),

(UUID(), 'Tủ locker nhân viên 12 ngăn LuxHome',
'Khung sắt mạ tĩnh điện, khóa cơ, phù hợp lưu trữ đồ cá nhân tại văn phòng.',
CURDATE(), 1, 130, 1, 780,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-locker-nhan-vien-luxhome',
'https://images.pexels.com/photos/7061412/pexels-photo-7061412.jpeg',
'SP048', NOW(), NOW()),

(UUID(), 'Đèn bàn làm việc LED VHome Smart',
'Cảm ứng 3 chế độ sáng, cổng sạc USB, kiểu dáng hiện đại.',
CURDATE(), 1, 140, 1, 850,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ban-lam-viec-vhome-smart',
'https://images.pexels.com/photos/619419/pexels-photo-619419.jpeg',
'SP049', NOW(), NOW()),

(UUID(), 'Đèn bàn chống cận AConcept EyeCare',
'Ánh sáng tự nhiên, điều chỉnh góc linh hoạt, thích hợp học tập và làm việc.',
CURDATE(), 1, 120, 1, 910,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ban-chong-can-aconcept',
'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
'SP050', NOW(), NOW()),

(UUID(), 'Ghế nhân viên lưng lưới IKEA Fredde',
'Tựa lưng lưới thoáng khí, nệm mút dày, khung nhựa cao cấp, phù hợp văn phòng hiện đại.',
CURDATE(), 1, 210, 1, 970,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-nhan-vien-lung-luoi-ikea-fredde',
'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg',
'SP051', NOW(), NOW()),

(UUID(), 'Ghế xoay da thật LuxHome LX-900',
'Da thật mềm mại, bánh xe chống ồn, điều chỉnh độ cao, kiểu dáng sang trọng cho lãnh đạo.',
CURDATE(), 1, 190, 1, 1140,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-xoay-da-that-luxhome-lx900',
'https://images.pexels.com/photos/813692/pexels-photo-813692.jpeg',
'SP052', NOW(), NOW()),

(UUID(), 'Ghế lưới quản lý Hòa Phát GL-202',
'Khung thép mạ sáng, tay vịn nhựa cứng, tựa lưng lưới cao, thiết kế công thái học.',
CURDATE(), 1, 230, 1, 1320,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-luoi-quan-ly-hoa-phat-gl202',
'https://images.pexels.com/photos/813693/pexels-photo-813693.jpeg',
'SP053', NOW(), NOW()),

(UUID(), 'Ghế làm việc Gotrust Flexi Mesh',
'Tựa lưng cong, hỗ trợ thắt lưng, nệm đệm cao su non, có thể điều chỉnh đa hướng.',
CURDATE(), 1, 260, 1, 1410,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-lam-viec-gotrust-flexi-mesh',
'https://images.pexels.com/photos/813695/pexels-photo-813695.jpeg',
'SP054', NOW(), NOW()),

(UUID(), 'Ghế training phòng học VHome Student',
'Ghế gấp gọn, khung sắt sơn tĩnh điện, có bàn viết mini, tiện lợi cho hội thảo, lớp học.',
CURDATE(), 1, 160, 1, 870,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-training-phong-hoc-vhome-student',
'https://images.pexels.com/photos/813694/pexels-photo-813694.jpeg',
'SP055', NOW(), NOW()),

-- 🪑 Bàn làm việc nhóm IKEA
(UUID(), 'Bàn làm việc nhóm IKEA Office 4 chỗ',
'Mặt gỗ MDF phủ melamine, khung sắt vuông sơn đen, vách ngăn acrylic, phù hợp open office.',
CURDATE(), 1, 180, 1, 980,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-lam-viec-nhom-ikea-office-4',
'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg',
'SP056', NOW(), NOW()),

(UUID(), 'Bàn nhân viên Hòa Phát HR-120',
'Mặt bàn phủ Laminate, chống trầy, có hộc tủ 3 ngăn, phù hợp mọi không gian văn phòng.',
CURDATE(), 1, 190, 1, 1020,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-nhan-vien-hoa-phat-hr120',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP057', NOW(), NOW()),

(UUID(), 'Bàn giám đốc AConcept Prestige',
'Kích thước 1m8, veneer walnut, tủ phụ bên hông, phong cách hiện đại sang trọng.',
CURDATE(), 1, 110, 1, 890,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-giam-doc-aconcept-prestige',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP058', NOW(), NOW()),

(UUID(), 'Bàn họp tròn 6 người LuxHome',
'Mặt gỗ MDF màu nâu, chân thép đen, thiết kế hiện đại, tạo không gian họp mở.',
CURDATE(), 1, 130, 1, 970,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-hop-tron-luxhome-6nguoi',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP059', NOW(), NOW()),


(UUID(), 'Bàn làm việc nhỏ Gotrust Simple 1m',
'Mặt bàn gỗ công nghiệp phủ melamine, dễ lắp ráp, dành cho không gian nhỏ gọn.',
CURDATE(), 1, 200, 1, 1050,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-lam-viec-nho-gotrust-simple',
'https://images.pexels.com/photos/159839/furniture-table-chair-room-159839.jpeg',
'SP060', NOW(), NOW()),

(UUID(), 'Tủ tài liệu LuxHome TL-03',
'Tủ gỗ MDF phủ Laminate, 3 ngăn kéo và 2 cánh tủ lớn, phù hợp lưu trữ hồ sơ.',
CURDATE(), 1, 125, 1, 720,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-tai-lieu-luxhome-tl03',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP061', NOW(), NOW()),


(UUID(), 'Tủ hồ sơ Hòa Phát TL-06 4 ngăn',
'Tủ cao 1m8, khung gỗ công nghiệp, cửa kính, khóa an toàn, dành cho văn phòng hành chính.',
CURDATE(), 1, 140, 1, 800,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-ho-so-hoa-phat-tl06',
'https://images.pexels.com/photos/7061412/pexels-photo-7061412.jpeg',
'SP062', NOW(), NOW()),

(UUID(), 'Tủ hồ sơ di động IKEA Alex',
'Tủ 3 ngăn kéo nhỏ gọn, bánh xe tiện di chuyển, phù hợp bàn làm việc cá nhân.',
CURDATE(), 1, 220, 1, 1020,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-ho-so-di-dong-ikea-alex',
'https://images.pexels.com/photos/7061413/pexels-photo-7061413.jpeg',
'SP063', NOW(), NOW()),


(UUID(), 'Tủ đựng đồ nhân viên Gotrust Locker 6 ngăn',
'Khung sắt sơn tĩnh điện, bền màu, có lỗ thoáng khí, phù hợp khu vực công cộng.',
CURDATE(), 1, 95, 1, 670,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-dung-do-nhan-vien-gotrust-locker',
'https://images.pexels.com/photos/7061414/pexels-photo-7061414.jpeg',
'SP064', NOW(), NOW()),


(UUID(), 'Kệ để tài liệu LuxHome 4 tầng',
'Kệ thép sơn đen, mặt gỗ công nghiệp, chịu tải tốt, thích hợp lưu trữ sách và hồ sơ.',
CURDATE(), 1, 170, 1, 830,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Kệ trang trí'),
'ke-de-tai-lieu-luxhome-4tang',
'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg',
'SP065', NOW(), NOW()),

(UUID(), 'Kệ sắt Hòa Phát KS-02',
'Kệ sắt mạ kẽm, chịu lực cao, dễ tháo lắp, phù hợp kho lưu trữ hồ sơ.',
CURDATE(), 1, 120, 1, 780,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Kệ trang trí'),
'ke-sat-hoa-phat-ks02',
'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg',
'SP066', NOW(), NOW()),

(UUID(), 'Đèn trần LED AConcept Office Light',
'Đèn LED âm trần, ánh sáng trắng tự nhiên, tiết kiệm điện năng, tuổi thọ cao.',
CURDATE(), 1, 140, 1, 880,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-tran-led-aconcept-office',
'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
'SP067', NOW(), NOW()),

(UUID(), 'Đèn bàn Hòa Phát Energy Lamp',
'Đèn LED ánh sáng vàng dịu, cổ xoay linh hoạt, thích hợp làm việc hoặc học tập ban đêm.',
CURDATE(), 1, 130, 1, 720,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ban-hoa-phat-energy',
'https://images.pexels.com/photos/619419/pexels-photo-619419.jpeg',
'SP068', NOW(), NOW()),

(UUID(), 'Đèn tường LuxHome Curve Light',
'Đèn hắt tường LED hiện đại, thân nhôm, ánh sáng vàng ấm, phù hợp không gian phòng họp.',
CURDATE(), 1, 100, 1, 700,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-tuong-luxhome-curve-light',
'https://images.pexels.com/photos/1966626/pexels-photo-1966626.jpeg',
'SP069', NOW(), NOW()),

(UUID(), 'Đèn bàn mini VHome Desk Light',
'Thiết kế nhỏ gọn, cổ xoay 360°, sạc USB, ánh sáng dịu nhẹ bảo vệ mắt.',
CURDATE(), 1, 160, 1, 880,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ban-mini-vhome-desk',
'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
'SP070', NOW(), NOW()),

(UUID(), 'Ghế công thái học Hòa Phát ErgoMax',
'Tựa lưng chia khớp, điều chỉnh đa hướng, hỗ trợ cột sống, phù hợp làm việc lâu dài.',
CURDATE(), 1, 260, 1, 1450,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-cong-thai-hoc-hoa-phat-ergomax',
'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg',
'SP071', NOW(), NOW()),

(UUID(), 'Ghế xoay AConcept Leather Pro',
'Ghế da thật cao cấp, trục nâng thủy lực, thiết kế sang trọng, bền bỉ và thoải mái.',
CURDATE(), 1, 190, 1, 980,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-xoay-aconcept-leather-pro',
'https://images.pexels.com/photos/813692/pexels-photo-813692.jpeg',
'SP072', NOW(), NOW()),

(UUID(), 'Ghế hội trường Gotrust Compact',
'Ghế bọc nỉ, tay nhựa gập, thiết kế gắn sàn cố định, tiện dụng cho không gian hội nghị.',
CURDATE(), 1, 160, 1, 820,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-hoi-truong-gotrust-compact',
'https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg',
'SP073', NOW(), NOW()),

(UUID(), 'Ghế xoay văn phòng LuxHome AirMesh',
'Tựa lưng lưới cao cấp, khung nhôm sáng, trục xoay linh hoạt, hỗ trợ cổ và lưng.',
CURDATE(), 1, 280, 1, 1350,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-xoay-van-phong-luxhome-airmesh',
'https://images.pexels.com/photos/159839/furniture-table-chair-room-159839.jpeg',
'SP074', NOW(), NOW()),

(UUID(), 'Ghế giám đốc VHome President',
'Ghế da bò tự nhiên, tay gỗ uốn cong, thiết kế cao cấp cho văn phòng lãnh đạo.',
CURDATE(), 1, 240, 1, 1180,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-giam-doc-vhome-president',
'https://images.pexels.com/photos/813693/pexels-photo-813693.jpeg',
'SP075', NOW(), NOW()),


(UUID(), 'Ghế training gấp gọn IKEA FlexFold',
'Ghế nhựa ABS cao cấp, khung sắt mạ kẽm, dễ xếp chồng, nhẹ và tiện dụng.',
CURDATE(), 1, 150, 1, 910,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-training-gap-gon-ikea-flexfold',
'https://images.pexels.com/photos/813694/pexels-photo-813694.jpeg',
'SP076', NOW(), NOW()),

(UUID(), 'Ghế nhân viên LuxHome Junior Mesh',
'Màu xám trung tính, tựa lưng lưới, chân xoay êm ái, phù hợp không gian làm việc trẻ trung.',
CURDATE(), 1, 200, 1, 990,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Nội thất văn phòng'),
'ghe-nhan-vien-luxhome-junior-mesh',
'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg',
'SP077', NOW(), NOW()),

(UUID(), 'Ghế phòng chờ Hòa Phát CH-05 3 chỗ',
'Ghế băng 3 chỗ, khung thép sơn tĩnh điện, đệm nỉ êm ái, phù hợp sảnh lễ tân.',
CURDATE(), 1, 180, 1, 940,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Ghế Sofa'),
'ghe-phong-cho-hoa-phat-ch05',
'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
'SP078', NOW(), NOW()),

(UUID(), 'Bàn làm việc gỗ óc chó AConcept',
'Mặt bàn veneer óc chó cao cấp, chân thép đen, tông màu sang trọng, thiết kế thanh lịch.',
CURDATE(), 1, 150, 1, 870,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-lam-viec-go-oc-cho-aconcept',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP079', NOW(), NOW()),

(UUID(), 'Bàn chữ U LuxHome Executive',
'Bàn giám đốc chữ U, tích hợp tủ phụ, mặt laminate vân gỗ sồi, tạo cảm giác uy nghi.',
CURDATE(), 1, 190, 1, 1090,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-chu-u-luxhome-executive',
'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg',
'SP080', NOW(), NOW()),

(UUID(), 'Bàn họp dài Gotrust 3m 10 người',
'Mặt gỗ MFC dày 36mm, chân sắt hộp, thiết kế liền khối, sang trọng cho không gian hội nghị.',
CURDATE(), 1, 230, 1, 970,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-hop-dai-gotrust-3m',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP081', NOW(), NOW()),


(UUID(), 'Bàn cụm 4 chỗ IKEA Connect',
'Bàn modular có vách ngăn, mặt phủ melamine, thích hợp mô hình coworking.',
CURDATE(), 1, 170, 1, 860,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-cum-4-cho-ikea-connect',
'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg',
'SP082', NOW(), NOW()),

(UUID(), 'Bàn tiếp khách VHome Coffee Table',
'Mặt kính cường lực, chân gỗ sồi, thiết kế đơn giản, phù hợp khu vực lễ tân.',
CURDATE(), 1, 150, 1, 840,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-tiep-khach-vhome-coffee',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP083', NOW(), NOW()),

(UUID(), 'Bàn giám đốc đôi LuxHome Master Desk',
'Bàn đôi kết hợp tủ tài liệu, mặt veneer walnut, khung sắt đen, sang trọng.',
CURDATE(), 1, 100, 1, 810,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-giam-doc-doi-luxhome-master',
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
'SP084', NOW(), NOW()),

(UUID(), 'Bàn làm việc mini Hòa Phát Simple',
'Mặt bàn 1m, chân sắt gấp gọn, phù hợp văn phòng nhỏ hoặc làm việc tại nhà.',
CURDATE(), 1, 210, 1, 970,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Bàn ăn'),
'ban-lam-viec-mini-hoa-phat-simple',
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
'SP085', NOW(), NOW()),

(UUID(), 'Tủ hồ sơ 3 buồng LuxHome',
'Tủ lớn, cửa kính cường lực, màu vân gỗ nâu sáng, lưu trữ tài liệu khoa học.',
CURDATE(), 1, 190, 1, 880,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-ho-so-3-buong-luxhome',
'https://images.pexels.com/photos/7061412/pexels-photo-7061412.jpeg',
'SP086', NOW(), NOW()),

(UUID(), 'Tủ di động IKEA UnderDesk Drawer',
'Tủ nhỏ đặt dưới bàn, 3 ngăn kéo, bánh xe dễ di chuyển, màu trắng thanh lịch.',
CURDATE(), 1, 120, 1, 780,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-di-dong-ikea-underdesk',
'https://images.pexels.com/photos/7061413/pexels-photo-7061413.jpeg',
'SP087', NOW(), NOW()),

(UUID(), 'Tủ hồ sơ gỗ sồi Gotrust Classic',
'Tủ 4 tầng, gỗ sồi tự nhiên, màu vàng sáng, phù hợp không gian giám đốc.',
CURDATE(), 1, 110, 1, 770,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-ho-so-go-soi-gotrust-classic',
'https://images.pexels.com/photos/7061412/pexels-photo-7061412.jpeg',
'SP088', NOW(), NOW()),

(UUID(), 'Tủ sắt văn phòng Hòa Phát TL-Metal',
'Tủ sắt sơn tĩnh điện, 2 tầng, cửa trượt, chịu lực tốt, bền bỉ với thời gian.',
CURDATE(), 1, 170, 1, 880,
(SELECT id FROM thuong_hieu WHERE tenbrand='Nội thất Hòa Phát'),
(SELECT id FROM danh_muc WHERE tendm='Tủ quần áo'),
'tu-sat-van-phong-hoa-phat-tlmetal',
'https://images.pexels.com/photos/7061412/pexels-photo-7061412.jpeg',
'SP089', NOW(), NOW()),

(UUID(), 'Kệ góc trang trí AConcept Elegant',
'Thiết kế hình tam giác, tiết kiệm không gian, phù hợp góc phòng hoặc hành lang.',
CURDATE(), 1, 140, 1, 790,
(SELECT id FROM thuong_hieu WHERE tenbrand='AConcept'),
(SELECT id FROM danh_muc WHERE tendm='Kệ trang trí'),
'ke-goc-trang-tri-aconcept-elegant',
'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg',
'SP090', NOW(), NOW()),

(UUID(), 'Kệ gỗ 5 tầng LuxHome Stand',
'Kệ đứng 5 tầng, gỗ MDF phủ laminate, tông nâu nhạt, lưu trữ hồ sơ, cây cảnh nhỏ.',
CURDATE(), 1, 100, 1, 810,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Kệ trang trí'),
'ke-go-5-tang-luxhome-stand',
'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg',
'SP091', NOW(), NOW()),


(UUID(), 'Đèn sàn văn phòng IKEA TallLamp',
'Đèn sàn kiểu dáng thanh mảnh, ánh sáng vàng, phù hợp góc làm việc hoặc đọc sách.',
CURDATE(), 1, 170, 1, 850,
(SELECT id FROM thuong_hieu WHERE tenbrand='IKEA'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-san-van-phong-ikea-talllamp',
'https://images.pexels.com/photos/271635/pexels-photo-271635.jpeg',
'SP092', NOW(), NOW()),

(UUID(), 'Đèn bàn LED LuxHome SmartEye',
'Cảm ứng thông minh, điều chỉnh ánh sáng tự nhiên, tiết kiệm năng lượng.',
CURDATE(), 1, 140, 1, 780,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ban-led-luxhome-smarteye',
'https://images.pexels.com/photos/619419/pexels-photo-619419.jpeg',
'SP093', NOW(), NOW()),

(UUID(), 'Đèn ốp trần Gotrust Halo LED',
'Thiết kế viền mảnh, ánh sáng dịu nhẹ, phù hợp phòng họp hoặc không gian chung.',
CURDATE(), 1, 180, 1, 850,
(SELECT id FROM thuong_hieu WHERE tenbrand='Gotrust'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-op-tran-gotrust-halo-led',
'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
'SP094', NOW(), NOW()),

(UUID(), 'Đèn chùm LuxHome Elegant Chandelier',
'Đèn chùm pha lê, ánh sáng trắng, tạo điểm nhấn sang trọng cho văn phòng cao cấp.',
CURDATE(), 1, 90, 1, 910,
(SELECT id FROM thuong_hieu WHERE tenbrand='LuxHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-chum-luxhome-elegant-chandelier',
'https://images.pexels.com/photos/1966626/pexels-photo-1966626.jpeg',
'SP095', NOW(), NOW()),

-- 💡 Đèn bàn nhỏ VHome BrightMini
(UUID(), 'Đèn bàn nhỏ VHome BrightMini',
'Đèn mini ánh sáng trắng, thiết kế gấp gọn, tiện mang theo khi làm việc linh hoạt.',
CURDATE(), 1, 150, 1, 890,
(SELECT id FROM thuong_hieu WHERE tenbrand='VHome'),
(SELECT id FROM danh_muc WHERE tendm='Đèn trang trí'),
'den-ban-nho-vhome-brightmini',
'https://images.pexels.com/photos/619419/pexels-photo-619419.jpeg',
'SP096', NOW(), NOW());
-- =========================================
-- BIẾN THỂ
-- =========================================
-- 🧹 XÓA DỮ LIỆU CŨ TRƯỚC KHI GEN MỚI
-- =========================================
DELETE FROM sanpham_bienthe;

-- =========================================
-- 🪄 TẠO 5 BIẾN THỂ CHO MỖI SẢN PHẨM (TỰ ĐỘNG THEO DANH MỤC)
-- =========================================
INSERT INTO sanpham_bienthe
(id, sanpham_id, mausac, kichthuoc, chatlieu, sl_tonkho, gia, code, created_at, updated_at)
SELECT 
  UUID(),
  sp.id,

  -- 🎨 Màu sắc (phụ thuộc thứ tự để không trùng)
  ELT(x.n, 'Trắng', 'Đen', 'Nâu', 'Xám', 'Be'),

  -- 📏 Kích thước (theo danh mục)
  CASE 
    WHEN dm.tendm LIKE '%Bàn%' THEN ELT(x.n, '120x60cm', '140x70cm', '160x80cm', '180x90cm', '200x100cm')
    WHEN dm.tendm LIKE '%Ghế%' THEN ELT(x.n, 'Nhỏ', 'Trung bình', 'Lớn', 'Cao', 'Siêu rộng')
    WHEN dm.tendm LIKE '%Tủ%' THEN ELT(x.n, '2 cánh', '3 cánh', '4 cánh', '5 cánh', '6 cánh')
    WHEN dm.tendm LIKE '%Giường%' THEN ELT(x.n, '140x200cm', '160x200cm', '180x200cm', '200x220cm', '220x240cm')
    WHEN dm.tendm LIKE '%Kệ%' THEN ELT(x.n, '3 tầng', '4 tầng', '5 tầng', '6 tầng', '7 tầng')
    WHEN dm.tendm LIKE '%Đèn%' THEN ELT(x.n, 'Nhỏ', 'Vừa', 'Lớn', 'Cao', 'Siêu lớn')
    WHEN dm.tendm LIKE '%Thảm%' THEN ELT(x.n, '1.2x1.8m', '1.6x2.3m', '2x3m', '2.4x3.2m', '3x4m')
    ELSE NULL
  END,

  -- 🪵 Chất liệu (theo danh mục)
  CASE 
    WHEN dm.tendm LIKE '%Ghế%' THEN ELT(x.n, 'Nhựa ABS', 'Inox', 'Gỗ sồi', 'Gỗ công nghiệp', 'Da PU')
    WHEN dm.tendm LIKE '%Bàn%' THEN ELT(x.n, 'Gỗ công nghiệp', 'Inox', 'Gỗ sồi', 'Kim loại', 'Đá nhân tạo')
    WHEN dm.tendm LIKE '%Tủ%' THEN ELT(x.n, 'Gỗ MDF', 'Inox', 'Gỗ sồi', 'Nhôm', 'Kính cường lực')
    WHEN dm.tendm LIKE '%Kệ%' THEN ELT(x.n, 'Kim loại', 'MDF', 'Inox', 'Gỗ sồi', 'Nhôm')
    WHEN dm.tendm LIKE '%Đèn%' THEN ELT(x.n, 'Nhôm', 'Sắt', 'Thủy tinh', 'Đồng', 'Nhựa ABS')
    WHEN dm.tendm LIKE '%Thảm%' THEN ELT(x.n, 'Len', 'Vải nỉ', 'Sợi tổng hợp', 'Cotton', 'Polyester')
    WHEN dm.tendm LIKE '%Giường%' THEN ELT(x.n, 'Gỗ sồi', 'Vải nỉ', 'Da PU', 'Gỗ công nghiệp', 'Inox')
    ELSE 'Gỗ công nghiệp'
  END,

  -- 📦 Số lượng tồn kho ngẫu nhiên
  FLOOR(5 + RAND()*40),

  -- 💰 Giá ngẫu nhiên tùy danh mục
  CASE 
    WHEN dm.tendm LIKE '%Ghế%' THEN FLOOR(1200000 + RAND()*3000000)
    WHEN dm.tendm LIKE '%Bàn%' THEN FLOOR(2000000 + RAND()*2500000)
    WHEN dm.tendm LIKE '%Tủ%' THEN FLOOR(3000000 + RAND()*2500000)
    WHEN dm.tendm LIKE '%Giường%' THEN FLOOR(4000000 + RAND()*3500000)
    WHEN dm.tendm LIKE '%Kệ%' THEN FLOOR(1200000 + RAND()*1000000)
    WHEN dm.tendm LIKE '%Đèn%' THEN FLOOR(800000 + RAND()*600000)
    WHEN dm.tendm LIKE '%Thảm%' THEN FLOOR(500000 + RAND()*600000)
    ELSE FLOOR(1000000 + RAND()*2000000)
  END,

  --  Code duy nhất tuyệt đối
  CONCAT('BT', LEFT(REPLACE(UUID(), '-', ''), 8)),

  NOW(), NOW()
FROM san_pham sp
JOIN danh_muc dm ON sp.danhmuc_id = dm.id
-- 🔁 Sinh 5 biến thể / sản phẩm
JOIN (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 
  UNION ALL SELECT 4 UNION ALL SELECT 5
) AS x
ON 1=1;
-- =========================================
-- DANH MỤC BÀI VIẾT
-- =========================================
INSERT INTO danhmuc_baiviet (id, tendanhmuc, mota)
VALUES
(UUID(),'Tin tức nội thất','Cập nhật xu hướng mới nhất.'),
(UUID(),'Mẹo chăm sóc đồ gỗ','Cách giữ đồ bền đẹp.'),
(UUID(),'Xu hướng thiết kế','Phong cách hiện đại.'),
(UUID(),'Trang trí nhà cửa','Gợi ý decor sáng tạo.'),
(UUID(),'Phong cách sống','Sống xanh, tối giản.'),
(UUID(),'Vật liệu & công năng','Giới thiệu vật liệu mới.');

-- =========================================
-- BÀI VIẾT
-- =========================================
INSERT INTO bai_viet (id, tieude, noidung, hinh_anh, danhmuc_baiviet_id, user_id)
VALUES
(UUID(), 
'Nghệ thuật phối màu nội thất phòng khách hiện đại',
'Phòng khách là không gian trung tâm thể hiện cá tính của gia chủ. Khi lựa chọn màu sắc, nên ưu tiên tông trung tính như be, xám hoặc trắng kết hợp với các điểm nhấn đậm màu như cam đất hoặc xanh rêu. Sự cân bằng giữa sáng và tối giúp không gian vừa sang trọng vừa ấm áp. Ngoài ra, việc kết hợp vật liệu tự nhiên như gỗ, mây tre hoặc đá sẽ tạo cảm giác gần gũi và thư giãn. Đừng quên sử dụng thảm, rèm cửa và gối ôm để tăng thêm chiều sâu cho tổng thể thiết kế.', 
'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Bí quyết chọn sofa phù hợp với không gian sống',
'Sofa là linh hồn của phòng khách, vì vậy lựa chọn đúng kiểu dáng, màu sắc và chất liệu là yếu tố quyết định. Với phòng nhỏ, nên chọn sofa góc chữ L để tiết kiệm diện tích, còn với không gian lớn, sofa da thật hoặc sofa vải nỉ cao cấp mang lại vẻ sang trọng. Màu sắc nên hài hòa với tường và sàn nhà, đồng thời có thể tạo điểm nhấn bằng gối tựa hoặc thảm. Ngoài ra, chất liệu da thật giúp dễ vệ sinh, trong khi vải nỉ đem lại cảm giác mềm mại, phù hợp với khí hậu mát mẻ.', 
'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Thiết kế phòng ăn mở – xu hướng nội thất năm 2025',
'Không gian mở giữa phòng bếp và phòng ăn đang trở thành xu hướng phổ biến. Việc loại bỏ vách ngăn giúp ánh sáng lan tỏa, tạo cảm giác rộng rãi và kết nối giữa các thành viên. Bàn ăn gỗ sồi kết hợp ghế bọc da hoặc nỉ mang lại vẻ sang trọng nhưng vẫn thân thiện. Đèn thả trần với ánh sáng vàng ấm giúp bữa ăn thêm ấm cúng. Đừng quên bố trí thêm cây xanh nhỏ hoặc tranh tường để tạo điểm nhấn nhẹ nhàng, giúp không gian sống sinh động và thoáng đãng hơn.', 
'https://images.pexels.com/photos/4207785/pexels-photo-4207785.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Ánh sáng và cảm xúc trong thiết kế nội thất',
'Ánh sáng đóng vai trò quan trọng trong việc tạo cảm xúc cho không gian sống. Việc kết hợp ánh sáng tự nhiên và nhân tạo hợp lý có thể thay đổi hoàn toàn không khí của căn phòng. Ban ngày, tận dụng tối đa nguồn sáng tự nhiên qua cửa sổ lớn hoặc rèm mỏng. Buổi tối, sử dụng đèn sàn, đèn bàn hoặc đèn âm trần với nhiệt độ màu ấm để tạo cảm giác thư giãn. Ngoài ra, ánh sáng gián tiếp từ các khe hắt trần hoặc tường có thể giúp căn phòng trở nên sang trọng và sâu hơn.', 
'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Không gian làm việc tại nhà tiện nghi và sáng tạo',
'Xu hướng làm việc tại nhà khiến nhu cầu về góc làm việc cá nhân tăng cao. Một bàn làm việc đơn giản, ghế công thái học và ánh sáng tốt sẽ giúp nâng cao hiệu suất. Màu sắc nhẹ nhàng như xanh pastel, trắng hoặc gỗ sáng giúp tập trung hơn. Nếu có thể, đặt bàn gần cửa sổ để tận dụng ánh sáng tự nhiên. Trang trí thêm kệ sách, cây nhỏ hoặc tranh nghệ thuật để tạo động lực mỗi khi làm việc. Sự hài hòa giữa công năng và thẩm mỹ là yếu tố then chốt của không gian này.', 
'https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Phong thủy phòng ngủ – Bí quyết ngủ ngon mỗi đêm',
'Phòng ngủ là nơi tái tạo năng lượng nên việc bố trí hợp phong thủy rất quan trọng. Giường không nên đặt đối diện cửa chính hoặc gương, tránh luồng khí xấu. Màu sắc nên chọn các gam ấm như kem, be, hồng nhạt hoặc xanh nhẹ để mang lại cảm giác an yên. Vật liệu tự nhiên như gỗ, vải cotton giúp giấc ngủ sâu hơn. Tránh để quá nhiều thiết bị điện tử trong phòng, vì sóng điện từ ảnh hưởng đến chất lượng giấc ngủ. Một phòng ngủ cân bằng là nền tảng cho sức khỏe và tinh thần tốt.', 
'https://images.pexels.com/photos/6585760/pexels-photo-6585760.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Tối ưu không gian nhỏ – bí quyết dành cho căn hộ hiện đại',
'Với diện tích hạn chế, thiết kế thông minh là chìa khóa. Hãy chọn nội thất đa năng như giường có ngăn kéo, bàn gấp, hoặc ghế có thể cất gọn. Sử dụng tông màu sáng giúp không gian trông lớn hơn, đồng thời kết hợp gương hoặc cửa kính để mở rộng tầm nhìn. Ánh sáng tự nhiên luôn là yếu tố quan trọng giúp căn phòng thông thoáng. Ngoài ra, việc hạn chế đồ đạc không cần thiết và bố trí hợp lý giúp tạo cảm giác ngăn nắp, tiện nghi và hiện đại.', 
'https://images.pexels.com/photos/157382/pexels-photo-157382.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Chất liệu gỗ trong thiết kế nội thất Việt Nam hiện đại',
'Gỗ là vật liệu truyền thống nhưng vẫn luôn được yêu thích trong thiết kế nội thất hiện đại. Gỗ sồi, gỗ óc chó hoặc gỗ thông mang lại cảm giác ấm cúng, gần gũi. Khi kết hợp với kim loại hoặc kính, gỗ tạo nên sự cân bằng giữa truyền thống và hiện đại. Ngoài ra, việc xử lý bề mặt bằng dầu hoặc sơn mờ giúp giữ màu tự nhiên lâu hơn. Để không gian không bị nặng nề, nên kết hợp gỗ với tường trắng hoặc sàn sáng màu, giúp tổng thể nhẹ nhàng mà vẫn sang trọng.', 
'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Đèn trang trí – điểm nhấn tinh tế trong không gian sống',
'Một chiếc đèn đẹp không chỉ chiếu sáng mà còn là chi tiết trang trí đầy tinh tế. Đèn thả trần ở phòng ăn tạo nên bữa cơm ấm cúng, đèn cây trong góc đọc sách mang lại cảm giác thư giãn. Khi chọn đèn, hãy chú ý đến tông màu ánh sáng và kiểu dáng sao cho phù hợp phong cách tổng thể. Đèn vàng giúp không gian ấm cúng, đèn trắng cho cảm giác hiện đại, đèn RGB lại tạo nét phá cách. Đèn là linh hồn của không gian nếu biết đặt đúng chỗ.', 
'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1)),

(UUID(), 
'Tạo điểm nhấn với thảm trải sàn phong cách Bắc Âu',
'Thảm trải sàn không chỉ giúp bảo vệ sàn nhà mà còn là yếu tố thẩm mỹ quan trọng. Phong cách Bắc Âu ưa chuộng thảm có họa tiết hình học hoặc đơn sắc nhẹ nhàng, chất liệu len hoặc cotton tự nhiên. Màu sắc nên hài hòa với sofa và rèm cửa. Thảm lớn có thể giúp phân chia không gian mở, tạo ranh giới giữa phòng khách và khu ăn uống. Để giữ thảm luôn mới, nên hút bụi thường xuyên và tránh phơi dưới nắng gắt. Một tấm thảm đẹp có thể thay đổi hoàn toàn diện mạo căn phòng.', 
'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg',
(SELECT id FROM danhmuc_baiviet ORDER BY RAND() LIMIT 1),
(SELECT id FROM nguoi_dung ORDER BY RAND() LIMIT 1));

-- =========================================
-- REVIEW
-- =========================================
INSERT INTO danh_gia (id, user_id, bienthe_id, rating, binhluan)
SELECT UUID(), @u2, id, FLOOR(3 + RAND()*2),
CONCAT('Sản phẩm rất ', ELT(FLOOR(RAND()*3)+1, 'tốt', 'đẹp', 'hài lòng'))
FROM sanpham_bienthe LIMIT 5;


-- =========================================
-- 🧹 XÓA ẢNH CŨ TRƯỚC KHI THÊM MỚI
-- =========================================
DELETE FROM hinh_anh;

-- =========================================
-- 📸 THÊM ẢNH CHO MỖI BIẾN THỂ (3 ẢNH / BIẾN THỂ)
-- =========================================
INSERT INTO hinh_anh (id, bienthe_id, url, created_at, updated_at)
SELECT 
  UUID(),
  bt.id,
  CASE 
    WHEN dm.tendm LIKE '%Ghế%' THEN ELT(x.n,
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg',
      'https://images.pexels.com/photos/157382/pexels-photo-157382.jpeg',
      'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg'
    )
    WHEN dm.tendm LIKE '%Bàn%' THEN ELT(x.n,
      'https://images.pexels.com/photos/4207785/pexels-photo-4207785.jpeg',
      'https://images.pexels.com/photos/4207786/pexels-photo-4207786.jpeg',
      'https://images.pexels.com/photos/5695871/pexels-photo-5695871.jpeg'
    )
    WHEN dm.tendm LIKE '%Tủ%' THEN ELT(x.n,
      'https://images.pexels.com/photos/6585766/pexels-photo-6585766.jpeg',
      'https://images.pexels.com/photos/6585768/pexels-photo-6585768.jpeg',
      'https://images.pexels.com/photos/6489128/pexels-photo-6489128.jpeg'
    )
    WHEN dm.tendm LIKE '%Giường%' THEN ELT(x.n,
      'https://images.pexels.com/photos/6585760/pexels-photo-6585760.jpeg',
      'https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
    )
    WHEN dm.tendm LIKE '%Kệ%' THEN ELT(x.n,
      'https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg',
      'https://images.pexels.com/photos/819959/pexels-photo-819959.jpeg',
      'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg'
    )
    WHEN dm.tendm LIKE '%Đèn%' THEN ELT(x.n,
      'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg',
      'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg',
      'https://images.pexels.com/photos/279646/pexels-photo-279646.jpeg'
    )
    WHEN dm.tendm LIKE '%Thảm%' THEN ELT(x.n,
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1457841/pexels-photo-1457841.jpeg',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg'
    )
    ELSE ELT(x.n,
      'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
      'https://images.pexels.com/photos/157382/pexels-photo-157382.jpeg',
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg'
    )
  END AS url,
  NOW(), NOW()
FROM sanpham_bienthe bt
JOIN san_pham sp ON bt.sanpham_id = sp.id
JOIN danh_muc dm ON sp.danhmuc_id = dm.id
JOIN (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3) AS x
ON 1=1;