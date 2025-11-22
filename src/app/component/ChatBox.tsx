'use client';
import { useState } from 'react';

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const toggleChat = () => {
    const newState = !isOpen;
    console.log('🔥 ChatBox toggled:', newState);
    console.log('📦 Contact options:', contactOptions.length);
    setIsOpen(newState);
  };

  const contactOptions = [
    {
      id: 'zalo',
      name: 'Chat Zalo',
      bgColor: '#0068FF',
      icon: 'bi-chat-dots-fill',
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
      name: 'Gọi Hotline',
      bgColor: '#FF6B6B',
      icon: 'bi-telephone-fill',
      link: 'tel:0909123456', //  Thay số điện thoại
    },
    {
      id: 'email',
      name: 'Gửi Email',
      bgColor: '#FF8E53',
      icon: 'bi-envelope-fill',
      link: 'mailto:contact@dannydecor.com', // Thay email
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
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
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
          right: '43px', 
          zIndex: 10000,
          pointerEvents: 'none',
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
                zIndex: 20,
                pointerEvents: 'auto',
              }}
            >
              <div
                style={{
                  animation: 'fadeInScale 0.4s ease-out',
                  animationDelay: `${index * 0.08}s`,
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
                      animation: 'popIn 0.3s ease-out',
                    }}
                  >
                    <div
                      className="px-3 py-2 shadow-lg"
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#fff',
                        background: option.bgColor,
                        borderRadius: '12px',
                        boxShadow: `0 4px 15px ${option.bgColor}40`,
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
                  className="d-flex align-items-center justify-content-center text-decoration-none"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: option.bgColor,
                    transition: 'all 0.3s ease',
                    boxShadow: `0 4px 15px ${option.bgColor}50`,
                    transform: hoveredOption === option.id ? 'scale(1.15)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  <i 
                    className={`bi ${option.icon} text-white`} 
                    style={{ fontSize: '26px' }}
                  ></i>
                </a>
              </div>
            </div>
          );
        })}

        {/* Main Chat Button */}
        <button
          onClick={toggleChat}
          className="border-0 d-flex align-items-center justify-content-center position-relative"
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: isOpen 
              ? '#FF6B6B'
              : 'linear-gradient(135deg, #FF8E53 0%, #FFA726 100%)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: isOpen ? 'none' : 'pulse 2s infinite',
            boxShadow: isOpen 
              ? '0 8px 25px rgba(255, 107, 107, 0.4)'
              : '0 8px 25px rgba(255, 142, 83, 0.5)',
            zIndex: 20,
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.animation = 'shake 0.5s ease';
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.animation = 'pulse 2s infinite';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {/* Badge */}
          {!isOpen && (
            <span
              className="position-absolute badge rounded-pill"
              style={{
                top: '-5px',
                right: '-5px',
                fontSize: '11px',
                padding: '5px 8px',
                background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
                fontWeight: '700',
              }}
            >
              1
            </span>
          )}

          {/* Icon */}
          <i 
            className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} text-white`}
            style={{ fontSize: '30px' }}
          ></i>
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div
            className="position-absolute text-white px-4 py-2"
            style={{
              bottom: '80px',
              right: '0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              animation: 'popIn 0.5s ease-out',
              pointerEvents: 'none',
            }}
          >
            💬 Cần hỗ trợ? Nhấn vào đây!
            <div
              style={{
                position: 'absolute',
                bottom: '-7px',
                right: '22px',
                width: '0',
                height: '0',
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '7px solid #34495e',
              }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}
