'use client';
import React from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatCard } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useMitraSchedule } from '@farmhith/hooks';
import { DollarSign, TrendingUp, Calendar, Percent, Loader2 } from 'lucide-react';

const PLATFORM_FEE_RATE = 0.10; // 10%

export default function SoilmitraEarningsPage() {
  const { user } = useAuth();
  const { data: sessions, loading } = useMitraSchedule(user?.id);

  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

  // Derive earnings from completed sessions (platform deducts 10%)
  const totalGross        = completedSessions.reduce((s, b) => s + b.amountPaid, 0);
  const totalCommission   = Math.round(totalGross * PLATFORM_FEE_RATE);
  const totalNet          = totalGross - totalCommission;
  const avgPerSession     = completedSessions.length > 0
    ? Math.round(totalNet / completedSessions.length)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Earnings"
        description="Your income breakdown and payment history"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gross Earned"  value={loading ? '—' : formatCurrency(totalGross)}   icon={<DollarSign size={20} />} accent="green" />
        <StatCard label="Net Payout"    value={loading ? '—' : formatCurrency(totalNet)}     icon={<TrendingUp size={20} />} accent="teal" />
        <StatCard label="Sessions Done" value={loading ? '—' : completedSessions.length}     icon={<Calendar size={20} />} accent="blue" />
        <StatCard label="Avg / Session" value={loading ? '—' : formatCurrency(avgPerSession)} icon={<Percent size={20} />} accent="purple" />
      </div>

      {/* Platform commission note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>Platform fee:</strong> FarmHith takes a 10% commission on each session. Your net payout is automatically calculated.
        <span className="block text-xs text-amber-600 mt-1">Total commission this period: {formatCurrency(totalCommission)}</span>
      </div>

      {/* Session earnings history */}
      <Card>
        <SectionHeader title="Completed Session History" />
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : completedSessions.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">No completed sessions yet.</p>
        ) : (
          <div className="space-y-3">
            {completedSessions.map(session => {
              const gross = session.amountPaid;
              const commission = Math.round(gross * PLATFORM_FEE_RATE);
              const net = gross - commission;
              return (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{session.farmerName}</p>
                    <p className="text-xs text-gray-500">
                      {session.cropType ?? '—'} · {new Date(session.sessionDatetime).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">{formatCurrency(net)}</p>
                    <p className="text-xs text-gray-400">Gross: {formatCurrency(gross)}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 bg-green-100 text-green-700">
                      SETTLED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
