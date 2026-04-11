'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatCard, StatusBadge, Card, SectionHeader, RatingStars } from '@farmhith/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@farmhith/utils';
import { CalendarDays, DollarSign, Star, Clock, ArrowRight, Video } from 'lucide-react';
import { mockSessions, mockEarnings } from '../../lib/mock-data';

export default function SoilmitraDashboard() {
  const { user } = useAuth();

  const upcoming  = mockSessions.filter(s => s.status === 'CONFIRMED' || s.status === 'PENDING');
  const completed = mockSessions.filter(s => s.status === 'COMPLETED');
  const totalEarned = mockEarnings.reduce((s, p) => s + p.netPayout, 0);
  const avgRating = completed.length
    ? (completed.reduce((s, s2) => s + (s2.farmerRating ?? 0), 0) / completed.length).toFixed(1)
    : '—';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Expert Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Upcoming Sessions" value={upcoming.length}           icon={<CalendarDays size={20} />} accent="teal" />
        <StatCard label="Sessions Done"      value={completed.length}          icon={<Clock size={20} />} accent="green" />
        <StatCard label="Avg Rating"          value={avgRating}                icon={<Star size={20} />} accent="amber" />
        <StatCard label="Net Earnings"        value={formatCurrency(totalEarned)} icon={<DollarSign size={20} />} accent="purple" />
      </div>

      {/* Upcoming sessions */}
      <Card>
        <SectionHeader
          title="Upcoming Sessions"
          action={<Link href="/dashboard/sessions" className="text-xs text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>}
        />
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No upcoming sessions.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map(session => {
              const sessionTime = new Date(session.sessionDatetime);
              const isToday = sessionTime.toDateString() === new Date().toDateString();
              const minutesUntil = Math.floor((sessionTime.getTime() - Date.now()) / 60000);
              const canJoin = minutesUntil <= 15 && minutesUntil >= -session.durationMinutes;

              return (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-teal-50 border border-teal-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center">
                      <Video size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{session.farmerName}</p>
                      <p className="text-xs text-gray-600">{session.cropType} · {formatDate(session.sessionDatetime)}</p>
                      <p className="text-xs text-teal-700 font-medium mt-0.5">
                        {isToday ? `Today at ${sessionTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : formatRelativeTime(session.sessionDatetime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={session.status} size="sm" />
                    {canJoin && (
                      <button className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors">
                        Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Recent completed */}
      <Card>
        <SectionHeader title="Recent Sessions" />
        <div className="space-y-3">
          {mockSessions.filter(s => s.status === 'COMPLETED').map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{session.farmerName}</p>
                <p className="text-xs text-gray-500">{session.cropType} · {formatDate(session.sessionDatetime)}</p>
              </div>
              <div className="flex items-center gap-3">
                {session.farmerRating && <RatingStars value={session.farmerRating} size="sm" />}
                <span className="text-sm font-semibold text-green-700">{formatCurrency(session.amountPaid)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
