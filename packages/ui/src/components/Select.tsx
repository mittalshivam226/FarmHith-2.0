'use client';
import React from 'react';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (valueOrEvent: any) => void;
  onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, onValueChange, onChange, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
            if (onValueChange) onValueChange(e.target.value);
          }}
          className={[
            'w-full rounded-md border bg-white px-3 py-3 md:py-2.5 text-sm text-slate-900',
            'transition-colors duration-150 appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            error ? 'border-error-500' : 'border-slate-200 hover:border-slate-300',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p id={`${selectId}-error`} className="mt-1.5 text-xs text-error-600 font-medium">{error}</p>}
        {hint && !error && <p id={`${selectId}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
