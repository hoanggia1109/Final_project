const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { ChiNhanhModel } = require("../database");

// 🧩 Cấu hình multer cho folder chinhanh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/chinhanh");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📋 Lấy danh sách chi nhánh
router.get("/", async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    
    let whereClause = {};
    if (!isAdmin) {
      whereClause.anhien = 1; // Chỉ lấy chi nhánh đang hiển thị cho user thường
    }

    const chinhanhs = await ChiNhanhModel.findAll({
      where: whereClause,
      order: [["thutu", "ASC"], ["created_at", "DESC"]],
    });
    res.json(chinhanhs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi lấy chi nhánh", error: err.message });
  }
});

// 📋 Lấy chi tiết chi nhánh
router.get("/:id", async (req, res) => {
  try {
    const chinhanh = await ChiNhanhModel.findByPk(req.params.id);
    if (!chinhanh) return res.status(404).json({ message: "Không tìm thấy chi nhánh" });
    res.json(chinhanh);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy chi nhánh", error: err.message });
  }
});

// ➕ Thêm chi nhánh mới
router.post("/", upload.single("hinhanh"), async (req, res) => {
  try {
    const {
      tenchinhanh,
      diachi,
      quan,
      thanhpho,
      sdt,
      email,
      giomocua,
      giodongcua,
      giomocua_cn,
      giodongcua_cn,
      mapurl,
      thutu,
      anhien,
    } = req.body;

    // Sử dụng URL động từ request thay vì hardcode localhost:5000
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const hinhanh = req.file 
      ? `${baseUrl}/uploads/chinhanh/${req.file.filename}` 
      : null;

    const newChiNhanh = await ChiNhanhModel.create({
      tenchinhanh,
      diachi,
      quan,
      thanhpho,
      sdt,
      email: email || null,
      giomocua: giomocua || null,
      giodongcua: giodongcua || null,
      giomocua_cn: giomocua_cn || null,
      giodongcua_cn: giodongcua_cn || null,
      mapurl: mapurl || null,
      hinhanh,
      thutu: thutu ? parseInt(thutu) : 0,
      anhien: anhien ? parseInt(anhien) : 1,
    });

    res.status(201).json(newChiNhanh);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi thêm chi nhánh", error: err.message });
  }
});

// ✏️ Cập nhật chi nhánh
router.put("/:id", upload.single("hinhanh"), async (req, res) => {
  try {
    const chinhanh = await ChiNhanhModel.findByPk(req.params.id);
    if (!chinhanh) return res.status(404).json({ message: "Không tìm thấy chi nhánh" });

    let hinhanh = chinhanh.hinhanh;
    if (req.file) {
      // Sử dụng URL động từ request thay vì hardcode localhost:5000
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      hinhanh = `${baseUrl}/uploads/chinhanh/${req.file.filename}`;
      // Xóa file cũ nếu có
      if (chinhanh.hinhanh) {
        const oldPath = path.join(__dirname, "../uploads/chinhanh", path.basename(chinhanh.hinhanh));
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (unlinkErr) {
            console.error("Lỗi khi xóa file cũ:", unlinkErr);
          }
        }
      }
    }

    const {
      tenchinhanh,
      diachi,
      quan,
      thanhpho,
      sdt,
      email,
      giomocua,
      giodongcua,
      giomocua_cn,
      giodongcua_cn,
      mapurl,
      thutu,
      anhien,
    } = req.body;

    await chinhanh.update({
      tenchinhanh,
      diachi,
      quan,
      thanhpho,
      sdt,
      email: email || null,
      giomocua: giomocua || null,
      giodongcua: giodongcua || null,
      giomocua_cn: giomocua_cn || null,
      giodongcua_cn: giodongcua_cn || null,
      mapurl: mapurl || null,
      hinhanh,
      thutu: thutu ? parseInt(thutu) : 0,
      anhien: anhien ? parseInt(anhien) : 1,
    });

    res.json(chinhanh);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật chi nhánh", error: err.message });
  }
});

// 🔄 Toggle trạng thái ẩn/hiện
router.patch("/:id/toggle", async (req, res) => {
  try {
    const chinhanh = await ChiNhanhModel.findByPk(req.params.id);
    if (!chinhanh) return res.status(404).json({ message: "Không tìm thấy chi nhánh" });

    chinhanh.anhien = chinhanh.anhien === 1 ? 0 : 1;
    await chinhanh.save();

    res.json({ 
      message: "Cập nhật trạng thái thành công",
      anhien: chinhanh.anhien 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: err.message });
  }
});

// 🗑️ Xóa chi nhánh
router.delete("/:id", async (req, res) => {
  try {
    const chinhanh = await ChiNhanhModel.findByPk(req.params.id);
    if (!chinhanh) return res.status(404).json({ message: "Không tìm thấy chi nhánh" });

    // Xóa file hình ảnh nếu có
    if (chinhanh.hinhanh) {
      const oldPath = path.join(__dirname, "../uploads/chinhanh", path.basename(chinhanh.hinhanh));
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (unlinkErr) {
          console.error("Lỗi khi xóa file:", unlinkErr);
        }
      }
    }

    await chinhanh.destroy();
    res.json({ message: "Đã xóa chi nhánh thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa chi nhánh", error: err.message });
  }
});

module.exports = router;


