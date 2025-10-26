'use client';
import { useState, useEffect } from 'react';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Auto show popup sau 1.5s mỗi khi load trang
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        .promo-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-in-out;
          padding: 20px;
        }

        .promo-modal-content {
          position: relative;
          max-width: 900px;
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .promo-modal-inner {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.95) 0%, 
            rgba(255, 192, 203, 0.95) 25%,
            rgba(176, 224, 230, 0.95) 75%,
            rgba(135, 206, 250, 0.95) 100%
          );
          padding: 50px;
          min-height: 500px;
          overflow: hidden;
        }

        .promo-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .promo-close-btn:hover {
          transform: rotate(90deg) scale(1.1);
          background: #ff4b6e;
          color: white;
        }

        .promo-decorative-flower {
          position: absolute;
          opacity: 0.3;
          pointer-events: none;
        }

        .flower-1 {
          top: 10%;
          left: 5%;
          font-size: 80px;
          animation: float 6s ease-in-out infinite;
        }

        .flower-2 {
          bottom: 10%;
          right: 5%;
          font-size: 100px;
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .flower-3 {
          top: 50%;
          left: 10%;
          font-size: 60px;
          animation: float 7s ease-in-out infinite;
          animation-delay: 2s;
        }

        .flower-4 {
          top: 20%;
          right: 15%;
          font-size: 70px;
          animation: float 9s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .promo-content-wrapper {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .promo-title {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ff4b6e 0%, #ff6b9d 50%, #ffa4c7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          text-shadow: 2px 2px 20px rgba(255, 75, 110, 0.3);
          line-height: 1.2;
          animation: slideDown 0.6s ease-out;
        }

        .promo-subtitle {
          font-size: 4rem;
          font-weight: 900;
          color: white;
          text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
          margin-bottom: 30px;
          animation: slideDown 0.7s ease-out;
        }

        .promo-badges {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 30px 0;
          animation: fadeIn 0.8s ease-out;
        }

        .promo-badge {
          background: white;
          padding: 20px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(255, 75, 110, 0.3);
          transform: rotate(-2deg);
          transition: all 0.3s ease;
        }

        .promo-badge:nth-child(2) {
          transform: rotate(2deg);
        }

        .promo-badge:nth-child(3) {
          transform: rotate(-3deg);
        }

        .promo-badge:hover {
          transform: rotate(0deg) scale(1.1);
          box-shadow: 0 15px 40px rgba(255, 75, 110, 0.4);
        }

        .promo-badge-label {
          font-size: 0.9rem;
          color: #ff4b6e;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .promo-badge-value {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ff4b6e 0%, #ff6b9d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .promo-gift-box {
          position: absolute;
          top: -30px;
          right: -20px;
          font-size: 60px;
          animation: bounce 2s ease-in-out infinite;
        }

        .promo-cta-button {
          background: linear-gradient(135deg, #ff4b6e 0%, #ff1744 100%);
          color: white;
          border: none;
          padding: 20px 60px;
          font-size: 1.5rem;
          font-weight: 900;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 15px 40px rgba(255, 75, 110, 0.5);
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 20px;
          animation: pulse 2s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .promo-cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .promo-cta-button:hover::before {
          width: 300px;
          height: 300px;
        }

        .promo-cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px rgba(255, 75, 110, 0.6);
        }

        .promo-decorative-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          pointer-events: none;
        }

        .circle-1 {
          width: 200px;
          height: 200px;
          top: -50px;
          left: -50px;
          animation: float 10s ease-in-out infinite;
        }

        .circle-2 {
          width: 150px;
          height: 150px;
          bottom: -30px;
          right: 100px;
          animation: float 12s ease-in-out infinite;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 100px;
          height: 100px;
          top: 100px;
          right: -30px;
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
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

        @media (max-width: 768px) {
          .promo-modal-inner {
            padding: 30px 20px;
            min-height: auto;
          }

          .promo-title {
            font-size: 2rem;
          }

          .promo-subtitle {
            font-size: 2.5rem;
          }

          .promo-badges {
            gap: 10px;
          }

          .promo-badge {
            padding: 15px 20px;
          }

          .promo-badge-value {
            font-size: 1.8rem;
          }

          .promo-cta-button {
            padding: 15px 40px;
            font-size: 1.2rem;
          }

          .flower-1, .flower-2, .flower-3, .flower-4 {
            font-size: 40px;
          }
        }
      `}</style>

      <div className="promo-modal-overlay" onClick={handleClose}>
        <div className="promo-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="promo-modal-inner">
            {/* Close Button */}
            <button className="promo-close-btn" onClick={handleClose}>
              <i className="bi bi-x-lg" style={{ fontSize: '20px' }}></i>
            </button>

            {/* Decorative Flowers */}
            <div className="promo-decorative-flower flower-1">🌸</div>
            <div className="promo-decorative-flower flower-2">🌺</div>
            <div className="promo-decorative-flower flower-3">🌸</div>
            <div className="promo-decorative-flower flower-4">🌺</div>

            {/* Decorative Circles */}
            <div className="promo-decorative-circle circle-1"></div>
            <div className="promo-decorative-circle circle-2"></div>
            <div className="promo-decorative-circle circle-3"></div>

            {/* Content */}
            <div className="promo-content-wrapper">
              <h2 className="promo-title">
                Tháng của Nàng 💖
              </h2>
              <h1 className="promo-subtitle">
                Nhận Ngàn Ưu Đãi
              </h1>

              {/* Badges */}
              <div className="promo-badges">
                <div className="promo-badge" style={{ position: 'relative' }}>
                  <div className="promo-badge-label">giảm giá</div>
                  <div className="promo-badge-value">50%</div>
                  <div className="promo-gift-box">🎁</div>
                </div>

                <div className="promo-badge">
                  <div className="promo-badge-label">trả góp</div>
                  <div className="promo-badge-value">0%</div>
                </div>

                <div className="promo-badge">
                  <div className="promo-badge-label">quà tặng</div>
                  <div className="promo-badge-value">HẤP DẪN</div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="promo-cta-button" onClick={handleClose}>
                <span style={{ position: 'relative', zIndex: 1 }}>Mua Ngay</span>
              </button>

              {/* Additional Info */}
              <p style={{ 
                marginTop: '20px', 
                color: 'white', 
                fontSize: '0.9rem',
                textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
              }}>
                ✨ Ưu đãi có giới hạn - Nhanh tay đặt hàng ngay hôm nay! ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

