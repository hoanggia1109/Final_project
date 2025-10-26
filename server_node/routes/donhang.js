const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const {
  DonHangModel,
  DonHangChiTietModel,
  GioHangModel,
  SanPhamBienTheModel,
  SanPhamModel,
  MaGiamGiaModel
} = require("../database");
const { auth } = require("../middleware/auth");
const router = express.Router();

/**
 * POST /api/donhang
 * Tạo đơn hàng từ giỏ hàng người dùng
 */
router.post("/", auth, async (req, res) => {
  try {
    // Lấy giỏ hàng của user
    const cart = await GioHangModel.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          required: true,
          attributes: ["id", "gia"],
          include: [{ model: SanPhamModel, as: "sanpham", attributes: ["id", "tensp"] }],
        },
      ],
    });

    if (!cart.length) return res.status(400).json({ message: "Giỏ hàng trống" });

    // Tính tổng tiền
    let total = 0;
    for (const c of cart) {
      if (c.bienthe) total += Number(c.bienthe.gia) * c.soluong;
    }

    // ===== Áp dụng mã giảm giá (nếu có) =====
    let giamgia = 0;
    let magiamgia_code = null;
    if (req.body.magiamgia_code) {
      const now = new Date();
      const mg = await MaGiamGiaModel.findOne({
        where: {
          code: req.body.magiamgia_code,
          trangthai: 1,
          ngaybatdau: { [Op.lte]: now },
          ngayketthuc: { [Op.gte]: now },
        },
      });

      if (mg) {
        magiamgia_code = mg.code;
        if (mg.loai === "percent") giamgia = (total * mg.giatrigiam) / 100;
        if (mg.loai === "cash") giamgia = mg.giatrigiam;
        if (giamgia > total) giamgia = total;
      }
    }

    const tong_sau_giam = total - giamgia;

    // ===== Tạo đơn hàng =====
    const dh = await DonHangModel.create({
      id: uuidv4(),
      code: "OD" + Date.now(),
      user_id: req.user.id,
      tongtien: total,
      giamgia,
      tongtien_sau_giam: tong_sau_giam,
      magiamgia_code,
    });

    // ===== Lưu chi tiết đơn hàng =====
    for (const c of cart) {
      if (c.bienthe) {
        await DonHangChiTietModel.create({
          id: uuidv4(),
          donhang_id: dh.id,
          bienthe_id: c.bienthe_id,
          soluong: c.soluong,
          gia: c.bienthe.gia,
        });
      }
    }

    // Xóa giỏ hàng sau khi đặt hàng
    await GioHangModel.destroy({ where: { user_id: req.user.id } });

    res.json({ message: "Đặt hàng thành công", donhang: dh });
  } catch (err) {
    console.error("Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/**
 * GET /api/donhang
 * Lấy danh sách đơn hàng người dùng
 */
router.get("/", auth, async (req, res) => {
  const dh = await DonHangModel.findAll({
    where: { user_id: req.user.id },
    include: [
      {
        model: DonHangChiTietModel,
        include: [
          {
            model: SanPhamBienTheModel,
            as: "bienthe",
            include: [{ model: SanPhamModel, as: "sanpham" }],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(dh);
});

/**
 * GET /api/donhang/:id
 * Chi tiết 1 đơn hàng
 */
router.get("/:id", auth, async (req, res) => {
  const dh = await DonHangModel.findByPk(req.params.id, {
    include: [
      {
        model: DonHangChiTietModel,
        include: [
          {
            model: SanPhamBienTheModel,
            as: "bienthe",
            include: [{ model: SanPhamModel, as: "sanpham" }],
          },
        ],
      },
    ],
  });
  res.json(dh);
});

/**
 * PUT /api/donhang/:id/huy
 * Hủy đơn hàng
 */
router.put("/:id/huy", auth, async (req, res) => {
  await DonHangModel.update({ trangthai: "cancelled" }, { where: { id: req.params.id } });
  res.json({ message: "Đã hủy đơn hàng" });
});

module.exports = router;