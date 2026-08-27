'use client';
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const taId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={taId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={taId}
          className={[
            'w-full rounded-md border bg-white px-3 py-3 md:py-2.5 text-sm text-slate-900',
            'placeholder:text-slate-400 resize-none transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            error ? 'border-error-500' : 'border-slate-200 hover:border-slate-300',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? `${taId}-error` : hint ? `${taId}-hint` : undefined}
        />
        {error && <p id={`${taId}-error`} className="mt-1.5 text-xs text-error-600 font-medium">{error}</p>}
        {hint && !error && <p id={`${taId}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
