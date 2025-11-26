// utils/discount.js
const { MaGiamGiaModel } = require("../../database");
const { Op } = require("sequelize");

/**
 * Áp dụng mã giảm giá (percent, cash, freeship)
 * @param {string} code - mã giảm giá
 * @param {number} tongTien - tổng tiền hàng
 * @param {number} phiVanChuyen - phí ship hiện tại
 * @returns {Object} giamgia, phiVanChuyen, magiamgia_id, magiamgia_code, message
 */
async function apDungMaGiamGia(code, tongTien, phiVanChuyen) {
  const now = new Date();

  const mg = await MaGiamGiaModel.findOne({
    where: {
      code,
      trangthai: 1,
      ngaybatdau: { [Op.lte]: now },
      ngayketthuc: { [Op.gte]: now },
    },
  });

  if (!mg) {
    return {
      giamgia: 0,
      phiVanChuyen,
      magiamgia_id: null,
      magiamgia_code: null,
      message: "Mã giảm giá không hợp lệ",
    };
  }

  // Chuyển kiểu an toàn
  const giaTriGiam = Number(mg.giatrigiam || 0);
  const giaTriToiThieu = Number(mg.giatri_toithieu || 0);
  let giamgia = 0;
  let phiVanChuyenSau = phiVanChuyen;

  // Kiểm tra giá trị đơn hàng tối thiểu (nếu có)
  if (giaTriToiThieu > 0 && tongTien < giaTriToiThieu) {
    return {
      giamgia: 0,
      phiVanChuyen,
      magiamgia_id: mg.id,
      magiamgia_code: mg.code,
      message: ` Đơn hàng cần tối thiểu ${giaTriToiThieu.toLocaleString()}₫ để áp dụng mã này`,
    };
  }

  // Tính giảm giá
  switch (mg.loai) {
    case "percent":
      giamgia = Math.floor((tongTien * giaTriGiam) / 100);
      break;
    case "cash":
      giamgia = giaTriGiam;
      break;
    case "freeship":
      phiVanChuyenSau = 0;
      break;
    default:
      return {
        giamgia: 0,
        phiVanChuyen,
        magiamgia_id: mg.id,
        magiamgia_code: mg.code,
        message: "Loại mã giảm giá không hợp lệ",
      };
  }

  // Giới hạn giảm không vượt quá tổng tiền
  if (giamgia > tongTien) giamgia = tongTien;

  return {
    giamgia,
    phiVanChuyen: phiVanChuyenSau,
    magiamgia_id: mg.id,
    magiamgia_code: mg.code,
    message: " Áp dụng mã giảm giá thành công",
  };
}

module.exports = { apDungMaGiamGia };