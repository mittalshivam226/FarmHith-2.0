'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatCard, StatusBadge, Card, SectionHeader } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { ClipboardList, CheckCircle, Clock, TrendingUp, Upload, ArrowRight } from 'lucide-react';
import { mockBookings, mockPayments } from '../../lib/mock-data';

export default function LabDashboard() {
  const { user } = useAuth();

  const pendingCount    = mockBookings.filter(b => b.status === 'PENDING').length;
  const acceptedCount   = mockBookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length;
  const completedCount  = mockBookings.filter(b => b.status === 'COMPLETED').length;
  const pendingReports  = mockBookings.filter(b => b.status === 'IN_PROGRESS' && !b.report).length;
  const dailyCapacity   = 15;
  const totalBooked     = pendingCount + acceptedCount;
  const capacityPct     = Math.min(100, Math.round((totalBooked / dailyCapacity) * 100));

  const totalRevenue = mockPayments
    .filter(p => p.status === 'SETTLED' || p.status === 'CAPTURED')
    .reduce((s, p) => s + p.grossAmount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lab Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.name} — Today&apos;s overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending" value={pendingCount} icon={<Clock size={20} />} accent="amber" />
        <StatCard label="In Progress" value={acceptedCount} icon={<ClipboardList size={20} />} accent="blue" />
        <StatCard label="Completed" value={completedCount} icon={<CheckCircle size={20} />} accent="green" />
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={<TrendingUp size={20} />} accent="purple" />
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
          {mockBookings.slice(0, 4).map(booking => (
            <Link
              key={booking.id}
              href={`/dashboard/bookings/${booking.id}`}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.farmerName}</p>
                <p className="text-xs text-gray-500">{booking.cropType} · {booking.collectionDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">{formatCurrency(booking.amountPaid)}</span>
                <StatusBadge status={booking.status} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Pending report uploads */}
      {pendingReports > 0 && (
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
