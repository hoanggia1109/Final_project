# DANH SÁCH API CHƯA CÓ TRONG SWAGGER DOCUMENTATION

## 🔴 CÁC API QUAN TRỌNG CẦN BỔ SUNG NGAY:

### 1. **PROFILE APIs** (`routes/profile.js`)
- `GET /api/profile` - Lấy thông tin profile user
- `PUT /api/profile` - Cập nhật thông tin profile
- `POST /api/profile/avatar` - Upload avatar

### 2. **YÊU THÍCH APIs** (`routes/yeuthich.js`)
- `GET /api/yeuthich` - Lấy danh sách sản phẩm yêu thích
- `POST /api/yeuthich` - Thêm sản phẩm vào yêu thích
- `DELETE /api/yeuthich/:sanpham_id` - Xóa sản phẩm khỏi yêu thích
- `DELETE /api/yeuthich` - Xóa tất cả sản phẩm yêu thích
- `GET /api/yeuthich/check/:sanpham_id` - Kiểm tra sản phẩm có trong wishlist

### 3. **BANNER APIs** (`routes/banner.js`)
- `GET /api/banner` - Lấy danh sách banner
- `GET /api/banner/:id` - Lấy chi tiết banner
- `POST /api/banner` - Thêm banner mới (upload ảnh)
- `PUT /api/banner/:id` - Cập nhật banner (upload ảnh)
- `DELETE /api/banner/:id` - Xóa banner

### 4. **TỒN KHO APIs** (`routes/tonkho.js`) - QUAN TRỌNG!
- `GET /api/tonkho` - Lấy danh sách tồn kho (có pagination, filter)
- `GET /api/tonkho/:id` - Lấy chi tiết tồn kho một biến thể
- `POST /api/tonkho/nhap` - Nhập kho
- `POST /api/tonkho/xuat` - Xuất kho
- `GET /api/tonkho/lichsu/all` - Lịch sử nhập xuất kho
- `GET /api/tonkho/thongke/summary` - Thống kê tồn kho

### 5. **SẢN PHẨM APIs**
- `GET /api/sanpham/giamgia` - Lấy danh sách sản phẩm giảm giá

### 6. **BIẾN THỂ APIs** (`routes/bienthe.js`)
- `GET /api/bienthe` - Lấy danh sách biến thể

### 7. **THANH TOÁN APIs** (`routes/thanhtoan.js`)
- `POST /api/thanhtoan/stripe/create-order-and-payment-intent` - Tạo đơn hàng và Payment Intent
- `POST /api/thanhtoan/stripe/webhook` - Stripe webhook (không cần Swagger vì là webhook)
- `GET /api/thanhtoan/stripe/test-config` - Test cấu hình Stripe
- `GET /api/thanhtoan/stripe/verify/:paymentIntentId` - Verify Payment Intent
- `POST /api/thanhtoan/cod` - Thanh toán COD

---

## 🟡 CÁC ADMIN APIs CHƯA CÓ:

### 8. **ADMIN - DASHBOARD & USERS**
- `GET /api/admin/dashboard` - Thống kê tổng quan
- `GET /api/admin/users` - Lấy danh sách users
- `DELETE /api/admin/users/:id` - Xóa user
- `PUT /api/admin/users/:id` - Cập nhật user

### 9. **ADMIN - SẢN PHẨM**
- `POST /api/admin/admin/sanpham` - Tạo sản phẩm
- `PUT /api/admin/admin/sanpham/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/admin/sanpham/:id` - Xóa sản phẩm
- `GET /api/admin/sanpham` - Lấy danh sách sản phẩm (admin)

### 10. **ADMIN - BIẾN THỂ**
- `POST /api/admin/admin/bienthe` - Tạo biến thể
- `PUT /api/admin/bienthe/:id` - Cập nhật biến thể
- `DELETE /api/admin/bienthe/:id` - Xóa biến thể

### 11. **ADMIN - ĐƠN HÀNG**
- `GET /api/admin/donhang` - Lấy danh sách đơn hàng
- `GET /api/admin/admin/donhang/:id` - Chi tiết đơn hàng (admin)

### 12. **ADMIN - MÃ GIẢM GIÁ**
- `GET /api/admin/magiamgia` - Lấy danh sách mã giảm giá
- `POST /api/admin/magiamgia` - Tạo mã giảm giá
- `PUT /api/admin/magiamgia/:id` - Cập nhật mã giảm giá
- `DELETE /api/admin/magiamgia/:id` - Xóa mã giảm giá

### 13. **ADMIN - BÀI VIẾT**
- `GET /api/admin/baiviet` - Lấy danh sách bài viết
- `POST /api/admin/baiviet` - Tạo bài viết
- `PUT /api/admin/baiviet/:id` - Cập nhật bài viết
- `DELETE /api/admin/baiviet/:id` - Xóa bài viết

### 14. **ADMIN - DANH MỤC BÀI VIẾT**
- `GET /api/admin/danhmucbaiviet` - Lấy danh sách danh mục bài viết
- `POST /api/admin/danhmucbaiviet` - Tạo danh mục bài viết
- `PUT /api/admin/admin/danhmucbaiviet/:id` - Cập nhật danh mục bài viết
- `DELETE /api/admin/admin/danhmucbaiviet/:id` - Xóa danh mục bài viết

### 15. **ADMIN - LIÊN HỆ**
- `GET /api/admin/lienhe` - Lấy danh sách liên hệ
- `DELETE /api/admin/lienhe/:id` - Xóa liên hệ

### 16. **ADMIN - REVIEW**
- `GET /api/admin/review` - Lấy danh sách review
- `DELETE /api/admin/review/:id` - Xóa review

---

## 📊 TỔNG KẾT:

**Tổng số API chưa có Swagger: ~45+ APIs**

### Độ ưu tiên:
1. **CAO** (Quan trọng cho user):
   - Profile APIs
   - Yêu thích APIs
   - Banner APIs
   - Tồn kho APIs

2. **TRUNG BÌNH** (Quan trọng cho admin):
   - Admin Dashboard
   - Admin Sản phẩm/Biến thể
   - Admin Mã giảm giá
   - Admin Bài viết

3. **THẤP**:
   - Các API test/config
   - Webhook APIs (không cần Swagger)

---

**Ghi chú:** File này được tạo tự động để theo dõi các API cần bổ sung vào Swagger documentation.

