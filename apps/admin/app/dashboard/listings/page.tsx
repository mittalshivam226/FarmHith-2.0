'use client';
import React from 'react';
import { SectionHeader, StatCard, StatusBadge, DataTable, type Column } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import type { CropListing } from '@farmhith/types';
import { useAllCropListingsAdmin } from '@farmhith/hooks';
import { ShoppingBasket, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';

const STATUS_TABS = ['ALL', 'ACTIVE', 'MATCHED', 'SOLD', 'EXPIRED'] as const;

const columns: Column<CropListing>[] = [
  { key: 'id', header: 'Listing ID', render: (l) => <span className="text-xs font-mono text-gray-400">{l.id.slice(0, 10)}</span> },
  { key: 'farmerName', header: 'Farmer', sortable: true, render: (l) => <p className="font-medium text-gray-900">{l.farmerName}</p> },
  { key: 'residueType', header: 'Residue Type', sortable: true },
  {
    key: 'quantityTons', header: 'Qty (tons)',
    render: (l) => <span className="font-semibold">{l.quantityTons}</span>,
    sortable: true,
  },
  { key: 'location', header: 'Location', render: (l) => l.farmerDistrict + ', ' + l.farmerState },
  {
    key: 'farmhithPricePerTon', header: 'Price/ton',
    render: (l) => formatCurrency(l.farmhithPricePerTon),
    sortable: true,
  },
  {
    key: 'availableFrom', header: 'Available From',
    render: (l) => formatDate(l.availableFrom),
    sortable: true,
  },
  { key: 'status', header: 'Status', render: (l) => <StatusBadge status={l.status} size="sm" /> },
];

export default function AdminListingsPage() {
  const [tab, setTab] = React.useState<typeof STATUS_TABS[number]>('ALL');
  const { data: listings, loading } = useAllCropListingsAdmin();

  const filtered     = tab === 'ALL' ? listings : listings.filter(l => l.status === tab);
  const activeCount  = listings.filter(l => l.status === 'ACTIVE').length;
  const soldCount    = listings.filter(l => l.status === 'SOLD').length;
  const totalTons    = listings.reduce((s, l) => s + l.quantityTons, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader title="Crop Listings" description="All farmer crop residue listings on the marketplace" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active Listings" value={loading ? '—' : activeCount}                icon={<ShoppingBasket size={20} />} accent="green" />
        <StatCard label="Total Sold"       value={loading ? '—' : soldCount}                 icon={<CheckCircle size={20} />}    accent="blue" />
        <StatCard label="Total Tonnes"     value={loading ? '—' : totalTons.toLocaleString('en-IN')} icon={<TrendingUp size={20} />}  accent="amber" />
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'ALL' ? `All (${listings.length})` : t}
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
          keyExtractor={(l) => l.id}
          emptyTitle="No listings found"
          emptyDescription="No crop listings match this filter."
        />
      )}
    </div>
  );
}
