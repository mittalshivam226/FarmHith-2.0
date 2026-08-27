'use client';
import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  description?: string;
  onChange?: (checkedOrEvent: any) => void;
  onValueChange?: (value: string) => void;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className = '', label, description, onChange, onValueChange, id, value, ...props }, ref) => {
    const uid = id ?? `radio-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="flex items-start gap-2.5">
        <input
          type="radio"
          ref={ref}
          id={uid}
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
            if (onValueChange) onValueChange(e.target.value);
          }}
          className={`
            mt-0.5 h-4 w-4 shrink-0 border border-slate-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            accent-primary-500
            ${className}
          `}
          {...props}
        />
        {(label || description) && (
          <label htmlFor={uid} className="cursor-pointer select-none">
            {label && <p className="text-sm font-medium text-slate-900 leading-none">{label}</p>}
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
