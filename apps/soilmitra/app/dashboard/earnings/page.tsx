'use client';
import React from 'react';
import { Card, SectionHeader, StatCard } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { DollarSign, TrendingUp, Calendar, Percent } from 'lucide-react';
import { mockEarnings, mockSessions } from '../../../lib/mock-data';

export default function SoilmitraEarningsPage() {
  const totalGross   = mockEarnings.reduce((s, p) => s + p.grossAmount, 0);
  const totalNet     = mockEarnings.reduce((s, p) => s + p.netPayout, 0);
  const totalCommission = mockEarnings.reduce((s, p) => s + p.platformCommission, 0);
  const completedSessions = mockSessions.filter(s => s.status === 'COMPLETED').length;
  const avgPerSession = completedSessions > 0 ? Math.round(totalNet / completedSessions) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Earnings"
        description="Your income breakdown and payment history"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gross Earned"   value={formatCurrency(totalGross)}   icon={<DollarSign size={20} />} accent="green" />
        <StatCard label="Net Payout"     value={formatCurrency(totalNet)}     icon={<TrendingUp size={20} />} accent="teal" />
        <StatCard label="Sessions Done"  value={completedSessions}           icon={<Calendar size={20} />} accent="blue" />
        <StatCard label="Avg / Session"  value={formatCurrency(avgPerSession)} icon={<Percent size={20} />} accent="purple" />
      </div>

      {/* Platform commission note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>Platform fee:</strong> FarmHith takes a 10% commission on each session. Your net payout is automatically calculated.
        <span className="block text-xs text-amber-600 mt-1">Total commission paid this period: {formatCurrency(totalCommission)}</span>
      </div>

      {/* Payment history */}
      <Card>
        <SectionHeader title="Payment History" />
        <div className="space-y-3">
          {mockEarnings.map(payment => (
            <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">{payment.payerName}</p>
                <p className="text-xs text-gray-500">
                  {payment.serviceType.replace('_', ' ')} · {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-700">{formatCurrency(payment.netPayout)}</p>
                <p className="text-xs text-gray-400">Gross: {formatCurrency(payment.grossAmount)}</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                  payment.status === 'SETTLED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{payment.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
