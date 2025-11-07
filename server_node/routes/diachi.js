const express = require("express");
const router = express.Router();
const { DiaChiModel } = require("../database");
const { auth } = require("../middleware/auth");

// Lấy địa chỉ theo userId
router.get("/",auth, async (req, res) => {
  try {
    const data = await DiaChiModel.findAll({
      where: { user_id: req.user.id },
    });
    res.json(data);
  } catch (error) {
  console.error(" Lỗi lấy danh sách địa chỉ:", error);
  res.status(500).json({
    message: "Lỗi lấy danh sách địa chỉ",
    error: error.message || error,
  });
}
})

// Thêm địa chỉ mới
router.post("/", async (req, res) => {
  try {
    const data = await DiaChiModel.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm địa chỉ", error });
  }
});

// Cập nhật địa chỉ
router.put("/:id", async (req, res) => {
  try {
    await DiaChiModel.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật địa chỉ", error });
  }
});

// Xóa địa chỉ
router.delete("/:id", async (req, res) => {
  try {
    await DiaChiModel.destroy({ where: { id: req.params.id } });
    res.json({ message: "Xóa địa chỉ thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa địa chỉ", error });
  }
});

module.exports = router;
