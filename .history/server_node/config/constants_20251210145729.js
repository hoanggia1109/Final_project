module.exports = {
  USER_TRACKING: {
    INACTIVE_THRESHOLD: 5 * 60 * 1000, // 5 phút (milliseconds)
    CLEANUP_INTERVAL: 60 * 1000, // 1 phút (milliseconds)
  },
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || "gmail",
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
    FROM: process.env.EMAIL_FROM || `Shop Nội Thất <${process.env.EMAIL_USER}>`,
  },
  PASSWORD: {
    MIN_LENGTH: 6, // Độ dài tối thiểu của mật khẩu
  },
  PAGINATION: {
    DEFAULT_PAGE: 1, // Trang mặc định
    DEFAULT_LIMIT: 10, // Số lượng mặc định mỗi trang
    MAX_LIMIT: 100, // Số lượng tối đa mỗi trang
  },
  SERVER: {
    NODE_ENV: process.env.NODE_ENV || 'development', // Môi trường chạy (development, production)
    PORT: process.env.PORT || 5000, // Port mặc định là 5000
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'SECRET_KEY', // JWT secret key (nên đặt trong .env)
  },
};

