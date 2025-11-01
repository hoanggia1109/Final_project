// Helper functions cho authentication

export const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:5000/api/auth/dangnhap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đăng nhập thất bại');
  }

  return data;
};

export const register = async (email: string, password: string) => {
  const response = await fetch('http://localhost:5000/api/auth/dangky', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đăng ký thất bại');
  }

  return data;
};

export const forgotPassword = async (email: string) => {
  const response = await fetch('http://localhost:5000/api/auth/quenpass', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra');
  }

  return data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vui lòng đăng nhập');
  }

  const response = await fetch('http://localhost:5000/api/auth/doipass', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      pass_old: oldPassword,
      pass_new1: newPassword,
      pass_new2: newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đổi mật khẩu thất bại');
  }

  return data;
};

// Check if user is logged in
export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Get current user email
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userEmail');
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
};
