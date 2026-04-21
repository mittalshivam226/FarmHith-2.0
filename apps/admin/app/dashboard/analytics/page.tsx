'use client';
import React from 'react';
import { Card, SectionHeader, StatCard } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useAllUsers, useAllSoilTestBookings, useAllMitraSessions, useAllCropListingsAdmin, useAllProcurementOrders, useAllPayments } from '@farmhith/hooks';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { TrendingUp, Users, ShoppingBasket, Loader2 } from 'lucide-react';

// Group payments by month for chart
function groupByMonth(items: { createdAt: string; grossAmount?: number; amountPaid?: number }[]) {
  const map: Record<string, number> = {};
  items.forEach(item => {
    try {
      const d = new Date(item.createdAt);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      map[key] = (map[key] ?? 0) + (item.grossAmount ?? item.amountPaid ?? 0);
    } catch { /* skip */ }
  });
  return Object.entries(map)
    .slice(-6)
    .map(([name, value]) => ({ name, value }));
}

export default function AnalyticsDashboard() {
  const { data: users,     loading: loadU } = useAllUsers();
  const { data: bookings,  loading: loadB } = useAllSoilTestBookings();
  const { data: sessions,  loading: loadS } = useAllMitraSessions();
  const { data: listings,  loading: loadL } = useAllCropListingsAdmin();
  const { data: orders,    loading: loadO } = useAllProcurementOrders();
  const { data: payments,  loading: loadP } = useAllPayments();

  const loading = loadU || loadB || loadS || loadL || loadO || loadP;

  // Derived stats
  const totalRevenue      = payments.reduce((s, p) => s + (p.grossAmount ?? 0), 0);
  const totalCommission   = payments.reduce((s, p) => s + (p.platformCommission ?? 0), 0);
  const completionRate    = bookings.length > 0
    ? Math.round((bookings.filter(b => b.status === 'COMPLETED').length / bookings.length) * 100)
    : 0;
  const sessionCompletion = sessions.length > 0
    ? Math.round((sessions.filter(s => s.status === 'COMPLETED').length / sessions.length) * 100)
    : 0;
  const matchRate = listings.length > 0
    ? Math.round(((listings.filter(l => l.status === 'MATCHED' || l.status === 'SOLD').length) / listings.length) * 100)
    : 0;

  const revenueChartData = groupByMonth(payments);

  const onboardingData = [
    { name: 'Farmers',     count: users.filter(u => u.role === 'FARMER').length },
    { name: 'Labs',        count: users.filter(u => u.role === 'LAB').length },
    { name: 'Soil-Mitras', count: users.filter(u => u.role === 'SOILMITRA').length },
    { name: 'Plants',      count: users.filter(u => u.role === 'BIOPELLET').length },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <SectionHeader title="Platform Analytics" description="Live metrics across the entire FarmHith ecosystem" />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Top KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Revenue"    value={formatCurrency(totalRevenue)}      icon={<TrendingUp size={20} />} accent="green" />
            <StatCard label="Platform Earned"  value={formatCurrency(totalCommission)}   icon={<TrendingUp size={20} />} accent="purple" />
            <StatCard label="Registered Users" value={users.length.toLocaleString('en-IN')} icon={<Users size={20} />}  accent="blue" />
            <StatCard label="Active Listings"  value={listings.filter(l => l.status === 'ACTIVE').length} icon={<ShoppingBasket size={20} />} accent="amber" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue chart */}
            <Card className="col-span-1 lg:col-span-2">
              <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue (₹)</h2>
              <div className="h-64 w-full text-xs">
                {revenueChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dx={-10} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No payment data yet. Revenue chart will populate after first transactions.
                  </div>
                )}
              </div>
            </Card>

            {/* Onboarding bar chart */}
            <Card>
              <h2 className="font-semibold text-gray-900 mb-4">Onboarded Users by Role</h2>
              <div className="h-56 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={onboardingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* KPIs */}
            <Card>
              <h2 className="font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
              <div className="space-y-5 mt-2">
                {[
                  { label: 'Soil Test Completion Rate', pct: completionRate, color: 'bg-emerald-500' },
                  { label: 'Marketplace Match Rate',    pct: matchRate,      color: 'bg-amber-400' },
                  { label: 'Mitra Session Completion',  pct: sessionCompletion, color: 'bg-teal-500' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <span className="text-sm font-bold text-emerald-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                    <p className="text-xs text-gray-500">Soil Tests</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                    <p className="text-xs text-gray-500">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'COMPLETED').length}</p>
                    <p className="text-xs text-gray-500">Orders Done</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
