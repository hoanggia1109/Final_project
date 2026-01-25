const express = require("express");
const { LienHeModel } = require("../database");
const { sendContactConfirmationEmail, sendContactNotificationToAdmin } = require("../services/emailService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { hoten, email, sdt, tieude, noidung } = req.body;
    
    // Validation
    if (!hoten || !email || !tieude || !noidung) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc!" 
      });
    }
    
    // Lưu vào database
    const lh = await LienHeModel.create(req.body);
    console.log('Liên hệ đã được lưu vào database:', lh.lienhe_id);
    
    // Gửi email xác nhận cho khách hàng
    const customerEmailResult = await sendContactConfirmationEmail(
      email,
      hoten,
      tieude,
      noidung
    );
    
    if (!customerEmailResult.success) {
      console.warn('Không thể gửi email xác nhận cho khách hàng:', customerEmailResult.error);
    }
    
    // Gửi thông báo cho admin (không chặn response nếu lỗi)
    sendContactNotificationToAdmin({
      hoten,
      email,
      sdt,
      tieude,
      noidung
    }).catch(err => {
      console.error('Không thể gửi thông báo cho admin:', err);
    });
    
    res.json({ 
      success: true,
      message: "Gửi liên hệ thành công! Vui lòng kiểm tra email để xem xác nhận.", 
      lh 
    });
    
  } catch (error) {
    console.error('Lỗi khi xử lý liên hệ:', error);
    res.status(500).json({ 
      success: false,
      message: "Có lỗi xảy ra khi xử lý liên hệ!" 
    });
  }
});


module.exports = router;