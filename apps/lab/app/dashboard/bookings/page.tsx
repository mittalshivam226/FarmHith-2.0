'use client';
import React from 'react';
import Link from 'next/link';
import { DataTable, type Column, StatusBadge, SectionHeader } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import type { SoilTestBooking } from '@farmhith/types';
import { mockBookings } from '../../../lib/mock-data';

const columns: Column<SoilTestBooking>[] = [
  {
    key: 'farmerName', header: 'Farmer', sortable: true,
    render: (b) => <p className="font-medium text-gray-900">{b.farmerName}</p>,
  },
  { key: 'cropType', header: 'Crop', sortable: true },
  {
    key: 'collectionDate', header: 'Collection Date',
    render: (b) => formatDate(b.collectionDate),
    sortable: true,
  },
  {
    key: 'amountPaid', header: 'Amount',
    render: (b) => <span className="font-semibold">{formatCurrency(b.amountPaid)}</span>,
    sortable: true,
  },
  {
    key: 'status', header: 'Status',
    render: (b) => <StatusBadge status={b.status} size="sm" />,
  },
  {
    key: 'id', header: 'Action',
    render: (b) => (
      <Link href={`/dashboard/bookings/${b.id}`} className="text-xs text-blue-600 hover:underline font-medium">
        View →
      </Link>
    ),
  },
];

const STATUS_TABS = ['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export default function LabBookingsPage() {
  const [activeTab, setActiveTab] = React.useState<typeof STATUS_TABS[number]>('ALL');

  const filtered = activeTab === 'ALL'
    ? mockBookings
    : mockBookings.filter(b => b.status === activeTab);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="Bookings Inbox"
        description="All soil test bookings assigned to your lab"
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'ALL' ? `All (${mockBookings.length})` : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(b) => b.id}
        emptyTitle="No bookings"
        emptyDescription={`No ${activeTab.toLowerCase()} bookings found.`}
      />
    </div>
  );
}
