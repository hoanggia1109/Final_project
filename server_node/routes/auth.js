// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require("express");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require("jsonwebtoken");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { UserModel, DiaChiModel } = require("../database");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemailer = require("nodemailer");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sendRegistrationEmail } = require("../services/emailService");

const router = express.Router();

/* -------- Đăng ký -------- */
router.post("/dangky", async (req, res) => {
  console.log(" Nhận request đăng ký:", req.body);
  
  try {
    const { email, password, fullName, phone, ngaysinh, gioitinh, birthDate, gender, address, city, district, ward } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }
    
    console.log(" Checking email:", email);
    
    const existed = await UserModel.findOne({ where: { email } });
    
    if (existed) {
      console.log(" Email đã tồn tại");
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    console.log(" Hashing password...");
    const hashed = await bcrypt.hash(password, 10);
    
    // Tạo verification token
    const verificationToken = uuidv4();
    
    // Xử lý ngày sinh và giới tính (hỗ trợ cả birthDate/gender và ngaysinh/gioitinh)
    const finalNgaysinh = ngaysinh || birthDate || null;
    const finalGioitinh = gioitinh || gender || null;
    
    console.log(" Creating user...");
    const newUser = await UserModel.create({ 
      id: uuidv4(), 
      email, 
      password: hashed,
      ho_ten: fullName || null,
      sdt: phone || null,
      ngaysinh: finalNgaysinh,
      gioitinh: finalGioitinh,
      email_verified: 0, // Chưa xác thực
      email_verification_token: verificationToken
    });
    
    console.log(" User created:", newUser.id);
    console.log(" Verification token:", verificationToken);
    
    // Tạo địa chỉ nếu có thông tin địa chỉ
    if (address || city || district || ward) {
      try {
        await DiaChiModel.create({
          id: uuidv4(),
          user_id: newUser.id,
          hoten: fullName || email.split('@')[0],
          sdt: phone || null,
          diachichitiet: address || null,
          phuong_xa: ward || null,
          quan_huyen: district || null,
          tinh_thanh: city || null,
          loaidiachi: 'home',
          macdinh: 1, // Đặt làm địa chỉ mặc định
        });
        console.log(" Địa chỉ đã được tạo cho user:", newUser.id);
      } catch (diachiError) {
        console.error(" Lỗi khi tạo địa chỉ:", diachiError);
        // Không fail đăng ký nếu lỗi tạo địa chỉ
      }
    }
    
    // Gửi email xác nhận đăng ký (không chờ để không làm chậm response)
    sendRegistrationEmail(email, fullName || email.split('@')[0], verificationToken)
      .then(result => {
        if (result.success) {
          console.log(" Email xác nhận đã được gửi đến:", email);
        } else {
          console.error(" Không thể gửi email:", result.error);
        }
      })
      .catch(error => {
        console.error(" Lỗi khi gửi email:", error);
      });
    
    res.json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản." });
  } catch (err) {
    console.error(" ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* -------- Đăng nhập -------- */
router.post("/dangnhap", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Sai mật khẩu" });

    // Kiểm tra email đã xác thực chưa - Admin không cần xác thực email
    const emailVerified = user.email_verified === 1;
    const isAdmin = user.role === 'admin';
    
    // Chỉ yêu cầu xác thực email cho user thường, admin không cần
    if (!isAdmin && !emailVerified) {
      return res.status(403).json({ 
        message: "Email chưa được xác thực. Vui lòng kiểm tra email và xác nhận tài khoản trước khi đăng nhập.",
        emailVerified: false,
        requiresVerification: true
      });
    }
    
    const token = jwt.sign({ id: user.id, email, role: user.role }, "SECRET_KEY", { expiresIn: "7d" });
    
    // Trả về thông tin user đầy đủ
    res.json({ 
      message: "Đăng nhập thành công", 
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.ho_ten || email.split('@')[0], // Dùng email nếu không có tên
        role: user.role || 'customer',
        emailVerified: isAdmin ? true : emailVerified // Admin luôn được coi là đã xác thực
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------- Quên mật khẩu -------- */
router.post("/quenpass", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const newPass = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(newPass, 10);
    await user.update({ password: hashed });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tnpv2709@gmail.com",
        pass: "anvb vlod twoq xvvy",
      },
    });

    await transporter.sendMail({
      from: "Shop Nội Thất <tnpv2709@gmail.com>",
      to: email,
      subject: "Khôi phục mật khẩu",
      html: `<p>Mật khẩu mới của bạn là: <b>${newPass}</b></p>`,
    });

    res.json({ message: "Đã gửi mật khẩu mới qua email" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi gửi email", error: err.message });
  }
});

/* -------- Xác nhận email -------- */
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    
    console.log(" Xác nhận email với token:", token);
    
    // Tìm user với token này
    const user = await UserModel.findOne({ 
      where: { email_verification_token: token } 
    });
    
    if (!user) {
      console.log(" Token không tìm thấy hoặc đã hết hạn");
      return res.status(400).json({ 
        success: false,
        message: "Link xác nhận không hợp lệ hoặc đã hết hạn" 
      });
    }
    
    // Kiểm tra đã xác thực chưa
    if (user.email_verified === 1) {
      console.log(" Email đã được xác thực trước đó");
      return res.json({ 
        success: true,
        message: "Email đã được xác thực trước đó",
        alreadyVerified: true
      });
    }
    
    // Xác thực email
    await user.update({ 
      email_verified: 1,
      email_verification_token: null // Xóa token sau khi dùng
    });
    
    console.log(" Email xác thực thành công cho:", user.email);
    
    res.json({ 
      success: true,
      message: "Xác nhận email thành công! Bạn có thể đăng nhập ngay bây giờ.",
      email: user.email
    });
  } catch (err) {
    console.error(" Lỗi xác nhận email:", err);
    res.status(500).json({ 
      success: false,
      message: "Có lỗi xảy ra khi xác nhận email" 
    });
  }
});

/* -------- Đổi mật khẩu -------- */
router.post("/doipass", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Thiếu header Authorization" });

    const token = authHeader.split(" ")[1]; // lấy phần sau "Bearer"
    if (!token)
      return res.status(401).json({ message: "Token không hợp lệ" });

    const decoded = jwt.verify(token, "SECRET_KEY");

    const { pass_old, pass_new1, pass_new2 } = req.body;
    if (pass_new1 !== pass_new2)
      return res.status(400).json({ message: "Mật khẩu mới không khớp" });

    const user = await UserModel.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const match = await bcrypt.compare(pass_old, user.password);
    if (!match) return res.status(400).json({ message: "Sai mật khẩu cũ" });

    const hashed = await bcrypt.hash(pass_new1, 10);
    await user.update({ password: hashed });

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;