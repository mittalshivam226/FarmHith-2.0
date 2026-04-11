'use client';
import React from 'react';
import { Card, SectionHeader, StatusBadge, StatCard, DataTable, type Column } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import type { SoilTestBooking } from '@farmhith/types';
import { allBookings, allPayments, mockStats } from '../../../lib/mock-data';
import { ClipboardList, TrendingUp, CheckCircle } from 'lucide-react';

const columns: Column<SoilTestBooking>[] = [
  { key: 'id', header: 'Booking ID', render: (b) => <span className="text-xs font-mono">{b.id}</span> },
  { key: 'farmerName', header: 'Farmer', sortable: true },
  { key: 'labName', header: 'Lab', sortable: true },
  { key: 'cropType', header: 'Crop' },
  { key: 'collectionDate', header: 'Date', render: (b) => formatDate(b.collectionDate), sortable: true },
  { key: 'amountPaid', header: 'Amount', render: (b) => <span className="font-semibold">{formatCurrency(b.amountPaid)}</span>, sortable: true },
  { key: 'status', header: 'Status', render: (b) => <StatusBadge status={b.status} size="sm" /> },
];

const STATUS_TABS = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export default function AdminBookingsPage() {
  const [tab, setTab] = React.useState<typeof STATUS_TABS[number]>('ALL');
  const filtered = tab === 'ALL' ? allBookings : allBookings.filter(b => b.status === tab);

  const totalRevenue = allBookings.reduce((s, b) => s + b.amountPaid, 0);
  const completedCount = allBookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader title="All Bookings" description="Platform-wide soil test booking management" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Bookings" value={allBookings.length} icon={<ClipboardList size={20} />} accent="blue" />
        <StatCard label="Completed" value={completedCount} icon={<CheckCircle size={20} />} accent="green" />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={<TrendingUp size={20} />} accent="purple" />
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'ALL' ? `All (${allBookings.length})` : t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(b) => b.id}
        emptyTitle="No bookings"
        emptyDescription="No bookings match this filter."
      />
    </div>
  );
}
