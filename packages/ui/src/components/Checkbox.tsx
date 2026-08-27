'use client';
import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  description?: string;
  onChange?: (checkedOrEvent: any) => void;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, onChange, onCheckedChange, id, ...props }, ref) => {
    const uid = id ?? `checkbox-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          ref={ref}
          id={uid}
          onChange={(e) => {
            if (onChange) onChange(e.target.checked);
            if (onCheckedChange) onCheckedChange(e.target.checked);
          }}
          className={`
            mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-slate-300
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

Checkbox.displayName = 'Checkbox';
