'use client';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variants: Record<string, string> = {
  primary:
    'bg-primary-500 text-slate-950 hover:bg-primary-400 active:bg-primary-600 shadow-glow-sm hover:shadow-glow-md focus-visible:ring-primary-400 font-semibold',
  secondary:
    'bg-slate-800/80 backdrop-blur-md text-slate-100 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 focus-visible:ring-slate-500 shadow-sm hover:shadow-glow-sm',
  ghost:
    'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus-visible:ring-slate-500',
  outline:
    'bg-transparent text-primary-400 border border-primary-500/50 hover:bg-primary-500/10 hover:border-primary-400 hover:shadow-glow-sm focus-visible:ring-primary-400',
  destructive:
    'bg-error-500 text-white hover:bg-error-400 active:bg-error-600 focus-visible:ring-error-400',
};

/* Danger is an alias for destructive — keeps backward compat */
(variants as Record<string, string>).danger = variants.destructive;

const sizes: Record<string, string> = {
  sm: 'h-10 md:h-8 px-3 text-sm gap-1.5',
  md: 'h-11 md:h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      asChild: _asChild,
      ...props
    },
    ref,
  ) => {
    const isActivelyLoading = loading || isLoading;
    return (
      <button
        ref={ref}
        disabled={disabled || isActivelyLoading}
        className={[
          'inline-flex items-center justify-center font-semibold rounded-md',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant] ?? variants.primary,
          sizes[size],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {isActivelyLoading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isActivelyLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isActivelyLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);
Button.displayName = 'Button';
