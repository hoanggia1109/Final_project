'use client';
import { useState } from 'react';

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const contactOptions = [
    {
      id: 'zalo',
      name: 'Zalo',
      bgColor: '#0068FF',
      icon: 'bi-chat-dots',
      link: 'https://zalo.me/0909123456', //  Thay số Zalo 
    },
    {
      id: 'messenger',
      name: 'Messenger',
      bgColor: '#0084FF',
      icon: 'bi-messenger',
      link: 'https://m.me/yourpage', // Thay link Facebook page
    },
    {
      id: 'phone',
      name: 'Hotline',
      bgColor: '#25D366',
      icon: 'bi-telephone-fill',
      link: 'tel:0909123456', //  Thay số điện thoại
    },
    {
      id: 'email',
      name: 'Email',
      bgColor: '#EA4335',
      icon: 'bi-envelope-fill',
      link: 'mailto:contact@vantaydecor.com', // Thay email
    },
  ];

  // Tính toán vị trí theo vòng cung
  const getButtonPosition = (index: number) => {
    const total = contactOptions.length;
    const angleStep = 180 / (total + 1); // Chia đều góc 180 độ
    const angle = angleStep * (index + 1);
    const radius = 140; // Khoảng cách từ nút chính
    
    // Chuyển đổi góc sang radian
    const radian = (angle * Math.PI) / 180;
    
    // Tính toán tọa độ x, y (bên trái và phía trên)
    const x = -Math.cos(radian) * radius;
    const y = -Math.sin(radian) * radius;
    
    return { x, y };
  };

  return (
    <>
      <style jsx global>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(10deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(0deg); }
        }
      `}</style>

      {/* Main Container */}
      <div 
        className="position-fixed" 
        style={{ 
          bottom: '30px', 
          right: '30px', 
          zIndex: 9999,
        }}
      >
        {/* Contact Option Buttons */}
        {isOpen && contactOptions.map((option, index) => {
          const position = getButtonPosition(index);
          
          return (
            <div
              key={option.id}
              className="position-absolute"
              style={{
                bottom: '0',
                right: '0',
                transform: `translate(${position.x}px, ${position.y}px)`,
                animation: 'popIn 0.3s ease-out',
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'both',
              }}
            >
              {/* Label */}
              {hoveredOption === option.id && (
                <div
                  className="position-absolute"
                  style={{
                    right: '70px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div
                    className="px-3 py-2 bg-white shadow rounded-pill"
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    {option.name}
                  </div>
                </div>
              )}

              {/* Button */}
              <a
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center shadow-lg text-decoration-none"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: option.bgColor,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <i 
                  className={`bi ${option.icon} text-white`} 
                  style={{ fontSize: '24px' }}
                ></i>
              </a>
            </div>
          );
        })}

        {/* Main Chat Button */}
        <button
          onClick={toggleChat}
          className="border-0 shadow-lg d-flex align-items-center justify-content-center position-relative"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: isOpen ? '#FF6B6B' : '#FFC107',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: isOpen ? 'none' : 'pulse 2s infinite',
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.animation = 'shake 0.5s ease';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.animation = 'pulse 2s infinite';
            }
          }}
        >
          {/* Badge */}
          {!isOpen && (
            <span
              className="position-absolute badge rounded-pill bg-danger"
              style={{
                top: '-5px',
                right: '-5px',
                fontSize: '10px',
                padding: '4px 6px',
              }}
            >
              1
            </span>
          )}

          {/* Icon */}
          <i 
            className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} text-white`}
            style={{ fontSize: '28px' }}
          ></i>
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div
            className="position-absolute bg-dark text-white px-3 py-2 shadow"
            style={{
              bottom: '75px',
              right: '0',
              borderRadius: '8px',
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            Cần hỗ trợ? Nhấn vào đây!
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '20px',
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #333',
              }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}
