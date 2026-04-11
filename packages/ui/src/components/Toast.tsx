'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

// ─── Internal single toast component ─────────────────────────────────────────
const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-green-600" />,
  error:   <XCircle size={16} className="text-red-500" />,
  warning: <AlertCircle size={16} className="text-amber-500" />,
  info:    <Info size={16} className="text-blue-500" />,
};

const bg: Record<ToastVariant, string> = {
  success: 'border-green-200 bg-green-50',
  error:   'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info:    'border-blue-200 bg-blue-50',
};

function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg w-80
        ${bg[toast.variant]}
        animate-in slide-in-from-right-4 fade-in duration-300
      `}
    >
      <div className="mt-0.5 shrink-0">{icons[toast.variant]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-gray-600 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Context ──────────────────────────────────────────────────────────────────
type AddToastFn = (opts: Omit<ToastMessage, 'id'>) => void;
const ToastCtx = createContext<AddToastFn>(() => {});

export function useToast(): AddToastFn {
  return useContext(ToastCtx);
}

// ─── ToastContainer — wrap your layout with this ─────────────────────────────
export function ToastContainer({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((opts: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? 4000;
    setToasts((t) => [...t, { ...opts, id }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      {/* Portal-like fixed container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
