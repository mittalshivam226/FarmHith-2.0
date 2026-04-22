'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, CardContent } from '@farmhith/ui';
import { useMyBookings, useMyMitraSessions, useFarmerOrders } from '@farmhith/hooks';
import { CalendarDays, FlaskConical, UserCheck, Factory, IndianRupee, Loader2 } from 'lucide-react';
import { formatDate } from '@farmhith/utils';

export default function FarmerHistory() {
  const { user } = useAuth();
  const farmerId = user?.id;

  const { data: soilBookings, loading: loadingBookings } = useMyBookings(farmerId);
  const { data: mitraSessions, loading: loadingSessions } = useMyMitraSessions(farmerId);
  const { data: orders, loading: loadingOrders } = useFarmerOrders(farmerId);

  const isLoading = loadingBookings || loadingSessions || loadingOrders;

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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity History</h1>
        <p className="text-slate-500">Your past interactions, soil tests, and marketplace transactions.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
          No history found. Book a test or list a crop to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <Card key={item.id} className="hover:border-slate-300 transition-colors">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                  <div className={`p-4 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'SOIL_TEST' ? 'bg-amber-100 text-amber-700' :
                    item.type === 'MITRA_SESSION' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.type === 'SOIL_TEST' && <FlaskConical className="w-6 h-6" />}
                    {item.type === 'MITRA_SESSION' && <UserCheck className="w-6 h-6" />}
                    {item.type === 'MARKETPLACE' && <Factory className="w-6 h-6" />}
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" /> {formatDate(item.date)}
                      </span>
                      <span>Partner: <strong>{item.partner}</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between items-end sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                    <div className={`flex items-center gap-1 font-bold text-lg ${
                      item.type === 'MARKETPLACE' ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      <IndianRupee className="w-5 h-5" />
                      {item.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mt-2">
                      {item.status}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
