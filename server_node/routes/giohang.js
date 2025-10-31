const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { GioHangModel, SanPhamBienTheModel, SanPhamModel, ImageModel } = require("../database");
const { auth } = require("../middleware/auth");

const router = express.Router();



/* ------------------ Lấy giỏ hàng ------------------ */
router.get("/", auth, async (req, res) => {
  try {
    const list = await GioHangModel.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          include: [
            { model: SanPhamModel, as: "sanpham" },
            { model: ImageModel, as: "images" },
          ],
        },
      ],
    });

    // Tính tổng tiền động
    const tong_tien = list.reduce((sum, item) => {
      const gia = Number(item.bienthe?.gia || 0);
      return sum + gia * Number(item.soluong || 0);
    }, 0);

    res.json({
      message: "Lấy giỏ hàng thành công",
      tong_tien,
      san_pham: list,
    });
  } catch (err) {
    console.error("❌ Lỗi GET /api/giohang:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ------------------ Thêm vào giỏ hàng ------------------ */
router.post("/", auth, async (req, res) => {
  try {
    const items = req.body; // [{ bienthe_id, soluong }, ...]

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });

    const result = [];

    for (const item of items) {
      // kiểm tra sp đã có trong giỏ chưa
      const existed = await GioHangModel.findOne({
        where: { user_id: req.user.id, bienthe_id: item.bienthe_id },
      });

      if (existed) {
        // nếu có rồi thì cộng thêm số lượng
        existed.soluong += item.soluong;
        await existed.save();
        result.push(existed);
      } else {
        // nếu chưa có thì thêm mới
        const newItem = await GioHangModel.create({
          id: uuidv4(),
          user_id: req.user.id,
          bienthe_id: item.bienthe_id,
          soluong: item.soluong,
        });
        result.push(newItem);
      }
    }

    res.json({ message: "Thêm sản phẩm vào giỏ hàng thành công", result });
  } catch (err) {
    console.error("❌ Lỗi POST /api/giohang:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ------------------ Cập nhật số lượng ------------------ */
router.put("/:id", auth, async (req, res) => {
  try {
    const { soluong } = req.body;
    if (soluong <= 0) return res.status(400).json({ message: "Số lượng không hợp lệ" });

    const updated = await GioHangModel.update(
      { soluong },
      { where: { id: req.params.id, user_id: req.user.id } }
    );
    if (!updated[0]) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ" });

    res.json({ message: "Cập nhật số lượng thành công" });
  } catch (err) {
    console.error("❌ Lỗi PUT /api/giohang/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ------------------ Xóa sản phẩm ------------------ */
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await GioHangModel.destroy({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });

    res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (err) {
    console.error("❌ Lỗi DELETE /api/giohang/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;