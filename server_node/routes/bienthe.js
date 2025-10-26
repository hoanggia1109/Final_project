const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { SanPhamBienTheModel, SanPhamModel, ImageModel } = require("../database");
const { auth } = require("../middleware/auth"); // middleware kiểm tra token
const router = express.Router();

/* -------------------- LẤY TẤT CẢ BIẾN THỂ -------------------- */
router.get("/", async (_, res) => {
  try {
    const list = await SanPhamBienTheModel.findAll({
      include: [
        { model: SanPhamModel, as: "sanpham", attributes: ["id", "tensp"] },
        { model: ImageModel, as: "images", attributes: ["url"] },
      ],
    });
    res.status(200).json(list);
  } catch (err) {
    console.error(" Lỗi GET /api/bienthe:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* -------------------- LẤY BIẾN THỂ THEO ID -------------------- */
router.get("/:id", async (req, res) => {
  try {
    const bienthe = await SanPhamBienTheModel.findByPk(req.params.id, {
      include: [{ model: ImageModel, as: "images" }],
    });
    if (!bienthe) return res.status(404).json({ message: "Không tìm thấy biến thể" });
    res.json(bienthe);
  } catch (err) {
    console.error("Lỗi GET /api/bienthe/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* -------------------- THÊM BIẾN THỂ -------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const { sanpham_id, mausac, sl_tonko, gia } = req.body;
    const bienthe = await SanPhamBienTheModel.create({
      id: uuidv4(),
      sanpham_id,
      mausac,
      sl_tonko,
      gia,
    });
    res.json({ message: "Thêm biến thể thành công", bienthe });
  } catch (err) {
    console.error("Lỗi POST /api/bienthe:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* -------------------- CẬP NHẬT BIẾN THỂ -------------------- */
router.put("/:id", auth, async (req, res) => {
  try {
    const { mausac, sl_tonko, gia } = req.body;
    await SanPhamBienTheModel.update(
      { mausac, sl_tonko, gia },
      { where: { id: req.params.id } }
    );
    res.json({ message: "Cập nhật biến thể thành công" });
  } catch (err) {
    console.error("Lỗi PUT /api/bienthe/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* -------------------- XÓA BIẾN THỂ -------------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    await SanPhamBienTheModel.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xóa biến thể" });
  } catch (err) {
    console.error("Lỗi DELETE /api/bienthe/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;