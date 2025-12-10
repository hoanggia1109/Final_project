/**
 * Cấu hình API Backend URL
 * Sử dụng biến môi trường NEXT_PUBLIC_API_URL nếu có
 * Fallback về localhost:5002 cho development
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

