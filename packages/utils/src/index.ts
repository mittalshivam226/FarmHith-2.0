// ─── CURRENCY ────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── DATES ────────────────────────────────────────────────────────────────────

/**
 * Normalises any date-like value to a JS Date.
 * Handles: ISO strings, JS Dates, and Firestore Timestamp objects
 * (which expose a `.toDate()` method but are not instanceof Date).
 */
function toDate(date: string | Date | unknown): Date {
  if (date && typeof (date as any).toDate === 'function') {
    return (date as any).toDate() as Date;
  }
  if (typeof date === 'string') return new Date(date);
  if (date instanceof Date) return date;
  // Fallback: try numeric milliseconds
  return new Date(date as any);
}

export function formatDate(date: string | Date | unknown, options?: Intl.DateTimeFormatOptions): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(d);
}

export function formatDateTime(date: string | Date | unknown): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: string | Date | unknown): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return '—';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(d);
}

export function getCountdown(targetDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isReady: boolean;
  isPast: boolean;
} {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isReady: true, isPast: true };
  }

  const isReady = diffMs <= 15 * 60 * 1000; // 15 minutes
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isReady, isPast: false };
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

export function calculateFarmhithPrice(
  procurementRate: number,
  commissionRate = 0.05,
): number {
  // Platform adds a small premium and takes commission from the total
  return Math.round(procurementRate * (1 - commissionRate));
}

// ─── STRINGS ─────────────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ─── IDS ─────────────────────────────────────────────────────────────────────

export function generateMockId(): string {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
}

export function generateTrackingId(): string {
  const prefix = 'FH';
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}-${num}`;
}

// ─── SOIL HEALTH ─────────────────────────────────────────────────────────────

export type SoilHealthLevel = 'Poor' | 'Fair' | 'Good' | 'Excellent';

export function getSoilHealthLevel(ph: number): SoilHealthLevel {
  if (ph < 5.5 || ph > 8.5) return 'Poor';
  if (ph < 6.0 || ph > 8.0) return 'Fair';
  if (ph < 6.5 || ph > 7.5) return 'Good';
  return 'Excellent';
}

export function getNitrogenLevel(value: number): SoilHealthLevel {
  if (value < 100) return 'Poor';
  if (value < 200) return 'Fair';
  if (value < 400) return 'Good';
  return 'Excellent';
}

// ─── ROLE HELPERS ─────────────────────────────────────────────────────────────

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    FARMER: 'Farmer',
    LAB: 'Soil Testing Lab',
    BIOPELLET: 'Bio-Pellet Plant',
    SOILMITRA: 'Soil-Mitra',
    ADMIN: 'Admin',
  };
  return labels[role] ?? role;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    FARMER:    'bg-primary-100 text-primary-800',
    LAB:       'bg-blue-100 text-blue-800',
    BIOPELLET: 'bg-slate-100 text-slate-800',
    SOILMITRA: 'bg-teal-100 text-teal-800',
    ADMIN:     'bg-purple-100 text-purple-800',
  };
  return colors[role] ?? 'bg-slate-100 text-slate-700';
}
