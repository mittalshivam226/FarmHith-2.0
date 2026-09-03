'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, CardContent, QueryState, StatusBadge, Badge } from '@farmhith/ui';
import { useMyBookings, useMyMitraSessions, useFarmerOrders } from '@farmhith/hooks';
import { CalendarDays, FlaskConical, UserCheck, Factory, IndianRupee, Activity, ArrowUpRight, Filter } from 'lucide-react';
import { formatDate, formatCurrency } from '@farmhith/utils';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

type ServiceFilter = 'ALL' | 'SOIL_TEST' | 'MITRA_SESSION' | 'MARKETPLACE';

export default function FarmerHistory() {
  const { user } = useAuth();
  const farmerId = user?.id;
  const [filter, setFilter] = useState<ServiceFilter>('ALL');

  const { data: soilBookings, loading: loadingBookings, error: errorBookings } = useMyBookings(farmerId);
  const { data: mitraSessions, loading: loadingSessions, error: errorSessions } = useMyMitraSessions(farmerId);
  const { data: orders, loading: loadingOrders, error: errorOrders } = useFarmerOrders(farmerId);

  const isLoading = loadingBookings || loadingSessions || loadingOrders;
  const isError = errorBookings || errorSessions || errorOrders;

  const historyItems = useMemo(() => {
    const items = [];

    for (const b of soilBookings) {
      items.push({
        id: b.id,
        type: 'SOIL_TEST' as const,
        title: `Soil Health Test`,
        partner: b.labName,
        date: b.createdAt || b.collectionDate,
        amount: b.amountPaid,
        status: b.status,
        link: `/dashboard/soil-test/${b.id}`,
      });
    }

    for (const s of mitraSessions) {
      items.push({
        id: s.id,
        type: 'MITRA_SESSION' as const,
        title: `Agronomist Consultation`,
        partner: s.mitraName,
        date: s.createdAt || s.sessionDatetime,
        amount: s.amountPaid,
        status: s.status,
        link: `/dashboard/mitra/${s.id}`,
      });
    }

    for (const o of orders) {
      items.push({
        id: o.id,
        type: 'MARKETPLACE' as const,
        title: `Crop Residue Sale (${o.listingResidueType})`,
        partner: o.plantName,
        date: o.createdAt,
        amount: o.totalAmount,
        status: o.status,
        link: `/dashboard/marketplace`,
      });
    }

    const sorted = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filter === 'ALL') return sorted;
    return sorted.filter(item => item.type === filter);
  }, [soilBookings, mitraSessions, orders, filter]);

  return (
    <div className="space-y-6 max-w-5xl text-slate-800">
      <SlideIn direction="left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Activity History</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Unified ledger of all your soil tests, agronomist sessions, and residue sales.</p>
        </div>
      </SlideIn>

      {/* Filter Tabs */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Activities' },
            { id: 'SOIL_TEST', label: '🌱 Soil Tests' },
            { id: 'MITRA_SESSION', label: '👨‍🌾 Mitra Sessions' },
            { id: 'MARKETPLACE', label: '♻️ Marketplace Sales' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as ServiceFilter)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-primary-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <QueryState
          loading={isLoading}
          error={isError}
          empty={historyItems.length === 0}
          emptyProps={{
            icon: <Activity size={28} className="text-slate-400" />,
            title: "No Activity History Found",
            description: "Your bookings and transactions across all 3 FarmHith services will appear here."
          }}
        >
          <div className="space-y-3.5">
            {historyItems.map((item, i) => (
              <ZoomIn key={item.id} delay={0.1 + (i * 0.04)}>
                <Card hover className="bg-white border-slate-200/90 shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        item.type === 'SOIL_TEST' ? 'bg-primary-50 text-primary-700 border-primary-100' :
                        item.type === 'MITRA_SESSION' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-sky-50 text-sky-700 border-sky-100'
                      }`}>
                        {item.type === 'SOIL_TEST' && <FlaskConical className="w-5 h-5" />}
                        {item.type === 'MITRA_SESSION' && <UserCheck className="w-5 h-5" />}
                        {item.type === 'MARKETPLACE' && <Factory className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" /> {formatDate(item.date)}
                          </span>
                          <span>·</span>
                          <span>Partner: <strong className="text-slate-700">{item.partner}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 gap-1">
                      <span className="text-xs text-slate-400">
                        {item.type === 'MARKETPLACE' ? 'Earnings' : 'Paid'}
                      </span>
                      <p className={`text-base sm:text-lg font-black ${
                        item.type === 'MARKETPLACE' ? 'text-primary-700' : 'text-slate-900'
                      }`}>
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </div>
                </Card>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </FadeIn>
    </div>
  );
}

