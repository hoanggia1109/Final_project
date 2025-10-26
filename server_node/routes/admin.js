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
  LienHeModel,
  ReviewModel
} = require("../database");

const router = express.Router();

/* ---------------- AUTH CHECK ---------------- */
const isAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });
  const user = await UserModel.findByPk(req.user.id);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  next();
};

/* ---------------- DASHBOARD ---------------- */
router.get("/admin/dashboard", auth, isAdmin, async (req, res) => {
  const sp = await SanPhamModel.count();
  const dh = await DonHangModel.count();
  const nd = await UserModel.count();
  const bv = await BaiVietModel.count();
  res.json({ sanpham: sp, donhang: dh, nguoidung: nd, baiviet: bv });
});

/* ---------------- USER ---------------- */
router.get("/admin/users", auth, isAdmin, async (_, res) => {
  const list = await UserModel.findAll();
  res.json(list);
});

router.delete("/admin/users/:id", auth, isAdmin, async (req, res) => {
  await UserModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa người dùng" });
});

/* ---------------- SẢN PHẨM ---------------- */
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

/* ---------------- DANH MỤC ---------------- */
router.post("/admin/danhmuc", auth, isAdmin, async (req, res) => {
  const dm = await LoaiModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm danh mục thành công", dm });
});

router.put("/admin/danhmuc/:id", auth, isAdmin, async (req, res) => {
  await LoaiModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật danh mục thành công" });
});

router.delete("/admin/danhmuc/:id", auth, isAdmin, async (req, res) => {
  await LoaiModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa danh mục" });
});

/* ---------------- THƯƠNG HIỆU ---------------- */
router.post("/admin/thuonghieu", auth, isAdmin, async (req, res) => {
  const th = await ThuongHieuModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm thương hiệu thành công", th });
});

router.put("/admin/thuonghieu/:id", auth, isAdmin, async (req, res) => {
  await ThuongHieuModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật thương hiệu thành công" });
});

router.delete("/admin/thuonghieu/:id", auth, isAdmin, async (req, res) => {
  await ThuongHieuModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa thương hiệu" });
});

/* ---------------- ĐƠN HÀNG ---------------- */
router.get("/admin/donhang", auth, isAdmin, async (_, res) => {
  const list = await DonHangModel.findAll({ order: [["ngaymua", "DESC"]] });
  res.json(list);
});

router.put("/admin/donhang/:id", auth, isAdmin, async (req, res) => {
  await DonHangModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
});

/* ---------------- MÃ GIẢM GIÁ ---------------- */
router.get("/admin/magiamgia", auth, isAdmin, async (_, res) => {
  const mg = await MaGiamGiaModel.findAll();
  res.json(mg);
});

router.post("/admin/magiamgia", auth, isAdmin, async (req, res) => {
  const mg = await MaGiamGiaModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm mã giảm giá thành công", mg });
});

router.put("/admin/magiamgia/:id", auth, isAdmin, async (req, res) => {
  await MaGiamGiaModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật mã giảm giá thành công" });
});

router.delete("/admin/magiamgia/:id", auth, isAdmin, async (req, res) => {
  await MaGiamGiaModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa mã giảm giá" });
});

/* ---------------- BÀI VIẾT ---------------- */
router.get("/admin/baiviet", auth, isAdmin, async (_, res) => {
  const bv = await BaiVietModel.findAll();
  res.json(bv);
});

router.post("/admin/baiviet", auth, isAdmin, async (req, res) => {
  const bv = await BaiVietModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm bài viết thành công", bv });
});

router.put("/admin/baiviet/:id", auth, isAdmin, async (req, res) => {
  await BaiVietModel.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật bài viết thành công" });
});

router.delete("/admin/baiviet/:id", auth, isAdmin, async (req, res) => {
  await BaiVietModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa bài viết" });
});

/* ---------------- DANH MỤC BÀI VIẾT ---------------- */
router.get("/admin/danhmucbaiviet", auth, isAdmin, async (_, res) => {
  const list = await DanhMucBaiVietModel.findAll();
  res.json(list);
});

router.post("/admin/danhmucbaiviet", auth, isAdmin, async (req, res) => {
  const dm = await DanhMucBaiVietModel.create({ id: uuidv4(), ...req.body });
  res.json({ message: "Thêm danh mục bài viết thành công", dm });
});

/* ---------------- LIÊN HỆ ---------------- */
router.get("/admin/lienhe", auth, isAdmin, async (_, res) => {
  const list = await LienHeModel.findAll({ order: [["created_at", "DESC"]] });
  res.json(list);
});

router.delete("/admin/lienhe/:id", auth, isAdmin, async (req, res) => {
  await LienHeModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa góp ý" });
});

/* ---------------- REVIEW ---------------- */
router.get("/admin/review", auth, isAdmin, async (_, res) => {
  const rv = await ReviewModel.findAll();
  res.json(rv);
});

router.delete("/admin/review/:id", auth, isAdmin, async (req, res) => {
  await ReviewModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa đánh giá" });
});

module.exports = router;

/* ---------------- USER: CẬP NHẬT ROLE / TRẠNG THÁI ---------------- */
// PUT /api/admin/users/:id
router.put("/admin/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const { role, trangthai } = req.body;
    const [count] = await UserModel.update(
      { role, trangthai },
      { where: { id: req.params.id } }
    );
    if (count === 0) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Cập nhật người dùng thành công" });
  } catch (err) {
    console.error(" Lỗi PUT /admin/users/:id:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ---------------- ADMIN: LẤY DANH SÁCH SẢN PHẨM ---------------- */
// GET /api/admin/sanpham
router.get("/admin/sanpham", auth, isAdmin, async (req, res) => {
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
    console.error("❌ Lỗi GET /admin/sanpham:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ---------------- ADMIN: CHI TIẾT 1 ĐƠN HÀNG ---------------- */
// GET /api/admin/donhang/:id
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