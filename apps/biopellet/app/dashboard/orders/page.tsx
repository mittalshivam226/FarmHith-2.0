'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatCard, StatusBadge } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { usePlantOrders } from '@farmhith/hooks';
import { DollarSign, TrendingUp, Loader2 } from 'lucide-react';

export default function BiopelletOrdersPage() {
  const { user } = useAuth();
  const { data: orders, loading } = usePlantOrders(user?.id);
  const [filter, setFilter] = React.useState('ALL');

  const TABS = ['ALL', 'INTERESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter(o => o.status === filter);

  const total      = orders.reduce((s, o) => s + o.totalAmount, 0);
  const confirmed  = orders.filter(o => o.status === 'CONFIRMED').length;
  const interested = orders.filter(o => o.status === 'INTERESTED').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="My Orders"
        description="Procurement orders placed with farmers"
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Interested"  value={loading ? '—' : interested}             icon={<TrendingUp size={20} />} accent="amber" />
        <StatCard label="Confirmed"   value={loading ? '—' : confirmed}              icon={<DollarSign size={20} />} accent="green" />
        <StatCard label="Total Value" value={loading ? '—' : formatCurrency(total)}  icon={<DollarSign size={20} />} accent="purple" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card>
        <SectionHeader title="Order History" />
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No orders yet. <Link href="/dashboard/listings" className="text-green-600 hover:underline">Browse listings →</Link></p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.farmerName}</p>
                  <p className="text-xs text-gray-500">{order.listingResidueType} · {order.finalQuantityTons} tons</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-bold text-green-700">{formatCurrency(order.totalAmount)}</p>
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
