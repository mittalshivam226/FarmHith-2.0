'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-700 shadow-sm
        ${paddingClasses[padding]}
        ${hover ? 'transition-shadow duration-150 hover:shadow-glow-sm hover:border-slate-600 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`flex flex-col space-y-1.5 p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <h3 className={`text-base font-semibold leading-none tracking-tight text-slate-100 ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
