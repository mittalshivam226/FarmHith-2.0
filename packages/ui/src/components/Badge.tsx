'use client';
import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'harvest';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  success: 'bg-primary-50 text-primary-700 border border-primary-200/80 font-semibold',
  harvest: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold',
  error:   'bg-red-50 text-red-700 border border-red-200/80 font-semibold',
  info:    'bg-sky-50 text-sky-700 border border-sky-200/80 font-semibold',
  purple:  'bg-purple-50 text-purple-700 border border-purple-200/80 font-semibold',
};

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${size === 'sm' ? 'px-2 py-0.5 text-[11px] leading-tight' : 'px-3 py-1 text-xs'}
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
  INTERESTED: 'harvest',
  CONFIRMED: 'info',
  ACTIVE: 'success',
  MATCHED: 'info',
  SOLD: 'default',
  EXPIRED: 'default',
  SETTLED: 'success',
  CAPTURED: 'success',
  FARMER: 'success',
  LAB: 'info',
  SOILMITRA: 'harvest',
  BIOPELLET: 'purple',
  ADMIN: 'error',
};

const statusLabel: Record<string, string> = {
  PENDING: '⏳ Pending',
  ACCEPTED: '✓ Accepted by Lab',
  IN_PROGRESS: '🔬 In Analysis',
  COMPLETED: '✓ Completed',
  CANCELLED: '✕ Cancelled',
  INTERESTED: '🟡 Buyer Interested',
  CONFIRMED: '🟢 Order Confirmed',
  ACTIVE: '🟢 Active Listing',
  MATCHED: '🤝 Matched',
  SOLD: '✓ Sold',
  EXPIRED: 'Expired',
  SETTLED: '✓ Payment Settled',
  CAPTURED: '✓ Paid',
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

