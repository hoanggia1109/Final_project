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
  "user",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "user" },
    trangthai: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  { tableName: "user", timestamps: false }
);
// MÃ GIẢM GIÁ

const MaGiamGiaModel = sequelize.define("ma_giam_gia", {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  code: DataTypes.STRING,
  mota: DataTypes.STRING,
  loai: DataTypes.STRING,
  giatrigiam: DataTypes.DECIMAL,
  trangthai: DataTypes.TINYINT,
  ngaybatdau: DataTypes.DATE,
  ngayketthuc: DataTypes.DATE,
  soluong: DataTypes.INTEGER,
  giatri_toithieu: DataTypes.DECIMAL,
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
  },
  { tableName: "danh_muc", timestamps: false }
);

// THƯƠNG HIỆU
// THƯƠNG HIỆU
const ThuongHieuModel = sequelize.define(
  "thuonghieu",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    code: DataTypes.STRING,
    tenbrand: DataTypes.STRING,
    logo: DataTypes.TEXT,
    thutu: DataTypes.INTEGER,
    anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  { tableName: "thuonghieu", timestamps: false }
);


// SẢN PHẨM
const SanPhamModel = sequelize.define(
  "san_pham",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    tensp: DataTypes.STRING,
    mota: DataTypes.TEXT,
    hot: { type: DataTypes.TINYINT, defaultValue: 0 },
    anhien: { type: DataTypes.TINYINT, defaultValue: 1 },
    thumbnail: DataTypes.TEXT,
    danhmuc_id: DataTypes.CHAR(36),
    thuonghieu_id: DataTypes.CHAR(36),
  },
  {tableName: "san_pham",
   timestamps: false }
);

// BIẾN THỂ
const SanPhamBienTheModel = sequelize.define(
  "sanpham_bienthe",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    sanpham_id: DataTypes.CHAR(36),
    mausac: DataTypes.STRING,
    sl_tonko: DataTypes.INTEGER,
    gia: DataTypes.DECIMAL(10, 2),
  },
  { tableName : "sanpham_bienthe", timestamps: false }
);

// ẢNH
const ImageModel = sequelize.define(
  "images",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    bienthe_id: DataTypes.CHAR(36),
    url: DataTypes.TEXT,
  },
  { tableName : "images", timestamps: false }
);

// GIỎ HÀNG
const GioHangModel = sequelize.define(
  "gio_hang",
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: DataTypes.CHAR(36),
    bienthe_id: DataTypes.CHAR(36),
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
    tongtien: DataTypes.DECIMAL(15, 2),
    trangthai: { type: DataTypes.STRING, defaultValue: "pending" },
  },
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
  },
  { tableName:"chitiet_donhang", timestamps: false }
);

/* ------------------ QUAN HỆ ------------------ */
// ======================
// 🔗 Quan hệ bảng sản phẩm
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
// 🔗 Quan hệ giỏ hàng
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
// 🔗 Quan hệ đơn hàng
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
  DonHangModel,
  DonHangChiTietModel,
};