const express = require("express");
const { ThuongHieuModel, SanPhamModel } = require("../database");
const router = express.Router();

// Danh sách thương hiệu
router.get("/", async (_, res) => {
  const th = await ThuongHieuModel.findAll({ where: { anhien: 1 } });
  res.json(th);
});

// Sản phẩm theo thương hiệu
router.get("/:id", async (req, res) => {
  const sp = await SanPhamModel.findAll({ where: { thuonghieu_id: req.params.id, anhien: 1 } });
  res.json(sp);
});

module.exports = router;