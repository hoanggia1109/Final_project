const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../database");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

/* -------- Đăng ký -------- */
router.post("/dangky", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existed = await UserModel.findOne({ where: { email } });
    if (existed) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.create({ id: uuidv4(), email, password: hashed });
    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
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

    const token = jwt.sign({ id: user.id, email }, "SECRET_KEY", { expiresIn: "7d" });
    res.json({ message: "Đăng nhập thành công", token });
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