/**
 * Cart Utility Functions
 * 
 * Các hàm tiện ích để xử lý giỏ hàng
 */

const { GioHangModel } = require("../../database");

/**
 * Xóa giỏ hàng của user sau khi đơn hàng được tạo thành công
 * 
 * @param {string} userId - User ID
 * @param {string} donhangId - Đơn hàng ID (optional, để log)
 * @returns {Promise<number>} Số lượng item đã xóa
 */
const deleteCartForOrder = async (userId, donhangId = null) => {
  try {
    if (!userId) {
      console.warn("[Cart Utils] deleteCartForOrder: userId is required");
      return 0;
    }

    // Đếm số lượng item trước khi xóa
    const countBefore = await GioHangModel.count({
      where: { user_id: userId },
    });

    // Xóa tất cả item trong giỏ hàng của user
    const deletedCount = await GioHangModel.destroy({
      where: { user_id: userId },
    });

    console.log(`[Cart Utils] Cart cleared for user ${userId}${donhangId ? ` (order: ${donhangId})` : ''}`);
    console.log(`[Cart Utils] Deleted ${deletedCount} items from cart (found ${countBefore} items before deletion)`);

    return deletedCount;
  } catch (error) {
    console.error("[Cart Utils] Error deleting cart:", error);
    throw error;
  }
};

/**
 * Xóa một item cụ thể khỏi giỏ hàng
 * 
 * @param {string} userId - User ID
 * @param {string} giohangId - Giỏ hàng item ID
 * @returns {Promise<boolean>} true nếu xóa thành công
 */
const deleteCartItem = async (userId, giohangId) => {
  try {
    const deletedCount = await GioHangModel.destroy({
      where: {
        id: giohangId,
        user_id: userId, // Đảm bảo chỉ xóa item của user này
      },
    });

    if (deletedCount === 0) {
      console.warn(`[Cart Utils] Cart item ${giohangId} not found or not owned by user ${userId}`);
      return false;
    }

    console.log(`[Cart Utils] Deleted cart item ${giohangId} for user ${userId}`);
    return true;
  } catch (error) {
    console.error("[Cart Utils] Error deleting cart item:", error);
    throw error;
  }
};

/**
 * Lấy số lượng item trong giỏ hàng của user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<number>} Số lượng item
 */
const getCartItemCount = async (userId) => {
  try {
    const count = await GioHangModel.count({
      where: { user_id: userId },
    });
    return count;
  } catch (error) {
    console.error("[Cart Utils] Error getting cart count:", error);
    throw error;
  }
};

module.exports = {
  deleteCartForOrder,
  deleteCartItem,
  getCartItemCount,
};

