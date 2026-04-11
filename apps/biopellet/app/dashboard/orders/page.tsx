'use client';
import React from 'react';
import { Card, SectionHeader, StatCard, StatusBadge } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ProcurementOrder } from '@farmhith/types';
import { mockOrders } from '../../../lib/mock-data';

export default function BiopelletOrdersPage() {
  const total = mockOrders.reduce((s, o) => s + o.totalAmount, 0);
  const confirmed = mockOrders.filter(o => o.status === 'CONFIRMED').length;
  const interested = mockOrders.filter(o => o.status === 'INTERESTED').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="My Orders"
        description="Procurement orders placed with farmers"
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Interested"  value={interested}             icon={<TrendingUp size={20} />} accent="amber" />
        <StatCard label="Confirmed"   value={confirmed}              icon={<DollarSign size={20} />} accent="green" />
        <StatCard label="Total Value" value={formatCurrency(total)}  icon={<DollarSign size={20} />} accent="purple" />
      </div>

      <Card>
        <SectionHeader title="Order History" />
        <div className="space-y-3">
          {mockOrders.map(order => (
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
          {mockOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No orders yet. <Link href="/dashboard/listings" className="text-green-600 hover:underline">Browse listings →</Link></p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
