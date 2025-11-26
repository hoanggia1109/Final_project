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

/* ------------------- TẠO REVIEW ------------------- */
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { chitiet_donhang_id, rating, binhluan } = req.body;

    // Kiểm tra user có sở hữu chi tiết đơn hàng này không
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

    // Tạo đánh giá
    const review = await DanhGiaModel.create({
      id: uuidv4(),
      user_id: req.user.id,
      chitiet_donhang_id,
      rating,
      binhluan,
    });

    // Lưu ảnh nếu có
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        id: uuidv4(),
        danhgia_id: review.id,
        url: `http://localhost:3000/uploads/reviews/${file.filename}`,
      }));
      await ReviewImageModel.bulkCreate(images);
      review.dataValues.hinhanh = images;
    }

    res.json({ message: "Thêm đánh giá thành công", review });
  } catch (err) {
    console.error("Lỗi tạo đánh giá:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ------------------- LẤY REVIEW THEO SẢN PHẨM ------------------- */
router.get("/sanpham/:sanpham_id", async (req, res) => {
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

    // Cập nhật ảnh nếu có
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

    res.json({ message: "Cập nhật đánh giá thành công", review: rv });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ---------------TRUNG BÌNH RATING---------------------
router.get("/:sanpham_id/average", async (req, res) => {
  try {
    const sanphamId = req.params.sanpham_id;

    const reviews = await DanhGiaModel.findAll({
      include: [
        {
          model: DonHangChiTietModel,
          as: "chitiet_donhang",
          include: [
            {
              model: require("../database").SanPhamBienTheModel,
              as: "bienthe",
              where: { sanpham_id: sanphamId },
            },
          ],
        },
      ],
    });

    if (!reviews.length)
      return res.json({ sanpham_id: sanphamId, average_rating: 0, count: 0 });

    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const average = Number((total / reviews.length).toFixed(1));

    res.json({
      sanpham_id: sanphamId,
      average_rating: average,
      count: reviews.length,
    });
  } catch (err) {
    console.error("❌ Lỗi tính trung bình rating sản phẩm:", err);
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

    res.json({ message: "Đã xóa đánh giá" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;