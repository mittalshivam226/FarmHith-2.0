'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@farmhith/ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', soilTests: 4000, sessions: 2400, marketplace: 2400 },
  { name: 'Feb', soilTests: 3000, sessions: 1398, marketplace: 2210 },
  { name: 'Mar', soilTests: 2000, sessions: 9800, marketplace: 2290 },
  { name: 'Apr', soilTests: 2780, sessions: 3908, marketplace: 2000 },
  { name: 'May', soilTests: 1890, sessions: 4800, marketplace: 2181 },
  { name: 'Jun', soilTests: 2390, sessions: 3800, marketplace: 2500 },
];

const ONBOARDING_DATA = [
  { name: 'Farmers', count: 1200 },
  { name: 'Labs', count: 45 },
  { name: 'Soil-Mitras', count: 80 },
  { name: 'Plants', count: 12 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
        <p className="text-slate-500">Live metrics across the entire FarmHith ecosystem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Forecast & Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full mt-4 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={REVENUE_DATA}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="soilTests" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Soil Tests" />
                  <Area type="monotone" dataKey="sessions" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} name="Mitra Sessions" />
                  <Area type="monotone" dataKey="marketplace" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} name="Marketplace Comm." />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Onboarded Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full mt-4 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ONBOARDING_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                  <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">Marketplace Match Rate</span>
                  <span className="text-sm font-bold text-emerald-600">84%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">Test Report SLA Breach</span>
                  <span className="text-sm font-bold text-amber-500">12%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">Mitra Session Completion</span>
                  <span className="text-sm font-bold text-emerald-600">96%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
