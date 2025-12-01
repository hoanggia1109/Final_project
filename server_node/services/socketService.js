/**
 * Socket.IO Service
 * 
 * Quản lý kết nối Socket.IO và tracking user online
 * 
 * Sử dụng Map để lưu trữ:
 * - Key: socketId
 * - Value: { userId, connectedAt }
 */

const onlineUsers = new Map(); // Map<socketId, { userId, connectedAt }>

let io = null; // Socket.IO server instance

/**
 * Thêm user vào danh sách online khi connect
 * 
 * @param {string} socketId - Socket ID
 * @param {string} userId - User ID
 */
const addOnlineUser = (socketId, userId) => {
  onlineUsers.set(socketId, {
    userId: String(userId), // Normalize về string
    connectedAt: Date.now(),
  });
  
  console.log(`[Socket Service] User connected: ${userId} (socket: ${socketId})`);
  console.log(`[Socket Service] Total online users: ${onlineUsers.size}`);
};

/**
 * Xóa user khỏi danh sách online khi disconnect
 * 
 * @param {string} socketId - Socket ID
 */
const removeOnlineUser = (socketId) => {
  const userInfo = onlineUsers.get(socketId);
  if (userInfo) {
    onlineUsers.delete(socketId);
    console.log(`[Socket Service] User disconnected: ${userInfo.userId} (socket: ${socketId})`);
    console.log(`[Socket Service] Total online users: ${onlineUsers.size}`);
  }
};

/**
 * Lấy số lượng user đang online
 * 
 * @returns {number} Số lượng user đang online
 */
const getOnlineUsersCount = () => {
  return onlineUsers.size;
};

/**
 * Lấy danh sách user đang online (unique userIds)
 * 
 * @returns {Array} Mảng các object { userId, socketId }
 */
const getOnlineUsersList = () => {
  const userIds = new Set();
  const result = [];
  
  for (const [socketId, userInfo] of onlineUsers.entries()) {
    const userIdStr = String(userInfo.userId);
    if (!userIds.has(userIdStr)) {
      userIds.add(userIdStr);
      result.push({
        userId: userIdStr,
        socketId: socketId,
      });
    }
  }
  
  return result;
};

/**
 * Kiểm tra user có đang online không
 * 
 * @param {string} userId - User ID
 * @returns {boolean} true nếu user đang online
 */
const isUserOnline = (userId) => {
  const userIdStr = String(userId);
  for (const userInfo of onlineUsers.values()) {
    if (String(userInfo.userId) === userIdStr) {
      return true;
    }
  }
  return false;
};

/**
 * Lấy socket IDs của một user (một user có thể có nhiều socket connections)
 * 
 * @param {string} userId - User ID
 * @returns {Array} Mảng các socket IDs
 */
const getUserSocketIds = (userId) => {
  const userIdStr = String(userId);
  const socketIds = [];
  
  for (const [socketId, userInfo] of onlineUsers.entries()) {
    if (String(userInfo.userId) === userIdStr) {
      socketIds.push(socketId);
    }
  }
  
  return socketIds;
};

/**
 * Clear tất cả online users (dùng cho testing/debugging)
 */
const clearAllOnlineUsers = () => {
  const count = onlineUsers.size;
  onlineUsers.clear();
  console.log(`[Socket Service] Cleared all ${count} online users`);
  return count;
};

/**
 * Khởi tạo Socket.IO server
 * 
 * @param {http.Server} httpServer - HTTP server instance
 * @returns {SocketIO.Server} Socket.IO server instance
 */
const initializeSocket = (httpServer) => {
  if (io) {
    console.log('[Socket Service] Socket.IO already initialized');
    return io;
  }

  try {
    const socketIO = require('socket.io');
    
    io = socketIO(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
      console.log(`[Socket Service] Client connected: ${socket.id}`);
      
      // Lắng nghe event user_online từ client
      socket.on('user_online', (data) => {
        const userId = data?.userId || data;
        if (userId) {
          addOnlineUser(socket.id, userId);
          // Emit số lượng user online cho tất cả clients
          io.emit('online_users_count', getOnlineUsersCount());
        }
      });

      // Lắng nghe event disconnect
      socket.on('disconnect', () => {
        removeOnlineUser(socket.id);
        // Emit số lượng user online cho tất cả clients
        io.emit('online_users_count', getOnlineUsersCount());
        console.log(`[Socket Service] Client disconnected: ${socket.id}`);
      });

      // Lắng nghe event ping để kiểm tra kết nối
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });

    console.log('[Socket Service] Socket.IO server initialized successfully');
    return io;
  } catch (error) {
    console.error('[Socket Service] Error initializing Socket.IO:', error);
    throw error;
  }
};

/**
 * Lấy Socket.IO server instance
 * 
 * @returns {SocketIO.Server|null} Socket.IO server instance hoặc null nếu chưa khởi tạo
 */
const getIO = () => {
  return io;
};

module.exports = {
  initializeSocket,
  getIO,
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsersCount,
  getOnlineUsersList,
  isUserOnline,
  getUserSocketIds,
  clearAllOnlineUsers,
};
