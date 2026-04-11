'use client';
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
}

export function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const base = 'animate-pulse bg-gray-100';
  const shape =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'line'
      ? 'rounded h-4'
      : 'rounded-xl';

  return <div className={`${base} ${shape} ${className}`} />;
}

// Convenience: card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="line" className="w-3/4" />
          <Skeleton variant="line" className="w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24" />
      <div className="flex gap-3">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
}
