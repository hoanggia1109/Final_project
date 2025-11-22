// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require("express");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require("jsonwebtoken");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { UserModel, DonHangModel, YeuThichModel, DiaChiModel } = require("../database");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const multer = require("multer");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const router = express.Router();

// Middleware xác thực token
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Thiếu header Authorization" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// Cấu hình multer cho upload avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatar/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)"));
    }
  },
});

// GET /api/profile - Lấy thông tin profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.userId, {
      attributes: [
        "id",
        "email",
        "ho_ten",
        "sdt",
        "ngaysinh",
        "gioitinh",
        "role",
        "avatar",
        "created_at",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Đếm số đơn hàng
    const orderCount = await DonHangModel.count({
      where: { user_id: req.userId },
    });

    // Đếm số sản phẩm yêu thích
    const wishlistCount = await YeuThichModel.count({
      where: { user_id: req.userId },
    });

    // Đếm số địa chỉ
    const addressCount = await DiaChiModel.count({
      where: { user_id: req.userId },
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        sdt: user.sdt,
        ngaysinh: user.ngaysinh,
        gioitinh: user.gioitinh,
        role: user.role,
        avatar: user.avatar,
        created_at: user.created_at,
      },
      stats: {
        orderCount,
        wishlistCount,
        addressCount,
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/profile - Cập nhật thông tin profile
router.put("/", auth, async (req, res) => {
  try {
    const { ho_ten, sdt, ngaysinh, gioitinh } = req.body;

    const user = await UserModel.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Cập nhật thông tin
    await user.update({
      ho_ten: ho_ten !== undefined ? ho_ten : user.ho_ten,
      sdt: sdt !== undefined ? sdt : user.sdt,
      ngaysinh: ngaysinh !== undefined ? ngaysinh : user.ngaysinh,
      gioitinh: gioitinh !== undefined ? gioitinh : user.gioitinh,
      updated_at: new Date(),
    });

    res.json({
      message: "Cập nhật thông tin thành công",
      user: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        sdt: user.sdt,
        ngaysinh: user.ngaysinh,
        gioitinh: user.gioitinh,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profile/avatar - Upload avatar
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    const user = await UserModel.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Cập nhật avatar path
    const avatarPath = `/uploads/avatar/${req.file.filename}`;
    await user.update({
      avatar: avatarPath,
      updated_at: new Date(),
    });

    res.json({
      message: "Upload avatar thành công",
      avatar: avatarPath,
    });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

