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
  default: 'bg-slate-800 border border-slate-700 text-slate-300 shadow-sm',
  success: 'bg-success-500/10 text-success-400 border border-success-500/20 shadow-glow-sm',
  warning: 'bg-warning-500/10 text-warning-400 border border-warning-500/20 shadow-glow-sm',
  error:   'bg-error-500/10 text-error-400 border border-error-500/20 shadow-glow-sm',
  info:    'bg-info-500/10 text-info-400 border border-info-500/20 shadow-glow-sm',
  purple:  'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-glow-sm',
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
