const express = require("express");
const router = express.Router();
const { ReviewModel } = require("../database");

// Lấy danh sách đánh giá theo sản phẩm
router.get("/:sanphamId", async (req, res) => {
  try {
    const data = await ReviewModel.findAll({
      where: { sanphamId: req.params.sanphamId },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đánh giá", error });
  }
});

// Thêm đánh giá mới
router.post("/", async (req, res) => {
  try {
    const data = await ReviewModel.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm đánh giá", error });
  }
});

// Xóa đánh giá
router.delete("/:id", async (req, res) => {
  try {
    await ReviewModel.destroy({ where: { id: req.params.id } });
    res.json({ message: "Xóa đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa đánh giá", error });
  }
});

module.exports = router;
