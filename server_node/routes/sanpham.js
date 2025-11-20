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
const upload = createMulterUpload("sanpham");

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

router.get("/", async (_req, res) => {
  try {
    const sanphams = await SanPhamModel.findAll({
      attributes: ["id", "code", "tensp", "thumbnail", "anhien", "slug", "ngay", "created_at"],
      include: [
        { model: LoaiModel, as: "danhmuc", attributes: ["id", "tendm"] },
        { model: ThuongHieuModel, as: "thuonghieu", attributes: ["id", "tenbrand"] },
        { model: SanPhamBienTheModel, as: "bienthe", attributes: ["id", "gia", "mausac", "kichthuoc", "sl_tonkho"] },
      ],
    });
    res.status(200).json(sanphams);
  } catch (err) {
    console.error("Lỗi /api/sanpham:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.get("/giamgia", async (_req, res) => {
  try {
    console.log(" API /api/sanpham/giamgia được gọi!");
    const sanphams = await SanPhamModel.findAll({
      attributes: ["id", "code", "tensp", "thumbnail", "slug"],
      include: [
        { model: LoaiModel, as: "danhmuc", attributes: ["id", "tendm"] },
        { model: ThuongHieuModel, as: "thuonghieu", attributes: ["id", "tenbrand"] },
        { model: SanPhamBienTheModel, as: "bienthe", attributes: ["id", "gia", "mausac", "kichthuoc", "sl_tonkho"] },
      ],
      limit: 8,
    });
    console.log(` Tìm thấy ${sanphams.length} sản phẩm giảm giá`);
    res.status(200).json(sanphams);
  } catch (err) {
    console.error("Lỗi lấy sản phẩm giảm giá:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const sp = await SanPhamModel.findByPk(req.params.id, {
      include: [
        { model: LoaiModel, as: "danhmuc", attributes: ["id", "tendm"] },
        { model: ThuongHieuModel, as: "thuonghieu", attributes: ["id", "tenbrand"] },
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          attributes: ["id", "gia", "mausac", "kichthuoc", "chatlieu", "sl_tonkho", "code"],
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

    if (typeof bienthe === "string") {
      try {
        bienthe = JSON.parse(bienthe);
      } catch {
        bienthe = [];
      }
    }

    const thumbnailPath = req.file ? `/uploads/sanpham/${req.file.filename}` : null;

    const finalSlug =
      slug?.trim() && slug.trim() !== ""
        ? slugify(slug)
        : slugify(tensp) + "-" + uuidv4().slice(0, 6);

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
    res.status(201).json({ message: " Thêm sản phẩm thành công!", sp });
  } catch (err) {
    await t.rollback();
    console.error(" Lỗi thêm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.put("/:id", upload.any(), async (req, res) => {
  const t = await SanPhamModel.sequelize.transaction();
  try {
    const sp = await SanPhamModel.findByPk(req.params.id, { transaction: t });
    if (!sp) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    let { tensp, mota, anhien, danhmuc_id, thuonghieu_id, bienthe } = req.body;
    if (typeof bienthe === "string") bienthe = JSON.parse(bienthe || "[]");

    const thumbnailFile = req.files.find((f) => f.fieldname === "thumbnail");
    const thumbnailPath = thumbnailFile
      ? `/uploads/sanpham/${thumbnailFile.filename}`
      : sp.thumbnail;
    await sp.update(
      { tensp, mota, anhien, danhmuc_id, thuonghieu_id, thumbnail: thumbnailPath },
      { transaction: t }
    );

    const oldVariants = await SanPhamBienTheModel.findAll({
      where: { sanpham_id: sp.id },
      include: [{ model: ImageModel, as: "images" }],
      transaction: t,
    });

    for (let i = 0; i < bienthe.length; i++) {
      const bt = bienthe[i];
      const filesForVariant = req.files.filter((f) => f.fieldname === `images_${i}`);

      if (bt.id) {
        const oldBT = oldVariants.find((v) => v.id === bt.id);
        if (oldBT) {
          await oldBT.update(
            {
              mausac: bt.mausac,
              kichthuoc: bt.kichthuoc,
              chatlieu: bt.chatlieu,
              gia: bt.gia,
              sl_tonkho: bt.sl_tonkho ?? 0,
            },
            { transaction: t }
          );

          for (const file of filesForVariant) {
            await ImageModel.create(
              { bienthe_id: oldBT.id, url: `/uploads/sanpham/${file.filename}` },
              { transaction: t }
            );
          }
        }
      } else {
        const newBT = await SanPhamBienTheModel.create(
          {
            sanpham_id: sp.id,
            mausac: bt.mausac,
            kichthuoc: bt.kichthuoc,
            chatlieu: bt.chatlieu,
            gia: bt.gia,
            sl_tonkho: bt.sl_tonkho ?? 0,
          },
          { transaction: t }
        );

        for (const file of filesForVariant) {
          await ImageModel.create(
            { bienthe_id: newBT.id, url: `/uploads/sanpham/${file.filename}` },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();
    res.json({ message: " Cập nhật sản phẩm thành công!", sp });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const sp = await SanPhamModel.findByPk(req.params.id);
    if (!sp) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await sp.destroy();
    res.json({ message: " Đã xóa sản phẩm!" });
  } catch (err) {
    console.error(" Lỗi xóa sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;


