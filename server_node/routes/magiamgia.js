const express = require("express");
const { Op } = require("sequelize");
const { MaGiamGiaModel } = require("../database");
const router = express.Router();

/**
 * Lấy danh sách mã giảm giá còn hạn
 */
router.get("/", async (_, res) => {
  try {
    const now = new Date();
    const list = await MaGiamGiaModel.findAll({
      where: {
        trangthai: 1,
        ngaybatdau: { [Op.lte]: now },
        ngayketthuc: { [Op.gte]: now },
        soluong: { [Op.gt]: 0 },
      },
      order: [["ngayketthuc", "ASC"]],
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/**
 * Áp dụng mã giảm giá
 */
router.post("/apply", async (req, res) => {
  try {
    const { code, tongtien } = req.body;
    if (!code || !tongtien)
      return res.status(400).json({ message: "Thiếu code hoặc tổng tiền đơn hàng" });

    const now = new Date();
    const mg = await MaGiamGiaModel.findOne({
      where: {
        code,
        trangthai: 1,
        ngaybatdau: { [Op.lte]: now },
        ngayketthuc: { [Op.gte]: now },
        soluong: { [Op.gt]: 0 },
      },
    });

    if (!mg)
      return res.status(404).json({ message: "Mã không hợp lệ hoặc đã hết hạn" });

    if (tongtien < mg.giatri_toithieu)
      return res.status(400).json({
        message: `Đơn hàng chưa đạt giá trị tối thiểu ${mg.giatri_toithieu.toLocaleString()}đ`,
      });

    let giam = 0;

    switch (mg.loai) {
      case "percent":
        giam = (tongtien * mg.giatrigiam) / 100;
        break;
      case "cash":
        giam = mg.giatrigiam;
        break;
      case "ship":
        giam = 0; // bạn có thể gắn cờ miễn phí vận chuyển thay vì giảm tiền
        break;
    }

    if (giam > tongtien) giam = tongtien; // tránh giảm quá nhiều

    // Giảm số lượng sử dụng mã
    mg.soluong -= 1;
    await mg.save();

    res.json({
      message: "Áp dụng mã giảm giá thành công",
      code: mg.code,
      loai: mg.loai,
      giatrigiam: mg.giatrigiam,
      giam,
      tong_tien_sau_giam: tongtien - giam,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;