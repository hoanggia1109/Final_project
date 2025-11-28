const { AppError } = require('./errors');
const constants = require('../config/constants');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password || password.length < constants.PASSWORD.MIN_LENGTH) {
    throw new AppError(
      `Mật khẩu phải có ít nhất ${constants.PASSWORD.MIN_LENGTH} ký tự`,
      400
    );
  }
  return true;
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

const validateRequired = (data, fields) => {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new AppError(
      `Thiếu các trường bắt buộc: ${missing.join(', ')}`,
      400
    );
  }
};

const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || constants.PAGINATION.DEFAULT_PAGE;
  const limitNum = Math.min(
    parseInt(limit) || constants.PAGINATION.DEFAULT_LIMIT,
    constants.PAGINATION.MAX_LIMIT
  );
  return {
    page: Math.max(1, pageNum),
    limit: Math.max(1, limitNum),
    offset: (Math.max(1, pageNum) - 1) * Math.max(1, limitNum),
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validatePagination,
};

