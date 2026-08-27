'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, RatingStars, Badge, Avatar, StatusBadge, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyMitraSessions, useAvailableMitras } from '@farmhith/hooks';
import { Users, Languages, Briefcase, CalendarDays } from 'lucide-react';

export default function MitraPage() {
  const { user } = useAuth();
  const { data: sessions, loading: loadingSessions, error: errorSessions } = useMyMitraSessions(user?.id);
  const { data: mitras, loading: loadingMitras, error: errorMitras } = useAvailableMitras();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Soil-Mitra Directory"
        description="Expert agronomists for personalised crop consultation"
        action={null}
      />

      {/* My upcoming sessions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Sessions</h2>
        <QueryState
          loading={loadingSessions}
          error={errorSessions}
          empty={sessions.length === 0}
          emptyProps={{
            icon: <CalendarDays size={24} />,
            title: "No sessions booked yet",
            description: "You haven't booked any Soil-Mitra consultations."
          }}
        >
          <div className="space-y-3">
            {sessions.map(session => (
              <Link key={session.id} href={`/dashboard/mitra/${session.id}`} className="block">
                <Card hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={session.mitraName} size="md" />
                      <div>
                        <p className="font-semibold text-gray-900">{session.mitraName}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(session.sessionDatetime)}
                        </p>
                        <p className="text-xs text-gray-400">{session.durationMinutes} min · {formatCurrency(session.amountPaid)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={session.status} size="sm" />
                      {session.farmerRating && <RatingStars value={session.farmerRating} size="sm" />}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </QueryState>
      </div>

      {/* Browse Mitras */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Find an Expert</h2>
        <QueryState
          loading={loadingMitras}
          error={errorMitras}
          empty={mitras.length === 0}
          emptyProps={{
            icon: <Users size={24} />,
            title: "No verified Soil-Mitras available yet",
            description: "Check back later for new agricultural experts."
          }}
          loadingFallback={<div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="space-y-4">
            {mitras.map(mitra => (
              <Card key={mitra.id} hover>
                <div className="flex items-start gap-4">
                  <Avatar name={mitra.fullName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{mitra.fullName}</h3>
                        <RatingStars value={mitra.rating} showValue count={mitra.totalSessions} size="sm" />
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-gray-500">Per session</p>
                        <p className="text-lg font-bold text-green-700">{formatCurrency(mitra.sessionFee)}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{mitra.bio}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {mitra.specialisation.map(spec => (
                        <Badge key={spec} variant="success" size="sm">{spec}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Languages size={12} />{mitra.languagesSpoken.join(', ')}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12} />{mitra.totalSessions} sessions</span>
                    </div>

                    <Link
                      href={`/dashboard/mitra/book/${mitra.id}`}
                      className="mt-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
                    >
                      <Users size={15} /> Book Session
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
