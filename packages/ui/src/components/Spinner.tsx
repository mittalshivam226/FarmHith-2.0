'use client';
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

export function Spinner({ size = 'md', className = '', color = 'border-green-600' }: SpinnerProps) {
  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full border-2 border-transparent
        ${color} border-t-current animate-spin ${className}
      `}
    />
  );
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
