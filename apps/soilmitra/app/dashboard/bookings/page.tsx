'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatusBadge, SectionHeader, DataTable, type Column, QueryState } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import type { MitraBooking } from '@farmhith/types';
import { useMitraSchedule } from '@farmhith/hooks';
// Removed Loader2

const columns: Column<MitraBooking>[] = [
  {
    key: 'farmerName', header: 'Farmer', sortable: true,
    render: (s) => <p className="font-medium text-gray-900">{s.farmerName}</p>,
  },
  { key: 'cropType', header: 'Crop', render: (s) => s.cropType ?? '—' },
  {
    key: 'sessionDatetime', header: 'Session Date',
    render: (s) => formatDate(s.sessionDatetime),
    sortable: true,
  },
  { key: 'durationMinutes', header: 'Duration', render: (s) => `${s.durationMinutes} min` },
  {
    key: 'amountPaid', header: 'Fee',
    render: (s) => <span className="font-semibold">{formatCurrency(s.amountPaid)}</span>,
    sortable: true,
  },
  {
    key: 'status', header: 'Status',
    render: (s) => <StatusBadge status={s.status} size="sm" />,
  },
  {
    key: 'id', header: '',
    render: (s) => (
      <Link href={`/dashboard/sessions/${s.id}`} className="text-xs text-teal-600 hover:underline font-medium">
        View →
      </Link>
    ),
  },
];

const TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;

export default function SoilmitraSessionsPage() {
  const { user } = useAuth();
  const [tab, setTab] = React.useState<typeof TABS[number]>('ALL');
  const { data: sessions, loading, error } = useMitraSchedule(user?.id);

  const filtered = tab === 'ALL' ? sessions : sessions.filter(s => s.status === tab);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="My Sessions"
        description="All farmer consultation sessions"
      />

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'ALL' ? `All (${sessions.length})` : t}
          </button>
        ))}
      </div>

      <QueryState
        loading={loading}
        error={error}
        empty={sessions.length === 0}
        emptyProps={{
          title: "No sessions",
          description: "No sessions found for this filter."
        }}
      >
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id}
          emptyTitle="No sessions"
          emptyDescription="No sessions found for this filter."
        />
      </QueryState>
    </div>
  );
}
