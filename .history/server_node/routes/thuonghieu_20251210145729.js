const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { ThuongHieuModel } = require("../database");

//  Cấu hình multer để lưu ảnh vào uploads/brand
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/brand");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

//  Lấy danh sách thương hiệu
router.get("/", async (req, res) => {
  try {
    // Admin có thể xem tất cả, user thường chỉ xem anhien=1
    const whereClause = req.query.admin === 'true' ? {} : { anhien: 1 };
    
    const list = await ThuongHieuModel.findAll({
      where: whereClause,
      attributes: ["id", "code", "tenbrand", "logo", "thutu", "anhien"],
      order: [['thutu', 'ASC'], ['tenbrand', 'ASC']],
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Lấy chi tiết thương hiệu
router.get("/:id", async (req, res) => {
  try {
    const item = await ThuongHieuModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Thêm thương hiệu
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { tenbrand, code, thutu, anhien } = req.body;
    const logo = req.file
      ? `http://localhost:5000/uploads/brand/${req.file.filename}`
      : null;

    const newBrand = await ThuongHieuModel.create({
      id: uuidv4(), // Tạo UUID cho primary key
      tenbrand,
      code,
      thutu,
      anhien: anhien ?? 1,
      logo,
    });

    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm", error: err.message });
  }
});

//  Cập nhật thương hiệu
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const brand = await ThuongHieuModel.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: "Không tìm thấy" });

    let logo = brand.logo;
    if (req.file) {
      logo = `http://localhost:5000/uploads/brand/${req.file.filename}`;
      // xóa ảnh cũ nếu có
      if (brand.logo) {
        const oldPath = path.join(
          __dirname,
          "../uploads/brand",
          path.basename(brand.logo)
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await brand.update({
      ...req.body,
      logo,
    });

    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
});

//  Xóa thương hiệu
router.delete("/:id", async (req, res) => {
  try {
    const brand = await ThuongHieuModel.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: "Không tìm thấy" });

    // Xóa ảnh cũ
    if (brand.logo) {
      const oldPath = path.join(
        __dirname,
        "../uploads/brand",
        path.basename(brand.logo)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await brand.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa", error: err.message });
  }
});

module.exports = router;
