const express = require("express");
const router = express.Router();
const { DanhMucBaiVietModel } = require("../database");

//  Lấy danh sách danh mục bài viết
router.get("/", async (req, res) => {
  try {
    const list = await DanhMucBaiVietModel.findAll({
      order: [["created_at", "DESC"]],
    });
    res.json(list);
  } catch (err) {
    console.error("Lỗi lấy danh sách danh mục:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Lấy chi tiết 1 danh mục
router.get("/:id", async (req, res) => {
  try {
    const item = await DanhMucBaiVietModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Thêm mới danh mục
router.post("/", async (req, res) => {
  try {
    const { tendanhmuc, mota, anhien } = req.body;
    const newItem = await DanhMucBaiVietModel.create({
      tendanhmuc,
      mota,
      anhien: anhien ?? 1,
    });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm", error: err.message });
  }
});

//  Cập nhật danh mục
router.put("/:id", async (req, res) => {
  try {
    const item = await DanhMucBaiVietModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy danh mục" });

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
});

//  Xóa danh mục
router.delete("/:id", async (req, res) => {
  try {
    const item = await DanhMucBaiVietModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy danh mục" });

    await item.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa", error: err.message });
  }
});

module.exports = router;
