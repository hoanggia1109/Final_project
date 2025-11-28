/**
 * INDEX.JS - DEPRECATED
 * 
 * File này đã được refactor và không còn được sử dụng.
 * 
 * Để khởi động server, vui lòng sử dụng:
 * - npm run dev (development mode với nodemon - tự động restart khi có thay đổi)
 * - npm start (production mode)
 * 
 * Cấu trúc mới:
 * - server.js: Khởi động HTTP server và xử lý process signals
 * - app.js: Cấu hình Express app (middleware, routes, error handling)
 * 
 * File này được giữ lại để backward compatibility.
 * Tự động redirect đến server.js mới.
 */

console.warn('WARNING: index.js is deprecated. Please use server.js instead.');
console.warn('   Run: npm run dev (development) or npm start (production)');

// Redirect to new server.js
require('./server.js');

// Cấu hình CORS chi tiết để Swagger UI hoạt động
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5001", "http://127.0.0.1:5001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// LOGGING middleware - log mọi request
app.use((req, res, next) => {
  console.log(`\n📥 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  console.log('   Headers:', req.headers['content-type']);
  console.log('   Body:', req.body);
  next();
});

app.use("/uploads", express.static("uploads"));



app.use("/api/auth", require("./routes/auth"));
app.use("/api/sanpham", require("./routes/sanpham"));
app.use("/api/donhang", require("./routes/donhang"));
app.use("/api/giohang", require("./routes/giohang"));
app.use("/api/review", require("./routes/review"));
app.use("/api/magiamgia", require("./routes/magiamgia"));
app.use("/api/baiviet", require("./routes/baiviet"));
app.use("/api/danhmuc", require("./routes/danhmuc"));
app.use("/api/danhmucbaiviet", require("./routes/danhmucbaiviet"));
app.use("/api/lienhe", require("./routes/lienhe"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/bienthe", require("./routes/bienthe"));
app.use("/api/thuonghieu", require("./routes/thuonghieu"));
app.use("/api/banner", require("./routes/banner"));
app.use("/api/tonkho", require("./routes/tonkho"));
app.use("/admin", require("./routes/admin"));
app.use("/api/diachi", require("./routes/diachi"));
app.use("/api/thanhtoan", require("./routes/thanhtoan"));
app.use("/api/yeuthich", require("./routes/yeuthich"));
app.use("/api/profile", require("./routes/profile"));

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
  DiaChiModel,
  MaGiamGiaModel,
  BaiVietModel,
  DanhMucBaiVietModel,
  DanhGiaModel,
  DonHangChiTietModel,
  ReviewImageModel,
  LienHeModel,
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
        url: `http://localhost:${port}`,
        description: "Development server",
      },
      {
        url: "http://localhost:5001",
        description: "Backend API server",
      },
    ],
  },
  apis: ["./index.js", "./swagger-docs.js"], 
};         

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log("Swagger Docs Loaded:", Object.keys(swaggerDocs.paths || {}));
// Cấu hình Swagger UI với options để hỗ trợ CORS và testing
const swaggerOptionsUI = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Shop Nội Thất API Documentation",
  swaggerOptions: {
    persistAuthorization: true, // Lưu token sau khi authorize
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptionsUI));
console.log(`Swagger UI đã được khởi tạo tại: http://localhost:${port}/api-docs`);
console.log(`API Server: http://localhost:${port}`);


/* ---------------- UPLOAD ẢNH ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Không có file" });
  res.json({ url: `http://localhost:5001/uploads/${req.file.filename}` });
});



/* ---------------- ERROR HANDLING TOÀN CỤC ---------------- */
// Bắt lỗi unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  // KHÔNG tắt server để tiếp tục debug
});

// Bắt lỗi uncaught exception
process.on('uncaughtException', (error) => {
  console.error(' UNCAUGHT EXCEPTION:');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  // KHÔNG tắt server để tiếp tục debug
});

// Middleware bắt lỗi Express (phải đặt SAU tất cả routes)
app.use((err, req, res, next) => {
  console.error(' EXPRESS ERROR HANDLER:');
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Server error', 
    error: err.message 
  });
});

/* ---------------- START SERVER ---------------- */
app.listen(port, () => console.log(` Server chạy http://localhost:${port}`));