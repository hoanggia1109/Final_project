const express = require("express");
const { LoaiModel, SanPhamModel } = require("../database");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Nếu admin=true thì lấy tất cả, không thì chỉ lấy anhien=1
    const whereClause = req.query.admin === 'true' ? {} : { anhien: 1 };
    
    const danhmuc = await LoaiModel.findAll({
      where: whereClause,
      attributes: ["id", "code", "tendm", "image", "mota", "anhien"],
      order: [["tendm", "ASC"]],
    });
    res.status(200).json(danhmuc);
  } catch (err) {
    console.error("Lỗi /api/danhmuc:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const danhmuc = await LoaiModel.findByPk(id, {
      include: [
        {
          model: SanPhamModel, 
          as: "sanphams",
          where: { anhien: 1 },
          required: false,
        },
      ],
    });

    if (!danhmuc) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json(danhmuc);
  } catch (err) {
    console.error("Lỗi /api/danhmuc/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
  //  Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/danhmuc");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

//  Thêm mới
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { tendm, mota, code, anhien } = req.body;
    // Sử dụng URL động từ request thay vì hardcode localhost:5000
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const image = req.file
      ? `${baseUrl}/uploads/danhmuc/${req.file.filename}`
      : null;

    const newItem = await LoaiModel.create({
      tendm,
      mota,
      code,
      anhien: anhien ?? 1,
      image,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm", error: err.message });
  }
});

//  Cập nhật
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await LoaiModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });

    let image = item.image;
    if (req.file) {
      // Sử dụng URL động từ request thay vì hardcode localhost:5000
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      image = `${baseUrl}/uploads/danhmuc/${req.file.filename}`;
      // xóa file cũ
      if (item.image) {
        const oldPath = path.join(
          __dirname,
          "../uploads/danhmuc",
          path.basename(item.image)
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await item.update({
      ...req.body,
      image,
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
});

//  Xóa
router.delete("/:id", async (req, res) => {
  try {
    const item = await LoaiModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy" });

    // xóa ảnh
    if (item.image) {
      const oldPath = path.join(
        __dirname,
        "../uploads/danhmuc",
        path.basename(item.image)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await item.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa", error: err.message });
  }
});

module.exports = router;