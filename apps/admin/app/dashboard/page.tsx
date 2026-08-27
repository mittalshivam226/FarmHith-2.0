'use client';
import React from 'react';
import Link from 'next/link';
import { StatCard, Card, SectionHeader, StatusBadge, DataTable, type Column, QueryState } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useAllUsers, useAllSoilTestBookings, useAllPayments } from '@farmhith/hooks';
import type { User } from '@farmhith/types';
import { Users, ClipboardList, TrendingUp, ShoppingBasket, BarChart2, ArrowRight } from 'lucide-react';

const userColumns: Column<User & { createdAt: string }>[] = [
  { key: 'id', header: 'ID', render: (u) => <span className="text-xs text-gray-400">{u.id.slice(0, 8)}</span> },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', render: (u) => <StatusBadge status={u.role} size="sm" /> },
  { key: 'createdAt', header: 'Joined', render: (u) => u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—' },
];

export default function AdminDashboard() {
  const { data: users, loading: loadingUsers, error: errorUsers }       = useAllUsers();
  const { data: bookings, loading: loadingBookings, error: errorBookings } = useAllSoilTestBookings();
  const { data: payments, loading: loadingPayments, error: errorPayments } = useAllPayments();

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
        <StatCard label="Total Users"       value={loadingUsers ? '—' : users.length.toLocaleString('en-IN')} icon={<Users size={20} />} accent="blue" />

      {/* Booking stats */}
        <StatCard label="Total Bookings"   value={loadingBookings ? '—' : bookings.length}          icon={<ClipboardList size={20} />} accent="amber" />
        <StatCard label="Completed"        value={loadingBookings ? '—' : completedCount}            icon={<TrendingUp size={20} />} accent="green" />
        <StatCard label="Platform Revenue" value={loadingPayments ? '—' : formatCurrency(totalRevenue)} icon={<ShoppingBasket size={20} />} accent="purple" />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <Card>
          <SectionHeader
            title="Recent Bookings"
            action={<Link href="/dashboard/bookings" className="text-xs text-green-600 hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>}
          />
          <QueryState
            loading={loadingBookings}
            error={errorBookings}
            empty={bookings.length === 0}
            emptyProps={{
              title: "No bookings yet",
              description: "Soil test bookings will appear here."
            }}
          >
            <div className="space-y-2">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
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
          </QueryState>
        </Card>

        {/* Payment ledger preview */}
        <Card>
          <SectionHeader
            title="Recent Payments"
            action={<Link href="/dashboard/payments" className="text-xs text-green-600 hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>}
          />
          <QueryState
            loading={loadingPayments}
            error={errorPayments}
            empty={payments.length === 0}
            emptyProps={{
              title: "No payments yet",
              description: "Transaction history will appear here."
            }}
          >
            <div className="space-y-2">
              {payments.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
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
          </QueryState>
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
        <QueryState
          loading={loadingUsers}
          error={errorUsers}
          empty={users.length === 0}
          emptyProps={{
            title: "No users found"
          }}
        >
          <DataTable
            columns={userColumns}
            data={users.slice(0, 10)}
            keyExtractor={(u) => u.id}
            emptyTitle="No users found"
          />
        </QueryState>
      </Card>
    </div>
  );
}
