/**
 * Tính phí vận chuyển cơ bản
 * @param {Object} orderData - dữ liệu địa chỉ hoặc tỉnh thành
 * @returns {number} - phí vận chuyển
 */


function tinhPhiVanChuyen(orderData = {}) {

  const DEFAULT_FEE = 30000;


  if (orderData.tinh_thanh === "TPHCM") return 0;
  return DEFAULT_FEE;
}

module.exports = { tinhPhiVanChuyen };
