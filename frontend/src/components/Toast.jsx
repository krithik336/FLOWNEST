/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onClose }) => {
  const { message, type } = toast;

  const typeConfig = {
    success: {
      bg: 'bg-brand-surface border-brand-accent/30 text-brand-text',
      icon: <CheckCircle className="w-5 h-5 text-brand-accent shrink-0" />,
      accentBar: 'bg-brand-accent',
    },
    error: {
      bg: 'bg-brand-surface border-red-500/30 text-brand-text',
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
      accentBar: 'bg-red-500',
    },
    warning: {
      bg: 'bg-brand-surface border-yellow-500/30 text-brand-text',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />,
      accentBar: 'bg-yellow-500',
    },
    info: {
      bg: 'bg-brand-surface border-blue-500/30 text-brand-text',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
      accentBar: 'bg-blue-500',
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-2xl backdrop-blur-md animate-slide-in relative overflow-hidden transition-all duration-300 ${config.bg}`}
      style={{
        animation: 'toast-enter 0.3s ease-out forwards',
      }}
    >
      {/* Side Color Highlight bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentBar}`} />
      
      <div className="flex items-center gap-3 pl-1">
        {config.icon}
        <span className="text-sm font-medium leading-relaxed">{message}</span>
      </div>

      <button
        onClick={onClose}
        className="ml-4 p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-brand-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Embedded inline keyframes for entering toast */}
      <style>{`
        @keyframes toast-enter {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
