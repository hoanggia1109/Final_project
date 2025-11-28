const { DonHangModel, UserModel, DonHangChiTietModel, SanPhamBienTheModel, SanPhamModel } = require("../database");
const { Op } = require("sequelize");
const { sendOrderStatusUpdateEmail } = require("../routes/utils/email");
const logger = require("../utils/logger");

/**
 * Job: Tự động hủy đơn hàng Stripe chưa thanh toán sau 1 ngày
 * Chạy mỗi giờ để kiểm tra và hủy các đơn hàng quá hạn
 */
async function cancelExpiredStripeOrders() {
  try {
    // Tính thời điểm 1 ngày (24 giờ) trước từ thời điểm hiện tại
    const oneDayAgo = new Date();
    oneDayAgo.setTime(oneDayAgo.getTime() - 24 * 60 * 60 * 1000); // Trừ đi 24 giờ (1 ngày)

    // Tìm các đơn hàng Stripe chưa thanh toán và đã tạo quá 1 ngày
    const expiredOrders = await DonHangModel.findAll({
      where: {
        phuongthucthanhtoan: "stripe",
        trangthaithanhtoan: "pending", // Chưa thanh toán
        trangthai: "pending", // Trạng thái pending
        created_at: {
          [Op.lt]: oneDayAgo, // Tạo trước 1 ngày
        },
      },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "email", "ho_ten"],
        },
      ],
    });

    if (expiredOrders.length === 0) {
      logger.info("Không có đơn hàng nào cần hủy");
      return;
    }

    logger.info(`Tìm thấy ${expiredOrders.length} đơn hàng cần hủy`);

    // Hủy từng đơn hàng
    for (const order of expiredOrders) {
      try {
        // Cập nhật trạng thái đơn hàng và lý do hủy
        await DonHangModel.update(
          {
            trangthai: "cancelled",
            trangthaithanhtoan: "cancelled",
            ly_do_huy: "Đơn hàng tự động hủy do quá hạn thanh toán (quá 24 giờ chưa thanh toán)",
          },
          { where: { id: order.id } }
        );

        logger.info(`Đã hủy đơn hàng ${order.code} (ID: ${order.id}) - Quá hạn thanh toán`);

        // Gửi email thông báo hủy đơn hàng
        if (order.user && order.user.email) {
          try {
            const chitiet = await DonHangChiTietModel.findAll({
              where: { donhang_id: order.id },
              include: [
                {
                  model: SanPhamBienTheModel,
                  as: "bienthe",
                  include: [{ model: SanPhamModel, as: "sanpham" }],
                },
              ],
            });

            await sendOrderStatusUpdateEmail(order.user.email, {
              code: order.code,
              trangthai: "cancelled",
              trangthai_cu: "pending",
              tongtien_sau_giam: order.tongtien_sau_giam,
              chitiet: chitiet,
            });

            logger.info(`Đã gửi email thông báo hủy đơn hàng đến ${order.user.email}`);
          } catch (emailError) {
            logger.error(`Lỗi khi gửi email thông báo hủy đơn hàng ${order.id}:`, emailError);
          }
        }
      } catch (error) {
        logger.error(`Lỗi khi hủy đơn hàng ${order.id}:`, error);
      }
    }

    logger.info(`Đã hoàn thành hủy ${expiredOrders.length} đơn hàng quá hạn`);
  } catch (error) {
    logger.error("Lỗi trong job hủy đơn hàng quá hạn:", error);
  }
}

module.exports = {
  cancelExpiredStripeOrders,
};

