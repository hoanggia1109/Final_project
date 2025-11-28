/**
 * APP.JS - Express Application Setup
 * 
 * File này chứa toàn bộ cấu hình Express app:
 * - Middleware setup (CORS, JSON parsing, logging)
 * - Database connection
 * - Route registration
 * - Swagger documentation
 * - File upload configuration
 * - Error handling
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const constants = require('./config/constants');
const logger = require('./utils/logger');
const { errorHandler } = require('./utils/errors');
const sequelize = require('./config/database');

const app = express();

// ==================== MIDDLEWARES ====================
// CORS: Cho phép các domain được phép truy cập API
app.use(cors(constants.CORS));

// JSON Parser: Parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging: Ghi log mọi request đến server (chỉ trong development)
app.use((req, res, next) => {
  logger.request(req);
  next();
});

// Static Files: Serve các file tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== DATABASE CONNECTION ====================
// Kiểm tra kết nối database khi server khởi động
sequelize
  .authenticate()
  .then(() => {
    logger.info('Kết nối MySQL thành công');
  })
  .catch((err) => {
    logger.error('Lỗi kết nối database:', err);
  });

// ==================== ROUTES ====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sanpham', require('./routes/sanpham'));
app.use('/api/donhang', require('./routes/donhang'));
app.use('/api/giohang', require('./routes/giohang'));
app.use('/api/review', require('./routes/review'));
app.use('/api/magiamgia', require('./routes/magiamgia'));
app.use('/api/baiviet', require('./routes/baiviet'));
app.use('/api/danhmuc', require('./routes/danhmuc'));
app.use('/api/danhmucbaiviet', require('./routes/danhmucbaiviet'));
app.use('/api/lienhe', require('./routes/lienhe'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bienthe', require('./routes/bienthe'));
app.use('/api/thuonghieu', require('./routes/thuonghieu'));
app.use('/api/banner', require('./routes/banner'));
app.use('/api/tonkho', require('./routes/tonkho'));
app.use('/admin', require('./routes/admin'));
app.use('/api/diachi', require('./routes/diachi'));
app.use('/api/thanhtoan', require('./routes/thanhtoan'));
app.use('/api/yeuthich', require('./routes/yeuthich'));
app.use('/api/profile', require('./routes/profile'));

// ==================== SWAGGER DOCUMENTATION ====================
if (constants.SERVER.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerJsDoc = require('swagger-jsdoc');

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Shop Nội Thất API',
        version: '1.0.0',
        description: 'API backend cho website bán nội thất văn phòng (Next.js + Node.js)',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      servers: [
        {
          url: `http://localhost:${constants.SERVER.PORT}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./index.js', './swagger-docs.js'],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  const swaggerOptionsUI = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Shop Nội Thất API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptionsUI));
  logger.info(`Swagger UI đã được khởi tạo tại: http://localhost:${constants.SERVER.PORT}/api-docs`);
}

// ==================== FILE UPLOAD ====================
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, constants.UPLOAD.UPLOAD_DIR)),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: constants.UPLOAD.MAX_FILE_SIZE },
});

app.post('/api/uploads', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file' });
  }
  res.json({
    success: true,
    url: `http://localhost:${constants.SERVER.PORT}/uploads/${req.file.filename}`,
  });
});

// ==================== ERROR HANDLING ====================
// Global error handler (must be last)
app.use(errorHandler);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} không tồn tại`,
  });
});

module.exports = app;

