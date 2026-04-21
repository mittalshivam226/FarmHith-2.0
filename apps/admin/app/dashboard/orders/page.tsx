'use client';
import React from 'react';
import { SectionHeader, StatCard, StatusBadge, DataTable, type Column } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import type { ProcurementOrder } from '@farmhith/types';
import { useAllProcurementOrders } from '@farmhith/hooks';
import { ShoppingCart, CheckCircle, TrendingUp, Clock, Loader2 } from 'lucide-react';

const STATUS_TABS = ['ALL', 'INTERESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;

const columns: Column<ProcurementOrder>[] = [
  { key: 'id', header: 'Order ID', render: (o) => <span className="text-xs font-mono text-gray-400">{o.id.slice(0, 10)}</span> },
  { key: 'farmerName', header: 'Farmer', sortable: true, render: (o) => <p className="font-medium text-gray-900">{o.farmerName}</p> },
  { key: 'plantName', header: 'Plant', sortable: true },
  { key: 'listingResidueType', header: 'Residue Type' },
  {
    key: 'finalQuantityTons', header: 'Qty (tons)',
    render: (o) => <span className="font-semibold">{o.finalQuantityTons}</span>,
    sortable: true,
  },
  {
    key: 'totalAmount', header: 'Total Amount',
    render: (o) => <span className="font-semibold">{formatCurrency(o.totalAmount)}</span>,
    sortable: true,
  },
  {
    key: 'createdAt', header: 'Date',
    render: (o) => formatDate(o.createdAt),
    sortable: true,
  },
  { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} size="sm" /> },
];

export default function AdminOrdersPage() {
  const [tab, setTab] = React.useState<typeof STATUS_TABS[number]>('ALL');
  const { data: orders, loading } = useAllProcurementOrders();

  const filtered         = tab === 'ALL' ? orders : orders.filter(o => o.status === tab);
  const pendingCount     = orders.filter(o => o.status === 'INTERESTED').length;
  const completedCount   = orders.filter(o => o.status === 'COMPLETED').length;
  const totalGMV         = orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader title="Procurement Orders" description="All bio-pellet plant procurement orders" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Pending Interest" value={loading ? '—' : pendingCount}             icon={<Clock size={20} />}          accent="amber" />
        <StatCard label="Completed Orders" value={loading ? '—' : completedCount}           icon={<CheckCircle size={20} />}    accent="green" />
        <StatCard label="Total GMV"        value={loading ? '—' : formatCurrency(totalGMV)} icon={<TrendingUp size={20} />}    accent="purple" />
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'ALL' ? `All (${orders.length})` : t}
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
          keyExtractor={(o) => o.id}
          emptyTitle="No orders found"
          emptyDescription="No procurement orders match this filter."
        />
      )}
    </div>
  );
}
