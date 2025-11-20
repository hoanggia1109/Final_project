const express = require("express");
const router = express.Router();
const { 
  SanPhamBienTheModel, 
  SanPhamModel, 
  PhieuNhapXuatKhoModel,
  UserModel,
  LoaiModel,
  ThuongHieuModel
} = require("../database");
const { auth } = require("../middleware/auth");
const { isAdmin } = require("./admin");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

// ========================================
// DANH SÁCH TỒN KHO
// ========================================
// GET /api/tonkho - Lấy danh sách tồn kho
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const { 
      search, 
      danhmuc_id, 
      thuonghieu_id, 
      tonkho_min, 
      tonkho_max,
      page = 1,
      limit = 20
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    let whereProduct = {};
    let whereBienThe = {};
    
    // Tìm kiếm theo tên sản phẩm
    if (search) {
      whereProduct.tensp = { [Op.like]: `%${search}%` };
    }
    
    // Lọc theo danh mục
    if (danhmuc_id) {
      whereProduct.danhmuc_id = danhmuc_id;
    }
    
    // Lọc theo thương hiệu
    if (thuonghieu_id) {
      whereProduct.thuonghieu_id = thuonghieu_id;
    }
    
    // Lọc theo số lượng tồn kho
    if (tonkho_min !== undefined) {
      whereBienThe.sl_tonkho = { [Op.gte]: parseInt(tonkho_min) };
    }
    if (tonkho_max !== undefined) {
      whereBienThe.sl_tonkho = { 
        ...whereBienThe.sl_tonkho,
        [Op.lte]: parseInt(tonkho_max) 
      };
    }

    const { count, rows } = await SanPhamBienTheModel.findAndCountAll({
      where: whereBienThe,
      include: [
        {
          model: SanPhamModel,
          as: "sanpham",
          where: whereProduct,
          attributes: ["id", "code", "tensp", "thumbnail"],
          include: [
            {
              model: LoaiModel,
              as: "danhmuc",
              attributes: ["id", "tendm"],
            },
            {
              model: ThuongHieuModel,
              as: "thuonghieu",
              attributes: ["id", "tenbrand"],
            },
          ],
        },
      ],
      order: [["sl_tonkho", "ASC"]], // Sắp xếp từ thấp đến cao
      limit: limitNum,
      offset: offset,
      distinct: true, // Đảm bảo count chính xác khi có join
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      }
    });
  } catch (err) {
    console.error("❌ Lỗi GET /api/tonkho:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ========================================
// CHI TIẾT TỒN KHO MỘT BIẾN THỂ
// ========================================
// GET /api/tonkho/:id - Lấy chi tiết tồn kho của một biến thể
router.get("/:id", auth, isAdmin, async (req, res) => {
  try {
    const bienthe = await SanPhamBienTheModel.findByPk(req.params.id, {
      include: [
        {
          model: SanPhamModel,
          as: "sanpham",
          attributes: ["id", "code", "tensp", "thumbnail", "mota"],
          include: [
            {
              model: LoaiModel,
              as: "danhmuc",
              attributes: ["id", "tendm"],
            },
            {
              model: ThuongHieuModel,
              as: "thuonghieu",
              attributes: ["id", "tenbrand"],
            },
          ],
        },
      ],
    });

    if (!bienthe) {
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    res.json(bienthe);
  } catch (err) {
    console.error(" Lỗi GET /api/tonkho/:id:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ========================================
// NHẬP KHO
// ========================================
// POST /api/tonkho/nhap - Nhập kho
router.post("/nhap", auth, isAdmin, async (req, res) => {
  try {
    const { bienthe_id, soluong, lydo } = req.body;
    const user_id = req.user.id;

    // Kiểm tra biến thể có tồn tại không
    const bienthe = await SanPhamBienTheModel.findByPk(bienthe_id);
    if (!bienthe) {
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    const soluong_truoc = bienthe.sl_tonkho || 0;
    const soluong_sau = soluong_truoc + parseInt(soluong);

    // Tạo phiếu nhập kho
    const phieu = await PhieuNhapXuatKhoModel.create({
      id: uuidv4(),
      bienthe_id,
      loai: "nhap",
      soluong: parseInt(soluong),
      soluong_truoc,
      soluong_sau,
      lydo: lydo || "Nhập kho",
      nguoi_thuc_hien: user_id,
    });

    // Cập nhật số lượng tồn kho
    await bienthe.update({ sl_tonkho: soluong_sau });

    // Lấy thông tin chi tiết phiếu nhập
    const phieuDetail = await PhieuNhapXuatKhoModel.findByPk(phieu.id, {
      include: [
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          include: [
            {
              model: SanPhamModel,
              as: "sanpham",
              attributes: ["id", "code", "tensp"],
            },
          ],
        },
        {
          model: UserModel,
          as: "nguoi_thuc_hien_info",
          attributes: ["id", "ho_ten", "email"],
        },
      ],
    });

    res.status(201).json({
      message: "Nhập kho thành công",
      phieu: phieuDetail,
    });
  } catch (err) {
    console.error(" Lỗi POST /api/tonkho/nhap:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ========================================
// XUẤT KHO
// ========================================
// POST /api/tonkho/xuat - Xuất kho
router.post("/xuat", auth, isAdmin, async (req, res) => {
  try {
    const { bienthe_id, soluong, lydo } = req.body;
    const user_id = req.user.id;

    // Kiểm tra biến thể có tồn tại không
    const bienthe = await SanPhamBienTheModel.findByPk(bienthe_id);
    if (!bienthe) {
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    const soluong_truoc = bienthe.sl_tonkho || 0;
    const soluong_xuat = parseInt(soluong);

    // Kiểm tra số lượng tồn kho có đủ không
    if (soluong_truoc < soluong_xuat) {
      return res.status(400).json({ 
        message: "Số lượng tồn kho không đủ",
        tonkho_hientai: soluong_truoc,
        soluong_xuat: soluong_xuat,
      });
    }

    const soluong_sau = soluong_truoc - soluong_xuat;

    // Tạo phiếu xuất kho
    const phieu = await PhieuNhapXuatKhoModel.create({
      id: uuidv4(),
      bienthe_id,
      loai: "xuat",
      soluong: soluong_xuat,
      soluong_truoc,
      soluong_sau,
      lydo: lydo || "Xuất kho",
      nguoi_thuc_hien: user_id,
    });

    // Cập nhật số lượng tồn kho
    await bienthe.update({ sl_tonkho: soluong_sau });

    // Lấy thông tin chi tiết phiếu xuất
    const phieuDetail = await PhieuNhapXuatKhoModel.findByPk(phieu.id, {
      include: [
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          include: [
            {
              model: SanPhamModel,
              as: "sanpham",
              attributes: ["id", "code", "tensp"],
            },
          ],
        },
        {
          model: UserModel,
          as: "nguoi_thuc_hien_info",
          attributes: ["id", "ho_ten", "email"],
        },
      ],
    });

    res.status(201).json({
      message: "Xuất kho thành công",
      phieu: phieuDetail,
    });
  } catch (err) {
    console.error(" Lỗi POST /api/tonkho/xuat:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ========================================
// LỊCH SỬ NHẬP XUẤT KHO
// ========================================
// GET /api/tonkho/lichsu - Lấy lịch sử nhập xuất kho
router.get("/lichsu/all", auth, isAdmin, async (req, res) => {
  try {
    const { bienthe_id, loai, from_date, to_date } = req.query;
    
    let where = {};
    
    // Lọc theo biến thể
    if (bienthe_id) {
      where.bienthe_id = bienthe_id;
    }
    
    // Lọc theo loại (nhập/xuất)
    if (loai) {
      where.loai = loai;
    }
    
    // Lọc theo khoảng thời gian
    if (from_date) {
      where.created_at = { [Op.gte]: new Date(from_date) };
    }
    if (to_date) {
      where.created_at = { 
        ...where.created_at,
        [Op.lte]: new Date(to_date) 
      };
    }

    const lichsu = await PhieuNhapXuatKhoModel.findAll({
      where,
      include: [
        {
          model: SanPhamBienTheModel,
          as: "bienthe",
          include: [
            {
              model: SanPhamModel,
              as: "sanpham",
              attributes: ["id", "code", "tensp", "thumbnail"],
            },
          ],
        },
        {
          model: UserModel,
          as: "nguoi_thuc_hien_info",
          attributes: ["id", "ho_ten", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(lichsu);
  } catch (err) {
    console.error("Lỗi GET /api/tonkho/lichsu:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ========================================
// THỐNG KÊ TỒN KHO
// ========================================
// GET /api/tonkho/thongke - Thống kê tồn kho
router.get("/thongke/summary", auth, isAdmin, async (req, res) => {
  try {
    const { sequelize } = require("../database");
    
    // Tổng số biến thể
    const tongBienThe = await SanPhamBienTheModel.count();
    
    // Tổng số lượng tồn kho
    const tongTonKho = await SanPhamBienTheModel.sum("sl_tonkho") || 0;
    
    // Số biến thể sắp hết hàng (< 10)
    const sapHetHang = await SanPhamBienTheModel.count({
      where: {
        sl_tonkho: { [Op.lt]: 10, [Op.gt]: 0 }
      }
    });
    
    // Số biến thể hết hàng
    const hetHang = await SanPhamBienTheModel.count({
      where: {
        sl_tonkho: { [Op.lte]: 0 }
      }
    });
    
    // Số lượng nhập/xuất trong tháng
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const nhapTrongThang = await PhieuNhapXuatKhoModel.sum("soluong", {
      where: {
        loai: "nhap",
        created_at: { [Op.gte]: startOfMonth }
      }
    }) || 0;
    
    const xuatTrongThang = await PhieuNhapXuatKhoModel.sum("soluong", {
      where: {
        loai: "xuat",
        created_at: { [Op.gte]: startOfMonth }
      }
    }) || 0;

    res.json({
      tongBienThe,
      tongTonKho,
      sapHetHang,
      hetHang,
      nhapTrongThang,
      xuatTrongThang,
    });
  } catch (err) {
    console.error(" Lỗi GET /api/tonkho/thongke:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;

