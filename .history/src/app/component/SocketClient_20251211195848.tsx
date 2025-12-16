'use client';

import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/lib/api-config';

let socketInstance: any = null;

export default function SocketClient() {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Chỉ kết nối Socket.IO khi ở client side
    if (typeof window === 'undefined') return;

    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token || !userEmail) {
      console.log('[Socket Client] User chưa đăng nhập, không kết nối Socket.IO');
      return;
    }

    // Lấy userId từ localStorage (đã được lưu khi đăng nhập)
    const userId: string | null = localStorage.getItem('userId');
    
    if (!userId) {
      console.warn('[Socket Client] Không tìm thấy userId trong localStorage');
      // Không thể track online nếu không có userId
      return;
    }

    // Import socket.io-client dynamically
    const initSocket = async () => {
      try {
        const io = (await import('socket.io-client')).default;
        
        // Tạo kết nối Socket.IO
        // Socket.IO tự động xử lý protocol, chỉ cần URL base
        const socketUrl = API_BASE_URL;
        console.log('[Socket Client] Đang kết nối đến:', socketUrl);
        
        socketInstance = io(socketUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
          console.log('[Socket Client] Đã kết nối Socket.IO:', socketInstance.id);
          
          // Emit event user_online với userId
          socketInstance.emit('user_online', { userId });
          console.log('[Socket Client] Đã emit user_online với userId:', userId);
        });

        socketInstance.on('disconnect', () => {
          console.log('[Socket Client] Đã ngắt kết nối Socket.IO');
        });

        socketInstance.on('connect_error', (error: any) => {
          console.error('[Socket Client] Lỗi kết nối Socket.IO:', error);
        });

        socketInstance.on('online_users_count', (count: number) => {
          console.log('[Socket Client] Số người dùng online:', count);
        });

        socketRef.current = socketInstance;
      } catch (error) {
        console.error('[Socket Client] Lỗi khi khởi tạo Socket.IO:', error);
      }
    };

    initSocket();

    // Cleanup khi component unmount hoặc user logout
    return () => {
      if (socketRef.current) {
        console.log('[Socket Client] Đang ngắt kết nối Socket.IO...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Reconnect khi user login
  useEffect(() => {
    const handleLoginSuccess = () => {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      if (token && userEmail && !socketRef.current) {
        // Reconnect nếu user vừa login và chưa có connection
        console.log('[Socket Client] User vừa đăng nhập, sẽ reconnect...');
        // Force re-render để kết nối lại
        window.location.reload(); // Hoặc có thể reconnect manual
      }
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  return null; // Component này không render gì
}

