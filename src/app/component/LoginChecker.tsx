'use client';
import { useEffect } from 'react';

export default function LoginChecker() {
  useEffect(() => {
    // Check localStorage ngay khi trang load
    console.log('🔍 LoginChecker - Checking localStorage on page load...');
    
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    
    console.log('📦 LocalStorage Contents:', {
      hasToken: !!token,
      token: token ? token.substring(0, 30) + '...' : 'KHÔNG CÓ',
      userName: userName || 'KHÔNG CÓ',
      userEmail: userEmail || 'KHÔNG CÓ',
      userRole: userRole || 'KHÔNG CÓ'
    });
    
    if (token && userEmail) {
      console.log('✅ User IS logged in!');
      console.log('👤 User Info:', {
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        role: userRole || 'customer'
      });
      
      // Dispatch event để Header update
      try {
        window.dispatchEvent(new Event('loginSuccess'));
        window.dispatchEvent(new Event('storage'));
        console.log('📢 Dispatched login events');
      } catch (e) {
        console.error('Error dispatching events:', e);
      }
    } else {
      console.log('❌ User NOT logged in');
      if (!token) console.log('   → Missing token');
      if (!userEmail) console.log('   → Missing email');
    }
  }, []);

  return null; // This component doesn't render anything
}

