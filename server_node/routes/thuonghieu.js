const express = require("express");
const router = express.Router();
const { ThuongHieuModel } = require("../database"); 
const { v4: uuidv4 } = require("uuid");

// 🟢 Lấy tất cả thương hiệu
router.get("/", async (req, res) => {
  try {
    const brands = await ThuongHieuModel.findAll({
      order: [["thutu", "ASC"]],
    });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách thương hiệu", error: err.message });
  }
});

// 🟢 Lấy 1 thương hiệu theo ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await ThuongHieuModel.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thương hiệu", error: err.message });
  }
});

// 🟢 Thêm thương hiệu mới
router.post("/", async (req, res) => {
  try {
    const { code, tenbrand, logo, thutu, anhien } = req.body;
    const newBrand = await ThuongHieuModel.create({
      id: uuidv4(),
      code,
      tenbrand,
      logo,
      thutu,
      anhien: anhien ?? 1,
    });
    res.status(201).json({ message: "Thêm thương hiệu thành công", brand: newBrand });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm thương hiệu", error: err.message });
  }
});

// 🟢 Cập nhật thương hiệu
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, tenbrand, logo, thutu, anhien } = req.body;
    const brand = await ThuongHieuModel.findByPk(id);
    if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });

    await brand.update({ code, tenbrand, logo, thutu, anhien });
    res.json({ message: "Cập nhật thương hiệu thành công", brand });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật thương hiệu", error: err.message });
  }
});

// 🟢 Xóa thương hiệu
router.delete("/:id", async (req, res) => {
  try {
    const brand = await ThuongHieuModel.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    await brand.destroy();
    res.json({ message: "Xóa thương hiệu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa thương hiệu", error: err.message });
  }
});

module.exports = router;