// routes/banner.js
const express = require("express");
const router = express.Router();
const { BannerModel } = require("../database");

/**
 * Lấy danh sách banner đang hiển thị
 * GET /api/banner
 */
router.get("/", async (req, res) => {
  try {
    const banners = await BannerModel.findAll({
      where: { anhien: 1 },
      order: [
        ["thutu", "ASC"],
        ["created_at", "DESC"],
      ],
    });
    res.json(banners);
  } catch (error) {
    console.error("Lỗi lấy danh sách banner:", error);
    res.status(500).json({ message: "Lỗi server khi lấy banner", error: error.message });
  }
});

/**
 * Lấy chi tiết 1 banner
 * GET /api/banner/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const banner = await BannerModel.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Không tìm thấy banner" });
    res.json(banner);
  } catch (error) {
    console.error("Lỗi lấy chi tiết banner:", error);
    res.status(500).json({ message: "Lỗi server khi lấy banner", error: error.message });
  }
});

module.exports = router;