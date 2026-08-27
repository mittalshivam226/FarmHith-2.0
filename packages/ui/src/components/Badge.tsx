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
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  error:   'bg-error-50 text-error-700',
  info:    'bg-info-50 text-info-700',
  purple:  'bg-purple-100 text-purple-800',
};

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-sm
        ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px] leading-tight' : 'px-2 py-0.5 text-xs'}
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
  SETTLED: 'success',
  CAPTURED: 'info',
  FARMER: 'success',
  LAB: 'info',
  SOILMITRA: 'default',
  BIOPELLET: 'purple',
  ADMIN: 'error',
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
  SETTLED: 'Settled',
  CAPTURED: 'Captured',
  FARMER: 'Farmer',
  LAB: 'Lab',
  SOILMITRA: 'Soil-Mitra',
  BIOPELLET: 'Bio-Pellet',
  ADMIN: 'Admin',
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
