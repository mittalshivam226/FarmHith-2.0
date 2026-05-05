'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatCard, StatusBadge, Card, SectionHeader } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useLabInbox } from '@farmhith/hooks';
import { ClipboardList, CheckCircle, Clock, TrendingUp, Upload, ArrowRight, Loader2 } from 'lucide-react';

export default function LabDashboard() {
  const { user } = useAuth();
  const labId = user?.id;

  const { data: bookings, loading } = useLabInbox(labId);

  const pendingCount   = bookings.filter(b => b.status === 'PENDING').length;
  const acceptedCount  = bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const pendingReports = bookings.filter(b => b.status === 'IN_PROGRESS' && !b.report).length;

  const labProfile = user?.profile as any;
  const dailyCapacity = labProfile?.dailyCapacity || 15;
  const totalBooked   = pendingCount + acceptedCount;
  const capacityPct   = Math.min(100, Math.round((totalBooked / dailyCapacity) * 100));

  // Revenue is estimated from completed bookings (real payment tracking comes later)
  const estimatedRevenue = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((s, b) => s + b.amountPaid, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lab Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.name} — Today&apos;s overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending" value={loading ? '—' : pendingCount} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="In Progress" value={loading ? '—' : acceptedCount} icon={<ClipboardList size={20} />} accent="blue" />
        <StatCard label="Completed" value={loading ? '—' : completedCount} icon={<CheckCircle size={20} />} accent="green" />
        <StatCard label="Revenue" value={loading ? '—' : formatCurrency(estimatedRevenue)} icon={<TrendingUp size={20} />} accent="purple" />
      </div>

      {/* Capacity bar */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Today&apos;s Capacity</h2>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{totalBooked} booked</span>
          <span>{dailyCapacity} daily limit</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              capacityPct >= 90 ? 'bg-red-500' : capacityPct >= 70 ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${capacityPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{capacityPct}% capacity used</p>
      </Card>

      {/* Recent bookings */}
      <Card>
        <SectionHeader
          title="Recent Bookings"
          action={
            <Link href="/dashboard/bookings" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          }
        />
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No bookings yet. Your inbox will fill up when farmers book your lab.</p>
          ) : (
            bookings.slice(0, 4).map(booking => (
              <Link
                key={booking.id}
                href={`/dashboard/bookings/${booking.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.farmerName}</p>
                  <p className="text-xs text-gray-500">{booking.cropType} · {formatDate(booking.collectionDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">{formatCurrency(booking.amountPaid)}</span>
                  <StatusBadge status={booking.status} size="sm" />
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>

      {/* Pending report uploads alert */}
      {!loading && pendingReports > 0 && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
          <Upload size={18} className="text-orange-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-orange-900">
              {pendingReports} report{pendingReports > 1 ? 's' : ''} pending upload
            </p>
            <p className="text-xs text-orange-700">Upload soil test reports for completed collections.</p>
          </div>
          <Link href="/dashboard/bookings" className="ml-auto text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors">
            Upload Now
          </Link>
        </div>
      )}
    </div>
  );
}
