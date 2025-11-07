const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { LoaiModel } = require("../database");

// 🧩 Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/danhmuc");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 🧠 Lấy danh sách
router.get("/", async (req, res) => {
  try {
    const list = await LoaiModel.findAll({
      where: { anhien: 1 },
      attributes: ["id", "code", "tendm", "image", "mota", "anhien"],
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🧠 Lấy chi tiết
router.get("/:id", async (req, res) => {
  try {
    const item = await LoaiModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🧩 Thêm mới
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { tendm, mota, code, anhien } = req.body;
    const image = req.file
      ? `http://localhost:5000/uploads/danhmuc/${req.file.filename}`
      : null;

    const newItem = await LoaiModel.create({
      tendm,
      mota,
      code,
      anhien: anhien ?? 1,
      image,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm", error: err.message });
  }
});

// ✏️ Cập nhật
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await LoaiModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });

    let image = item.image;
    if (req.file) {
      image = `http://localhost:5000/uploads/danhmuc/${req.file.filename}`;
      // xóa file cũ
      if (item.image) {
        const oldPath = path.join(
          __dirname,
          "../uploads/danhmuc",
          path.basename(item.image)
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await item.update({
      ...req.body,
      image,
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
});

// ❌ Xóa
router.delete("/:id", async (req, res) => {
  try {
    const item = await LoaiModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });

    // xóa ảnh
    if (item.image) {
      const oldPath = path.join(
        __dirname,
        "../uploads/danhmuc",
        path.basename(item.image)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await item.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa", error: err.message });
  }
});

module.exports = router;
