const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { BaiVietModel, DanhMucBaiVietModel, UserModel } = require("../database");

// 🧩 Cấu hình multer cho folder blog
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/blog");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

//  Lấy danh sách bài viết (cho admin - lấy tất cả)
router.get("/", async (req, res) => {
  try {
    const whereClause = req.query.admin === 'true' ? {} : { anhien: 1 };
    
    const list = await BaiVietModel.findAll({
      where: whereClause,
      include: [
        { model: DanhMucBaiVietModel, as: "danhmuc", attributes: ["tendanhmuc"] },
        { model: UserModel, as: "user", attributes: ["email", "ho_ten"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(list);
  } catch (err) {
    console.error("Lỗi lấy danh sách bài viết:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Lấy tất cả danh mục bài viết (cho dropdown)
router.get("/danhmuc/all", async (req, res) => {
  try {
    const list = await DanhMucBaiVietModel.findAll({
      order: [["tendanhmuc", "ASC"]],
    });
    res.json(list);
  } catch (err) {
    console.error("Lỗi lấy danh mục bài viết:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Lấy tất cả users (cho dropdown tác giả)
router.get("/users/all", async (req, res) => {
  try {
    const list = await UserModel.findAll({
      attributes: ["id", "ho_ten", "email"],
      order: [["ho_ten", "ASC"]],
    });
    res.json(list);
  } catch (err) {
    console.error("Lỗi lấy danh sách users:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Lấy chi tiết bài viết
router.get("/:id", async (req, res) => {
  try {
    const item = await BaiVietModel.findByPk(req.params.id, {
      include: [
        { model: DanhMucBaiVietModel, as: "danhmuc" },
        { model: UserModel, as: "user", attributes: ["email", "ho_ten"] },
      ],
    });
    if (!item) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    
    // Tăng lượt xem
    await item.increment('luotxem');
    await item.reload(); // Reload để lấy giá trị mới
    
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//  Thêm bài viết mới
router.post("/", upload.single("hinh_anh"), async (req, res) => {
  try {
    const { tieude, noidung, danhmuc_baiviet_id, user_id, anhien } = req.body;
    // Sử dụng URL động từ request thay vì hardcode localhost:5000
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const hinh_anh = req.file ? `${baseUrl}/uploads/blog/${req.file.filename}` : null;

    const newItem = await BaiVietModel.create({
      tieude,
      noidung,
      hinh_anh,
      danhmuc_baiviet_id,
      user_id,
      anhien: anhien ?? 1,
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Lỗi khi thêm bài viết:", err);
    res.status(500).json({ message: "Lỗi khi thêm", error: err.message });
  }
});

//  Cập nhật bài viết
router.put("/:id", upload.single("hinh_anh"), async (req, res) => {
  try {
    const item = await BaiVietModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    let hinh_anh = item.hinh_anh;
    if (req.file) {
      // Sử dụng URL động từ request thay vì hardcode localhost:5000
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      hinh_anh = `${baseUrl}/uploads/blog/${req.file.filename}`;
      // xóa ảnh cũ nếu có
      if (item.hinh_anh) {
        const oldPath = path.join(__dirname, "../uploads/blog", path.basename(item.hinh_anh));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await item.update({
      ...req.body,
      hinh_anh,
    });

    res.json(item);
  } catch (err) {
    console.error("Lỗi cập nhật bài viết:", err);
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
});

//  Xóa bài viết
router.delete("/:id", async (req, res) => {
  try {
    const item = await BaiVietModel.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    if (item.hinh_anh) {
      const oldPath = path.join(__dirname, "../uploads/blog", path.basename(item.hinh_anh));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await item.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    console.error("Lỗi xóa bài viết:", err);
    res.status(500).json({ message: "Lỗi xóa", error: err.message });
  }
});

module.exports = router;
