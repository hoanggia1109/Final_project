const express = require("express");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { auth } = require("../middleware/auth");
const {
  UserModel,
  SanPhamModel,
  LoaiModel,
  ThuongHieuModel,
  DonHangModel,
  MaGiamGiaModel,
  BaiVietModel,
  DanhMucBaiVietModel,
} = require("../database");

const router = express.Router();

/*  AUTH CHECK  */
const isAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });
  const user = await UserModel.findByPk(req.user.id);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  next();
};

/*  DASHBOARD  */
router.get("/dashboard", auth, isAdmin, async (req, res) => {
  const sp = await SanPhamModel.count();
  const dh = await DonHangModel.count();
  const nd = await UserModel.count();
  const bv = await BaiVietModel.count();
  res.json({ sanpham: sp, donhang: dh, nguoidung: nd, baiviet: bv });
});

/*  USER  */
router.get("/users", auth, isAdmin, async (_, res) => {
  const list = await UserModel.findAll();
  res.json(list);
});

router.delete("/users/:id", auth, isAdmin, async (req, res) => {
  await UserModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa người dùng" });
});

/*  SẢN PHẨM  */
router.post("/admin/sanpham", auth, isAdmin, async (req, res) => {
  const sp = await SanPhamModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm sản phẩm thành công", sp });
});

router.put("/admin/sanpham/:id", auth, isAdmin, async (req, res) => {
  await SanPhamModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật sản phẩm thành công" });
});

router.delete("/admin/sanpham/:id", auth, isAdmin, async (req, res) => {
  await SanPhamModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa sản phẩm" });
});


/* Biến thể  */
router.post("/admin/bienthe", auth, async (req, res) => {
  try {
    const { sanpham_id, mausac, sl_tonkho, gia } = req.body;
    const bienthe = await SanPhamBienTheModel.create({
      id: uuidv4(),
      sanpham_id,
      mausac,
      sl_tonkho,
      gia,
    });
    res.json({ message: "Thêm biến thể thành công", bienthe });
  } catch (err) {
    console.error("Lỗi POST /api/bienthe:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.put("/bienthe/:id", auth, async (req, res) => {
  try {
    const { mausac, sl_tonkho, gia } = req.body;
    await SanPhamBienTheModel.update(
      { mausac, sl_tonkho, gia },
      { where: { id: req.params.id } }
    );
    res.json({ message: "Cập nhật biến thể thành công" });
  } catch (err) {
    console.error("Lỗi PUT /api/bienthe/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


router.delete("/bienthe/:id", auth, async (req, res) => {
  try {
    await SanPhamBienTheModel.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa biến thể" });
  } catch (err) {
    console.error("Lỗi DELETE /api/bienthe/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/*  DANH MỤC  */
router.post("/danhmuc", auth, isAdmin, async (req, res) => {
  const dm = await LoaiModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm danh mục thành công", dm });
});

router.put("/danhmuc/:id", auth, isAdmin, async (req, res) => {
  await LoaiModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật danh mục thành công" });
});

router.delete("/danhmuc/:id", auth, isAdmin, async (req, res) => {
  await LoaiModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa danh mục" });
});

/*  THƯƠNG HIỆU  */
router.post("/thuonghieu", auth, isAdmin, async (req, res) => {
  const th = await ThuongHieuModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm thương hiệu thành công", th });
});

router.put("/thuonghieu/:id", auth, isAdmin, async (req, res) => {
  await ThuongHieuModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật thương hiệu thành công" });
});

router.delete("/thuonghieu/:id", auth, isAdmin, async (req, res) => {
  await ThuongHieuModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa thương hiệu" });
});

/*  ĐƠN HÀNG  */
router.get("/donhang", auth, isAdmin, async (_, res) => {
  const list = await DonHangModel.findAll({ order: [["ngaymua", "DESC"]] });
  res.json(list);
});

router.put("/donhang/:id", auth, isAdmin, async (req, res) => {
  await DonHangModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
});

/*  MÃ GIẢM GIÁ  */
router.get("/magiamgia", auth, isAdmin, async (_, res) => {
  const mg = await MaGiamGiaModel.findAll();
  res.json(mg);
});

router.post("/magiamgia", auth, isAdmin, async (req, res) => {
  const mg = await MaGiamGiaModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm mã giảm giá thành công", mg });
});

router.put("/magiamgia/:id", auth, isAdmin, async (req, res) => {
  await MaGiamGiaModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật mã giảm giá thành công" });
});

router.delete("/magiamgia/:id", auth, isAdmin, async (req, res) => {
  await MaGiamGiaModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa mã giảm giá" });
});

/*  BÀI VIẾT  */
router.get("/baiviet", auth, isAdmin, async (_, res) => {
  const bv = await BaiVietModel.findAll();
  res.json(bv);
});

router.post("/baiviet", auth, isAdmin, async (req, res) => {
  const bv = await BaiVietModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm bài viết thành công", bv });
});

router.put("/baiviet/:id", auth, isAdmin, async (req, res) => {
  await BaiVietModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật bài viết thành công" });
});

router.delete("/baiviet/:id", auth, isAdmin, async (req, res) => {
  await BaiVietModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa bài viết" });
});

/*  DANH MỤC BÀI VIẾT  */
router.get("/danhmucbaiviet", auth, isAdmin, async (_, res) => {
  const list = await DanhMucBaiVietModel.findAll();
  res.json(list);
});

router.post("/danhmucbaiviet", auth, isAdmin, async (req, res) => {
  const dm = await DanhMucBaiVietModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm danh mục bài viết thành công", dm });
});

/*  LIÊN HỆ  */
router.get("/lienhe", auth, isAdmin, async (_, res) => {
  const list = await LienHeModel.findAll({ order: [["created_at", "DESC"]] });
  res.json(list);
});

router.delete("/lienhe/:id", auth, isAdmin, async (req, res) => {
  await LienHeModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa góp ý" });
});

/*  REVIEW  */
router.get("/review", auth, isAdmin, async (_, res) => {
  const rv = await ReviewModel.findAll();
  res.json(rv);
});

router.delete("/review/:id", auth, isAdmin, async (req, res) => {
  await ReviewModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa đánh giá" });
});

module.exports = router;

/* ---------------- USER: CẬP NHẬT ROLE / TRẠNG THÁI ---------------- */
// PUT /api/users/:id
router.put("/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const { role, trangthai } = req.body;
    const [count] = await UserModel.update(
      { role, trangthai },
      { where: { id: req.params.id } }
    );
    if (count === 0) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Cập nhật người dùng thành công" });
  } catch (err) {
    console.error(" Lỗi PUT /users/:id:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ---------------- ADMIN: LẤY DANH SÁCH SẢN PHẨM ---------------- */
// GET /api/sanpham
router.get("/sanpham", auth, isAdmin, async (req, res) => {
  try {
    const list = await SanPhamModel.findAll({
      order: [["ngay", "DESC"]],
      include: [
        { model: LoaiModel, as: "danhmuc", attributes: ["tendm"] },
        { model: ThuongHieuModel, as: "thuonghieu", attributes: ["tenbrand"] },
      ],
    });
    res.json(list);
  } catch (err) {
    console.error("❌ Lỗi GET /sanpham:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ---------------- ADMIN: CHI TIẾT 1 ĐƠN HÀNG ---------------- */
// GET /api/donhang/:id
router.get("/admin/donhang/:id", auth, isAdmin, async (req, res) => {
  try {
    const dh = await DonHangModel.findByPk(req.params.id, {
      include: [
        {
          association: "chitiet_donhang",
          include: ["bienthe"],
        },
      ],
    });
    if (!dh) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(dh);
  } catch (err) {
    console.error(" Lỗi GET /admin/donhang/:id:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ---------------- DANH MỤC BÀI VIẾT: CẬP NHẬT + XOÁ ---------------- */
// PUT /api/admin/danhmucbaiviet/:id
router.put("/admin/danhmucbaiviet/:id", auth, isAdmin, async (req, res) => {
  try {
    const [count] = await DanhMucBaiVietModel.update(req.body, { where: { id: req.params.id } });
    if (count === 0) return res.status(404).json({ message: "Không tìm thấy danh mục bài viết" });
    res.json({ message: "Cập nhật danh mục bài viết thành công" });
  } catch (err) {
    console.error(" Lỗi PUT /admin/danhmucbaiviet/:id:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// DELETE /api/admin/danhmucbaiviet/:id
router.delete("/admin/danhmucbaiviet/:id", auth, isAdmin, async (req, res) => {
  try {
    const count = await DanhMucBaiVietModel.destroy({ where: { id: req.params.id } });
    if (!count) return res.status(404).json({ message: "Không tìm thấy danh mục bài viết" });
    res.json({ message: "Đã xóa danh mục bài viết" });
  } catch (err) {
    console.error(" Lỗi DELETE /admin/danhmucbaiviet/:id:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});