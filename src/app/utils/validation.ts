/**
 * Validation utility functions
 * Các hàm validation chung cho toàn bộ dự án
 */

export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, '');
  return /^[0-9]{10,11}$/.test(cleaned);
};

export const validateRequired = (value: string | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, min: number): boolean => {
  if (!value) return false;
  return value.trim().length >= min;
};

export const validateMaxLength = (value: string, max: number): boolean => {
  if (!value) return true; // Optional field
  return value.trim().length <= max;
};

export const validatePositiveNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

export const validateNonNegativeNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0;
};

export const validateInteger = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return !isNaN(num) && Number.isInteger(num);
};

export const validateDateNotFuture = (dateString: string): boolean => {
  if (!dateString) return true; // Optional field
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  return date <= today;
};

export const validatePassword = (password: string, minLength: number = 6): boolean => {
  if (!password) return false;
  return password.length >= minLength;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validation error messages
 */
export const ValidationMessages = {
  required: (field: string) => `Vui lòng nhập ${field}`,
  email: 'Email không hợp lệ',
  phone: 'Số điện thoại không hợp lệ (10-11 số)',
  minLength: (field: string, min: number) => `${field} phải có ít nhất ${min} ký tự`,
  maxLength: (field: string, max: number) => `${field} không được vượt quá ${max} ký tự`,
  positiveNumber: (field: string) => `${field} phải là số dương`,
  nonNegativeNumber: (field: string) => `${field} phải là số không âm`,
  integer: (field: string) => `${field} phải là số nguyên`,
  dateNotFuture: 'Ngày sinh không được là tương lai',
  password: (min: number) => `Mật khẩu phải có ít nhất ${min} ký tự`,
  passwordMatch: 'Mật khẩu không khớp',
};

