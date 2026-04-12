'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@farmhith/ui';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

const MOCK_EVENTS = [
  { id: 1, title: 'Sample Collection: Wheat Field', time: '10:00 AM', location: 'Ludhiana North', status: 'PENDING' },
  { id: 2, title: 'Sample Collection: Paddy Field', time: '11:30 AM', location: 'Ludhiana East', status: 'COMPLETED' },
  { id: 3, title: 'Lab Analysis: Soil Test #992', time: '02:00 PM', location: 'In Lab', status: 'IN_PROGRESS' },
];

export default function LabCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule Calendar</h1>
          <p className="text-slate-500">Manage sample collections and lab tasks</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-md border border-slate-200 p-1">
          <Button variant="ghost" size="sm" className="px-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-4">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
          </span>
          <Button variant="ghost" size="sm" className="px-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <CardTitle className="text-sm font-medium text-slate-700">Today's Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {MOCK_EVENTS.map((event) => (
                  <div key={event.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-20 text-right shrink-0">
                      <span className="text-sm font-medium text-slate-900">{event.time}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-900">{event.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          event.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          event.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-slate-500 gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Daily Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">14</span>
                <span className="text-slate-500 mb-1">/ 20 tests</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
