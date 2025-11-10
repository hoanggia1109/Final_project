// Cart utilities
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  colorCode?: string;
}

// Lấy số lượng sản phẩm trong giỏ từ backend
export const getCartCount = async (): Promise<number> => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    const response = await fetch('http://localhost:5000/api/giohang', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return 0;

    const data = await response.json();
    const items = data.san_pham || [];
    return items.reduce((total: number, item: { soluong: number }) => total + item.soluong, 0);
  } catch (error) {
    console.error('Error loading cart count:', error);
    return 0;
  }
};

// Thêm sản phẩm vào giỏ hàng (gọi API backend)
export const addToCart = async (product: {
  bienthe_id: string; // ID của biến thể sản phẩm
  soluong: number;
}) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      window.location.href = '/auth';
      return false;
    }

    const response = await fetch('http://localhost:5000/api/giohang', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify([{
        bienthe_id: product.bienthe_id,
        soluong: product.soluong,
      }]),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to add to cart');
    }

    // Dispatch custom event để Header update
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility (not used with new backend)
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

