'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, StatusBadge, SectionHeader, Badge, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyBookings, useAvailableLabs } from '@farmhith/hooks';
import { FlaskConical, MapPin, Plus } from 'lucide-react';
import { FadeIn, ZoomIn, SlideIn } from '../../components/Animations';

export default function SoilTestPage() {
  const { user } = useAuth();
  const { data: bookings, loading: loadingBookings, error: errorBookings } = useMyBookings(user?.id);
  const { data: labs, loading: loadingLabs, error: errorLabs } = useAvailableLabs();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-100">
      <SlideIn direction="left">
        <div className="[&_h2]:!text-white [&_p]:!text-slate-400">
          <SectionHeader
            title="Soil Tests"
            description="Book soil tests from verified labs and view your reports"
            action={
            <Link
              href="/dashboard/soil-test/book"
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-slate-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-glow-sm"
            >
              <Plus size={16} /> Book Test
            </Link>
          }
        />
        </div>
      </SlideIn>

      {/* My bookings */}
      <div>
        <FadeIn delay={0.1}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">My Bookings</h2>
        </FadeIn>
        <QueryState
          loading={loadingBookings}
          error={errorBookings}
          empty={bookings.length === 0}
          emptyProps={{
            icon: <FlaskConical size={24} className="text-slate-500" />,
            title: "No soil tests booked yet",
            description: "Book a test with a verified lab to understand your soil health."
          }}
        >
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <ZoomIn key={booking.id} delay={0.2 + (i * 0.1)}>
                <Link href={`/dashboard/soil-test/${booking.id}`} className="block group">
                  <Card padding="md" className="bg-slate-900 border-slate-800 hover:border-primary-500/30 transition-colors hud-element shadow-glow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-sm">
                          <FlaskConical size={20} className="text-primary-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-primary-400 transition-colors text-lg">{booking.labName}</p>
                          <p className="text-sm text-slate-400">{booking.cropType} · {booking.landParcelDetails}</p>
                          <p className="text-xs text-slate-500 mt-1">Collection: {formatDate(booking.collectionDate)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={booking.status} />
                        <span className="text-sm font-bold text-primary-400">{formatCurrency(booking.amountPaid)}</span>
                      </div>
                    </div>
                    {booking.report && (
                      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-6 flex-wrap">
                        {[
                          { label: 'N', value: booking.report.testParameters.nitrogen, unit: 'mg/kg', color: 'text-success-400' },
                          { label: 'P', value: booking.report.testParameters.phosphorus, unit: 'mg/kg', color: 'text-warning-400' },
                          { label: 'K', value: booking.report.testParameters.potassium, unit: 'mg/kg', color: 'text-info-400' },
                          { label: 'pH', value: booking.report.testParameters.ph, unit: '', color: 'text-purple-400' },
                        ].map(param => (
                          <div key={param.label} className="text-center">
                            <p className="text-xs font-bold text-slate-500">{param.label}</p>
                            <p className={`text-base font-black ${param.color}`}>
                              {param.value}<span className="text-xs font-normal text-slate-500 ml-0.5">{param.unit}</span>
                            </p>
                          </div>
                        ))}
                        <span className="ml-auto text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-wider">
                          Download PDF →
                        </span>
                      </div>
                    )}
                  </Card>
                </Link>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </div>

      {/* Browse labs */}
      <div className="pt-4">
        <FadeIn delay={0.4}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Verified Labs Near You</h2>
        </FadeIn>
        <QueryState
          loading={loadingLabs}
          error={errorLabs}
          empty={labs.length === 0}
          emptyProps={{
            title: "No verified labs available yet",
            description: "Check back later for new lab partners."
          }}
          loadingFallback={<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab, i) => (
              <ZoomIn key={lab.id} delay={0.5 + (i * 0.1)}>
                <Card hover className="bg-slate-900 border-slate-800 hud-element flex flex-col h-full hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-glow-sm">
                      <FlaskConical size={20} className="text-blue-400" />
                    </div>
                    <Badge variant="success" className="bg-success-500/10 text-success-400 border border-success-500/20">Verified</Badge>
                  </div>
                  <h3 className="font-bold text-slate-100 text-lg">{lab.labName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <MapPin size={12} className="text-slate-500" />{lab.address}
                  </div>
                  <div className="flex items-center justify-between mt-6 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Per test</p>
                      <p className="text-lg font-black text-primary-400">{formatCurrency(lab.perTestPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</p>
                      <p className="text-sm font-semibold text-slate-300">{lab.dailyCapacity}/day</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-2">
                    <Link
                      href={`/dashboard/soil-test/book?labId=${lab.id}`}
                      className="w-full flex items-center justify-center text-sm font-bold bg-slate-800 hover:bg-primary-500 hover:text-slate-950 text-slate-100 py-3 rounded-xl transition-all border border-slate-700 hover:border-primary-400"
                    >
                      Book with this Lab
                    </Link>
                  </div>
                </Card>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}
