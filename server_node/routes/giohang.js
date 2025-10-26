const express = require("express");
const { GioHangModel,SanPhamBienTheModel, SanPhamModel, ImageModel } = require("../database");
const { auth } = require("../middleware/auth");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");


router.get("/", auth, async (req, res) => {
  const list = await GioHangModel.findAll({
    where: { user_id: req.user.id },
    include: [{ 
        model: SanPhamBienTheModel,
         as : "bienthe" ,
          include: [{
           model: SanPhamModel, 
            as:"sanpham" 
        } , {
            model:ImageModel , 
            as:"images"}] ,
        }]
  });
  res.json(list);
});

router.post("/", auth, async (req, res) => {
  try {
    const items = req.body; // mảng [{bienthe_id, soluong}, ...]

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });

    const dataToInsert = items.map((item) => ({
      id: uuidv4(),
      user_id: req.user.id,
      bienthe_id: item.bienthe_id,
      soluong: item.soluong,
    }));

    const result = await GioHangModel.bulkCreate(dataToInsert);
    res.json({ message: "Thêm nhiều sản phẩm vào giỏ hàng thành công", result });
  } catch (err) {
    console.error("Lỗi POST /giohang:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  await GioHangModel.update({ soluong: req.body.soluong }, { where: { id: req.params.id } });
  res.json({ message: "Cập nhật giỏ hàng thành công" });
});

router.delete("/:id", auth, async (req, res) => {
  await GioHangModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
});

module.exports = router;