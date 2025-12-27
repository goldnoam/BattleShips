
import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  primaryAction?: { label: string; onClick: () => void };
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, primaryAction, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
      
      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-[scale_0.3s_ease-out]">
        <div className="p-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"></div>
        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-100 mb-2">{title}</h2>
          {children}
          
          <div className="mt-8 flex gap-4">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="flex-1 py-4 bg-white text-slate-950 font-black rounded-xl hover:bg-slate-200 transition-all shadow-lg active:scale-95"
              >
                {primaryAction.label}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-4 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
