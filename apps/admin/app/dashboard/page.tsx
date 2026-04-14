'use client';
import React from 'react';
import Link from 'next/link';
import { StatCard, Card, SectionHeader, StatusBadge, DataTable, type Column } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useAllUsers, useAllSoilTestBookings, useAllPayments } from '@farmhith/hooks';
import type { User } from '@farmhith/types';
import { Users, ClipboardList, TrendingUp, ShoppingBasket, BarChart2, ArrowRight, Loader2 } from 'lucide-react';

const userColumns: Column<User & { createdAt: string }>[] = [
  { key: 'id', header: 'ID', render: (u) => <span className="text-xs text-gray-400">{u.id.slice(0, 8)}</span> },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', render: (u) => <StatusBadge status={u.role} size="sm" /> },
  { key: 'createdAt', header: 'Joined', render: (u) => u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—' },
];

export default function AdminDashboard() {
  const { data: users, loading: loadingUsers }       = useAllUsers();
  const { data: bookings, loading: loadingBookings } = useAllSoilTestBookings();
  const { data: payments, loading: loadingPayments } = useAllPayments();

  // Derived platform stats
  const totalFarmers  = users.filter(u => u.role === 'FARMER').length;
  const totalLabs     = users.filter(u => u.role === 'LAB').length;
  const totalMitras   = users.filter(u => u.role === 'SOILMITRA').length;
  const totalPlants   = users.filter(u => u.role === 'BIOPELLET').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const completionRate = bookings.length > 0
    ? Math.round((completedCount / bookings.length) * 100)
    : 0;
  const totalRevenue  = payments.reduce((s, p) => s + (p.grossAmount ?? 0), 0);

  const isLoading = loadingUsers || loadingBookings || loadingPayments;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-sm text-gray-500 mt-1">FarmHith Admin — real-time platform metrics</p>
      </div>

      {/* User role stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Farmers"     value={loadingUsers ? '—' : totalFarmers.toLocaleString('en-IN')} icon={<Users size={20} />} accent="green" />
        <StatCard label="Verified Labs"     value={loadingUsers ? '—' : totalLabs}     icon={<ClipboardList size={20} />} accent="blue" />
        <StatCard label="Active Mitras"     value={loadingUsers ? '—' : totalMitras}   icon={<Users size={20} />} accent="teal" />
        <StatCard label="Bio-Pellet Plants" value={loadingUsers ? '—' : totalPlants}   icon={<ShoppingBasket size={20} />} accent="purple" />
      </div>

      {/* Booking stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings"   value={loadingBookings ? '—' : bookings.length}          icon={<ClipboardList size={20} />} accent="amber" />
        <StatCard label="Completed"        value={loadingBookings ? '—' : completedCount}            icon={<TrendingUp size={20} />} accent="green" />
        <StatCard label="Platform Revenue" value={loadingPayments ? '—' : formatCurrency(totalRevenue)} icon={<ShoppingBasket size={20} />} accent="purple" />
        <StatCard label="Completion Rate"  value={loadingBookings ? '—' : `${completionRate}%`}      icon={<BarChart2 size={20} />} accent="teal" />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <Card>
          <SectionHeader
            title="Recent Bookings"
            action={<Link href="/dashboard/bookings" className="text-xs text-green-600 hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>}
          />
          {loadingBookings ? (
            <div className="flex justify-center py-8"><Loader2 size={18} className="animate-spin text-gray-400" /></div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No bookings yet.</p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 5).map(b => (
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
          )}
        </Card>

        {/* Payment ledger preview */}
        <Card>
          <SectionHeader
            title="Recent Payments"
            action={<Link href="/dashboard/payments" className="text-xs text-green-600 hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>}
          />
          {loadingPayments ? (
            <div className="flex justify-center py-8"><Loader2 size={18} className="animate-spin text-gray-400" /></div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No payments yet.</p>
          ) : (
            <div className="space-y-2">
              {payments.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.payerName} → {p.payeeName}</p>
                    <p className="text-xs text-gray-500">{p.serviceType?.replace('_', ' ')} · Commission: {formatCurrency(p.platformCommission)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-700">{formatCurrency(p.grossAmount)}</span>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
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
        {loadingUsers ? (
          <div className="flex justify-center py-8"><Loader2 size={18} className="animate-spin text-gray-400" /></div>
        ) : (
          <DataTable
            columns={userColumns}
            data={users.slice(0, 10)}
            keyExtractor={(u) => u.id}
            emptyTitle="No users found"
          />
        )}
      </Card>
    </div>
  );
}
