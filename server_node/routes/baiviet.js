const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { BaiVietModel } = require("../database");

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/baiviet");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📝 Lấy danh sách bài viết
router.get("/", async (req, res) => {
  try {
    const list = await BaiVietModel.findAll({ order: [["created_at", "DESC"]] });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 📝 Lấy chi tiết
router.get("/:id", async (req, res) => {
  try {
    const bv = await BaiVietModel.findByPk(req.params.id);
    if (!bv) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(bv);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ✏️ Tạo bài viết mới
router.post("/", upload.single("hinh_anh"), async (req, res) => {
  try {
    const { tieude, noidung, anhien, user_id, danhmuc_baiviet_id } = req.body;
    const hinh_anh = req.file
      ? `http://localhost:5000/uploads/baiviet/${req.file.filename}`
      : null;

    const newBv = await BaiVietModel.create({
      tieude,
      noidung,
      anhien: anhien ?? 1,
      user_id,
      danhmuc_baiviet_id,
      hinh_anh,
    });

    res.status(201).json(newBv);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo bài viết", error: err.message });
  }
});

// ✏️ Cập nhật bài viết
router.put("/:id", upload.single("hinh_anh"), async (req, res) => {
  try {
    const bv = await BaiVietModel.findByPk(req.params.id);
    if (!bv) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    let hinh_anh = bv.hinh_anh;
    if (req.file) {
      hinh_anh = `http://localhost:5000/uploads/baiviet/${req.file.filename}`;
      // xóa ảnh cũ
      if (bv.hinh_anh) {
        const oldPath = path.join(
          __dirname,
          "../uploads/baiviet",
          path.basename(bv.hinh_anh)
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await bv.update({
      ...req.body,
      hinh_anh,
    });

    res.json(bv);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật bài viết", error: err.message });
  }
});

// ❌ Xóa bài viết
router.delete("/:id", async (req, res) => {
  try {
    const bv = await BaiVietModel.findByPk(req.params.id);
    if (!bv) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // xóa ảnh đại diện
    if (bv.hinh_anh) {
      const oldPath = path.join(
        __dirname,
        "../uploads/baiviet",
        path.basename(bv.hinh_anh)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await bv.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa bài viết", error: err.message });
  }
});

module.exports = router;
