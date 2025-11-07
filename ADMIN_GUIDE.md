# 🔐 Hướng Dẫn Sử Dụng Trang Admin

## ✅ Tính Năng Đã Hoàn Thành

### 1. **Trang Admin Dashboard** (`/admin`)
- Tổng quan thống kê: Sản phẩm, Đơn hàng, Khách hàng, Doanh thu
- Thao tác nhanh: Quản lý sản phẩm, Thêm sản phẩm mới, Đơn hàng, Thống kê
- Giao diện hiện đại với Bootstrap 5

### 2. **Layout Admin** với Sidebar Navigation
- Menu điều hướng: Dashboard, Sản phẩm, Đơn hàng, Khách hàng, Cài đặt
- Toggle sidebar: Thu gọn/Mở rộng
- Hiển thị thông tin admin đang đăng nhập
- Nút đăng xuất và quay về trang chủ

### 3. **Tự Động Redirect Theo Role**
- **Admin**: Sau khi đăng nhập → Redirect đến `/admin`
- **Customer**: Sau khi đăng nhập → Ở lại trang chủ
- Áp dụng cho cả:
  - `AuthModal` (đăng nhập qua modal)
  - `/login` (trang đăng nhập riêng)

### 4. **Bảo Mật Admin Routes**
- Kiểm tra `userRole` từ localStorage
- Redirect về trang chủ nếu không phải admin
- Hiển thị thông báo lỗi

---

## 🚀 Cách Sử Dụng

### **Bước 1: Tạo Tài Khoản Admin**

Bạn cần có tài khoản với `role = 'admin'` trong database.

**Cách 1: Thủ công qua Database**
```sql
-- Thêm trường role vào bảng users (nếu chưa có)
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer';

-- Cập nhật user thành admin
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

**Cách 2: Sử Dụng NPM Scripts (Khuyến nghị)** ✨

Dự án đã có sẵn các script tiện lợi:

```bash
cd server_node

# Tạo tài khoản admin mới (admin@admin.com / admin123)
npm run admin:create

# Xem danh sách tất cả admin
npm run admin:list

# Nâng cấp user hiện có lên admin
npm run admin:promote
```

**Cách 3: Chạy Script Trực Tiếp**
```bash
cd server_node

# Tạo admin
node scripts/create-admin.js

# Xem danh sách admin
node scripts/list-admins.js

# Nâng cấp user thành admin
node scripts/promote-to-admin.js
```

---

### **Bước 2: Đăng Nhập với Tài Khoản Admin**

1. Truy cập trang đăng nhập (`/login`) hoặc click "Đăng nhập" trên Header
2. Nhập thông tin admin:
   - **Email**: `admin@admin.com`
   - **Password**: `admin123` (hoặc password bạn đã đặt)
3. Click "Đăng nhập"
4. Hệ thống sẽ **tự động redirect** đến `/admin`

---

### **Bước 3: Sử Dụng Trang Admin**

Sau khi đăng nhập thành công, bạn sẽ thấy:

#### **Dashboard** (`/admin`)
- Xem tổng quan thống kê
- Thao tác nhanh với các chức năng chính

#### **Quản Lý Sản Phẩm** (`/admin/products`)
- Xem danh sách sản phẩm
- Tìm kiếm sản phẩm
- Thêm sản phẩm mới (`/admin/products/create`)
- Sửa sản phẩm (`/admin/products/edit/[id]`)
- Xóa sản phẩm

#### **Các Trang Khác** (Coming Soon)
- Quản lý đơn hàng
- Quản lý khách hàng
- Cài đặt hệ thống

---

## 🗂️ Cấu Trúc Files

```
src/app/admin/
├── layout.tsx              # Layout với sidebar navigation
├── page.tsx               # Dashboard chính
└── products/
    ├── page.tsx          # Danh sách sản phẩm
    ├── create/
    │   └── page.tsx      # Thêm sản phẩm mới
    └── edit/
        └── [id]/
            └── page.tsx  # Sửa sản phẩm
```

---

## 🔒 Bảo Mật

### **Frontend**
- Kiểm tra `userRole` trong `localStorage`
- Redirect nếu không phải admin

### **Backend** (Khuyến nghị thêm)
```javascript
// middleware/checkAdmin.js
const jwt = require('jsonwebtoken');
const { UserModel } = require('../database');

async function checkAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, 'SECRET_KEY');
    const user = await UserModel.findByPk(decoded.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin only' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = checkAdmin;
```

Áp dụng middleware:
```javascript
const checkAdmin = require('./middleware/checkAdmin');

// Protect admin routes
router.delete('/sanpham/:id', checkAdmin, async (req, res) => {
  // Chỉ admin mới xóa được
});
```

---

## 📝 Ghi Chú

### **Database Schema**
Đảm bảo bảng `users` có cột `role`:
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  ho_ten VARCHAR(100),
  sdt VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **LocalStorage Keys**
- `token`: JWT token
- `userEmail`: Email người dùng
- `userName`: Tên hiển thị
- `userRole`: `'admin'` hoặc `'customer'`

---

## 🐛 Troubleshooting

### **Không redirect đến /admin sau khi login**
✅ Kiểm tra:
1. Backend có trả về `role: 'admin'` không?
2. `localStorage.getItem('userRole')` có giá trị `'admin'` không?
3. Mở Console để xem logs

### **Vào /admin bị redirect về trang chủ**
✅ Kiểm tra:
1. Đã đăng nhập chưa?
2. `userRole` trong localStorage có đúng là `'admin'` không?

### **Sidebar không hiển thị đúng**
✅ Làm mới trang (F5) hoặc xóa cache

---

## 🎨 Tùy Chỉnh

### **Thay đổi màu sắc**
File: `src/app/admin/layout.tsx`
```tsx
// Sidebar color
style={{ backgroundColor: '#1F2937' }} // Dark gray

// Active menu color
className="bg-warning" // Yellow -> Có thể đổi thành bg-primary
```

### **Thêm menu item**
File: `src/app/admin/layout.tsx`
```tsx
const menuItems = [
  // ... existing items
  {
    title: 'Báo cáo',
    icon: FileText,
    path: '/admin/reports',
    active: pathname?.startsWith('/admin/reports'),
  },
];
```

---

## ✨ Next Steps

- [ ] Thêm API và trang quản lý đơn hàng
- [ ] Thêm API và trang quản lý users
- [ ] Thêm middleware bảo mật backend
- [ ] Thêm trang thống kê chi tiết
- [ ] Thêm tính năng export Excel/PDF

---

Chúc bạn sử dụng tốt! 🚀

