'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, RatingStars, Badge, Avatar, StatusBadge, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyMitraSessions, useAvailableMitras } from '@farmhith/hooks';
import { Users, Languages, Briefcase, CalendarDays } from 'lucide-react';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

export default function MitraPage() {
  const { user } = useAuth();
  const { data: sessions, loading: loadingSessions, error: errorSessions } = useMyMitraSessions(user?.id);
  const { data: mitras, loading: loadingMitras, error: errorMitras } = useAvailableMitras();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-100">
      <SlideIn direction="left">
        <div className="[&_h2]:!text-white [&_p]:!text-slate-400">
          <SectionHeader
            title="Soil-Mitra Directory"
            description="Expert agronomists for personalised crop consultation"
            action={null}
          />
        </div>
      </SlideIn>

      {/* My upcoming sessions */}
      <div>
        <FadeIn delay={0.1}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">My Sessions</h2>
        </FadeIn>
        <QueryState
          loading={loadingSessions}
          error={errorSessions}
          empty={sessions.length === 0}
          emptyProps={{
            icon: <CalendarDays size={24} className="text-slate-500" />,
            title: "No sessions booked yet",
            description: "You haven't booked any Soil-Mitra consultations."
          }}
        >
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <ZoomIn key={session.id} delay={0.2 + (i * 0.1)}>
                <Link href={`/dashboard/mitra/${session.id}`} className="block group">
                  <Card hover padding="md" className="bg-slate-900 border-slate-800 hover:border-warning-500/30 transition-colors hud-element shadow-glow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="shadow-glow-sm rounded-full overflow-hidden group-hover:scale-105 transition-transform">
                          <Avatar name={session.mitraName} size="md" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-warning-400 transition-colors text-lg">{session.mitraName}</p>
                          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                            <CalendarDays size={14} className="text-warning-400" />
                            {formatDate(session.sessionDatetime)}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 font-semibold">{session.durationMinutes} min · {formatCurrency(session.amountPaid)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={session.status} size="sm" />
                        {session.farmerRating && <RatingStars value={session.farmerRating} size="sm" />}
                      </div>
                    </div>
                  </Card>
                </Link>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </div>

      {/* Browse Mitras */}
      <div className="pt-4">
        <FadeIn delay={0.4}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Find an Expert</h2>
        </FadeIn>
        <QueryState
          loading={loadingMitras}
          error={errorMitras}
          empty={mitras.length === 0}
          emptyProps={{
            icon: <Users size={24} className="text-slate-500" />,
            title: "No verified Soil-Mitras available yet",
            description: "Check back later for new agricultural experts."
          }}
          loadingFallback={<div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="space-y-6">
            {mitras.map((mitra, i) => (
              <SlideIn key={mitra.id} delay={0.5 + (i * 0.1)} direction="right">
                <Card hover className="bg-slate-900 border-slate-800 hud-element hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="shadow-glow-sm rounded-full overflow-hidden shrink-0">
                      <Avatar name={mitra.fullName} size="lg" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-100 text-xl mb-1">{mitra.fullName}</h3>
                          <RatingStars value={mitra.rating} showValue count={mitra.totalSessions} size="sm" />
                        </div>
                        <div className="shrink-0 sm:text-right bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Per session</p>
                          <p className="text-xl font-black text-warning-400">{formatCurrency(mitra.sessionFee)}</p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 mt-4 leading-relaxed line-clamp-2">{mitra.bio}</p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {mitra.specialisation.map(spec => (
                          <Badge key={spec} variant="success" size="sm" className="bg-success-500/10 text-success-400 border border-success-500/20">{spec}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 mt-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-2"><Languages size={14} className="text-slate-400" />{mitra.languagesSpoken.join(', ')}</span>
                        <span className="flex items-center gap-2"><Briefcase size={14} className="text-slate-400" />{mitra.totalSessions} sessions</span>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-800 flex justify-end">
                        <Link
                          href={`/dashboard/mitra/book/${mitra.id}`}
                          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-warning-500 hover:text-slate-950 text-slate-100 text-sm font-bold px-6 py-2.5 rounded-xl transition-all border border-slate-700 hover:border-warning-400 shadow-glow-sm"
                        >
                          <Users size={16} /> Book Session
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </SlideIn>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
