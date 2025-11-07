# 👤 HƯỚNG DẪN CÁC TRANG TÀI KHOẢN NGƯỜI DÙNG

## 📋 Tổng Quan

Hệ thống quản lý tài khoản người dùng hoàn chỉnh với 5 trang chính:

1. **Tài khoản của tôi** (`/profile`)
2. **Đơn hàng của tôi** (`/orders`)
3. **Sản phẩm yêu thích** (`/wishlist`)
4. **Địa chỉ của tôi** (`/addresses`)
5. **Thông báo** (`/notifications`)

---

## 🎯 CHI TIẾT TỪNG TRANG

### 1. 📱 Tài Khoản Của Tôi (`/profile`)

**Tính năng:**
- ✅ Hiển thị thông tin cá nhân
- ✅ Chỉnh sửa thông tin (tên, SĐT, ngày sinh, giới tính)
- ✅ Upload avatar (UI ready)
- ✅ Link đổi mật khẩu
- ✅ Thống kê tài khoản (đơn hàng, yêu thích, địa chỉ)

**Components:**
- Sidebar navigation
- Avatar với nút upload
- Form chỉnh sửa thông tin
- 3 cards thống kê

**LocalStorage:**
```json
{
  "userName": "Tên người dùng",
  "userEmail": "email@example.com",
  "userRole": "customer"
}
```

---

### 2. 📦 Đơn Hàng Của Tôi (`/orders`)

**Tính năng:**
- ✅ Danh sách tất cả đơn hàng
- ✅ Filter theo trạng thái:
  - Chờ xác nhận
  - Đang xử lý
  - Đang giao
  - Đã giao
  - Đã hủy
- ✅ Chi tiết từng đơn hàng
- ✅ Nút "Mua lại" cho đơn đã giao
- ✅ Badge status với màu sắc

**Order Status:**
| Status | Label | Màu | Icon |
|--------|-------|-----|------|
| `pending` | Chờ xác nhận | #ffc107 | clock |
| `processing` | Đang xử lý | #17a2b8 | hourglass-split |
| `shipping` | Đang giao | #007bff | truck |
| `delivered` | Đã giao | #28a745 | check-circle |
| `cancelled` | Đã hủy | #dc3545 | x-circle |

---

### 3. ❤️ Sản Phẩm Yêu Thích (`/wishlist`)

**Tính năng:**
- ✅ Danh sách sản phẩm yêu thích
- ✅ Grid layout responsive (3 cột desktop)
- ✅ Thêm vào giỏ hàng
- ✅ Xóa khỏi wishlist
- ✅ Badge "Hết hàng"
- ✅ Hover effects đẹp

**LocalStorage Structure:**
```json
{
  "wishlist": [
    {
      "id": "1",
      "name": "Tên sản phẩm",
      "price": 15000000,
      "image": "/path/to/image",
      "category": "Sofa",
      "inStock": true
    }
  ]
}
```

**Integration với Cart:**
- Khi click "Thêm vào giỏ" → Add to cart
- Dispatch `cartUpdated` event
- Cập nhật badge ở header

---

### 4. 📍 Địa Chỉ Của Tôi (`/addresses`)

**Tính năng:**
- ✅ Danh sách địa chỉ giao hàng
- ✅ Thêm địa chỉ mới
- ✅ Chỉnh sửa địa chỉ
- ✅ Xóa địa chỉ
- ✅ Đặt địa chỉ mặc định
- ✅ Modal form đẹp

**Form Fields:**
- Họ và tên
- Số điện thoại
- Địa chỉ (số nhà, đường)
- Thành phố
- Quận/Huyện
- Phường/Xã
- Checkbox "Đặt làm mặc định"

**Address Structure:**
```typescript
{
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}
```

---

### 5. 🔔 Thông Báo (`/notifications`)

**Tính năng:**
- ✅ Danh sách thông báo
- ✅ Filter: Tất cả / Chưa đọc
- ✅ Badge số lượng chưa đọc
- ✅ 3 loại thông báo:
  - Đơn hàng (xanh lá)
  - Khuyến mãi (vàng)
  - Hệ thống (xanh dương)
- ✅ Đánh dấu đã đọc
- ✅ Đánh dấu tất cả đã đọc
- ✅ Xóa thông báo

**Notification Types:**
```typescript
type NotificationType = 'order' | 'promotion' | 'system';

{
  order: { icon: 'bag-check', color: '#28a745', label: 'Đơn hàng' },
  promotion: { icon: 'gift', color: '#FFC107', label: 'Khuyến mãi' },
  system: { icon: 'bell', color: '#17a2b8', label: 'Hệ thống' }
}
```

---

## 🎨 THIẾT KẾ CHUNG

### Layout
- **Desktop**: Sidebar (3 col) + Content (9 col)
- **Mobile**: Stack layout, sidebar collapse

### Màu Sắc
- **Primary**: #FFC107 (Vàng)
- **Success**: #28a745 (Xanh lá)
- **Danger**: #dc3545 (Đỏ)
- **Info**: #17a2b8 (Xanh dương)
- **Light**: #f8f9fa (Xám nhạt)

### Typography
- **Headings**: Bold, 16-24px
- **Body**: Regular, 14-16px
- **Small**: 12-13px

### Spacing
- **Border Radius**: 12-16px (cards), 8px (buttons)
- **Padding**: 16-24px
- **Gap**: 12-16px

### Components
- Card với shadow-sm
- Rounded corners (12-24px)
- Hover effects (transform + shadow)
- Smooth transitions (0.3s)

---

## 🔗 NAVIGATION

### Sidebar Menu (Tất cả trang)
```typescript
const menuItems = [
  { href: '/profile', icon: 'person-circle', label: 'Tài khoản của tôi' },
  { href: '/orders', icon: 'bag-check', label: 'Đơn hàng' },
  { href: '/wishlist', icon: 'heart', label: 'Yêu thích' },
  { href: '/addresses', icon: 'geo-alt', label: 'Địa chỉ' },
  { href: '/notifications', icon: 'bell', label: 'Thông báo' }
];
```

### Active State
- Background: `#FFF8E1`
- Text color: `#FFC107`
- Border radius: `12px`

---

## 💾 DATA MANAGEMENT

### LocalStorage Keys
```typescript
// User info
'userName'
'userEmail'
'userRole'
'token'

// Cart & Wishlist
'cart'
'wishlist'

// Addresses (có thể thêm)
'addresses'
```

### State Management
Mỗi trang tự quản lý state riêng, dùng `useState` và `useEffect`.

### Events
```typescript
// Dispatch khi update
window.dispatchEvent(new Event('cartUpdated'));
window.dispatchEvent(new Event('loginSuccess'));

// Listen
window.addEventListener('cartUpdated', handler);
```

---

## 🚀 KẾT NỐI API (TODO)

### Profile
```typescript
// GET /api/users/profile
// PUT /api/users/profile

const updateProfile = async (data) => {
  const response = await fetch('http://localhost:5000/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### Orders
```typescript
// GET /api/orders
// GET /api/orders/:id

const getOrders = async () => {
  const response = await fetch('http://localhost:5000/api/orders', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};
```

### Wishlist
```typescript
// GET /api/wishlist
// POST /api/wishlist
// DELETE /api/wishlist/:id
```

### Addresses
```typescript
// GET /api/addresses
// POST /api/addresses
// PUT /api/addresses/:id
// DELETE /api/addresses/:id
```

### Notifications
```typescript
// GET /api/notifications
// PUT /api/notifications/:id/read
// PUT /api/notifications/read-all
```

---

## 📱 RESPONSIVE

### Breakpoints
- **xs**: < 576px
- **sm**: 576px - 767px
- **md**: 768px - 991px
- **lg**: 992px - 1199px
- **xl**: ≥ 1200px

### Mobile Optimization
- Sidebar: Hidden trên mobile (có thể thêm hamburger menu)
- Cards: Full width
- Grid: 1 column
- Font size: Slightly smaller

---

## 🎯 FEATURES ROADMAP

### Cần Thêm
- [ ] Upload avatar thật
- [ ] Change password page
- [ ] Order tracking detail page
- [ ] Review/Rating system
- [ ] Push notifications
- [ ] Email notifications
- [ ] Export orders to PDF
- [ ] Loyalty points system

### Backend Integration
- [ ] Kết nối tất cả API endpoints
- [ ] Authentication middleware
- [ ] Image upload service
- [ ] Email service
- [ ] SMS service (OTP)

---

## 🐛 TROUBLESHOOTING

### Sidebar không active đúng
- Check pathname matching
- Đảm bảo Link href đúng

### Data không load
- Check localStorage
- Check console logs
- Verify API endpoints

### Responsive issues
- Test với Chrome DevTools
- Check Bootstrap breakpoints
- Verify custom styles

---

## 📞 NOTES

### Icons (Bootstrap Icons)
Tất cả icons dùng từ `bootstrap-icons`:
```html
<i className="bi bi-icon-name"></i>
```

### Loading States
Tất cả trang có loading spinner khi fetch data:
```typescript
{loading && <Spinner />}
```

### Empty States
Mọi trang đều có UI cho trường hợp rỗng (no data).

---

**Tạo bởi**: AI Assistant  
**Ngày**: 31/10/2025  
**Version**: 1.0.0

🎉 **Tất cả trang đã sẵn sàng sử dụng!**











