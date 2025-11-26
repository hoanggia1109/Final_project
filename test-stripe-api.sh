#!/bin/bash

# Script test Stripe API endpoints
# Chạy: bash test-stripe-api.sh

echo "🧪 TEST STRIPE API ENDPOINTS"
echo "======================================"

# Test 1: Server có chạy không?
echo ""
echo "📡 Test 1: Kiểm tra server..."
curl -s http://localhost:5000/api/sanpham > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Server đang chạy"
else
    echo "   ❌ Server KHÔNG chạy!"
    echo "   💡 Chạy: cd server_node && npm start"
    exit 1
fi

echo ""
echo "✅ Tất cả tests OK!"
echo ""
echo "📋 Bước tiếp theo:"
echo "1. Mở browser: http://localhost:3000"
echo "2. Đăng nhập"
echo "3. Thêm sản phẩm vào giỏ"
echo "4. Checkout → Stripe"
echo ""





























