const express = require("express");
const { Op } = require("sequelize");
const { SanPhamModel, SanPhamBienTheModel, ThuongHieuModel, LoaiModel, ImageModel } = require("../database");
const router = express.Router();

// lấy tất cả sp
router.get("/", async (req, res) => {
  try {
    const sanphams = await SanPhamModel.findAll({
      attributes: [
        "id",
        "code",
        "tensp",
        "mota",
        "thumbnail",
        "luotban",
        "anhien",
        "slug",
      "ratingTB",
      ],
      include: [
        {
          model: LoaiModel,
          as: "danhmuc",
          attributes: ["id", "tendm"],
        },
        {
          model: ThuongHieuModel,
          as: "thuonghieu",
          attributes: ["id", "tenbrand"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(sanphams);
  } catch (err) {
    console.error("Lỗi /sanpham:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});



//tìm kiêms
router.get("/timkiem", async (req, res) => {
  const q = req.query.q || "";
  const sp = await SanPhamModel.findAll({
    where: { tensp: { [Op.substring]: q }, anhien: 1 },
    include: [{ model: SanPhamBienTheModel, as: "bienthe" }],
  });
  res.json(sp);
});


// Sản phẩm trong danh mục
router.get("/trongloai/:id", async (req, res) => {
  const sp = await SanPhamModel.findAll({ where: { danhmuc_id: req.params.id, anhien: 1 } });
  res.json(sp);
});



// Sản phẩm hot
router.get("/hot", async (_, res) => {
  try {
    const sp = await SanPhamModel.findAll({
      where: { anhien: 1 },          
      order: [["luotban", "DESC"]],  
      limit: 8,                      
    });
    res.json(sp);
  } catch (err) {
    console.error("Lỗi lấy sản phẩm hot:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Sản phẩm mới
router.get("/moi", async (_, res) => {
  const sp = await SanPhamModel.findAll({ where: { anhien: 1 }, order: [["ngay", "DESC"]], limit: 8 });
  res.json(sp);
});

// Gợi ý sản phẩm tương tự
router.get("/tuongtu/:id", async (req, res) => {
  const sp = await SanPhamModel.findByPk(req.params.id);
  const tuongtu = await SanPhamModel.findAll({
    where: { danhmuc_id: sp.danhmuc_id, id: { [Op.ne]: sp.id }, anhien: 1 },
    limit: 8,
  });
  res.json(tuongtu);
});

// Top xem nhiều
router.get("/xemnhieu", async (_, res) => {
  const sp = await SanPhamModel.findAll({ order: [["luotxem", "DESC"]], limit: 8 });
  res.json(sp);
});

// Sản phẩm có mã giảm giá
router.get("/giamgia", async (_, res) => {
  const sp = await SanPhamModel.findAll({ where: { trangthai: 1 }, limit: 10 });
  res.json(sp);
});

//lấy chi tiết sp
router.get("/:id", async (req, res) => {
  try {
    const sp = await SanPhamModel.findByPk(req.params.id, {
      include: [
        {
          model: LoaiModel,
          as: "danhmuc",
          attributes: ["id", "tendm"],
        },
        {
          model: ThuongHieuModel,
          as: "thuonghieu",
          attributes: ["id", "tenbrand"],
        },
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          include: [
            {
              model: ImageModel,
              as: "images",
              attributes: ["url"],
            },
          ],
        },
      ],
    });

    if (!sp) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.status(200).json(sp);
  } catch (err) {
    console.error("Lỗi /sp/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
module.exports = router;