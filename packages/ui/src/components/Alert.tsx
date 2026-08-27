'use client';
import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const config: Record<AlertVariant, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-success-50 border-success-200 text-success-700',
    icon: <CheckCircle size={18} className="text-success-600 shrink-0 mt-0.5" />,
  },
  warning: {
    bg: 'bg-warning-50 border-warning-200 text-warning-700',
    icon: <AlertTriangle size={18} className="text-warning-600 shrink-0 mt-0.5" />,
  },
  error: {
    bg: 'bg-error-50 border-error-200 text-error-700',
    icon: <XCircle size={18} className="text-error-600 shrink-0 mt-0.5" />,
  },
  info: {
    bg: 'bg-info-50 border-info-200 text-info-700',
    icon: <Info size={18} className="text-info-600 shrink-0 mt-0.5" />,
  },
};

export function Alert({ variant = 'info', title, children, onDismiss, className = '' }: AlertProps) {
  const { bg, icon } = config[variant];
  return (
    <div
      role="alert"
      className={`
        flex gap-3 px-4 py-3 rounded-md border
        ${bg}
        ${className}
      `}
    >
      {icon}
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold mb-0.5">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-0.5 rounded text-current opacity-60 hover:opacity-100 shrink-0"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
