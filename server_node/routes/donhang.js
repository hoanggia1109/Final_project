const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const {
  DonHangModel,
  DonHangChiTietModel,
  GioHangModel,
  SanPhamBienTheModel,
  SanPhamModel,
  UserModel, // CHANGED: Import UserModel để lấy email user
} = require("../database");
const { auth } = require("../middleware/auth");
const router = express.Router();
const { tinhPhiVanChuyen } = require("./utils/shipping");
const { apDungMaGiamGia } = require("./utils/discount");
// CHANGED: Không import email function, chỉ gửi email khi thanh toán thành công
/**
 * POST /api/donhang/tinh-tong-tien
 * Tính tạm tổng tiền, giảm giá và phí vận chuyển (không tạo đơn hàng)
 */
router.post("/tinh-tong-tien", auth, async (req, res) => {
  try {
    const cart = await GioHangModel.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          include: [{ model: SanPhamModel, as: "sanpham" }],
        },
      ],
    });

    if (!cart.length)
      return res.status(400).json({ message: "Giỏ hàng trống" });


    let total = 0;
    for (const c of cart)
      total += Number(c.bienthe?.gia || 0) * Number(c.soluong || 0);




    const phiVanChuyen = tinhPhiVanChuyen({ tinh_thanh: req.body.tinh_thanh });


    const {
  giamgia,
  phiVanChuyen: phiSauGiam,
  magiamgia_id,
  magiamgia_code,
  message,
} = await apDungMaGiamGia(req.body.magiamgia_code, total, phiVanChuyen);

    //  Tổng cuối cùng
    const tong_sau_giam = total - giamgia + phiSauGiam;

    res.json({
  message: message || "Tính tổng tiền thành công",
  tong_tien_hang: total,
  giam_gia: giamgia,
  phi_van_chuyen: phiSauGiam,
  tong_thanh_toan: Math.max(0, total - giamgia) + (phiSauGiam || 0),
  magiamgia_code,
});
  } catch (err) {
    console.error(" Lỗi tính tổng tiền:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/**
 * POST /api/donhang
 * Tạo đơn hàng từ giỏ hàng người dùng
 */
router.post("/", auth, async (req, res) => {
  try {
    // Lấy giỏ hàng user
    const cart = await GioHangModel.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          required: true,
          include: [{ model: SanPhamModel, as: "sanpham" }],
        },
      ],
    });

    if (!cart.length)
      return res.status(400).json({ message: "Giỏ hàng trống" });

    // ====== Tính tổng tiền hàng ======
    let total = 0;
    for (const c of cart) {
      total += Number(c.bienthe?.gia || 0) * Number(c.soluong || 0);
    }

    // ====== Tính phí vận chuyển ======
    const phiVanChuyenCoBan = tinhPhiVanChuyen({
      tinh_thanh: req.body.tinh_thanh,
    });

    // ====== Áp dụng mã giảm giá (nếu có) ======
    let giamgia = 0,
      phiSauGiam = phiVanChuyenCoBan,
      magiamgia_id = null,
      magiamgia_code = null;

    if (req.body.magiamgia_code) {
      const kq = await apDungMaGiamGia(
        req.body.magiamgia_code,
        total,
        phiVanChuyenCoBan
      );
      giamgia = kq.giamgia;
      phiSauGiam = kq.phiVanChuyen;
      magiamgia_id = kq.magiamgia_id;
      magiamgia_code = kq.magiamgia_code;
    }

    // ====== Tính tổng cuối ======
    const tong_sau_giam = Math.max(0, total - giamgia) + (phiSauGiam || 0);

    // ====== Tạo đơn hàng ======
    // CHANGED: Lưu phương thức thanh toán từ request (cod, stripe, banking)
    const phuongthucthanhtoan = req.body.phuongthucthanhtoan || 'cod';
    
    // CHANGED: Lưu thông tin địa chỉ nếu có (cho banking và các phương thức khác)
    const dh = await DonHangModel.create({
      id: uuidv4(),
      code: "OD" + Date.now(),
      user_id: req.user.id,
      tongtien: total,
      giamgia,
      tongtien_sau_giam: tong_sau_giam,
      phi_van_chuyen: phiSauGiam,
      magiamgia_id,
      magiamgia_code,
      diachi_id: req.body.diachi_id || null,
      ghichu: req.body.ghichu || null,
      trangthai: "pending",
      trangthaithanhtoan: "pending",
      phuongthucthanhtoan: phuongthucthanhtoan, // CHANGED: Lưu phương thức thanh toán (cod, stripe, banking)
      // CHANGED: Lưu thông tin địa chỉ chi tiết nếu có (cho banking)
      diachichitiet: req.body.address || null,
      phuong_xa: req.body.ward || null,
      quan_huyen: req.body.district || null,
      tinh_thanh: req.body.tinh_thanh || req.body.city || null,
      hoten: req.body.fullName || null,
      sdt: req.body.phone || null,
    });

    // ====== Lưu chi tiết đơn hàng ======
    for (const c of cart) {
      await DonHangChiTietModel.create({
        id: uuidv4(),
        donhang_id: dh.id,
        bienthe_id: c.bienthe_id,
        soluong: c.soluong,
        gia: c.bienthe.gia,
      });
    }

    // ====== Xóa giỏ hàng sau khi đặt ======
    await GioHangModel.destroy({ where: { user_id: req.user.id } });

    // CHANGED: Không gửi email khi tạo đơn hàng, chỉ gửi khi thanh toán thành công
    // Email sẽ được gửi ở thanhtoan.js khi thanh toán thành công

    // ====== Trả về kết quả ======
    res.json({
      message: "Đặt hàng thành công",
      donhang: {
        id: dh.id,
        code: dh.code,
        tong_tien_hang: total,
        giam_gia: giamgia,
        phi_van_chuyen: phiSauGiam,
        tong_thanh_toan: tong_sau_giam,
        magiamgia_code,
        trangthai: dh.trangthai,
        trangthaithanhtoan: dh.trangthaithanhtoan,
      },
    });
  } catch (err) {
    console.error(" Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;



/**
 * GET /api/donhang
 * Lấy danh sách đơn hàng người dùng
 */
router.get("/", auth, async (req, res) => {
  const { DiaChiModel } = require("../database");
  const dh = await DonHangModel.findAll({
    where: { user_id: req.user.id },
    include: [
      {
        model: DonHangChiTietModel,
        as: "chitiet",
        include: [
          {
            model: SanPhamBienTheModel,
            as: "bienthe",
            include: [{ model: SanPhamModel, as: "sanpham" }],
          },
        ],
      },
      {
        model: DiaChiModel,
        as: "diachi",
        required: false
      }
    ],
    order: [["created_at", "DESC"]],
  });
  res.json(dh);
});

/**
 * GET /api/donhang/:id
 * Chi tiết 1 đơn hàng
 */
router.get("/:id", auth, async (req, res) => {
  const { DiaChiModel } = require("../database");
  const dh = await DonHangModel.findByPk(req.params.id, {
    include: [
      {
        model: DonHangChiTietModel,
        as: "chitiet",
        include: [
          {
            model: SanPhamBienTheModel,
            as: "bienthe",
            include: [{ model: SanPhamModel, as: "sanpham" }],
          },
        ],
      },
      {
        model: DiaChiModel,
        as: "diachi",
        required: false
      }
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