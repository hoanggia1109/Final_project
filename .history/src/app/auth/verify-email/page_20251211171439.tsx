'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api-config';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Không tìm thấy token xác nhận');
      return;
    }

    // Gọi API xác nhận
    const verifyEmail = async () => {
      try {
        // Token đã được browser tự động decode từ URL, chỉ cần encode lại khi gửi lên API
        const apiUrl = `${API_BASE_URL}/api/auth/verify-email/${encodeURIComponent(token)}`;
        console.log('🔍 Đang gọi API xác nhận email:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Lỗi xác nhận email' }));
          console.error('❌ Lỗi từ API:', errorData);
          throw new Error(errorData.message || 'Lỗi xác nhận email');
        }
        
        const data = await response.json();
        console.log('✅ Dữ liệu từ API:', data);

        if (data.success) {
          if (data.alreadyVerified) {
            setStatus('already');
          } else {
            setStatus('success');
          }
          setMessage(data.message);
          setEmail(data.email || '');
        } else {
          setStatus('error');
          setMessage(data.message || 'Xác nhận thất bại');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xác nhận email');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5 text-center">
                {/* Loading */}
                {status === 'loading' && (
                  <>
                    <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h2 className="mb-3">Đang xác nhận email...</h2>
                    <p className="text-muted">Vui lòng chờ trong giây lát</p>
                  </>
                )}

                {/* Success */}
                {status === 'success' && (
                  <>
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                      </svg>
                    </div>
                    <h2 className="text-success mb-3">Xác nhận thành công! 🎉</h2>
                    <p className="text-muted mb-4">{message}</p>
                    {email && (
                      <p className="mb-4">
                        <strong>Email:</strong> {email}
                      </p>
                    )}
                    <div className="d-grid gap-2">
                      <Link href="/auth" className="btn btn-primary btn-lg">
                        Đăng nhập ngay
                      </Link>
                      <Link href="/" className="btn btn-outline-secondary">
                        Về trang chủ
                      </Link>
                    </div>
                  </>
                )}

                {/* Already Verified */}
                {status === 'already' && (
                  <>
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-info-circle-fill text-info" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                      </svg>
                    </div>
                    <h2 className="text-info mb-3">Email đã được xác nhận</h2>
                    <p className="text-muted mb-4">{message}</p>
                    <div className="d-grid gap-2">
                      <Link href="/auth" className="btn btn-primary btn-lg">
                        Đăng nhập
                      </Link>
                      <Link href="/" className="btn btn-outline-secondary">
                        Về trang chủ
                      </Link>
                    </div>
                  </>
                )}

                {/* Error */}
                {status === 'error' && (
                  <>
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                      </svg>
                    </div>
                    <h2 className="text-danger mb-3">Xác nhận thất bại</h2>
                    <p className="text-muted mb-4">{message}</p>
                    <div className="alert alert-warning" role="alert">
                      <strong>Lưu ý:</strong> Link xác nhận có thể đã hết hạn hoặc không hợp lệ.
                    </div>
                    <div className="d-grid gap-2">
                      <Link href="/register" className="btn btn-primary">
                        Đăng ký lại
                      </Link>
                      <Link href="/" className="btn btn-outline-secondary">
                        Về trang chủ
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4 text-muted">
              <small>
                Bạn cần hỗ trợ? <Link href="/contact" className="text-decoration-none">Liên hệ với chúng tôi</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

