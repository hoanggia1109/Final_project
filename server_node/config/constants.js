/**
 * CONSTANTS.JS - Application Constants & Configuration
 * 
 * File này tập trung tất cả constants và cấu hình của ứng dụng.
 * Giá trị được ưu tiên từ environment variables (.env file),
 * nếu không có thì dùng giá trị mặc định.
 * 
 * Cấu trúc:
 * - SERVER: Port, environment
 * - JWT: Secret key, expiration time
 * - DATABASE: Connection info
 * - CORS: Allowed origins, methods, headers
 * - EMAIL: Email service configuration
 * - STRIPE: Payment gateway configuration
 * - UPLOAD: File upload limits and settings
 * - Business constants: Order status, payment methods, etc.
 */

module.exports = {
  // Server
  SERVER: {
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET || 'SECRET_KEY',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Database
  DATABASE: {
    NAME: process.env.DB_NAME || 'shopnoithat',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    HOST: process.env.DB_HOST || 'localhost',
    DIALECT: process.env.DB_DIALECT || 'mysql',
  },

  // CORS
  CORS: {
    ORIGINS: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://localhost:5001', 'http://127.0.0.1:5001'],
    CREDENTIALS: true,
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  },

  // Email
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    USER: process.env.EMAIL_USER || '',
    PASSWORD: process.env.EMAIL_PASSWORD || '',
    FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
  },

  // Stripe
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    MIN_AMOUNT_VND: 14000, // Minimum $0.50 equivalent in VND
  },

  // Upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    UPLOAD_DIR: 'uploads',
  },

  // Review
  REVIEW: {
    MAX_IMAGES: 5,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  },

  // Shipping
  SHIPPING: {
    DEFAULT_FEE: 30000,
    FREE_SHIP_CITY: 'TPHCM',
  },

  // Discount
  DISCOUNT: {
    TYPES: {
      PERCENT: 'percent',
      CASH: 'cash',
      FREESHIP: 'freeship',
    },
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned',
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled',
  },

  // Payment Methods
  PAYMENT_METHODS: {
    COD: 'cod',
    STRIPE: 'stripe',
    BANKING: 'banking',
    VNPAY: 'vnpay',
    MOMO: 'momo',
  },

  // User Roles
  ROLES: {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
  },

  // User Online Tracking
  USER_TRACKING: {
    INACTIVE_THRESHOLD: 5 * 60 * 1000, // 5 minutes
    CLEANUP_INTERVAL: 60 * 1000, // 1 minute
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Password
  PASSWORD: {
    MIN_LENGTH: 6,
    BCRYPT_ROUNDS: 10,
  },
};

