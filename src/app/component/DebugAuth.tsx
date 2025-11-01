'use client';
import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState({
    token: '',
    userName: '',
    userEmail: '',
    userRole: ''
  });

  const updateDebugInfo = () => {
    setDebugInfo({
      token: localStorage.getItem('token') || 'KHÔNG CÓ',
      userName: localStorage.getItem('userName') || 'KHÔNG CÓ',
      userEmail: localStorage.getItem('userEmail') || 'KHÔNG CÓ',
      userRole: localStorage.getItem('userRole') || 'KHÔNG CÓ'
    });
  };

  useEffect(() => {
    updateDebugInfo();
    
    const interval = setInterval(updateDebugInfo, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#FFC107' }}>
        🔍 DEBUG - LocalStorage
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong style={{ color: '#4CAF50' }}>Token:</strong>
        <div style={{ 
          wordBreak: 'break-all', 
          fontSize: '10px',
          color: debugInfo.token === 'KHÔNG CÓ' ? '#f44336' : '#8BC34A'
        }}>
          {debugInfo.token === 'KHÔNG CÓ' ? '❌ KHÔNG CÓ' : `✅ ${debugInfo.token.substring(0, 30)}...`}
        </div>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong style={{ color: '#2196F3' }}>User Name:</strong>
        <div style={{ color: debugInfo.userName === 'KHÔNG CÓ' ? '#f44336' : '#8BC34A' }}>
          {debugInfo.userName === 'KHÔNG CÓ' ? '❌ KHÔNG CÓ' : `✅ ${debugInfo.userName}`}
        </div>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong style={{ color: '#9C27B0' }}>User Email:</strong>
        <div style={{ 
          wordBreak: 'break-all',
          color: debugInfo.userEmail === 'KHÔNG CÓ' ? '#f44336' : '#8BC34A'
        }}>
          {debugInfo.userEmail === 'KHÔNG CÓ' ? '❌ KHÔNG CÓ' : `✅ ${debugInfo.userEmail}`}
        </div>
      </div>
      <div>
        <strong style={{ color: '#FF9800' }}>User Role:</strong>
        <div style={{ color: debugInfo.userRole === 'KHÔNG CÓ' ? '#f44336' : '#8BC34A' }}>
          {debugInfo.userRole === 'KHÔNG CÓ' ? '❌ KHÔNG CÓ' : `✅ ${debugInfo.userRole}`}
        </div>
      </div>
      <button
        onClick={updateDebugInfo}
        style={{
          marginTop: '10px',
          background: '#FFC107',
          border: 'none',
          color: 'black',
          padding: '5px 10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        🔄 Refresh
      </button>
      <button
        onClick={() => {
          localStorage.clear();
          updateDebugInfo();
          window.location.reload();
        }}
        style={{
          marginTop: '5px',
          background: '#f44336',
          border: 'none',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        🗑️ Clear All
      </button>
    </div>
  );
}

