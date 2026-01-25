#!/bin/bash

# Script tạo file .env cho Mac
# Chạy: bash create-env-files.sh

echo "🚀 Tạo file .env cho DANNYdecor..."
echo ""

# Lấy IP của máy
echo "📡 Đang lấy IP của máy Mac..."
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

if [ -z "$IP" ]; then
    echo "⚠️  Không tìm thấy IP. Sử dụng localhost..."
    IP="localhost"
else
    echo "✅ Tìm thấy IP: $IP"
fi

echo ""
echo "=========================================="
echo "Tạo file .env cho Backend..."
echo "=========================================="

# Tạo file .env cho backend
cat > server_node/.env << EOF
# ============================================
# CẤU HÌNH BACKEND - DANNYdecor
# ============================================

# Port cho backend server
PORT=5002

# ============================================
# CẤU HÌNH EMAIL (Gmail)
# ============================================
# Lấy App Password từ: https://myaccount.google.com/apppasswords
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here

# Email admin nhận thông báo
ADMIN_EMAIL=admin@dannydecor.com

# ============================================
# CẤU HÌNH FRONTEND URL (QUAN TRỌNG!)
# ============================================
# Đã tự động detect IP: $IP
# Nếu không đúng, sửa lại thủ công
FRONTEND_URL=http://$IP:3000

# ============================================
# CẤU HÌNH JWT SECRET
# ============================================
# Tạo secret key ngẫu nhiên cho JWT token
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || echo "your-super-secret-jwt-key-change-this-in-production")
EOF

echo "✅ Đã tạo file: server_node/.env"
echo ""

echo "=========================================="
echo "Tạo file .env.local cho Frontend..."
echo "=========================================="

# Tạo file .env.local cho frontend
cat > .env.local << EOF
# ============================================
# CẤU HÌNH FRONTEND - DANNYdecor (Next.js)
# ============================================

# ============================================
# BACKEND API URL (QUAN TRỌNG!)
# ============================================
# Đã tự động detect IP: $IP
# Nếu không đúng, sửa lại thủ công
NEXT_PUBLIC_API_URL=http://$IP:5002
EOF

echo "✅ Đã tạo file: .env.local"
echo ""

echo "=========================================="
echo "✅ Hoàn thành!"
echo "=========================================="
echo ""
echo "📝 Các bước tiếp theo:"
echo "1. Mở file server_node/.env và điền:"
echo "   - EMAIL_USER (email Gmail của bạn)"
echo "   - EMAIL_PASSWORD (App Password từ Gmail)"
echo ""
echo "2. Kiểm tra FRONTEND_URL và NEXT_PUBLIC_API_URL có đúng IP không"
echo "   (IP hiện tại: $IP)"
echo ""
echo "3. Khởi động lại servers:"
echo "   - Backend: cd server_node && node index.js"
echo "   - Frontend: npm run dev"
echo ""




