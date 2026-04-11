'use client';
import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
};

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────────
type BookingStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type OrderStatus = 'INTERESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
type ListingStatus = 'ACTIVE' | 'MATCHED' | 'SOLD' | 'EXPIRED';
type SessionStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

type AnyStatus = BookingStatus | OrderStatus | ListingStatus | SessionStatus | string;

const statusMap: Record<string, BadgeVariant> = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
  INTERESTED: 'purple',
  CONFIRMED: 'info',
  ACTIVE: 'success',
  MATCHED: 'info',
  SOLD: 'default',
  EXPIRED: 'default',
};

const statusLabel: Record<string, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  INTERESTED: 'Interested',
  CONFIRMED: 'Confirmed',
  ACTIVE: 'Active',
  MATCHED: 'Matched',
  SOLD: 'Sold',
  EXPIRED: 'Expired',
};

interface StatusBadgeProps {
  status: AnyStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const variant = statusMap[status] ?? 'default';
  const label = statusLabel[status] ?? status;
  return <Badge variant={variant} size={size}>{label}</Badge>;
}
