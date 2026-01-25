/**
 * AUTH.JS - Authentication Middleware
 * 
 * Middleware xác thực JWT token:
 * 1. Kiểm tra Authorization header có tồn tại
 * 2. Extract token từ "Bearer <token>"
 * 3. Verify token với JWT secret
 * 4. Gắn thông tin user (decoded) vào req.user
 * 5. Cho phép request tiếp tục nếu token hợp lệ
 */

const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Auth Middleware
 * 
 * Xác thực JWT token từ Authorization header
 * Format: "Bearer <token>"
 * 
 * Nếu token hợp lệ: gắn user info vào req.user và tiếp tục
 * Nếu token không hợp lệ: trả về lỗi 401
 */
const auth = (req, res, next) => {
  try {
    // Lấy Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('Thiếu token xác thực', 401);
    }

    // Extract token từ "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Token không hợp lệ', 401);
    }

    try {
      // Verify token với JWT secret
      // Nếu hợp lệ, sẽ trả về decoded payload (chứa id, email, role)
      const decoded = jwt.verify(token, constants.JWT.SECRET);
      
      // Gắn thông tin user vào request object để các route sau có thể sử dụng
      req.user = decoded;
      
      // CHANGED: Log chi tiết để debug user tracking issue
      logger.debug(`Xác thực người dùng thành công: ${decoded.email} (${decoded.role}) - User ID: ${decoded.id}`);
      
      // Tiếp tục xử lý request
      next();
    } catch (err) {
      // Xử lý các lỗi JWT cụ thể
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Token đã hết hạn', 401);
      }
      if (err.name === 'JsonWebTokenError') {
        throw new AppError('Token không hợp lệ', 401);
      }
      throw new AppError('Lỗi xác thực token', 401);
    }
  } catch (error) {
    // Chuyển error đến error handler middleware
    next(error);
  }
};

module.exports = { auth };