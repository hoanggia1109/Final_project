const express = require("express");
const { BaiVietModel, DanhMucBaiVietModel } = require("../database");
const router = express.Router();

router.get("/", async (_, res) => {
  const bv = await BaiVietModel.findAll({ where: { anhien: 1 } });
  res.json(bv);
});

router.get("/:slug", async (req, res) => {
  const bv = await BaiVietModel.findOne({ where: { slug: req.params.slug } });
  res.json(bv);
});

router.get("/danhmucbaiviet/all", async (_, res) => {
  const dm = await DanhMucBaiVietModel.findAll();
  res.json(dm);
});

module.exports = router;