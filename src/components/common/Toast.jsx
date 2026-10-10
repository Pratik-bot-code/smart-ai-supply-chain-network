import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage, clearToast } = useApp();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success': return <CheckCircle2 size={18} color="#10b981" />;
      case 'warning': return <AlertTriangle size={18} color="#f59e0b" />;
      default: return <Info size={18} color="#38bdf8" />;
    }
  };

  const getBorderColor = () => {
    switch (toastMessage.type) {
      case 'success': return 'rgba(16, 185, 129, 0.4)';
      case 'warning': return 'rgba(245, 158, 11, 0.4)';
      default: return 'rgba(6, 182, 212, 0.4)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      background: 'rgba(20, 23, 33, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${getBorderColor()}`,
      borderRadius: 'var(--radius-md)',
      padding: '0.875rem 1.25rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(99, 102, 241, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      maxWidth: '420px',
      animation: 'slideInUp 0.3s ease-out'
    }}>
      <div>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
          {toastMessage.title}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {toastMessage.message}
        </div>
      </div>
      <button 
        onClick={clearToast}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;

