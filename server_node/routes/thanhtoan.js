const express = require("express");
const { DonHangModel, GioHangModel, SanPhamBienTheModel, SanPhamModel, DiaChiModel } = require("../database");
const { auth } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");
const { tinhPhiVanChuyen } = require("./utils/shipping");
const { apDungMaGiamGia } = require("./utils/discount");
const router = express.Router();

// Khởi tạo Stripe
// CHANGED: Đã xóa emoji/sticker khỏi console logs
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecretKey || stripeSecretKey.startsWith('pk_')) {
  console.error('LOI CAU HINH: STRIPE_SECRET_KEY không hợp lệ!');
  console.error('   Cần secret key bắt đầu bằng "sk_test_" hoặc "sk_live_"');
  console.error('   Không được dùng publishable key (pk_test_...)');
}
const stripe = require('stripe')(stripeSecretKey || 'sk_test_YOUR_SECRET_KEY');

// ===================== STRIPE PAYMENT =====================

/**
 * POST /api/thanhtoan/stripe/create-order-and-payment-intent
 * Tạo đơn hàng từ giỏ hàng và Payment Intent cho Stripe (tích hợp vào cart page)
 */
// CHANGED: Đã xóa emoji/sticker khỏi console logs
router.post("/stripe/create-order-and-payment-intent", auth, async (req, res) => {
  console.log('\n=== CREATE ORDER AND PAYMENT INTENT FROM CART ===');
  console.log('User ID:', req.user?.id);
  console.log('Request Body:', req.body);
  
  try {
    const { 
      diachichitiet, 
      phuong_xa, 
      quan_huyen, 
      tinh_thanh, 
      hoten, 
      sdt, 
      note,
      magiamgia_code 
    } = req.body;
    
    // Validate thông tin địa chỉ
    if (!diachichitiet || !quan_huyen || !tinh_thanh || !hoten || !sdt) {
      return res.status(400).json({ 
        message: "Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng" 
      });
    }
    
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

    if (!cart.length) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Tính tổng tiền hàng
    let total = 0;
    for (const c of cart) {
      total += Number(c.bienthe?.gia || 0) * Number(c.soluong || 0);
    }

    // Tính phí vận chuyển
    const phiVanChuyen = tinhPhiVanChuyen({ tinh_thanh });

    // Áp dụng mã giảm giá
    const {
      giamgia,
      phiVanChuyen: phiSauGiam,
      magiamgia_id,
      magiamgia_code: codeApplied,
    } = await apDungMaGiamGia(magiamgia_code, total, phiVanChuyen);

    // Tổng cuối cùng
    const tong_sau_giam = Math.max(0, total - giamgia) + (phiSauGiam || phiVanChuyen);

    // Tạo đơn hàng
    const donhangId = uuidv4();
    const donhangCode = `DH${Date.now()}`;
    
    const donhang = await DonHangModel.create({
      id: donhangId,
      code: donhangCode,
      user_id: req.user.id,
      tongtien: total,
      giamgia: giamgia || 0,
      tongtien_sau_giam: tong_sau_giam,
      phuongthucthanhtoan: "stripe",
      trangthaithanhtoan: "pending", // CHANGED: Thay "processing" bằng "pending" (ENUM chỉ có: pending, paid, failed, refunded, cancelled)
      trangthaidonhang: "pending",
      diachichitiet,
      phuong_xa: phuong_xa || '',
      quan_huyen,
      tinh_thanh,
      hoten,
      sdt,
      note: note || '',
      magiamgia_id: magiamgia_id || null,
      magiamgia_code: codeApplied || null,
      phi_van_chuyen: phiSauGiam || phiVanChuyen,
    });

    // Tạo chi tiết đơn hàng
    for (const c of cart) {
      const gia = Number(c.bienthe?.gia || 0);
      await require("../database").DonHangChiTietModel.create({
        id: uuidv4(),
        donhang_id: donhangId,
        bienthe_id: c.bienthe_id,
        soluong: c.soluong,
        gia: gia,
        tonggia: gia * Number(c.soluong || 0),
      });
    }

    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    console.log('Order created:', donhangId);

    // Tạo Payment Intent với Stripe
    console.log('Creating Stripe Payment Intent...');
    
    // Validate Stripe secret key
    if (!stripeSecretKey || stripeSecretKey.startsWith('pk_')) {
      console.error('STRIPE_SECRET_KEY không hợp lệ:', stripeSecretKey ? 'pk_...' : 'empty');
      throw new Error('STRIPE_SECRET_KEY không hợp lệ. Vui lòng kiểm tra lại cấu hình trong .env');
    }
    
    // Validate và tính toán amount
    console.log('Calculating payment amount:', {
      tong_sau_giam: tong_sau_giam,
      type: typeof tong_sau_giam,
      total: total,
      giamgia: giamgia,
      phiSauGiam: phiSauGiam,
      phiVanChuyen: phiVanChuyen
    });
    
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    let tongTien = Number(tong_sau_giam) || 0;
    if (!tongTien || tongTien <= 0 || isNaN(tongTien)) {
      console.error('Tổng tiền không hợp lệ:', {
        tong_sau_giam: tong_sau_giam,
        calculated: tongTien,
        total: total,
        giamgia: giamgia,
        phiSauGiam: phiSauGiam
      });
      // Thử tính lại
      tongTien = Math.max(0, total - (giamgia || 0)) + (phiSauGiam || phiVanChuyen || 0);
      console.log('Recalculated amount:', tongTien);
      
      if (!tongTien || tongTien <= 0) {
        throw new Error(`Tổng tiền đơn hàng không hợp lệ (${tongTien}₫).`);
      }
    }
    
    // VND không có decimal places, amount phải là số nguyên
    const amount = Math.round(tongTien);
    
    // CHANGED: Stripe yêu cầu minimum 50 cents = ~14,000 VND (để đảm bảo >= $0.50 với tỷ giá hiện tại)
    // Minimum amount cho VND là 14,000₫ để đảm bảo >= $0.50
    if (amount < 14000) {
      throw new Error(`Số tiền thanh toán (${amount}₫) phải tối thiểu 14,000₫ (Stripe yêu cầu tối thiểu $0.50)`);
    }
    
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    console.log('Final payment details:', {
      original_tong_sau_giam: tong_sau_giam,
      calculated_tongtien: tongTien,
      amount: amount,
      currency: 'vnd',
    });
    
    // CHANGED: Sửa lỗi scope - khai báo paymentIntent bên ngoài try block
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "vnd",
        metadata: {
          donhang_id: donhangId,
          donhang_code: donhangCode,
          user_id: String(req.user.id),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      console.log('Payment Intent created:', paymentIntent.id);
      console.log('Client Secret:', paymentIntent.client_secret ? 'Có' : 'KHÔNG CÓ');
      
      if (!paymentIntent.client_secret) {
        throw new Error('Payment Intent không có client_secret');
      }
      
    } catch (stripeError) {
      console.error('\n=== STRIPE API ERROR ===');
      console.error('Error Type:', stripeError.type);
      console.error('Error Code:', stripeError.code);
      console.error('Error Message:', stripeError.message);
      if (stripeError.raw) {
        console.error('Stripe Raw Error:', JSON.stringify(stripeError.raw, null, 2));
      }
      throw stripeError;
    }

    // CHANGED: Đảm bảo paymentIntent đã được tạo thành công trước khi cập nhật DB
    // Cập nhật đơn hàng với payment_intent_id
    await DonHangModel.update(
      { 
        payment_intent_id: paymentIntent.id,
      },
      { where: { id: donhangId } }
    );

    // Xóa giỏ hàng sau khi tạo đơn hàng thành công
    await GioHangModel.destroy({
      where: { user_id: req.user.id }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      donhang_id: donhangId,
      donhang_code: donhangCode,
    });
  } catch (error) {
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    console.error("\n=== ERROR CREATING ORDER AND PAYMENT INTENT ===");
    console.error("Error Type:", error.type);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Stack:", error.stack);
    
    // Trả về lỗi chi tiết hơn
    let errorMessage = error.message || 'Không thể tạo đơn hàng và payment intent';
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = `Lỗi từ Stripe: ${error.message}`;
    } else if (error.code === 'resource_missing' && error.param === 'secret_key') {
      errorMessage = 'STRIPE_SECRET_KEY không hợp lệ. Vui lòng kiểm tra lại cấu hình.';
    }
    
    res.status(500).json({ 
      message: "Lỗi tạo đơn hàng và payment intent", 
      error: errorMessage,
      type: error.type || 'unknown',
      code: error.code || null
    });
  }
});

/**
 * POST /api/thanhtoan/stripe/create-payment-intent
 * Tạo Payment Intent cho Stripe (dùng khi đã có đơn hàng)
 */
// CHANGED: Đã xóa emoji/sticker khỏi console logs
router.post("/stripe/create-payment-intent", auth, async (req, res) => {
  console.log('\n=== CREATE PAYMENT INTENT REQUEST ===');
  console.log('User ID:', req.user?.id);
  console.log('Request Body:', req.body);
  
  try {
    const { donhang_id } = req.body;
    
    // Lấy thông tin đơn hàng
    console.log('Finding order:', donhang_id);
    const donhang = await DonHangModel.findByPk(donhang_id);
    if (!donhang) {
      console.log('Order not found:', donhang_id);
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    
    console.log('Order found:', {
      id: donhang.id,
      code: donhang.code,
      tongtien: donhang.tongtien,
      giamgia: donhang.giamgia,
      tongtien_sau_giam: donhang.tongtien_sau_giam,
      phi_van_chuyen: donhang.phi_van_chuyen,
      user_id: donhang.user_id,
      raw_tongtien_sau_giam: donhang.dataValues?.tongtien_sau_giam
    });
    
    // Debug: Kiểm tra tất cả các field liên quan đến tiền
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    console.log('Order money fields:', {
      tongtien: typeof donhang.tongtien,
      giamgia: typeof donhang.giamgia,
      tongtien_sau_giam: typeof donhang.tongtien_sau_giam,
      phi_van_chuyen: typeof donhang.phi_van_chuyen,
    });

    // Kiểm tra đơn hàng có thuộc về user không
    if (donhang.user_id !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    // Tạo Payment Intent với Stripe
    console.log('Creating Stripe Payment Intent...');
    
    // Validate Stripe secret key
    if (!stripeSecretKey || stripeSecretKey.startsWith('pk_')) {
      console.error('STRIPE_SECRET_KEY không hợp lệ:', stripeSecretKey ? 'pk_...' : 'empty');
      throw new Error('STRIPE_SECRET_KEY không hợp lệ. Vui lòng kiểm tra lại cấu hình trong .env');
    }
    
    // CHANGED: Khai báo amount bên ngoài try block để có thể dùng trong error handler
    // Validate và tính toán amount
    let tongTien = donhang.tongtien_sau_giam;
    let amount = 0; // CHANGED: Khai báo amount để tránh lỗi "amount is not defined" trong error handler
    
    // Kiểm tra nếu tongtien_sau_giam là null/undefined, tính lại từ các field khác
    if (!tongTien || tongTien === null || tongTien === undefined || Number(tongTien) <= 0) {
      console.warn('tongtien_sau_giam không hợp lệ, tính lại từ các field khác');
      const tongTienHang = Number(donhang.tongtien) || 0;
      const giamGia = Number(donhang.giamgia) || 0;
      const phiVC = Number(donhang.phi_van_chuyen) || 0;
      tongTien = Math.max(0, tongTienHang - giamGia) + phiVC;
      console.log('Recalculated:', {
        tongtien_hang: tongTienHang,
        giamgia: giamGia,
        phi_van_chuyen: phiVC,
        tongtien_sau_giam: tongTien
      });
    }
    
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    tongTien = Number(tongTien) || 0;
    if (!tongTien || tongTien <= 0) {
      console.error('Tổng tiền không hợp lệ sau khi validate:', {
        original: donhang.tongtien_sau_giam,
        calculated: tongTien,
        tongtien: donhang.tongtien,
        giamgia: donhang.giamgia,
        phi_van_chuyen: donhang.phi_van_chuyen
      });
      throw new Error(`Tổng tiền đơn hàng không hợp lệ (${tongTien}₫). Vui lòng kiểm tra lại đơn hàng.`);
    }
    
    // VND không có decimal places, amount phải là số nguyên
    amount = Math.round(tongTien); // CHANGED: Gán giá trị cho amount thay vì khai báo const
    
    // CHANGED: Stripe yêu cầu minimum 50 cents = ~14,000 VND (để đảm bảo >= $0.50 với tỷ giá hiện tại)
    // Minimum amount cho VND là 14,000₫ để đảm bảo >= $0.50
    if (amount < 14000) {
      throw new Error(`Số tiền thanh toán (${amount}₫) phải tối thiểu 14,000₫ (Stripe yêu cầu tối thiểu $0.50)`);
    }
    
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    console.log('Payment details:', {
      original_tongtien_sau_giam: donhang.tongtien_sau_giam,
      calculated_tongtien: tongTien,
      amount: amount,
      currency: 'vnd',
    });
    
    // CHANGED: Sửa lỗi scope - khai báo paymentIntent bên ngoài try block
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "vnd",
        metadata: {
          donhang_id: donhang.id,
          donhang_code: donhang.code,
          user_id: String(req.user.id),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      console.log('Payment Intent created:', paymentIntent.id);
      console.log('Client Secret:', paymentIntent.client_secret ? 'Có' : 'KHÔNG CÓ');
      
      // Kiểm tra client_secret
      if (!paymentIntent.client_secret) {
        throw new Error('Payment Intent không có client_secret');
      }
      
    } catch (stripeError) {
      console.error('\n=== STRIPE API ERROR ===');
      console.error('Error Type:', stripeError.type);
      console.error('Error Code:', stripeError.code);
      console.error('Error Message:', stripeError.message);
      if (stripeError.raw) {
        console.error('Stripe Raw Error:', JSON.stringify(stripeError.raw, null, 2));
      }
      throw stripeError;
    }

    // CHANGED: Đảm bảo paymentIntent đã được tạo thành công trước khi cập nhật DB
    // CHANGED: Sửa giá trị trangthaithanhtoan từ "processing" thành "pending" (vì ENUM không có "processing")
    // Cập nhật trạng thái đơn hàng
    await DonHangModel.update(
      { 
        phuongthucthanhtoan: "stripe",
        trangthaithanhtoan: "pending", // CHANGED: Thay "processing" bằng "pending" (ENUM chỉ có: pending, paid, failed, refunded, cancelled)
        payment_intent_id: paymentIntent.id,
      },
      { where: { id: donhang_id } }
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
    
    console.log('Response sent with clientSecret:', paymentIntent.client_secret ? 'Có' : 'KHÔNG CÓ');
  } catch (error) {
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    // CHANGED: Cải thiện error logging để debug lỗi 500
    console.error("\n=== ERROR CREATING PAYMENT INTENT ===");
    console.error("Error Type:", error.type);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Stack:", error.stack);
    
    if (error.raw) {
      console.error("Stripe Raw Error:", JSON.stringify(error.raw, null, 2));
    }
    
    // CHANGED: Sửa lỗi scope - amount có thể không tồn tại trong catch block
    // Log thêm thông tin về request
    console.error("Request details:", {
      donhang_id: req.body?.donhang_id,
      user_id: req.user?.id,
      amount: typeof amount !== 'undefined' ? amount : 'N/A' // CHANGED: Kiểm tra amount trước khi log
    });
    
    // Trả về lỗi chi tiết hơn
    let errorMessage = error.message || 'Không thể tạo payment intent';
    
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = `Lỗi từ Stripe: ${error.message}`;
      // Nếu là lỗi amount quá nhỏ, thêm hướng dẫn
      if (error.code === 'amount_too_small') {
        errorMessage += ' (Yêu cầu tối thiểu 14,000₫)';
      }
    } else if (error.code === 'resource_missing' && error.param === 'secret_key') {
      errorMessage = 'STRIPE_SECRET_KEY không hợp lệ. Vui lòng kiểm tra lại cấu hình.';
    } else if (!error.type) {
      // Nếu không phải Stripe error, có thể là lỗi database hoặc khác
      errorMessage = `Lỗi: ${error.message || 'Không xác định'}`;
    }
    
    res.status(500).json({ 
      message: "Lỗi tạo payment intent", 
      error: errorMessage,
      type: error.type || 'unknown',
      code: error.code || null,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack?.split('\n').slice(0, 3),
        rawMessage: error.message
      } : undefined
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
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý các event từ Stripe
  switch (event.type) {
           case 'payment_intent.succeeded':
             const paymentIntent = event.data.object;
             console.log('PaymentIntent succeeded:', paymentIntent.id);
             
             // Cập nhật trạng thái đơn hàng
             const donhangPaid = await DonHangModel.findOne({
               where: { payment_intent_id: paymentIntent.id }
             });

             if (donhangPaid) {
               await DonHangModel.update(
                 {
                   trangthaithanhtoan: "paid",
                   ngaythanhtoan: new Date(),
                 },
                 { 
                   where: { payment_intent_id: paymentIntent.id }
                 }
               );

               // CHANGED: Gửi email xác nhận thanh toán thành công qua webhook (email duy nhất, gửi 1 lần)
               try {
                 const user = await UserModel.findByPk(donhangPaid.user_id);
                 if (user && user.email) {
                   // CHANGED: Lấy chi tiết đơn hàng để hiển thị trong email
                   const chitiet = await DonHangChiTietModel.findAll({
                     where: { donhang_id: donhangPaid.id },
                     include: [
                       {
                         model: SanPhamBienTheModel,
                         as: "bienthe",
                         include: [{ model: SanPhamModel, as: "sanpham" }],
                       },
                     ],
                   });

                   await sendPaymentSuccessEmail(user.email, {
                     code: donhangPaid.code,
                     id: donhangPaid.id,
                     tongtien_sau_giam: donhangPaid.tongtien_sau_giam,
                     phuongthucthanhtoan: donhangPaid.phuongthucthanhtoan || 'stripe',
                     chitiet: chitiet,
                   });
                   console.log('Payment success email sent via webhook to:', user.email);
                 }
               } catch (emailError) {
                 console.error('Error sending payment success email via webhook:', emailError);
               }
             }
             break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // CHANGED: Đã xóa emoji/sticker khỏi console logs
      console.log('PaymentIntent failed:', failedPayment.id);
      
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
 * GET /api/thanhtoan/stripe/test-config
 * Test cấu hình Stripe (không cần auth để debug)
 */
router.get("/stripe/test-config", async (req, res) => {
  try {
    const hasKey = !!stripeSecretKey;
    const isValidKey = stripeSecretKey && stripeSecretKey.startsWith('sk_');
    const isPublishableKey = stripeSecretKey && stripeSecretKey.startsWith('pk_');
    
    let testResult = null;
    if (isValidKey) {
      try {
        // CHANGED: Minimum amount cho VND là 14,000₫ để đảm bảo >= $0.50
        // Test tạo một payment intent nhỏ
        const testIntent = await stripe.paymentIntents.create({
          amount: 14000, // 14,000 VND minimum (Stripe yêu cầu tối thiểu $0.50)
          currency: "vnd",
          metadata: {
            test: "true"
          },
        });
        testResult = {
          success: true,
          paymentIntentId: testIntent.id,
          hasClientSecret: !!testIntent.client_secret
        };
      } catch (stripeError) {
        testResult = {
          success: false,
          error: stripeError.message,
          type: stripeError.type,
          code: stripeError.code
        };
      }
    }
    
    res.json({
      hasKey,
      isValidKey,
      isPublishableKey,
      keyPrefix: stripeSecretKey ? stripeSecretKey.substring(0, 7) + '...' : 'none',
      testResult
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
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
    // CHANGED: Đã xóa emoji/sticker khỏi console logs
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      message: "Lỗi xác minh thanh toán", 
      error: error.message 
    });
  }
});

/**
 * POST /api/thanhtoan/stripe/confirm-payment
 * Cập nhật trạng thái đơn hàng thành "paid" sau khi thanh toán thành công
 * CHANGED: Thêm endpoint để cập nhật trạng thái ngay lập tức, không cần đợi webhook
 */
router.post("/stripe/confirm-payment", auth, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Thiếu orderId" });
    }

    // Lấy đơn hàng
    const donhang = await DonHangModel.findByPk(orderId);
    if (!donhang) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra đơn hàng có thuộc về user không
    if (donhang.user_id !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    // Nếu có paymentIntentId, xác minh với Stripe
    if (paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({ 
            message: `Payment Intent chưa thành công. Status: ${paymentIntent.status}` 
          });
        }
      } catch (stripeError) {
        console.error("Error verifying payment intent:", stripeError);
        return res.status(400).json({ 
          message: "Không thể xác minh Payment Intent" 
        });
      }
    }

    // CHANGED: Cập nhật trạng thái đơn hàng thành "paid" ngay lập tức
    await DonHangModel.update(
      {
        trangthaithanhtoan: "paid",
        ngaythanhtoan: new Date(),
      },
      { where: { id: orderId } }
    );

    console.log('Order payment confirmed:', orderId);

    // CHANGED: Gửi email xác nhận thanh toán thành công (email duy nhất, gửi 1 lần)
    try {
      const user = await UserModel.findByPk(donhang.user_id);
      if (user && user.email) {
        const updatedDonhang = await DonHangModel.findByPk(orderId);
        // CHANGED: Lấy chi tiết đơn hàng để hiển thị trong email
        const chitiet = await DonHangChiTietModel.findAll({
          where: { donhang_id: orderId },
          include: [
            {
              model: SanPhamBienTheModel,
              as: "bienthe",
              include: [{ model: SanPhamModel, as: "sanpham" }],
            },
          ],
        });

        await sendPaymentSuccessEmail(user.email, {
          code: updatedDonhang.code,
          id: updatedDonhang.id,
          tongtien_sau_giam: updatedDonhang.tongtien_sau_giam,
          phuongthucthanhtoan: updatedDonhang.phuongthucthanhtoan,
          chitiet: chitiet,
        });
        console.log('Payment success email sent to:', user.email);
      }
    } catch (emailError) {
      // CHANGED: Không throw error nếu gửi email thất bại, chỉ log
      console.error('Error sending payment success email:', emailError);
    }

    res.json({ 
      message: "Cập nhật trạng thái thanh toán thành công",
      orderId: orderId,
      status: "paid"
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ 
      message: "Lỗi cập nhật trạng thái thanh toán", 
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

// ===================== BANKING (CHUYỂN KHOẢN) =====================

/**
 * POST /api/thanhtoan/banking/confirm-transfer
 * Xác nhận đã chuyển khoản - cập nhật trạng thái đơn hàng thành "pending" (chờ xác nhận)
 * CHANGED: Tạo endpoint để xác nhận chuyển khoản từ frontend
 */
router.post("/banking/confirm-transfer", auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Thiếu orderId" });
    }

    // Lấy đơn hàng
    const donhang = await DonHangModel.findByPk(orderId);
    if (!donhang) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra đơn hàng có thuộc về user không
    if (donhang.user_id !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    // CHANGED: Cập nhật trạng thái đơn hàng thành "pending" (chờ xác nhận chuyển khoản)
    // Admin sẽ kiểm tra và xác nhận sau khi nhận được tiền
    await DonHangModel.update(
      {
        phuongthucthanhtoan: "banking",
        trangthaithanhtoan: "pending", // Chờ admin xác nhận đã nhận tiền
        trangthaidonhang: "pending",
      },
      { where: { id: orderId } }
    );

    console.log('Banking transfer confirmed for order:', orderId);

    // CHANGED: Không gửi email khi xác nhận banking (chờ admin xác nhận thanh toán)
    // Email sẽ được gửi khi admin xác nhận đơn hàng đã thanh toán thành công

    res.json({ 
      message: "Xác nhận chuyển khoản thành công. Đơn hàng của bạn đang chờ được kiểm tra.",
      orderId: orderId,
      status: "pending"
    });
  } catch (error) {
    console.error("Error confirming banking transfer:", error);
    res.status(500).json({ 
      message: "Lỗi xác nhận chuyển khoản", 
      error: error.message 
    });
  }
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
