const express = require("express");
const router = express.Router();
const { DiaChiModel } = require("../database");
const { auth } = require("../middleware/auth");
const { Op } = require("sequelize");

// Lấy địa chỉ theo userId
router.get("/",auth, async (req, res) => {
  try {
    const data = await DiaChiModel.findAll({
      where: { user_id: req.user.id },
    });
    res.json(data);
  } catch (error) {
  console.error(" Lỗi lấy danh sách địa chỉ:", error);
  res.status(500).json({
    message: "Lỗi lấy danh sách địa chỉ",
    error: error.message || error,
  });
}
})

// Thêm địa chỉ mới
router.post("/", auth, async (req, res) => {
  try {
    const { hoten, sdt, diachichitiet, phuong_xa, quan_huyen, tinh_thanh, macdinh, loaidiachi } = req.body;
    
    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (macdinh === 1 || macdinh === true) {
      await DiaChiModel.update(
        { macdinh: 0 },
        { where: { user_id: req.user.id } }
      );
    }
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { v4: uuidv4 } = require("uuid");
    
    const data = await DiaChiModel.create({
      id: uuidv4(),
      user_id: req.user.id,
      hoten: hoten || null,
      sdt: sdt || null,
      diachichitiet: diachichitiet || null,
      phuong_xa: phuong_xa || null,
      quan_huyen: quan_huyen || null,
      tinh_thanh: tinh_thanh || null,
      macdinh: macdinh === 1 || macdinh === true ? 1 : 0,
      loaidiachi: loaidiachi || 'home',
    });
    res.status(201).json(data);
  } catch (error) {
    console.error(" Lỗi thêm địa chỉ:", error);
    res.status(500).json({ message: "Lỗi thêm địa chỉ", error: error.message });
  }
});

// Cập nhật địa chỉ
router.put("/:id", auth, async (req, res) => {
  try {
    const { hoten, sdt, diachichitiet, phuong_xa, quan_huyen, tinh_thanh, macdinh, loaidiachi } = req.body;
    
    // Kiểm tra địa chỉ có thuộc về user này không
    const diachi = await DiaChiModel.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });
    
    if (!diachi) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ hoặc không có quyền" });
    }
    
    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (macdinh === 1 || macdinh === true) {
      await DiaChiModel.update(
        { macdinh: 0 },
        { where: { user_id: req.user.id, id: { [Op.ne]: req.params.id } } }
      );
    }
    
    await DiaChiModel.update({
      hoten: hoten !== undefined ? hoten : diachi.hoten,
      sdt: sdt !== undefined ? sdt : diachi.sdt,
      diachichitiet: diachichitiet !== undefined ? diachichitiet : diachi.diachichitiet,
      phuong_xa: phuong_xa !== undefined ? phuong_xa : diachi.phuong_xa,
      quan_huyen: quan_huyen !== undefined ? quan_huyen : diachi.quan_huyen,
      tinh_thanh: tinh_thanh !== undefined ? tinh_thanh : diachi.tinh_thanh,
      macdinh: macdinh !== undefined ? (macdinh === 1 || macdinh === true ? 1 : 0) : diachi.macdinh,
      loaidiachi: loaidiachi !== undefined ? loaidiachi : diachi.loaidiachi,
    }, { where: { id: req.params.id, user_id: req.user.id } });
    
    const updated = await DiaChiModel.findByPk(req.params.id);
    res.json({ message: "Cập nhật thành công", data: updated });
  } catch (error) {
    console.error(" Lỗi cập nhật địa chỉ:", error);
    res.status(500).json({ message: "Lỗi cập nhật địa chỉ", error: error.message });
  }
});

// Xóa địa chỉ
router.delete("/:id", auth, async (req, res) => {
  try {
    // Kiểm tra địa chỉ có thuộc về user này không
    const diachi = await DiaChiModel.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });
    
    if (!diachi) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ hoặc không có quyền" });
    }
    
    await DiaChiModel.destroy({ where: { id: req.params.id, user_id: req.user.id } });
    res.json({ message: "Xóa địa chỉ thành công" });
  } catch (error) {
    console.error(" Lỗi xóa địa chỉ:", error);
    res.status(500).json({ message: "Lỗi xóa địa chỉ", error: error.message });
  }
});

module.exports = router;
