'use client';
import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="mb-4 flex items-center justify-center h-14 w-14 rounded-lg bg-slate-100 text-slate-400">
        {icon ?? <Inbox size={24} />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs mb-5">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
