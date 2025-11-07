  const express = require("express");
  const { LoaiModel, SanPhamModel,SanPhamBienTheModel } = require("../database");
  const router = express.Router();

  // router.get("/", async (req, res) => {
  //   try {
  //     const danhmuc = await LoaiModel.findAll({
  //       where: { anhien: 1 },
  //       attributes: ["id", "code", "tendm", "image", "mota"],
  //       order: [["tendm", "ASC"]],
  //     });
  //     res.status(200).json(danhmuc);
  //   } catch (err) {
  //     console.error("Lỗi /api/danhmuc:", err);
  //     res.status(500).json({ message: "Lỗi server", error: err.message });
  //   }
  // });

  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const danhmuc = await LoaiModel.findByPk(id, {
        attributes: ["id", "code", "tendm", "image", "mota"],
        include: [
          {
            model: SanPhamModel,
            as: "sanphams",
            required: false,
            where: { anhien: 1 },
            include: [
              {
                model: SanPhamBienTheModel,
                as: "bienthe",
                attributes: ["gia", "mausac", "kichthuoc"],
              },
            ],
          },
        ],
      });
  
      if (!danhmuc)
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
  
      res.status(200).json(danhmuc);
    } catch (err) {
      console.error("Lỗi /api/danhmuc/:id:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  });
  


  router.get("/", async (req, res) => {
    try {
      const danhmuc = await LoaiModel.findAll({
        where: { anhien: 1 },
        attributes: ["id", "code", "tendm", "image", "mota"],
        include: [
          {
            model: SanPhamModel,
            as: "sanphams",
            // where: { anhien: 1 },
            required: false, // vẫn trả danh mục nếu chưa có sản phẩm
            include: [
              {
                model: SanPhamBienTheModel,
                as: "bienthe",
                attributes: ["gia", "mausac", "kichthuoc"]
              }
            ]
          }
        ],
        order: [["tendm", "ASC"]],
      });

      res.status(200).json(danhmuc);
    } catch (err) {
      console.error("Lỗi /api/danhmuc:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  });
  module.exports = router;