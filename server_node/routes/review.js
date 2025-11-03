const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { auth } = require("../middleware/auth");
const {
  DanhGiaModel,
  ReviewImageModel,
  DonHangModel,
  DonHangChiTietModel,
  SanPhamBienTheModel,
  SanPhamModel,
} = require("../database");

const router = express.Router();

/* ------------------- CẤU HÌNH MULTER ------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/reviews"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/* ------------------- HÀM PHỤ: CẬP NHẬT RATINGTB CHO SẢN PHẨM ------------------- */
async function capNhatRatingSanPham(chitiet_donhang_id) {
  try {
    // tìm sản phẩm liên quan
    const chiTiet = await DonHangChiTietModel.findByPk(chitiet_donhang_id, {
      include: [{ model: SanPhamBienTheModel, as: "bienthe" }],
    });

    if (!chiTiet || !chiTiet.bienthe) return;

    const sanphamId = chiTiet.bienthe.sanpham_id;

    // lấy tất cả review của sản phẩm
    const reviews = await DanhGiaModel.findAll({
      include: [
        {
          model: DonHangChiTietModel,
          as: "chitiet_donhang",
          include: [
            {
              model: SanPhamBienTheModel,
              as: "bienthe",
              where: { sanpham_id: sanphamId },
            },
          ],
        },
      ],
    });

    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avg = reviews.length ? Number((total / reviews.length).toFixed(1)) : 0;

    // cập nhật vào bảng san_pham
    await SanPhamModel.update({ ratingTB: avg }, { where: { id: sanphamId } });
  } catch (error) {
    console.error("Lỗi cập nhật ratingTB:", error);
  }
}

/* ------------------- TẠO REVIEW ------------------- */
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { chitiet_donhang_id, rating, binhluan } = req.body;

    const chiTiet = await DonHangChiTietModel.findOne({
      where: { id: chitiet_donhang_id },
      include: [{ model: DonHangModel, as: "donhang" }],
    });

    if (!chiTiet)
      return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });

    if (chiTiet.donhang.user_id !== req.user.id)
      return res.status(403).json({ message: "Bạn không có quyền đánh giá đơn hàng này" });

    if (chiTiet.donhang.trangthai !== "delivered")
      return res.status(400).json({ message: "Chỉ được đánh giá sau khi đơn hàng đã giao thành công" });

    const review = await DanhGiaModel.create({
      id: uuidv4(),
      user_id: req.user.id,
      chitiet_donhang_id,
      rating,
      binhluan,
    });

    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        id: uuidv4(),
        danhgia_id: review.id,
        url: `http://localhost:3000/uploads/reviews/${file.filename}`,
      }));
      await ReviewImageModel.bulkCreate(images);
      review.dataValues.hinhanh = images;
    }

    // ✅ Cập nhật ratingTB sau khi thêm review
    await capNhatRatingSanPham(chitiet_donhang_id);

    res.json({ message: "Thêm đánh giá thành công", review });
  } catch (err) {
    console.error("Lỗi tạo đánh giá:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ------------------- LẤY REVIEW THEO SẢN PHẨM ------------------- */
router.get("/:sanpham_id/average", async (req, res) => {
  try {
    const reviews = await DanhGiaModel.findAll({
      include: [
        {
          model: DonHangChiTietModel,
          as: "chitiet_donhang",
          include: [
            {
              model: SanPhamBienTheModel,
              as: "bienthe",
              where: { sanpham_id: req.params.sanpham_id },
              include: [{ model: SanPhamModel, as: "sanpham" }],
            },
          ],
        },
        { model: ReviewImageModel, as: "hinhanh" },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(reviews);
  } catch (err) {
    console.error("Lỗi lấy review:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ------------------- CẬP NHẬT REVIEW ------------------- */
router.put("/:id", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { rating, binhluan } = req.body;
    const rv = await DanhGiaModel.findByPk(req.params.id);

    if (!rv) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    if (rv.user_id !== req.user.id)
      return res.status(403).json({ message: "Không có quyền sửa đánh giá này" });

    rv.rating = rating;
    rv.binhluan = binhluan;
    await rv.save();

    if (req.files && req.files.length > 0) {
      await ReviewImageModel.destroy({ where: { danhgia_id: rv.id } });
      const imgs = req.files.map((f) => ({
        id: uuidv4(),
        danhgia_id: rv.id,
        url: `http://localhost:3000/uploads/reviews/${f.filename}`,
      }));
      await ReviewImageModel.bulkCreate(imgs);
      rv.dataValues.hinhanh = imgs;
    }

    // ✅ Cập nhật lại ratingTB sau khi sửa review
    await capNhatRatingSanPham(rv.chitiet_donhang_id);

    res.json({ message: "Cập nhật đánh giá thành công", review: rv });
  } catch (err) {
    console.error(" Lỗi cập nhật đánh giá:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ------------------- XÓA REVIEW ------------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    const rv = await DanhGiaModel.findByPk(req.params.id);
    if (!rv) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    if (rv.user_id !== req.user.id)
      return res.status(403).json({ message: "Không có quyền xóa đánh giá này" });

    await ReviewImageModel.destroy({ where: { danhgia_id: rv.id } });
    await rv.destroy();

    // ✅ Cập nhật ratingTB sau khi xóa review
    await capNhatRatingSanPham(rv.chitiet_donhang_id);

    res.json({ message: "Đã xóa đánh giá" });
  } catch (err) {
    console.error("Lỗi xóa đánh giá:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;