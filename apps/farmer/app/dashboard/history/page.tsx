'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, CardContent, QueryState } from '@farmhith/ui';
import { useMyBookings, useMyMitraSessions, useFarmerOrders } from '@farmhith/hooks';
import { CalendarDays, FlaskConical, UserCheck, Factory, IndianRupee, Activity } from 'lucide-react';
import { formatDate } from '@farmhith/utils';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

export default function FarmerHistory() {
  const { user } = useAuth();
  const farmerId = user?.id;

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
        type: 'SOIL_TEST',
        title: `Soil Test`,
        partner: b.labName,
        date: b.createdAt || b.collectionDate,
        amount: b.amountPaid,
        status: b.status,
      });
    }

    for (const s of mitraSessions) {
      items.push({
        id: s.id,
        type: 'MITRA_SESSION',
        title: `Consultation`,
        partner: s.mitraName,
        date: s.createdAt || s.sessionDatetime,
        amount: s.amountPaid,
        status: s.status,
      });
    }

    for (const o of orders) {
      items.push({
        id: o.id,
        type: 'MARKETPLACE',
        title: `Crop Sale: ${o.listingResidueType}`,
        partner: o.plantName,
        date: o.createdAt,
        amount: o.totalAmount,
        status: o.status,
      });
    }

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [soilBookings, mitraSessions, orders]);

  return (
    <div className="space-y-6 max-w-5xl text-slate-100">
      <SlideIn direction="left">
        <div>
          <h1 className="text-3xl font-bold text-white">Activity History</h1>
          <p className="text-slate-400 mt-1">Your past interactions, soil tests, and marketplace transactions.</p>
        </div>
      </SlideIn>

      <FadeIn delay={0.1}>
        <QueryState
          loading={isLoading}
          error={isError}
          empty={historyItems.length === 0}
          emptyProps={{
            icon: <Activity size={24} className="text-slate-500" />,
            title: "No history found",
            description: "Book a soil test, consult a Mitra, or list a crop to get started!"
          }}
        >
          <div className="space-y-4">
            {historyItems.map((item, i) => (
              <ZoomIn key={item.id} delay={0.2 + (i * 0.05)}>
                <Card className="hover:border-primary-500/30 transition-colors bg-slate-900 border-slate-800 hud-element shadow-glow-sm">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row p-4 gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-glow-sm ${
                        item.type === 'SOIL_TEST' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' :
                        item.type === 'MITRA_SESSION' ? 'bg-warning-500/10 text-warning-400 border-warning-500/20' :
                        'bg-info-500/10 text-info-400 border-info-500/20'
                      }`}>
                        {item.type === 'SOIL_TEST' && <FlaskConical className="w-6 h-6" />}
                        {item.type === 'MITRA_SESSION' && <UserCheck className="w-6 h-6" />}
                        {item.type === 'MARKETPLACE' && <Factory className="w-6 h-6" />}
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-slate-100 mb-1">{item.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4 text-slate-500" /> {formatDate(item.date)}
                          </span>
                          <span>Partner: <strong className="text-slate-300">{item.partner}</strong></span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col justify-between items-end sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
                        <div className={`flex items-center gap-1 font-black text-xl ${
                          item.type === 'MARKETPLACE' ? 'text-info-400' : 'text-slate-100'
                        }`}>
                          <IndianRupee className="w-5 h-5" />
                          {item.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 mt-2 border border-slate-700 tracking-wider uppercase">
                          {item.status}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </FadeIn>
    </div>
  );
}
