const express = require("express");
const { DonHangModel } = require("../database");
const { auth } = require("../middleware/auth");
const router = express.Router();

// Khởi tạo Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY');

// ===================== STRIPE PAYMENT =====================

/**
 * POST /api/thanhtoan/stripe/create-payment-intent
 * Tạo Payment Intent cho Stripe
 */
router.post("/stripe/create-payment-intent", auth, async (req, res) => {
  console.log('\n🔵 === CREATE PAYMENT INTENT REQUEST ===');
  console.log('User ID:', req.user?.id);
  console.log('Request Body:', req.body);
  
  try {
    const { donhang_id } = req.body;
    
    // Lấy thông tin đơn hàng
    console.log('📦 Finding order:', donhang_id);
    const donhang = await DonHangModel.findByPk(donhang_id);
    if (!donhang) {
      console.log('❌ Order not found:', donhang_id);
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    
    console.log('✅ Order found:', {
      id: donhang.id,
      code: donhang.code,
      tongtien_sau_giam: donhang.tongtien_sau_giam,
      user_id: donhang.user_id
    });

    // Kiểm tra đơn hàng có thuộc về user không
    if (donhang.user_id !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    // Tạo Payment Intent với Stripe
    // Stripe yêu cầu số tiền tính bằng cents (VND không có cents nên nhân 1)
    console.log('💳 Creating Stripe Payment Intent...');
    console.log('Amount:', Math.round(donhang.tongtien_sau_giam), 'VND');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(donhang.tongtien_sau_giam), // VND
      currency: "vnd",
      metadata: {
        donhang_id: donhang.id,
        donhang_code: donhang.code,
        user_id: req.user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    console.log('✅ Payment Intent created:', paymentIntent.id);

    // Cập nhật trạng thái đơn hàng
    await DonHangModel.update(
      { 
        phuongthucthanhtoan: "stripe",
        trangthaithanhtoan: "processing",
        payment_intent_id: paymentIntent.id,
      },
      { where: { id: donhang_id } }
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("\n❌ === ERROR CREATING PAYMENT INTENT ===");
    console.error("Error Type:", error.type);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    if (error.raw) {
      console.error("Stripe Raw Error:", error.raw);
    }
    console.error("Full Error:", error);
    
    res.status(500).json({ 
      message: "Lỗi tạo payment intent", 
      error: error.message,
      type: error.type
    });
  }
});

/**
 * POST /api/thanhtoan/stripe/webhook
 * Webhook để nhận thông báo từ Stripe khi thanh toán thành công
 */
router.post("/stripe/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý các event từ Stripe
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
      
      // Cập nhật trạng thái đơn hàng
      await DonHangModel.update(
        {
          trangthaithanhtoan: "paid",
          ngaythanhtoan: new Date(),
        },
        { 
          where: { payment_intent_id: paymentIntent.id }
        }
      );
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ PaymentIntent failed:', failedPayment.id);
      
      // Cập nhật trạng thái đơn hàng
      await DonHangModel.update(
        {
          trangthaithanhtoan: "failed",
        },
        { 
          where: { payment_intent_id: failedPayment.id }
        }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * GET /api/thanhtoan/stripe/verify/:paymentIntentId
 * Xác minh trạng thái thanh toán
 */
router.get("/stripe/verify/:paymentIntentId", auth, async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.params.paymentIntentId
    );

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ 
      message: "Lỗi xác minh thanh toán", 
      error: error.message 
    });
  }
});

// ===================== COD =====================

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