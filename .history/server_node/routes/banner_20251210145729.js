const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { BannerModel } = require("../database");

// 🧩 Cấu hình multer cho folder banners
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/banner");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

//  Lấy danh sách banner
router.get("/", async (req, res) => {
  try {
    const banners = await BannerModel.findAll({
      order: [["thutu", "ASC"], ["created_at", "DESC"]],
    });
    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi lấy banner", error: err.message });
  }
});

//  Lấy chi tiết banner
router.get("/:id", async (req, res) => {
  try {
    const banner = await BannerModel.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Không tìm thấy banner" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy banner", error: err.message });
  }
});

//  Thêm banner mới
router.post("/", upload.single("url"), async (req, res) => {
  try {
    const { tieude, mota, thutu, anhien, linksp } = req.body;
    const url = req.file ? `http://localhost:5000/uploads/banner/${req.file.filename}` : null;

    const newBanner = await BannerModel.create({
      tieude,
      mota,
      thutu: thutu ?? 1,
      anhien: anhien ?? 1,
      linksp,
      url,
    });

    res.status(201).json(newBanner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi thêm banner", error: err.message });
  }
});

//  Cập nhật banner
router.put("/:id", upload.single("url"), async (req, res) => {
  try {
    const banner = await BannerModel.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Không tìm thấy banner" });

    let url = banner.url;
    if (req.file) {
      url = `http://localhost:5000/uploads/banner/${req.file.filename}`;
      // xóa file cũ nếu có
      if (banner.url) {
        const oldPath = path.join(__dirname, "../uploads/banner", path.basename(banner.url));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await banner.update({
      ...req.body,
      url,
    });

    res.json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật banner", error: err.message });
  }
});

//  Xóa banner
router.delete("/:id", async (req, res) => {
  try {
    const banner = await BannerModel.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Không tìm thấy banner" });

    if (banner.url) {
      const oldPath = path.join(__dirname, "../uploads/banner", path.basename(banner.url));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await banner.destroy();
    res.json({ message: "Đã xóa banner thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa banner", error: err.message });
  }
});

module.exports = router;
