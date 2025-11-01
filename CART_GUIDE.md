# 🛒 HƯỚNG DẪN SỬ DỤNG TÍNH NĂNG GIỎ HÀNG

## 📋 Tổng Quan

Hệ thống giỏ hàng hoàn chỉnh với đầy đủ chức năng mua sắm online hiện đại.

## ✨ Tính Năng

### 1. **Giỏ Hàng (`/cart`)**
- ✅ Hiển thị danh sách sản phẩm trong giỏ
- ✅ Cập nhật số lượng sản phẩm
- ✅ Xóa sản phẩm khỏi giỏ
- ✅ Áp dụng mã giảm giá
- ✅ Tính toán tổng tiền tự động
- ✅ Miễn phí ship cho đơn > 5 triệu
- ✅ UI/UX đẹp mắt, responsive

### 2. **Thanh Toán (`/checkout`)**
- ✅ Form thông tin giao hàng đầy đủ
- ✅ Chọn phương thức thanh toán (COD/Banking)
- ✅ Hiển thị tóm tắt đơn hàng
- ✅ Xác nhận và đặt hàng
- ✅ Validation form

### 3. **Header Integration**
- ✅ Icon giỏ hàng với badge số lượng
- ✅ Cập nhật real-time khi thêm/xóa sản phẩm
- ✅ Hover effects đẹp mắt

### 4. **Cart Hook (`useCart`)**
- ✅ Quản lý state giỏ hàng tập trung
- ✅ LocalStorage persistence
- ✅ Event-based updates
- ✅ Helper functions đầy đủ

## 📂 Cấu Trúc File

```
src/app/
├── cart/
│   └── page.tsx          # Trang giỏ hàng
├── checkout/
│   └── page.tsx          # Trang thanh toán
├── hooks/
│   └── useCart.ts        # Hook quản lý cart
└── component/
    └── Header.tsx        # Header với cart icon
```

## 🎨 Thiết Kế

### Màu Sắc
- **Primary**: #FFC107 (Vàng)
- **Danger**: #dc3545 (Đỏ - badge)
- **Success**: #28a745 (Xanh lá - miễn phí ship)
- **Background**: #f8f9fa (Xám nhạt)

### Components
- **Rounded corners**: 12px - 24px
- **Shadows**: `shadow-sm`
- **Transitions**: `0.25s cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover effects**: Transform + background color

## 💻 Cách Sử Dụng

### 1. Thêm Sản Phẩm Vào Giỏ

```typescript
import { useCart } from '@/app/hooks/useCart';

function ProductCard() {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      id: '1',
      name: 'Sofa Modern',
      price: 15000000,
      image: '/products/sofa.jpg',
      category: 'Sofa'
    }, 1); // quantity = 1
  };
  
  return (
    <button onClick={handleAddToCart}>
      Thêm vào giỏ
    </button>
  );
}
```

### 2. Sử Dụng Cart Hook

```typescript
const {
  cartItems,        // Danh sách sản phẩm
  loading,          // Trạng thái loading
  addToCart,        // Thêm sản phẩm
  updateQuantity,   // Cập nhật số lượng
  removeFromCart,   // Xóa sản phẩm
  clearCart,        // Xóa toàn bộ giỏ
  getCartTotal,     // Tổng tiền
  getCartCount,     // Tổng số lượng
  isInCart,         // Kiểm tra sản phẩm có trong giỏ
} = useCart();
```

### 3. LocalStorage Structure

```json
{
  "cart": [
    {
      "id": "1",
      "name": "Sofa Modern",
      "price": 15000000,
      "image": "/products/sofa.jpg",
      "category": "Sofa",
      "quantity": 2
    }
  ]
}
```

### 4. Events

Hook tự động dispatch events khi cart thay đổi:
- `cartUpdated`: Khi thêm/xóa/cập nhật sản phẩm
- `storage`: Native browser event

Các component khác có thể listen:
```typescript
window.addEventListener('cartUpdated', () => {
  // Update UI
});
```

## 🎁 Mã Giảm Giá

Có sẵn 2 mã giảm giá test:

| Mã | Giảm giá | Mô tả |
|---|---|---|
| `NOITHAT10` | 10% | Giảm giá 10% tổng đơn |
| `FREESHIP` | 5% | Miễn phí ship (5%) |

## 📱 Responsive

- **Desktop**: Layout 2 cột (cart items + summary)
- **Tablet**: Layout responsive
- **Mobile**: Stack layout, optimized touch

## 🔧 Tùy Chỉnh

### Thay Đổi Phí Ship

File: `src/app/cart/page.tsx`

```typescript
const shippingFee = subtotal > 5000000 ? 0 : 100000;
//                           ↑ Đổi ngưỡng miễn phí ship
//                                              ↑ Đổi phí ship
```

### Thêm Mã Giảm Giá Mới

File: `src/app/cart/page.tsx`

```typescript
const applyPromoCode = () => {
  const code = promoCode.toUpperCase();
  if (code === 'NEWCODE') {  // Mã mới
    setDiscount(15);          // % giảm giá
    alert('Mã giảm giá 15% đã được áp dụng!');
  }
  // ... existing codes
};
```

### Thay Đổi Phương Thức Thanh Toán

File: `src/app/checkout/page.tsx`

Thêm option mới trong radio buttons:

```typescript
<div className="form-check mb-3 p-3 border rounded-3">
  <input
    type="radio"
    name="paymentMethod"
    id="momo"
    value="momo"
  />
  <label htmlFor="momo">
    <i className="bi bi-wallet2 text-danger me-2"></i>
    <div>Ví MoMo</div>
  </label>
</div>
```

## 🚀 Triển Khai

### Kết Nối API Backend

File: `src/app/checkout/page.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setProcessing(true);

  try {
    // ✅ GỌI API THẬT
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        items: cartItems,
        customerInfo: formData,
        total: total
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Đặt hàng thất bại');
    }

    // Clear cart & redirect
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    router.push(`/orders/${data.orderId}`);
    
  } catch (error) {
    alert((error as Error).message);
  } finally {
    setProcessing(false);
  }
};
```

## 🐛 Troubleshooting

### Cart không cập nhật
- Check localStorage có data không (F12 → Application → Local Storage)
- Check console có error không
- Đảm bảo event `cartUpdated` được dispatch

### Badge số lượng không hiện
- Check `cartUpdated` event
- Check Header có import đúng không
- Reload trang

### Lỗi khi checkout
- Check cart có sản phẩm không
- Check form validation
- Check console logs

## 📊 Performance

- ✅ LocalStorage caching
- ✅ Event-based updates (không polling)
- ✅ Lazy loading images
- ✅ Optimized re-renders

## 🎯 Roadmap

- [ ] Wishlist integration
- [ ] Cart sharing (URL)
- [ ] Product recommendations
- [ ] Order tracking
- [ ] Payment gateway integration
- [ ] Invoice generation

## 📞 Support

Nếu cần hỗ trợ, kiểm tra:
1. Console logs (F12)
2. Network tab (API calls)
3. LocalStorage data
4. Component state trong React DevTools

---

**Tạo bởi**: AI Assistant  
**Ngày**: 31/10/2025  
**Version**: 1.0.0


