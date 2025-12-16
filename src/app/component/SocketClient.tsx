'use client';

import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/lib/api-config';

export default function SocketClient() {
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = async () => {
    // Chỉ kết nối Socket.IO khi ở client side
    if (typeof window === 'undefined') return;

    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token || !userEmail) {
      console.log('[Socket Client] User chưa đăng nhập, không kết nối Socket.IO');
      return;
    }

    // Nếu đã kết nối rồi thì không kết nối lại
    if (socketRef.current?.connected) {
      console.log('[Socket Client] Socket.IO đã kết nối');
      return;
    }

    // Lấy userId từ localStorage (đã được lưu khi đăng nhập)
    const userId: string | null = localStorage.getItem('userId');
    
    if (!userId) {
      console.warn('[Socket Client] Không tìm thấy userId trong localStorage');
      return;
    }

    try {
      const io = (await import('socket.io-client')).default;
      
      // Tạo kết nối Socket.IO
      const socketUrl = API_BASE_URL;
      console.log('[Socket Client] Đang kết nối đến:', socketUrl);
      
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('[Socket Client] Đã kết nối Socket.IO:', socket.id);
        setIsConnected(true);
        
        // Emit event user_online với userId
        socket.emit('user_online', { userId });
        console.log('[Socket Client] Đã emit user_online với userId:', userId);
      });

      socket.on('disconnect', () => {
        console.log('[Socket Client] Đã ngắt kết nối Socket.IO');
        setIsConnected(false);
      });

      socket.on('connect_error', (error: any) => {
        console.error('[Socket Client] Lỗi kết nối Socket.IO:', error);
        setIsConnected(false);
      });

      socket.on('online_users_count', (count: number) => {
        console.log('[Socket Client] Số người dùng online:', count);
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('[Socket Client] Lỗi khi khởi tạo Socket.IO:', error);
    }
  };

  useEffect(() => {
    // Kết nối khi component mount
    connectSocket();

    // Cleanup khi component unmount
    return () => {
      if (socketRef.current) {
        console.log('[Socket Client] Đang ngắt kết nối Socket.IO...');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, []);

  // Reconnect khi user login
  useEffect(() => {
    const handleLoginSuccess = () => {
      console.log('[Socket Client] Nhận event loginSuccess, đang kết nối Socket.IO...');
      // Delay một chút để đảm bảo localStorage đã được cập nhật
      setTimeout(() => {
        connectSocket();
      }, 500);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'userId') {
        console.log('[Socket Client] Storage changed, kiểm tra lại kết nối...');
        if (localStorage.getItem('token') && localStorage.getItem('userId')) {
          connectSocket();
        } else if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          setIsConnected(false);
        }
      }
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null; // Component này không render gì
}

