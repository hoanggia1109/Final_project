/**
 * Script tạo mã giảm giá
 * Chạy: node server_node/scripts/create-discount.js
 */

const { MaGiamGiaModel } = require("../database");
const crypto = require("crypto");

// Hàm UUID
function generateUUID() {
  return crypto.randomUUID();
}

async function createDiscountCode() {
  try {
    console.log(" Bắt đầu tạo mã giảm giá...\n");

    // Tạo các mã giảm giá mẫu
    const discountCodes = [
      {
        id: generateUUID(),
        code: "GIAM10",
        mota: "Giảm 10% cho đơn hàng từ 500k",
        loai: "percent", // percent, cash, ship
        giatrigiam: 10, // 10%
        giatri_toithieu: 500000, // Đơn tối thiểu 500k
        soluong: 100, // Số lượng mã
        ngaybatdau: new Date(),
        ngayketthuc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        trangthai: 1, // Active
      },
      {
        id: generateUUID(),
        code: "GIAM50K",
        mota: "Giảm 50k cho đơn hàng từ 1 triệu",
        loai: "cash",
        giatrigiam: 50000, // 50k
        giatri_toithieu: 1000000, // Đơn tối thiểu 1 triệu
        soluong: 50,
        ngaybatdau: new Date(),
        ngayketthuc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        trangthai: 1,
      },
      {
        id: generateUUID(),
        code: "FREESHIP",
        mota: "Miễn phí vận chuyển cho đơn từ 300k",
        loai: "ship",
        giatrigiam: 0,
        giatri_toithieu: 300000,
        soluong: 200,
        ngaybatdau: new Date(),
        ngayketthuc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        trangthai: 1,
      },
      {
        id: generateUUID(),
        code: "SALE20",
        mota: "Giảm 20% cho đơn hàng từ 2 triệu",
        loai: "percent",
        giatrigiam: 20,
        giatri_toithieu: 2000000,
        soluong: 30,
        ngaybatdau: new Date(),
        ngayketthuc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        trangthai: 1,
      },
      {
        id: generateUUID(),
        code: "GIAM100K",
        mota: "Giảm 100k cho đơn hàng từ 3 triệu",
        loai: "cash",
        giatrigiam: 100000,
        giatri_toithieu: 3000000,
        soluong: 20,
        ngaybatdau: new Date(),
        ngayketthuc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        trangthai: 1,
      },
    ];

    for (const discount of discountCodes) {
      // Check xem mã đã tồn tại chưa
      const existing = await MaGiamGiaModel.findOne({
        where: { code: discount.code },
      });

      if (existing) {
        console.log(`  Mã ${discount.code} đã tồn tại, bỏ qua...`);
      } else {
        await MaGiamGiaModel.create(discount);
        console.log(` Đã tạo mã: ${discount.code}`);
        console.log(`    Mô tả: ${discount.mota}`);
        console.log(`    Giảm: ${discount.loai === 'percent' ? discount.giatrigiam + '%' : discount.giatrigiam.toLocaleString() + 'đ'}`);
        console.log(`    Đơn tối thiểu: ${discount.giatri_toithieu.toLocaleString()}đ`);
        console.log(`    Số lượng: ${discount.soluong}`);
        console.log();
      }
    }

    console.log("\n Hoàn thành! Các mã giảm giá đã được tạo.");
    process.exit(0);
  } catch (error) {
    console.error(" Lỗi:", error.message);
    process.exit(1);
  }
}

createDiscountCode();

