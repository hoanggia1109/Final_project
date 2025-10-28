const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));



app.use("/api/auth", require("./routes/auth"));
app.use("/api/sanpham", require("./routes/sanpham"));
app.use("/api/donhang", require("./routes/donhang"));
app.use("/api/giohang", require("./routes/giohang"));
app.use("/api/review", require("./routes/review"));
app.use("/api/magiamgia", require("./routes/magiamgia"));
app.use("/api/baiviet", require("./routes/baiviet"));
app.use("/api/danhmuc", require("./routes/danhmuc"));
app.use("/api/lienhe", require("./routes/lienhe"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/bienthe", require("./routes/bienthe"));
app.use("/api/thuonghieu", require("./routes/thuonghieu"));

// Import model từ file database
const {
  sequelize,
  UserModel,
  LoaiModel,
  SanPhamModel,
  ThuongHieuModel,
  SanPhamBienTheModel,
  ImageModel,
  GioHangModel,
  DonHangModel,
  DonHangChiTietModel,
} = require("./database");

// kết nối DB
sequelize
  .authenticate()
  .then(() => console.log("Kết nối MySQL thành công"))
  .catch((err) => console.error("Lỗi DB:", err));



/* ------------------ SWAGGER CONFIG ------------------ */
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Cấu hình swagger-jsdoc
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shop Nội Thất API",
      version: "1.0.0",
      description: "API backend cho website bán nội thất văn phòng (Next.js + Node.js)",
      
    },
    components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
},
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./index.js", "./swagger-docs.js"], // file chứa mô tả API (ngay trong file này)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("📘 Swagger UI đã được khởi tạo tại: http://localhost:3000/api-docs");


/* ---------------- UPLOAD ẢNH ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Không có file" });
  res.json({ url: `http://localhost:${port}/uploads/${req.file.filename}` });
});


/* ------Tôi cho phép các request từ domain http://localhost:3000 được truy cập vào API này ----- */
// const cors = require("cors");
// app.use(cors({ origin: "http://localhost:3000" }));




/* ---------------- START SERVER ---------------- */
console.log("⚡ Chuẩn bị khởi động server...");

app.get("/", (req, res) => {
  res.send("✅ Backend đang hoạt động!");
});

app.listen(port, () => console.log(`✅ Server đang chạy tại http://localhost:${port}`));

console.log("⚡ Đã chạy qua dòng app.listen()");
