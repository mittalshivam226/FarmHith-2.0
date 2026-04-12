'use client';

import { Card, CardHeader, CardTitle, CardContent, Button } from '@farmhith/ui';
import { AlertCircle, FileText, CheckCircle } from 'lucide-react';

const MOCK_DISPUTES = [
  { id: 'DSP-001', type: 'Delay in Soil Report', priority: 'HIGH', user: 'Ramesh Kumar (Farmer)', relatedTo: 'AgriTest Punjab (Lab)', status: 'OPEN', raisedOn: '2026-04-11' },
  { id: 'DSP-002', type: 'Biomass Quality Issue', priority: 'CRITICAL', user: 'Greenleaf Bio-Energy', relatedTo: 'Gurpreet Singh (Farmer)', status: 'INVESTIGATING', raisedOn: '2026-04-10' },
  { id: 'DSP-003', type: 'Mitra No-Show', priority: 'MEDIUM', user: 'Farmer #1029', relatedTo: 'Dr. Harpreet Kaur', status: 'RESOLVED', raisedOn: '2026-04-05' },
];

export default function DisputesHub() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resolution Hub</h1>
        <p className="text-slate-500">Manage support tickets and cross-party disputes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {MOCK_DISPUTES.map((dispute) => (
            <Card key={dispute.id} className="hover:border-slate-300 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${
                      dispute.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                      dispute.priority === 'HIGH' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">{dispute.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          dispute.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          dispute.status === 'INVESTIGATING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {dispute.status}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">{dispute.type}</h3>
                      <div className="mt-2 text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
                        <span><strong>Raised by:</strong> {dispute.user}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span><strong>Against:</strong> {dispute.relatedTo}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 text-red-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold">Open Critical</span>
                  </div>
                  <span className="text-xl font-bold">1</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold">Investigating</span>
                  </div>
                  <span className="text-xl font-bold">4</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold">Resolved (24h)</span>
                  </div>
                  <span className="text-xl font-bold">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
