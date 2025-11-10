'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          icon: 'bi-check-circle-fill'
        };
      case 'error':
        return {
          bg: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
          icon: 'bi-x-circle-fill'
        };
      case 'info':
        return {
          bg: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          icon: 'bi-info-circle-fill'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          icon: 'bi-check-circle-fill'
        };
    }
  };

  const colors = getColors();

  return (
    <>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        .toast-container {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
      
      <div
        className="toast-container position-fixed d-flex align-items-center gap-3 px-4 py-3 shadow-lg"
        style={{
          top: '100px',
          right: '30px',
          zIndex: 10001,
          background: colors.bg,
          color: '#fff',
          borderRadius: '12px',
          minWidth: '320px',
          maxWidth: '400px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        }}
      >
        <i className={`bi ${colors.icon}`} style={{ fontSize: '24px' }}></i>
        <span style={{ flex: 1, fontWeight: '500', fontSize: '15px' }}>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1',
          }}
        >
          <i className="bi bi-x"></i>
        </button>
      </div>
    </>
  );
}

