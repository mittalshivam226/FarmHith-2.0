'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@farmhith/ui';
import { CalendarDays, FlaskConical, UserCheck, Factory, IndianRupee } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 1, type: 'SOIL_TEST', title: 'Soil Test #992', partner: 'AgriTest Punjab', date: '2026-04-10', amount: 299, status: 'COMPLETED' },
  { id: 2, type: 'MITRA_SESSION', title: 'Consultation: Wheat Diseases', partner: 'Dr. Harpreet Kaur', date: '2026-04-05', amount: 499, status: 'COMPLETED' },
  { id: 3, type: 'MARKETPLACE', title: 'Sold 6 Tons Paddy Straw', partner: 'Greenleaf Bio-Energy', date: '2026-03-20', amount: 15000, status: 'COMPLETED' },
  { id: 4, type: 'SOIL_TEST', title: 'Soil Test #884', partner: 'FarmLabs National', date: '2025-11-15', amount: 250, status: 'COMPLETED' },
];

export default function FarmerHistory() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity History</h1>
        <p className="text-slate-500">Your past interactions, soil tests, and marketplace transactions.</p>
      </div>

      <div className="space-y-4">
        {MOCK_HISTORY.map((item) => (
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
                      <CalendarDays className="w-4 h-4" /> {item.date}
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
    </div>
  );
}
