# 🔍 HƯỚNG DẪN DEBUG - VẤN ĐỀ HIỂN THỊ USER

## ⚡ TÓM TẮT VẤN ĐỀ
LocalStorage đã được lưu (kiểm tra F12) nhưng Header vẫn không hiển thị tên user.

## 🛠️ CÁC GIẢI PHÁP ĐÃ TRIỂN KHAI

### 1. ✅ Thêm Interval Check (Polling)
**Mục đích**: Tự động kiểm tra localStorage mỗi 2 giây để phát hiện thay đổi

**File**: `src/app/component/Header.tsx` (dòng 74-87)

```typescript
// Interval check để đảm bảo sync (check mỗi 2 giây)
const interval = setInterval(() => {
  const currentToken = localStorage.getItem('token');
  const currentEmail = localStorage.getItem('userEmail');
  
  // Chỉ update nếu có thay đổi
  if (currentToken && currentEmail && !isLoggedIn) {
    console.log('🔄 Detected login change via interval check');
    checkLoginStatus();
  }
}, 2000);
```

### 2. ✅ Dispatch Multiple Events
**Mục đích**: Đảm bảo Header nhận được signal để update

**File**: `src/app/login/page.tsx` & `src/app/component/AuthModal.tsx`

```typescript
// Dispatch cả 2 events
window.dispatchEvent(new Event('loginSuccess'));
window.dispatchEvent(new Event('storage'));
```

### 3. ✅ Tăng Timeout Trước Reload
**Mục đích**: Cho localStorage nhiều thời gian hơn để flush data

**Thay đổi**: 100ms → 200ms

```typescript
setTimeout(() => {
  window.location.href = '/';
}, 200);
```

### 4. ✅ Debug Component Real-time
**Mục đích**: Xem localStorage real-time ngay trên trang web

**File**: `src/app/component/DebugAuth.tsx`

Component này sẽ hiển thị ở góc dưới bên phải màn hình với:
- Token status (có/không)
- User Name
- User Email  
- User Role
- Nút refresh thủ công
- Nút clear localStorage

### 5. ✅ Debug Console Logs
**Mục đích**: Theo dõi state changes của Header

```typescript
// Log mỗi khi state thay đổi
useEffect(() => {
  console.log('🎯 Header State Updated:', {
    isLoggedIn,
    userName,
    userEmail,
    userRole
  });
}, [isLoggedIn, userName, userEmail, userRole]);
```

## 📋 CHECKLIST DEBUG

### Bước 1: Kiểm Tra LocalStorage
1. Đăng nhập vào hệ thống
2. Mở DevTools (F12) → Tab **Application** → **Local Storage**
3. Kiểm tra 4 keys:
   - ✅ `token`: Phải có giá trị JWT
   - ✅ `userEmail`: Phải có email
   - ✅ `userName`: Phải có tên (không phải "undefined" hay "null")
   - ✅ `userRole`: Phải có role (customer/admin)

### Bước 2: Kiểm Tra Debug Widget
1. Nhìn góc **dưới bên phải** màn hình
2. Phải thấy box màu đen với tiêu đề "🔍 DEBUG - LocalStorage"
3. Kiểm tra:
   - ✅ Token: Có dấu ✅ màu xanh
   - ✅ User Name: Có dấu ✅ và hiển thị đúng tên
   - ✅ User Email: Có dấu ✅ và hiển thị đúng email
   - ✅ User Role: Có dấu ✅ và hiển thị role

### Bước 3: Kiểm Tra Console Logs
1. Mở DevTools (F12) → Tab **Console**
2. Sau khi đăng nhập, phải thấy:
```
💾 Login Page - Đã lưu localStorage: {...}
🔍 Verify localStorage: {...}
✅ Đăng nhập thành công!
🔄 Redirect về trang chủ...
```

3. Sau khi redirect về trang chủ:
```
🔍 Header - Checking localStorage: {...}
✅ User logged in: {...}
🎯 Header State Updated: {...}
```

4. Nếu không thấy update, đợi ~2 giây, phải thấy:
```
🔄 Detected login change via interval check
🔍 Header - Checking localStorage: {...}
```

### Bước 4: Kiểm Tra Header Dropdown
1. Click vào **icon user** ở góc phải header
2. Dropdown phải hiển thị:
   - ✅ Avatar circle màu vàng
   - ✅ Tên user (KHÔNG phải "User" hay rỗng)
   - ✅ Email user
   - ✅ Badge "ADMIN" (nếu là admin)
   - ✅ Menu items (Tài khoản, Đơn hàng, etc.)
   - ✅ Nút Đăng xuất màu đỏ

### Bước 5: Test Interval Check
1. Đăng nhập và đợi ở trang chủ
2. **KHÔNG reload** trang
3. Đợi tối đa 2 giây
4. Kiểm tra console xem có log:
```
🔄 Detected login change via interval check
```

## 🐛 CÁC TRƯỜNG HỢP LỖI VÀ GIẢI PHÁP

### ❌ Lỗi 1: LocalStorage bị rỗng sau login
**Triệu chứng**: F12 → Application → Local Storage không có gì

**Nguyên nhân**: Backend không trả về user object hoặc token

**Giải pháp**:
1. Kiểm tra Network tab (F12)
2. Tìm request `/api/auth/dangnhap`
3. Xem Response, phải có format:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "user@email.com",
    "fullName": "User Name",
    "role": "customer"
  }
}
```

### ❌ Lỗi 2: LocalStorage có dữ liệu nhưng Header không update
**Triệu chứng**: 
- Debug widget hiển thị ✅ đầy đủ
- Nhưng header vẫn hiển thị icon trống

**Giải pháp**:
1. Đợi 2 giây (interval check sẽ tự động update)
2. Click vào icon user để trigger `checkLoginStatus()`
3. Nếu vẫn không work, reload page (Ctrl + R)
4. Kiểm tra console có lỗi JavaScript không

### ❌ Lỗi 3: userName hiển thị "undefined" hoặc "null"
**Triệu chứng**: Dropdown hiển thị text "undefined" thay vì tên

**Nguyên nhân**: Backend không trả về `fullName`

**Giải pháp**: 
- Code đã có fallback tự động
- Sẽ lấy phần trước @ của email làm tên
- Ví dụ: `user@gmail.com` → `user`

### ❌ Lỗi 4: Đăng xuất không work
**Triệu chứng**: Click "Đăng xuất" nhưng vẫn thấy thông tin user

**Giải pháp**:
1. Kiểm tra console xem có log:
```
🚪 Logging out...
✅ Đăng xuất thành công - localStorage đã được xóa
```
2. Kiểm tra localStorage trong F12 (phải rỗng)
3. Nếu vẫn còn → Dùng nút "🗑️ Clear All" trong debug widget
4. Reload page

## 🔧 DEBUG TOOLS

### 1. Debug Widget (Góc dưới phải)
- **Refresh**: Update thông tin ngay lập tức
- **Clear All**: Xóa toàn bộ localStorage và reload

### 2. Console Commands
Mở Console (F12) và gõ:

```javascript
// Xem toàn bộ localStorage
console.table({
  token: localStorage.getItem('token'),
  userName: localStorage.getItem('userName'),
  userEmail: localStorage.getItem('userEmail'),
  userRole: localStorage.getItem('userRole')
});

// Force check login status
window.dispatchEvent(new Event('loginSuccess'));

// Xóa localStorage
localStorage.clear();
window.location.reload();
```

### 3. Network Tab
1. F12 → Network
2. Filter: `Fetch/XHR`
3. Đăng nhập
4. Tìm request `dangnhap`
5. Xem Response data

## 📊 EXPECTED BEHAVIOR

### ✅ Flow Đúng
1. User nhập email/password → Click "Đăng nhập"
2. Backend trả về token + user info
3. Frontend lưu vào localStorage
4. Dispatch events (`loginSuccess`, `storage`)
5. Header listen events → Gọi `checkLoginStatus()`
6. Update state: `setIsLoggedIn(true)`, `setUserName()`, etc.
7. UI re-render → Hiển thị tên user
8. Nếu bỏ lỡ event → Interval check (2s) sẽ tự động update

### 🔄 Timeline
```
0ms:    User click "Đăng nhập"
100ms:  API response
150ms:  Save to localStorage
160ms:  Dispatch events
170ms:  Header receives event
180ms:  checkLoginStatus() called
200ms:  State updated
220ms:  UI re-renders
240ms:  Redirect to homepage
240ms+: Homepage Header mount
250ms:  Header checkLoginStatus() on mount
260ms:  Display user info

Backup:
2000ms: Interval check
2010ms: Auto update if missed
```

## 🎯 KẾT LUẬN

Với các cải tiến trên, Header **PHẢI** cập nhật trong vòng 2 giây sau khi login.

Nếu vẫn không work:
1. ✅ Kiểm tra Debug Widget
2. ✅ Xem Console logs
3. ✅ Verify localStorage trong F12
4. ✅ Check Network tab (API response)
5. ✅ Screenshot và báo lỗi chi tiết

---

**Lưu ý**: Debug Widget chỉ nên dùng trong development. Nhớ remove trước khi deploy production!

Để tắt Debug Widget, xóa dòng này trong `src/app/layout.tsx`:
```typescript
<DebugAuth />  // ← XÓA DÒNG NÀY
```


