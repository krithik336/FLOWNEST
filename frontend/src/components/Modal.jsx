import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-brand-border bg-brand-surface text-brand-text shadow-2xl animate-scale-in"
        style={{
          animation: 'modal-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
          <h3 className="text-lg font-bold text-brand-text tracking-wide font-display">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-brand-surface-light text-brand-text/50 hover:text-brand-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Embedded animations */}
        <style>{`
          @keyframes modal-enter {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Modal;
