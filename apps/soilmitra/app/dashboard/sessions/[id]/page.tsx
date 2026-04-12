'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@farmhith/ui';
import { Video, Phone, CheckCircle2, FileText, CalendarDays, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SessionLiveView() {
  const { id } = useParams();
  const [status, setStatus] = useState<'UPCOMING' | 'ACTIVE' | 'COMPLETED'>('UPCOMING');

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex bg-white items-center justify-between p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl">
            R
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ramesh Kumar</h1>
            <div className="flex items-center text-sm text-slate-500 gap-4 mt-1">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> Farmer (Punjab)</span>
              <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Today, 10:00 AM (30 mins)</span>
            </div>
          </div>
        </div>
        <div>
          {status === 'UPCOMING' && (
            <Button onClick={() => setStatus('ACTIVE')} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Video className="w-4 h-4" /> Join Video Call
            </Button>
          )}
          {status === 'ACTIVE' && (
            <Button variant="destructive" onClick={() => setStatus('COMPLETED')} className="gap-2">
              <Phone className="w-4 h-4" /> End Call
            </Button>
          )}
          {status === 'COMPLETED' && (
            <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" /> Session Completed
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Crop Type</p>
              <p className="font-medium text-slate-900">Wheat (Triticum aestivum)</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Farmer's Notes</p>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100 italic">
                "Yellowing of leaves visible across the entire north field for the last 5 days."
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked Soil Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 p-4 border border-emerald-100 bg-emerald-50 rounded-lg">
              <FileText className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-semibold text-emerald-900">Soil Test #992</h4>
                <p className="text-sm text-emerald-700 mt-1">Lab: AgriTest Punjab</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs font-semibold bg-white text-emerald-700 px-2 py-1 rounded border border-emerald-200 shadow-sm">N: 142 (Low)</span>
                  <span className="text-xs font-semibold bg-white text-emerald-700 px-2 py-1 rounded border border-emerald-200 shadow-sm">P: 28 (Normal)</span>
                  <span className="text-xs font-semibold bg-white text-emerald-700 px-2 py-1 rounded border border-emerald-200 shadow-sm">pH: 7.2</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="#">View Full Report Details</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
