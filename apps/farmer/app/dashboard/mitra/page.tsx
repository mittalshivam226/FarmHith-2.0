'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, RatingStars, Badge, Avatar, StatusBadge, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyMitraSessions, useAvailableMitras } from '@farmhith/hooks';
import { Users, Languages, Briefcase, CalendarDays, ShieldCheck, Video, ArrowRight, Sparkles } from 'lucide-react';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

export default function MitraPage() {
  const { user } = useAuth();
  const { data: sessions, loading: loadingSessions, error: errorSessions } = useMyMitraSessions(user?.id);
  const { data: mitras, loading: loadingMitras, error: errorMitras } = useAvailableMitras();

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-800">
      <SlideIn direction="left">
        <SectionHeader
          title="Soil-Mitra Agronomist Directory"
          description="Connect with verified agricultural experts for video consultations and crop solutions"
          action={null}
        />
      </SlideIn>

      {/* ── Value & Trust Banner ── */}
      <FadeIn delay={0.05}>
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                100% Verified Agricultural Scientists & Agronomists
              </h3>
              <p className="text-xs sm:text-sm text-amber-800/90 mt-0.5">
                Every Soil-Mitra holds accredited agronomy credentials and offers personalized field guidance in your preferred regional language.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── My Consultations ── */}
      <div>
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">My Consultations</h2>
            {sessions.length > 0 && (
              <span className="text-xs font-semibold text-slate-500">{sessions.length} Scheduled</span>
            )}
          </div>
        </FadeIn>

        <QueryState
          loading={loadingSessions}
          error={errorSessions}
          empty={sessions.length === 0}
          emptyProps={{
            icon: <CalendarDays size={28} className="text-slate-400" />,
            title: "No Consultations Scheduled Yet",
            description: "Browse verified Soil-Mitra agronomists below to book your first video consultation.",
          }}
        >
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <ZoomIn key={session.id} delay={0.15 + (i * 0.05)}>
                <Link href={`/dashboard/mitra/${session.id}`} className="block group">
                  <Card hover className="bg-white border-slate-200/90 shadow-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="shadow-xs rounded-full overflow-hidden shrink-0 border-2 border-amber-200">
                          <Avatar name={session.mitraName} size="md" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors text-base sm:text-lg">
                              {session.mitraName}
                            </p>
                            <Badge variant="harvest" size="sm">
                              <ShieldCheck size={12} className="inline mr-0.5" /> Verified Mitra
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-1">
                            <CalendarDays size={14} className="text-amber-600" />
                            <span>{formatDate(session.sessionDatetime)}</span>
                            <span>·</span>
                            <span className="font-medium text-slate-500">{session.durationMinutes} min session</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 gap-1.5">
                        <StatusBadge status={session.status} size="sm" />
                        {session.farmerRating ? (
                          <RatingStars value={session.farmerRating} size="sm" />
                        ) : session.status === 'CONFIRMED' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                            <Video size={13} /> Ready to Join
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </Link>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </div>

      {/* ── Browse Available Mitras ── */}
      <div className="pt-2">
        <FadeIn delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Available Agricultural Experts</h2>
              <p className="text-xs text-slate-500">Select an expert based on specialization and language</p>
            </div>
          </div>
        </FadeIn>

        <QueryState
          loading={loadingMitras}
          error={errorMitras}
          empty={mitras.length === 0}
          emptyProps={{
            icon: <Users size={28} className="text-slate-400" />,
            title: "No Experts Available Currently",
            description: "Check back shortly or contact FarmHith support."
          }}
          loadingFallback={<div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="space-y-5">
            {mitras.map((mitra, i) => (
              <SlideIn key={mitra.id} delay={0.35 + (i * 0.08)} direction="right">
                <Card hover className="bg-white border-slate-200/90 shadow-card">
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="rounded-2xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-xs">
                      <Avatar name={mitra.fullName} size="xl" />
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">{mitra.fullName}</h3>
                            <Badge variant="harvest" size="sm">
                              <ShieldCheck size={12} className="inline mr-1" /> Verified Soil-Mitra
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <RatingStars value={mitra.rating} showValue count={mitra.totalSessions} size="sm" />
                          </div>
                        </div>

                        <div className="shrink-0 sm:text-right bg-amber-50/80 px-4 py-2.5 rounded-2xl border border-amber-100">
                          <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Session Fee</p>
                          <p className="text-xl font-black text-amber-800">{formatCurrency(mitra.sessionFee)}</p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">{mitra.bio}</p>

                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {mitra.specialisation.map(spec => (
                          <Badge key={spec} variant="default" size="sm" className="bg-slate-100 text-slate-700">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 mt-4 text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1.5"><Languages size={14} className="text-slate-400" />{mitra.languagesSpoken.join(', ')}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400" />{mitra.totalSessions} sessions completed</span>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/dashboard/mitra/book/${mitra.id}`}
                          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs active:scale-95"
                        >
                          <Users size={15} /> Book Consultation &rarr;
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

