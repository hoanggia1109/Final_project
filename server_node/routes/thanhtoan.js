const express = require("express");
const { DonHangModel } = require("../database");
const { auth } = require("../middleware/auth");
const router = express.Router();

// COD
router.post("/cod", auth, async (req, res) => {
  const { donhang_id } = req.body;
  await DonHangModel.update(
    { trangthaithanhtoan: "COD", phuongthucthanhtoan: "cod" },
    { where: { id: donhang_id } }
  );
  res.json({ message: "Thanh toán khi nhận hàng đã được ghi nhận" });
});

// VNPay (mock demo)
router.post("/vnpay", auth, async (req, res) => {
  const { donhang_id } = req.body;
  const dh = await DonHangModel.findByPk(donhang_id);
  if (!dh) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

  // Giả lập tạo URL thanh toán (thực tế sẽ gọi API VNPay)
  const paymentUrl = `https://sandbox.vnpayment.vn/payment?orderId=${dh.id}&amount=${dh.tongtien}`;
  res.json({ message: "Tạo link VNPay thành công", url: paymentUrl });
});
router.get("/vnpay/return", async (req, res) => {
  const { orderId, vnp_ResponseCode } = req.query;
  if (vnp_ResponseCode === "00") {
    await DonHangModel.update(
      { trangthaithanhtoan: "paid", phuongthucthanhtoan: "vnpay", ngaythanhtoan: new Date() },
      { where: { id: orderId } }
    );
    return res.redirect(`/thanhcong?orderId=${orderId}`);
  }
  res.redirect(`/thatbai?orderId=${orderId}`);
});

// Momo (mock demo)
router.post("/momo", auth, async (req, res) => {
  const { donhang_id } = req.body;
  const dh = await DonHangModel.findByPk(donhang_id);
  if (!dh) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

  const momoUrl = `https://test-payment.momo.vn/payment?orderId=${dh.id}&amount=${dh.tongtien}`;
  res.json({ message: "Tạo link MoMo thành công", url: momoUrl });
});

// Trạng thái thanh toán
router.get("/trangthai/:id", auth, async (req, res) => {
  const dh = await DonHangModel.findByPk(req.params.id);
  if (!dh) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  res.json({
    trangthai: dh.trangthaithanhtoan,
    phuongthuc: dh.phuongthucthanhtoan,
    ngaythanhtoan: dh.ngaythanhtoan,
  });
});

module.exports = router;    