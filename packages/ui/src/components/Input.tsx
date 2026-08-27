'use client';
import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftElement, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-md border bg-slate-800 px-3 py-3 md:py-2.5 text-sm text-slate-100',
              'placeholder:text-slate-400 transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:shadow-glow-sm',
              'disabled:bg-slate-800/50 disabled:text-slate-600 disabled:cursor-not-allowed',
              error
                ? 'border-error-500 focus:ring-error-400'
                : 'border-slate-600 hover:border-slate-500',
              leftElement ? 'pl-10' : '',
              rightElement ? 'pr-10' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          />
          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightElement}
            </span>
          )}
        </div>
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-xs text-error-500 font-medium">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-400">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
