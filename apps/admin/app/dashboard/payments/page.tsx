'use client';
import React from 'react';
import { Card, SectionHeader, StatCard, DataTable, type Column } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import type { Payment } from '@farmhith/types';
import { allPayments } from '../../../lib/mock-data';
import { CreditCard, TrendingUp, Percent } from 'lucide-react';

const columns: Column<Payment>[] = [
  { key: 'id', header: 'ID', render: (p) => <span className="text-xs font-mono text-gray-400">{p.id}</span> },
  { key: 'payerName', header: 'From', sortable: true },
  { key: 'payeeName', header: 'To', sortable: true },
  { key: 'serviceType', header: 'Service', render: (p) => p.serviceType.replace('_', ' ') },
  { key: 'grossAmount', header: 'Gross', render: (p) => formatCurrency(p.grossAmount), sortable: true },
  { key: 'platformCommission', header: 'Commission', render: (p) => <span className="font-medium text-green-700">{formatCurrency(p.platformCommission)}</span>, sortable: true },
  { key: 'netPayout', header: 'Net', render: (p) => formatCurrency(p.netPayout), sortable: true },
  {
    key: 'status', header: 'Status',
    render: (p) => (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
        p.status === 'SETTLED' ? 'bg-green-100 text-green-700' :
        p.status === 'CAPTURED' ? 'bg-blue-100 text-blue-700' :
        'bg-gray-100 text-gray-600'
      }`}>{p.status}</span>
    ),
  },
];

export default function AdminPaymentsPage() {
  const totalGross      = allPayments.reduce((s, p) => s + p.grossAmount, 0);
  const totalCommission = allPayments.reduce((s, p) => s + p.platformCommission, 0);
  const commissionRate  = totalGross > 0 ? ((totalCommission / totalGross) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader title="Payment Ledger" description="All platform transactions and commission tracking" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Transacted" value={formatCurrency(totalGross)} icon={<CreditCard size={20} />} accent="blue" />
        <StatCard label="Platform Commission" value={formatCurrency(totalCommission)} icon={<TrendingUp size={20} />} accent="green" />
        <StatCard label="Effective Rate" value={`${commissionRate}%`} icon={<Percent size={20} />} accent="purple" />
      </div>

      <DataTable
        columns={columns}
        data={allPayments}
        keyExtractor={(p) => p.id}
        emptyTitle="No payments"
        emptyDescription="No payment records found."
      />
    </div>
  );
}
