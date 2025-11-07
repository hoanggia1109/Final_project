const express = require("express");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const createMulterUpload = require("../middleware/upload");

const {
  SanPhamModel,
  SanPhamBienTheModel,
  ThuongHieuModel,
  LoaiModel,
  ImageModel,
} = require("../database");

const router = express.Router();
const upload = createMulterUpload("sanpham"); // 📂 Lưu ảnh vào uploads/sanpham/

// Hàm tạo slug thân thiện
const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ==============================
 🟢 LẤY TẤT CẢ SẢN PHẨM
============================== */

router.get("/", async (req, res) => {
  try {
    const sanphams = await SanPhamModel.findAll({
      attributes: ["id", "code", "tensp", "thumbnail", "anhien", "slug", "ngay", "created_at"],
      include: [
        { model: LoaiModel, as: "danhmuc", attributes: ["id", "tendm"] },
        { model: ThuongHieuModel, as: "thuonghieu", attributes: ["id", "tenbrand"] },
        { model: SanPhamBienTheModel, as: "bienthe", attributes: ["id", "gia", "mausac", "kichthuoc"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json(sanphams);
  } catch (err) {
    console.error("Lỗi /api/sanpham:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ==============================
 🟢 LẤY CHI TIẾT 1 SẢN PHẨM
============================== */

router.get("/:id", async (req, res) => {
  try {
    const sp = await SanPhamModel.findByPk(req.params.id, {
      include: [
        { model: LoaiModel, as: "danhmuc", attributes: ["id", "tendm"] },
        { model: ThuongHieuModel, as: "thuonghieu", attributes: ["id", "tenbrand"] },
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          include: [{ model: ImageModel, as: "images", attributes: ["id", "url"] }],
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

/* ==============================
 🟢 THÊM SẢN PHẨM (có upload ảnh)
============================== */
router.post("/", upload.single("thumbnail"), async (req, res) => {
  const t = await SanPhamModel.sequelize.transaction();
  try {
    let {
      code,
      tensp,
      mota,
      anhien,
      slug,
      danhmuc_id,
      thuonghieu_id,
      bienthe,
    } = req.body;
    
    // nếu client gửi dạng JSON string thì parse lại
    if (typeof bienthe === "string") {
      try {
        bienthe = JSON.parse(bienthe);
      } catch {
        bienthe = [];
      }
    }
    

    // Nếu có file ảnh thì lưu đường dẫn
    const thumbnailPath = req.file
      ? `/uploads/sanpham/${req.file.filename}`
      : null;

    const finalSlug =
      slug?.trim() && slug.trim() !== ""
        ? slugify(slug)
        : slugify(tensp) + "-" + uuidv4().slice(0, 6);

    // 🟢 1. Tạo sản phẩm chính
    const sp = await SanPhamModel.create(
      {
        code,
        tensp,
        mota,
        thumbnail: thumbnailPath,
        anhien: anhien ?? 1,
        slug: finalSlug,
        danhmuc_id,
        thuonghieu_id,
      },
      { transaction: t }
    );

    // 🟢 2. Tạo biến thể + ảnh
    if (Array.isArray(bienthe) && bienthe.length > 0) {
      for (const bt of bienthe) {
        const newBT = await SanPhamBienTheModel.create(
          {
            sanpham_id: sp.id,
            gia: bt.gia,
            mausac: bt.mausac,
            kichthuoc: bt.kichthuoc,
            chatlieu: bt.chatlieu,
            sl_tonkho: bt.sl_tonkho ?? 0,
          },
          { transaction: t }
        );

        if (Array.isArray(bt.images)) {
          for (const url of bt.images) {
            await ImageModel.create(
              { bienthe_id: newBT.id, url },
              { transaction: t }
            );
          }
        }
      }
    }

    await t.commit();
    res.status(201).json({ message: "✅ Thêm sản phẩm thành công!", sp });
  } catch (err) {
    await t.rollback();
    console.error("❌ Lỗi thêm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ==============================
 🟡 CẬP NHẬT SẢN PHẨM
============================== */
router.put("/:id", upload.any(), async (req, res) => {
  const t = await SanPhamModel.sequelize.transaction();
  try {
    const sp = await SanPhamModel.findByPk(req.params.id, { transaction: t });
    if (!sp) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    let { tensp, mota, anhien, danhmuc_id, thuonghieu_id, bienthe } = req.body;
    if (typeof bienthe === "string") bienthe = JSON.parse(bienthe || "[]");

    // ---------------- Thumbnail ----------------
    const thumbnailFile = req.files.find(f => f.fieldname === 'thumbnail');
    const thumbnailPath = thumbnailFile ? `/uploads/sanpham/${thumbnailFile.filename}` : sp.thumbnail;
    await sp.update({ tensp, mota, anhien, danhmuc_id, thuonghieu_id, thumbnail: thumbnailPath }, { transaction: t });

    // ---------------- Biến thể ----------------
    const oldVariants = await SanPhamBienTheModel.findAll({ where: { sanpham_id: sp.id }, include: [{ model: ImageModel, as: "images" }], transaction: t });

    for (let i = 0; i < bienthe.length; i++) {
      const bt = bienthe[i];

      // Lấy tất cả file của biến thể này theo fieldname
      const filesForThisVariant = req.files.filter(f => f.fieldname === `images_${i}`);

      if (bt.id) { // update biến thể cũ
        const oldBT = oldVariants.find(v => v.id === bt.id);
        if (oldBT) {
          await oldBT.update({
            mausac: bt.mausac,
            kichthuoc: bt.kichthuoc,
            chatlieu: bt.chatlieu,
            gia: bt.gia,
            sl_tonkho: bt.sl_tonkho ?? 0
          }, { transaction: t });

          // Thêm ảnh mới
          for (const file of filesForThisVariant) {
            await ImageModel.create({ bienthe_id: oldBT.id, url: `/uploads/sanpham/${file.filename}` }, { transaction: t });
          }
        }
      } else { // thêm biến thể mới
        const newBT = await SanPhamBienTheModel.create({
          sanpham_id: sp.id,
          mausac: bt.mausac,
          kichthuoc: bt.kichthuoc,
          chatlieu: bt.chatlieu,
          gia: bt.gia,
          sl_tonkho: bt.sl_tonkho ?? 0
        }, { transaction: t });

        for (const file of filesForThisVariant) {
          await ImageModel.create({ bienthe_id: newBT.id, url: `/uploads/sanpham/${file.filename}` }, { transaction: t });
        }
      }
    }

    await t.commit();
    res.json({ message: "✅ Cập nhật sản phẩm thành công!", sp });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


/* ==============================
 🔴 XÓA SẢN PHẨM
============================== */
router.delete("/:id", async (req, res) => {
  try {
    const sp = await SanPhamModel.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await sp.destroy();
    res.json({ message: "🗑️ Đã xóa sản phẩm!" });
  } catch (err) {
    console.error("❌ Lỗi xóa sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
