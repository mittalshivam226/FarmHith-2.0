'use client';
import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (checkedOrEvent: any) => void;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', onChange, onCheckedChange, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        onChange={(e) => {
          if (onChange) onChange(e.target.checked);
          if (onCheckedChange) onCheckedChange(e.target.checked);
        }}
        className={`peer h-4 w-4 shrink-0 rounded-sm border border-emerald-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-emerald-600 ${className}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
