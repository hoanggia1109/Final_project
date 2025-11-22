'use client';
import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripePaymentForm({ onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // CHANGED: Đã xóa emoji/sticker khỏi console logs
  useEffect(() => {
    if (stripe && elements) {
      console.log('Stripe and Elements ready');
      setIsReady(true);
    } else {
      console.log('Waiting for Stripe and Elements...', {
        stripe: !!stripe,
        elements: !!elements
      });
      setIsReady(false);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required', // Chỉ redirect nếu cần thiết
    });

    if (error) {
      setMessage(error.message || 'Có lỗi xảy ra khi thanh toán');
      onError(error.message || 'Có lỗi xảy ra khi thanh toán');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Thanh toán thành công
      setProcessing(false);
      onSuccess();
    } else {
      // Đang xử lý, có thể redirect
      setMessage('Đang xử lý thanh toán...');
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Đang tải form thanh toán...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="p-3 border rounded-3"
        style={{
          background: '#ffffff',
          borderColor: '#e9ecef',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          minHeight: '200px',
        }}
      >
        {isReady ? (
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
            onReady={() => {
              // CHANGED: Đã xóa emoji/sticker khỏi console logs
              console.log('PaymentElement ready');
            }}
          />
        ) : (
          <div className="text-center py-4">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <small className="text-muted">Đang tải form nhập thẻ...</small>
          </div>
        )}
      </div>
      
      {message && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn text-white w-100 py-3 mt-4"
        style={{
          background: processing 
            ? 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' 
            : 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '16px',
          border: 'none',
          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        {processing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Đang xử lý thanh toán...
          </>
        ) : (
          <>
            Thanh toán ngay
            <i className="bi bi-credit-card ms-2"></i>
          </>
        )}
      </button>
    </form>
  );
}


