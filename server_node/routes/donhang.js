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
 * GET /api/donhang/stats
 * Lấy thống kê đơn hàng cho tính toán sản phẩm bán chạy (Public, không cần auth)
 * Route này PHẢI đặt TRƯỚC route /:id để tránh conflict
 * Route này chỉ trả về dữ liệu tối thiểu: chitiet_donhang với bienthe.sanpham_id và soluong
 */
router.get("/stats", async (req, res) => {
  try {
    const orders = await DonHangModel.findAll({
      attributes: ['id'], // Chỉ lấy id để optimize
      include: [
        {
          model: DonHangChiTietModel,
          as: "chitiet",
          attributes: ['soluong'], // Chỉ lấy soluong
          include: [
            {
              model: SanPhamBienTheModel,
              as: "bienthe",
              attributes: ['sanpham_id'], // Chỉ lấy sanpham_id
            },
          ],
        },
      ],
      where: {
        // Chỉ lấy đơn hàng đã hoàn thành hoặc đang xử lý (không lấy đơn đã hủy)
        trangthai: {
          [Op.notIn]: ['cancelled', 'returned']
        }
      }
    });
    
    res.json(orders);
  } catch (err) {
    console.error("Lỗi lấy thống kê đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

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

    // CHANGED: Xóa giỏ hàng ngay sau khi tạo đơn hàng thành công
    // Giỏ hàng sẽ được xóa ngay khi đơn hàng được tạo, không cần chờ thanh toán
    try {
      const deletedCount = await GioHangModel.destroy({ 
        where: { user_id: req.user.id } 
      });
      console.log(`✅ [DonHang] Cart cleared after order creation: ${deletedCount} item(s) deleted for user ${req.user.id}`);
    } catch (cartError) {
      console.error('❌ [DonHang] Error clearing cart after order creation:', cartError);
      // Không throw error vì đơn hàng đã được tạo thành công
    }

    // CHANGED: Không gửi email khi tạo đơn hàng, chỉ gửi khi thanh toán thành công
    // Email sẽ được gửi ở thanhtoan.js khi thanh toán thành công



    // ====== Trả về kết quả ======
    res.json({

      message: "Đặt hàng thành công. Vui lòng hoàn tất thanh toán.",

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

/**
 * GET /api/donhang
 * Lấy danh sách đơn hàng người dùng
 */
router.get("/", auth, async (req, res) => {
  try {
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
    
    console.log(`[GET /api/donhang] Found ${dh.length} orders for user ${req.user.id}`);
    res.json(dh);
  } catch (err) {
    console.error("Lỗi GET /api/donhang:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/**
 * GET /api/donhang/admin/all
 * Lấy tất cả đơn hàng (Admin only)
 * 
 * CHANGED: Route này PHẢI đặt TRƯỚC route /:id để tránh conflict
 * Vì Express sẽ match /admin/all với /:id nếu đặt sau
 */
router.get("/admin/all", auth, async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
    }

    const { DiaChiModel, UserModel } = require("../database");
    
    const orders = await DonHangModel.findAll({
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
        },
        {
          model: UserModel,
          as: "user",
          attributes: ['id', 'email', 'ho_ten', 'sdt'],
          required: false
        }
      ],
      order: [["created_at", "DESC"]],
    });
    
    res.json(orders);
  } catch (err) {
    console.error("Lỗi lấy danh sách đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/**
 * GET /api/donhang/:id
 * Chi tiết 1 đơn hàng
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const { DiaChiModel } = require("../database");
    
    const donhang = await DonHangModel.findByPk(req.params.id, {
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

    if (!donhang) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra quyền: user chỉ có thể xem đơn hàng của mình, trừ khi là admin
    if (req.user.role !== 'admin' && donhang.user_id !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền xem đơn hàng này" });
    }

    res.json(donhang);
  } catch (err) {
    console.error("Lỗi GET /api/donhang/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/**
 * PUT /api/donhang/:id/huy
 * Hủy đơn hàng
 * Gửi email thông báo khi hủy đơn hàng
 * 
 * Route này phải đặt trước PUT /:id để tránh conflict
 */
router.put("/:id/huy", auth, async (req, res) => {
  try {
    // Lấy đơn hàng (không cần include user vì sẽ lấy trực tiếp sau)
    const donhang = await DonHangModel.findByPk(req.params.id);

    if (!donhang) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra quyền: chỉ user sở hữu đơn hàng mới được hủy
    if (donhang.user_id !== req.user.id) {
      console.error(`Permission denied: User ${req.user.id} (${req.user.email}) tried to cancel order ${req.params.id} owned by ${donhang.user_id}`);
      return res.status(403).json({ message: "Không có quyền hủy đơn hàng này" });
    }

    // CHANGED: Log để debug
    console.log(`Cancelling order ${donhang.code} - Order user_id: ${donhang.user_id}, Request user_id: ${req.user.id}, Request email: ${req.user.email}`);

    const trangthaiCu = donhang.trangthai;

    // Chỉ cho phép hủy nếu đơn hàng chưa được xác nhận hoặc đang giao
    if (trangthaiCu === "delivered") {
      return res.status(400).json({ message: "Không thể hủy đơn hàng đã được giao" });
    }

    // Lấy lý do hủy từ request body (nếu có)
    const ly_do_huy = req.body.ly_do_huy || null;

    // Cập nhật trạng thái thành cancelled và lý do hủy
    await DonHangModel.update(
      { 
        trangthai: "cancelled",
        ly_do_huy: ly_do_huy || "Khách hàng hủy đơn hàng" // Mặc định nếu không có lý do
      }, 
      { where: { id: req.params.id } }
    );

    // Gửi email thông báo hủy đơn hàng
    // CHANGED: Lấy user email trực tiếp từ user_id trong đơn hàng để đảm bảo đúng user
    try {
      const { sendOrderStatusUpdateEmail } = require("./utils/email");
      
      // Lấy thông tin user từ user_id trong đơn hàng (đảm bảo đúng user sở hữu đơn hàng)
      const orderOwner = await UserModel.findByPk(donhang.user_id, {
        attributes: ["id", "email", "ho_ten"],
      });

      if (orderOwner && orderOwner.email) {
        const chitiet = await DonHangChiTietModel.findAll({
          where: { donhang_id: req.params.id },
          include: [
            {
              model: SanPhamBienTheModel,
              as: "bienthe",
              include: [{ model: SanPhamModel, as: "sanpham" }],
            },
          ],
        });

        console.log(`Sending cancellation email - Order: ${donhang.code}, User ID: ${donhang.user_id}, Email: ${orderOwner.email}`);
        
        await sendOrderStatusUpdateEmail(orderOwner.email, {
          code: donhang.code,
          trangthai: "cancelled",
          trangthai_cu: trangthaiCu,
          tongtien_sau_giam: donhang.tongtien_sau_giam,
          chitiet: chitiet,
        });

        console.log(`Order cancellation email sent successfully to ${orderOwner.email} - Order: ${donhang.code}`);
      } else {
        console.warn(`Cannot send email: User ${donhang.user_id} not found or no email`);
      }
    } catch (emailError) {
      console.error("Error sending order cancellation email:", emailError);
    }

    res.json({ message: "Đã hủy đơn hàng" });
  } catch (err) {
    console.error("Lỗi hủy đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/**
 * PUT /api/donhang/:id/trangthai
 * Cập nhật trạng thái đơn hàng (Admin only)
 */
router.put("/:id/trangthai", auth, async (req, res) => {
  try {
    const { trangthai } = req.body;
    
    // Validate trạng thái
    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(trangthai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }
    
    // Lấy đơn hàng cũ để lấy trạng thái cũ
    const donhangCu = await DonHangModel.findByPk(req.params.id);
    if (!donhangCu) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    
    await DonHangModel.update(
      { trangthai }, 
      { where: { id: req.params.id } }
    );
    
    // ====== Gửi email cập nhật trạng thái ======
    try {
      const { sendOrderStatusUpdateEmail } = require("../services/emailService");
      
      const donhang = await DonHangModel.findByPk(req.params.id, {
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
            model: UserModel,
            as: "user",
            attributes: ['id', 'email', 'ho_ten'],
          },
        ],
      });

      if (donhang && donhang.user && donhang.user.email) {
        await sendOrderStatusUpdateEmail(donhang.user.email, {
          code: donhang.code,
          trangthai: trangthai,
          trangthai_cu: donhangCu.trangthai,
          tongtien_sau_giam: donhang.tongtien_sau_giam,
          chitiet: donhang.chitiet,
        });
      }
    } catch (emailError) {
      console.error("⚠️ Lỗi gửi email cập nhật trạng thái:", emailError);
      // Không chặn response nếu lỗi email
    }
    
    res.json({ message: "Đã cập nhật trạng thái đơn hàng" });
  } catch (err) {
    console.error(" Lỗi cập nhật trạng thái:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;