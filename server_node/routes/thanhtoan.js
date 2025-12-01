const express = require("express");

const { DonHangModel, GioHangModel, UserModel, DonHangChiTietModel, SanPhamBienTheModel, SanPhamModel } = require("../database");

const { auth } = require("../middleware/auth");

const { sendPaymentSuccessEmail } = require("../services/emailService");

const router = express.Router();



// Khởi tạo Stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY');

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

      await DonHangChiTietModel.create({

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

    

    // ĐIỂM TIÊN QUYẾT 1: Kiểm tra donhang_id có tồn tại trong request
    if (!donhang_id) {
      return res.status(400).json({ message: "Thiếu donhang_id" });
    }
    

    // Load thông tin đơn hàng từ database
    console.log('Finding order:', donhang_id);
    const donhang = await DonHangModel.findByPk(donhang_id);
    if (!donhang) {
      console.log('Order not found:', donhang_id);
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    

    console.log('Order found:', {
      id: donhang.id,
      code: donhang.code,
      tongtien_sau_giam: donhang.tongtien_sau_giam,
      user_id: donhang.user_id,
      trangthaithanhtoan: donhang.trangthaithanhtoan,
      payment_intent_id: donhang.payment_intent_id
    });

    // ĐIỂM TIÊN QUYẾT 2: Kiểm tra quyền truy cập - user phải sở hữu đơn hàng
    if (donhang.user_id !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền truy cập đơn hàng này" });
    }



    // ĐIỂM TIÊN QUYẾT 3: Đơn hàng chưa được thanh toán
    if (donhang.trangthaithanhtoan === 'paid') {
      return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });
    }



    // ĐIỂM TIÊN QUYẾT 4: Kiểm tra và tái sử dụng payment intent hiện có nếu còn hiệu lực
    if (donhang.payment_intent_id) {
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(donhang.payment_intent_id);
        console.log('Found existing Payment Intent:', existingIntent.id, 'Status:', existingIntent.status);
        

        // Nếu payment intent đang ở trạng thái có thể tiếp tục thanh toán
        // requires_payment_method: Cần nhập thông tin thẻ
        // requires_confirmation: Cần xác nhận thanh toán
        // requires_action: Cần hành động từ user (3D Secure, etc.)
        if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(existingIntent.status)) {
          console.log('Reusing existing Payment Intent');
          return res.json({
            clientSecret: existingIntent.client_secret,
            paymentIntentId: existingIntent.id,
          });
        }
        

        // Nếu payment intent đã succeeded (đã thanh toán) hoặc canceled (đã hủy), tạo mới
        if (['succeeded', 'canceled'].includes(existingIntent.status)) {
          console.log('Existing Payment Intent is', existingIntent.status, '- Creating new one');
        }
      } catch (stripeError) {
        // Nếu không tìm thấy payment intent (có thể đã bị xóa ở Stripe), tiếp tục tạo mới
        console.log('Existing Payment Intent not found or invalid, creating new one:', stripeError.message);
      }
    }

    

    // ĐIỂM TIÊN QUYẾT 5: Tạo Payment Intent mới với Stripe
    console.log('Creating new Stripe Payment Intent...');
    console.log('Amount:', Math.round(donhang.tongtien_sau_giam), 'VND');
    

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(donhang.tongtien_sau_giam), // VND - Stripe yêu cầu số tiền là số nguyên
      currency: "vnd",
      metadata: {
        donhang_id: donhang.id,
        donhang_code: donhang.code,
        user_id: String(req.user.id),
      },
      automatic_payment_methods: {
        enabled: true, // Cho phép tất cả phương thức thanh toán được hỗ trợ
      },
    });
    

    console.log('Payment Intent created:', paymentIntent.id);

    // ĐIỂM TIÊN QUYẾT 6: Cập nhật payment_intent_id vào đơn hàng để theo dõi
    // Giữ trạng thái thanh toán là "pending" cho đến khi webhook hoặc confirm-payment xác nhận thành công
    await DonHangModel.update(
      { 
        phuongthucthanhtoan: "stripe",
        trangthaithanhtoan: "pending", // Giữ pending cho đến khi thanh toán thành công
        payment_intent_id: paymentIntent.id,
      },
      { where: { id: donhang_id } }
    );

    // Trả về clientSecret để frontend sử dụng với Stripe Elements
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error("\n=== ERROR CREATING PAYMENT INTENT ===");
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

               // Xóa giỏ hàng sau khi thanh toán Stripe thành công

               if (donhangPaid.user_id) {

                 try {

                   const deletedCount = await GioHangModel.destroy({ where: { user_id: donhangPaid.user_id } });

                   console.log(`Webhook: Đã xóa giỏ hàng của user ${donhangPaid.user_id}: ${deletedCount} item(s) deleted`);

                 } catch (cartError) {

                   console.error('Webhook: Error clearing cart:', cartError);

                 }

               }

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

    // CHANGED: Xóa giỏ hàng sau khi thanh toán thành công
    try {
      const deletedCount = await GioHangModel.destroy({ where: { user_id: donhang.user_id } });
      console.log(`Cart cleared after successful payment for user ${donhang.user_id}: ${deletedCount} item(s) deleted`);
    } catch (cartError) {
      console.error('Error clearing cart after payment:', cartError);
      // Không throw error để không ảnh hưởng đến response
    }

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

  try {

    const { donhang_id } = req.body;

    
    // Cập nhật trạng thái thanh toán

    await DonHangModel.update(

      { trangthaithanhtoan: "paid", phuongthucthanhtoan: "cod", ngaythanhtoan: new Date() },

      { where: { id: donhang_id } }

    );

    // Xóa giỏ hàng sau khi xác nhận COD thành công
    try {
      const deletedCount = await GioHangModel.destroy({ where: { user_id: req.user.id } });
      console.log(`COD: Đã xóa giỏ hàng của user ${req.user.id}: ${deletedCount} item(s) deleted`);
    } catch (cartError) {
      console.error('COD: Error clearing cart:', cartError);
      // Không throw error để không ảnh hưởng đến response
    }

    // ====== Gửi email thanh toán thành công ======

    try {

      const donhang = await DonHangModel.findByPk(donhang_id, {

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

        await sendPaymentSuccessEmail(donhang.user.email, {

          code: donhang.code,

          id: donhang.id,

          tongtien_sau_giam: donhang.tongtien_sau_giam,

          phuongthucthanhtoan: "cod",

          chitiet: donhang.chitiet,

        });

      }

    } catch (emailError) {

      console.error("Lỗi gửi email thanh toán thành công:", emailError);

      // Không chặn response nếu lỗi email

    }

    res.json({ message: "Thanh toán khi nhận hàng đã được ghi nhận" });

  } catch (error) {

    console.error("Lỗi xử lý COD:", error);

    res.status(500).json({ message: "Lỗi server", error: error.message });

  }

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
