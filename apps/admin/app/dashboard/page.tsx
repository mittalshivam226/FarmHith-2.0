'use client';
import React from 'react';
import Link from 'next/link';
import { StatCard, Card, SectionHeader, StatusBadge, DataTable, type Column } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { Users, ClipboardList, TrendingUp, ShoppingBasket, BarChart2, CreditCard, ArrowRight } from 'lucide-react';
import { mockStats, allBookings, allPayments, mockUsers } from '../../lib/mock-data';
import type { User } from '@farmhith/types';

const userColumns: Column<User>[] = [
  { key: 'id', header: 'ID', render: (u) => <span className="text-xs text-gray-400">{u.id.slice(0, 8)}</span> },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', render: (u) => <StatusBadge status={u.role} size="sm" /> },
  { key: 'createdAt', header: 'Joined', render: (u) => new Date(u.createdAt).toLocaleDateString('en-IN') },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-sm text-gray-500 mt-1">FarmHith Admin — real-time platform metrics</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Farmers" value={mockStats.totalFarmers.toLocaleString('en-IN')} icon={<Users size={20} />} accent="green" />
        <StatCard label="Verified Labs"  value={mockStats.totalLabs}      icon={<ClipboardList size={20} />} accent="blue" />
        <StatCard label="Active Mitras" value={mockStats.totalMitras}    icon={<Users size={20} />} accent="teal" />
        <StatCard label="Bio-Pellet Plants" value={mockStats.totalPlants} icon={<ShoppingBasket size={20} />} accent="purple" />
      </div>

      {/* Today metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Bookings Today" value={mockStats.bookingsToday} icon={<ClipboardList size={20} />} accent="amber" />
        <StatCard label="Revenue Today"  value={formatCurrency(mockStats.revenueToday)} icon={<TrendingUp size={20} />} accent="green" />
        <StatCard label="Active Listings" value={mockStats.activeListings} icon={<ShoppingBasket size={20} />} accent="purple" />
        <StatCard label="Completion Rate" value={`${mockStats.completionRate}%`} icon={<BarChart2 size={20} />} accent="teal" />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <Card>
          <SectionHeader
            title="Recent Bookings"
            action={<Link href="/dashboard/bookings" className="text-xs text-green-600 hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>}
          />
          <div className="space-y-2">
            {allBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.farmerName}</p>
                  <p className="text-xs text-gray-500">{b.labName} · {b.cropType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{formatCurrency(b.amountPaid)}</span>
                  <StatusBadge status={b.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment ledger preview */}
        <Card>
          <SectionHeader
            title="Recent Payments"
            action={<Link href="/dashboard/payments" className="text-xs text-green-600 hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>}
          />
          <div className="space-y-2">
            {allPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.payerName} → {p.payeeName}</p>
                  <p className="text-xs text-gray-500">{p.serviceType.replace('_', ' ')} · Commission: {formatCurrency(p.platformCommission)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-green-700">{formatCurrency(p.grossAmount)}</span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Users table */}
      <Card padding="none">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">User Management</h2>
            <p className="text-xs text-gray-500 mt-0.5">All registered platform users</p>
          </div>
          <Link href="/dashboard/users" className="text-xs text-green-600 hover:underline flex items-center gap-1">
            Manage all <ArrowRight size={12} />
          </Link>
        </div>
        <DataTable
          columns={userColumns}
          data={mockUsers}
          keyExtractor={(u) => u.id}
          emptyTitle="No users found"
        />
      </Card>
    </div>
  );
}
