const { Sequelize, DataTypes } = require("sequelize");

// Kết nối database MySQL
const sequelize = new Sequelize("shopnoithat", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

/* ------------------ MODELS ------------------ */

// USER
const UserModel = sequelize.define(
  "nguoi_dung",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    ngaysinh : { type: DataTypes.DATEONLY, allowNull: true },
    gioitinh :{ type: DataTypes.STRING, allowNull: true },
    ho_ten : { type: DataTypes.STRING, allowNull: true },
    sdt : { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin','customer'), defaultValue: "customer" },
    trangthai: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
  },
  { tableName: "nguoi_dung", timestamps: false }
);

//Địa chỉ 
const DiaChiModel = sequelize.define(
  "dia_chi",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: DataTypes.CHAR(36),
    hoten : DataTypes.STRING,
    sdt : DataTypes.STRING,
    diachichitiet: DataTypes.TEXT,
    phuong_xa: DataTypes.STRING,
    quan_huyen: DataTypes.STRING,
    tinh_thanh: DataTypes.STRING,
    macdinh: { type: DataTypes.TINYINT, defaultValue: 0 },
    loaidiachi : DataTypes.ENUM("home", "office", "other"),
     created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},

  },
  { tableName: "dia_chi", timestamps: false }
)
// MÃ GIẢM GIÁ

const MaGiamGiaModel = sequelize.define("ma_giam_gia", {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  code: DataTypes.STRING,
  mota: DataTypes.STRING,
  loai: DataTypes.ENUM("percent", "cash", "freeship"),
  giatrigiam: DataTypes.DECIMAL,
  trangthai: DataTypes.TINYINT,
  ngaybatdau: DataTypes.DATE,
  ngayketthuc: DataTypes.DATE,
  soluong: DataTypes.INTEGER,
  giatri_toithieu: DataTypes.DECIMAL(10,2),
  created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
  updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
},
 { tableName: "ma_giam_gia",  timestamps : false }
);


// DANH MỤC
const LoaiModel = sequelize.define(
  "danh_muc",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    tendm: DataTypes.STRING,
    mota: DataTypes.TEXT,
    anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
    image : { type: DataTypes.STRING, allowNull : true },
    code : DataTypes.STRING, 
     created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
  },
  { tableName: "danh_muc", timestamps: false }
);

// THƯƠNG HIỆU
const ThuongHieuModel = sequelize.define(
  "thuong_hieu",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    tenbrand: DataTypes.STRING,
    logo : DataTypes.STRING,
    thutu : DataTypes.INTEGER,
    anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
     created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
  },
  { tableName: "thuong_hieu",  timestamps: false }
);

// SẢN PHẨM
const SanPhamModel = sequelize.define(
  "san_pham",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    code: DataTypes.STRING,
    tensp: DataTypes.STRING,
    mota: DataTypes.TEXT,
    ngay: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    trangthai : DataTypes.TINYINT,
    ratingTB : { type: DataTypes.DECIMAL(3,1), defaultValue: 0 },
    anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
    luotxem: { type: DataTypes.INTEGER, defaultValue: 0 },
    luotban : { type: DataTypes.INTEGER, defaultValue: 0 },
    slug: DataTypes.STRING,
     created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
    thumbnail: DataTypes.TEXT,
    danhmuc_id: DataTypes.CHAR(36),
    thuonghieu_id: DataTypes.CHAR(36),
  },
  {tableName: "san_pham",
   timestamps: false }
);
//BANNER
const BannerModel = sequelize.define("banners", {
  id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  tieude: DataTypes.STRING,
  mota: DataTypes.TEXT,
  url: DataTypes.STRING,
  thutu: DataTypes.INTEGER,
  anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
  linksp : DataTypes.STRING,
  created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
  updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
},
  { tableName: "banners",  timestamps : false }
  );

//Danh mục bài viết 
const DanhMucBaiVietModel = sequelize.define(
  "danhmuc_baiviet",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    tendanhmuc: DataTypes.STRING,
    mota: DataTypes.TEXT,
    anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
     created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
  },
  { tableName: "danhmuc_baiviet", timestamps: false });

  const BaiVietModel = sequelize.define(
    "bai_viet",
    {
      id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      tieude: DataTypes.STRING,
      noidung: DataTypes.TEXT,
      anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
      hinh_anh: DataTypes.STRING,
      user_id: DataTypes.CHAR(36),
      danhmuc_baiviet_id: DataTypes.CHAR(36),
        created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
      updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
    },
    { tableName: "bai_viet", timestamps: false }
  );

  const DanhGiaModel = sequelize.define(
    "danh_gia",
    {
      id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      user_id: DataTypes.CHAR(36),
      chitiet_donhang_id: DataTypes.CHAR(36),
      rating: DataTypes.INTEGER,
      binhluan: DataTypes.TEXT,
        created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
      updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
    },
    { tableName: "danh_gia", timestamps: false }
  );
// BIẾN THỂ
const SanPhamBienTheModel = sequelize.define(
  "sanpham_bienthe",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    sanpham_id: DataTypes.CHAR(36),
    mausac: DataTypes.STRING,
    kichthuoc: DataTypes.STRING,
    chatlieu: DataTypes.STRING,
    gia: DataTypes.DECIMAL(10, 2),
    code: DataTypes.STRING,
    sl_tonkho: DataTypes.INTEGER,
    created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
  },
  { tableName : "sanpham_bienthe", timestamps: false }
);

// ẢNH
const ImageModel = sequelize.define(
  "hinh_anh",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    bienthe_id: DataTypes.CHAR(36),
    url: DataTypes.TEXT,
  },
  { tableName : "hinh_anh", timestamps: false }
);

// GIỎ HÀNG
const GioHangModel = sequelize.define(
  "gio_hang",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: DataTypes.CHAR(36),
    bienthe_id: DataTypes.CHAR(36),
     created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
    soluong: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { tableName: "gio_hang", timestamps: false }
);

// ĐƠN HÀNG
const DonHangModel = sequelize.define(
  "don_hang",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    code: DataTypes.STRING,
    user_id: DataTypes.CHAR(36),
    ngaymua: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ghichu : DataTypes.TEXT,
    phi_van_chuyen : DataTypes.DECIMAL(15, 2),
    magiaodich: DataTypes.CHAR(100),
    magiamgia_id: DataTypes.CHAR(36),
    diachi_id: DataTypes.CHAR(36),
    thoidiemthanhtoan : DataTypes.DATE,
    trangthaithanhtoan: DataTypes.ENUM('pending','paid','failed','refunded','cancelled'),
      created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
      updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
    tongtien: {type:DataTypes.DECIMAL(15, 2), defaultValue : 0},
    giamgia: {type:DataTypes.DECIMAL(15, 2), defaultValue : 0},
    tongtien_saugiam: {type:DataTypes.DECIMAL(15, 2), defaultValue : 0},
trangthai: {
  type: DataTypes.ENUM("pending", "confirmed", "shipping", "delivered", "cancelled", "returned"),
  defaultValue: "pending",
}  },
  { tableName:"don_hang", timestamps: false }
);

// CHI TIẾT ĐƠN HÀNG
const DonHangChiTietModel = sequelize.define(
  "chitiet_donhang",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    donhang_id: DataTypes.CHAR(36),
    bienthe_id: DataTypes.CHAR(36),
    soluong: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(10, 2),
     created_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW },
    updated_at :{ type : DataTypes.DATE, defaultValue : DataTypes.NOW},
  },
  { tableName:"chitiet_donhang", timestamps: false }
);

const ReviewImageModel = sequelize.define("hinhanh_danhgia", {
  id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  danhgia_id: DataTypes.CHAR(36),
  url: DataTypes.TEXT,
}, {
  tableName: "hinhanh_danhgia",
  timestamps: false, // hoặc true nếu muốn có created_at / updated_at
});

/* ------------------ QUAN HỆ ------------------ */
// ======================
// Quan hệ bảng sản phẩm
// ======================

// Danh mục có nhiều sản phẩm
LoaiModel.hasMany(SanPhamModel, {
  foreignKey: "danhmuc_id",
  as: "sanphams",
});
SanPhamModel.belongsTo(LoaiModel, {
  foreignKey: "danhmuc_id",
  as: "danhmuc",
});

// Thương hiệu có nhiều sản phẩm
ThuongHieuModel.hasMany(SanPhamModel, {
  foreignKey: "thuonghieu_id",
  as: "sanphams",
});
SanPhamModel.belongsTo(ThuongHieuModel, {
  foreignKey: "thuonghieu_id",
  as: "thuonghieu",
});

// Một sản phẩm có nhiều biến thể
SanPhamModel.hasMany(SanPhamBienTheModel, {
  foreignKey: "sanpham_id",
  as: "bienthe",
});
SanPhamBienTheModel.belongsTo(SanPhamModel, {
  foreignKey: "sanpham_id",
  as: "sanpham",
});

// Một biến thể có nhiều hình ảnh
SanPhamBienTheModel.hasMany(ImageModel, {
  foreignKey: "bienthe_id",
  as: "images",
});
ImageModel.belongsTo(SanPhamBienTheModel, {
  foreignKey: "bienthe_id",
  as: "bienthe",
});


// ======================
// Quan hệ giỏ hàng
// ======================
UserModel.hasMany(GioHangModel, {
  foreignKey: "user_id",
  as: "giohang",
});
GioHangModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

SanPhamBienTheModel.hasMany(GioHangModel, {
  foreignKey: "bienthe_id",
  as: "giohang",
});
GioHangModel.belongsTo(SanPhamBienTheModel, {
  foreignKey: "bienthe_id",
  as: "bienthe",
});

// ======================
//  Quan hệ đơn hàng
// ======================
UserModel.hasMany(DonHangModel, {
  foreignKey: "user_id",
  as: "donhang",
});
DonHangModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

DonHangModel.hasMany(DonHangChiTietModel, {
  foreignKey: "donhang_id",
  as: "chitiet",
});
DonHangChiTietModel.belongsTo(DonHangModel, {
  foreignKey: "donhang_id",
  as: "donhang",
});

SanPhamBienTheModel.hasMany(DonHangChiTietModel, {
  foreignKey: "bienthe_id",
  as: "donhangchitiet",
});
DonHangChiTietModel.belongsTo(SanPhamBienTheModel, {
  foreignKey: "bienthe_id",
  as: "bienthe",
});

UserModel.hasMany(DiaChiModel, {
  foreignKey: "user_id",
  as: "diachis",
});
DiaChiModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});
DiaChiModel.hasMany(DonHangModel, {
  foreignKey: "diachi_id",
  as: "donhangs",
});
DonHangModel.belongsTo(DiaChiModel, {
  foreignKey: "diachi_id",
  as: "diachi",
});

MaGiamGiaModel.hasMany(DonHangModel, {
  foreignKey: "magiamgia_id",
  as: "donhangs",
});
DonHangModel.belongsTo(MaGiamGiaModel, {
  foreignKey: "magiamgia_id",
  as: "magiamgia",
});

UserModel.hasMany(DanhGiaModel, {
  foreignKey: "user_id",
  as: "danhgias",
});
DanhGiaModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});
// Đánh giá liên kết tới chi tiết đơn hàng
DonHangChiTietModel.hasMany(DanhGiaModel, {
  foreignKey: "chitiet_donhang_id",
  as: "danhgias",
});
DanhGiaModel.belongsTo(DonHangChiTietModel, {
  foreignKey: "chitiet_donhang_id",
  as: "chitiet_donhang",
});

UserModel.hasMany(BaiVietModel, {
  foreignKey: "user_id",
  as: "baiviets",
});
BaiVietModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

DanhMucBaiVietModel.hasMany(BaiVietModel, {
  foreignKey: "danhmuc_baiviet_id",
  as: "baiviets",
});
BaiVietModel.belongsTo(DanhMucBaiVietModel, {
  foreignKey: "danhmuc_baiviet_id",
  as: "danhmuc",
});
DanhGiaModel.hasMany(ReviewImageModel, { foreignKey: "danhgia_id", as: "hinhanh" });
ReviewImageModel.belongsTo(DanhGiaModel, { foreignKey: "danhgia_id", as: "danhgia" });
/* ------------------ EXPORT ------------------ */
module.exports = {
  sequelize,
  UserModel,
  LoaiModel,
  ThuongHieuModel,
  MaGiamGiaModel,
  SanPhamModel,
  SanPhamBienTheModel,
  ImageModel,
  GioHangModel,
  DiaChiModel,
  BaiVietModel,
  DanhMucBaiVietModel,
  DanhGiaModel,
  DonHangModel,
  DonHangChiTietModel,
  ReviewImageModel,
  BannerModel,
};