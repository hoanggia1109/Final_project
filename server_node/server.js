/**
 * SERVER.JS - Server Startup & Process Management
 * 
 * File này chịu trách nhiệm:
 * - Khởi động HTTP server
 * - Initialize Socket.IO server
 * - Xử lý unhandled errors (unhandled rejection, uncaught exception)
 * - Graceful shutdown khi nhận signal SIGTERM/SIGINT
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const constants = require('./config/constants');
const logger = require('./utils/logger');
const { cancelExpiredStripeOrders } = require('./jobs/cancelExpiredOrders');
const { initializeSocket } = require('./services/socketService');

// ==================== UNHANDLED ERROR HANDLING ====================
// Bắt lỗi khi có Promise bị reject nhưng không được catch
// Đây là lỗi nghiêm trọng, nên log lại để debug
process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION:', reason);
  logger.error('Promise:', promise);
  // Trong production, có thể muốn tắt server để tránh undefined behavior
  // process.exit(1);
});

// Bắt lỗi khi có exception không được catch
// Đây là lỗi rất nghiêm trọng, trong production nên tắt server
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION:', error.message);
  logger.error('Stack:', error.stack);
  // Trong production, nên tắt server để tránh corrupted state
  if (constants.SERVER.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// ==================== START SERVER ====================
// Lấy port từ config (mặc định 5001)
const PORT = constants.SERVER.PORT;

// Tạo HTTP server từ Express app
const httpServer = http.createServer(app);

// Initialize Socket.IO server
const io = initializeSocket(httpServer);
// Export io để các route khác có thể sử dụng
global.io = io;

// Khởi động HTTP server (bao gồm cả Socket.IO)
httpServer.listen(PORT, () => {
  logger.info(`Server chạy tại: http://localhost:${PORT}`);
  logger.info(`Environment: ${constants.SERVER.NODE_ENV}`);
  if (constants.SERVER.NODE_ENV === 'development') {
    logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
  }
  logger.info(`Socket.IO server đã được khởi động (port: ${PORT})`);

  // Chạy job hủy đơn hàng quá hạn ngay sau khi server khởi động
  cancelExpiredStripeOrders();

  // Chạy job hủy đơn hàng quá hạn mỗi giờ
  setInterval(() => {
    cancelExpiredStripeOrders();
  }, 60 * 60 * 1000); // 1 giờ = 60 * 60 * 1000 ms

  logger.info('Scheduled job: Tự động hủy đơn hàng Stripe quá hạn (chạy mỗi giờ)');
});

// ==================== GRACEFUL SHUTDOWN ====================
// Xử lý signal SIGTERM (thường được gửi bởi process manager như PM2)
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server and Socket.IO');
  // Đóng Socket.IO server trước
  if (io) {
    io.close(() => {
      logger.info('Socket.IO server closed');
    });
  }
  // Đóng HTTP server
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Xử lý signal SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server and Socket.IO');
  // Đóng Socket.IO server trước
  if (io) {
    io.close(() => {
      logger.info('Socket.IO server closed');
    });
  }
  // Đóng HTTP server
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

