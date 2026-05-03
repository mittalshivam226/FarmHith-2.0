'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { StatCard, StatusBadge, Card, SectionHeader } from '@farmhith/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@farmhith/utils';
import { useMitraSchedule } from '@farmhith/hooks';
import { CalendarDays, DollarSign, Star, Clock, ArrowRight, Video, Loader2 } from 'lucide-react';

export default function SoilmitraDashboard() {
  const { user } = useAuth();
  const mitraId = user?.id;

  const { data: sessions, loading } = useMitraSchedule(mitraId);

  const upcoming  = sessions.filter(s => s.status === 'CONFIRMED' || s.status === 'PENDING');
  const completed = sessions.filter(s => s.status === 'COMPLETED');

  // Earnings from completed sessions
  const totalEarned = completed.reduce((s, b) => s + b.amountPaid, 0);

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
        <StatCard label="Upcoming Sessions" value={loading ? '—' : upcoming.length}           icon={<CalendarDays size={20} />} accent="teal" />
        <StatCard label="Sessions Done"      value={loading ? '—' : completed.length}          icon={<Clock size={20} />} accent="green" />
        <StatCard label="Avg Rating"         value={loading ? '—' : avgRating}                icon={<Star size={20} />} accent="amber" />
        <StatCard label="Net Earnings"       value={loading ? '—' : formatCurrency(totalEarned)} icon={<DollarSign size={20} />} accent="purple" />
      </div>

      {/* Upcoming sessions */}
      <Card>
        <SectionHeader
          title="Upcoming Sessions"
          action={<Link href="/dashboard/bookings" className="text-xs text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>}
        />
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No upcoming sessions. Farmers will book you once your profile is live.</p>
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
                        {isToday
                          ? `Today at ${sessionTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                          : formatRelativeTime(session.sessionDatetime)}
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
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : completed.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No completed sessions yet.</p>
        ) : (
          <div className="space-y-3">
            {completed.map(session => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.farmerName}</p>
                  <p className="text-xs text-gray-500">{session.cropType} · {formatDate(session.sessionDatetime)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {session.farmerRating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-medium">{session.farmerRating}</span>
                    </div>
                  )}
                  <span className="text-sm font-semibold text-green-700">{formatCurrency(session.amountPaid)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
