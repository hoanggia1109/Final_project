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
// router.get("/:id", async (req, res) => {
//   try {
//     const bienthe = await SanPhamBienTheModel.findByPk(req.params.id, {
//       include: [{ model: ImageModel, as: "images" }],
//     });
//     if (!bienthe) return res.status(404).json({ message: "Không tìm thấy biến thể" });
//     res.json(bienthe);
//   } catch (err) {
//     console.error("Lỗi GET /api/bienthe/:id:", err);
//     res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// });

/* -------------------- THÊM BIẾN THỂ -------------------- */


module.exports = router;