'use client';
import React from 'react';
import { SectionHeader, StatCard, StatusBadge, DataTable, type Column } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import type { MitraBooking } from '@farmhith/types';
import { useAllMitraSessions } from '@farmhith/hooks';
import { CalendarDays, CheckCircle, Clock, TrendingUp, Loader2, Video } from 'lucide-react';

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;

const columns: Column<MitraBooking>[] = [
  { key: 'id', header: 'Session ID', render: (s) => <span className="text-xs font-mono text-gray-400">{s.id.slice(0, 10)}</span> },
  { key: 'farmerName', header: 'Farmer', sortable: true, render: (s) => <p className="font-medium text-gray-900">{s.farmerName}</p> },
  { key: 'mitraName', header: 'Soil-Mitra', sortable: true },
  { key: 'cropType', header: 'Crop', render: (s) => s.cropType ?? '—' },
  {
    key: 'sessionDatetime', header: 'Session Date', sortable: true,
    render: (s) => formatDate(s.sessionDatetime),
  },
  {
    key: 'amountPaid', header: 'Amount',
    render: (s) => <span className="font-semibold">{formatCurrency(s.amountPaid)}</span>,
    sortable: true,
  },
  { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} size="sm" /> },
  {
    key: 'videoRoomUrl', header: 'Room',
    render: (s) => s.videoRoomUrl
      ? <a href={s.videoRoomUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-600 hover:underline text-xs font-medium"><Video size={12} /> Join</a>
      : <span className="text-xs text-gray-400">—</span>,
  },
];

export default function AdminSessionsPage() {
  const [tab, setTab] = React.useState<typeof STATUS_TABS[number]>('ALL');
  const { data: sessions, loading } = useAllMitraSessions();

  const filtered       = tab === 'ALL' ? sessions : sessions.filter(s => s.status === tab);
  const totalRevenue   = sessions.reduce((s, b) => s + b.amountPaid, 0);
  const completedCount = sessions.filter(s => s.status === 'COMPLETED').length;
  const confirmedCount = sessions.filter(s => s.status === 'CONFIRMED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader title="Mitra Sessions" description="Platform-wide Soil-Mitra session management" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sessions"  value={loading ? '—' : sessions.length}            icon={<CalendarDays size={20} />} accent="teal" />
        <StatCard label="Confirmed"       value={loading ? '—' : confirmedCount}             icon={<Clock size={20} />}        accent="blue" />
        <StatCard label="Completed"       value={loading ? '—' : completedCount}             icon={<CheckCircle size={20} />}  accent="green" />
        <StatCard label="Total Revenue"   value={loading ? '—' : formatCurrency(totalRevenue)} icon={<TrendingUp size={20} />} accent="purple" />
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'ALL' ? `All (${sessions.length})` : t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id}
          emptyTitle="No sessions found"
          emptyDescription="No mitra sessions match this filter."
        />
      )}
    </div>
  );
}
