'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@farmhith/auth';
import { Card, StatusBadge, SectionHeader, Badge, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { useMyBookings, useAvailableLabs } from '@farmhith/hooks';
import { FlaskConical, MapPin, Plus, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { FadeIn, ZoomIn, SlideIn } from '../../components/Animations';

export default function SoilTestPage() {
  const { user } = useAuth();
  const { data: bookings, loading: loadingBookings, error: errorBookings } = useMyBookings(user?.id);
  const { data: labs, loading: loadingLabs, error: errorLabs } = useAvailableLabs();

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-800">
      <SlideIn direction="left">
        <SectionHeader
          title="Soil Testing Services"
          description="Book certified soil tests to know your soil's NPK, pH, and nutrient profile"
          action={
            <Link
              href="/dashboard/soil-test/book"
              className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Plus size={16} /> Book Soil Test
            </Link>
          }
        />
      </SlideIn>

      {/* ── 3-Step Process Guide Banner ── */}
      <FadeIn delay={0.05}>
        <div className="bg-gradient-to-r from-primary-50 via-primary-100/60 to-emerald-50 border border-primary-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 text-primary-800 font-bold text-sm mb-3">
            <Sparkles size={16} className="text-primary-600" />
            <span>How FarmHith Soil Testing Works:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-primary-100 shadow-xs flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-primary-700 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-bold text-slate-900">Select Lab & Date</p>
                <p className="text-slate-600 text-xs mt-0.5">Pick a certified laboratory and schedule doorstep sample pickup.</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-primary-100 shadow-xs flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-primary-700 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="font-bold text-slate-900">Lab Analysis</p>
                <p className="text-slate-600 text-xs mt-0.5">Lab technician conducts calibrated chemical testing (NPK, pH, EC).</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-primary-100 shadow-xs flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-primary-700 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-bold text-slate-900">Health Report & Advice</p>
                <p className="text-slate-600 text-xs mt-0.5">Receive an easy-to-read report with customized fertilizer suggestions.</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── My Soil Test Bookings ── */}
      <div>
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">My Soil Tests</h2>
            {bookings.length > 0 && (
              <span className="text-xs font-semibold text-slate-500">{bookings.length} Total Bookings</span>
            )}
          </div>
        </FadeIn>
        
        <QueryState
          loading={loadingBookings}
          error={errorBookings}
          empty={bookings.length === 0}
          emptyProps={{
            icon: <FlaskConical size={28} className="text-slate-400" />,
            title: "No Soil Tests Booked Yet",
            description: "Book a test with a verified lab to understand your soil's health and maximize your crop yield.",
            action: (
              <Link href="/dashboard/soil-test/book" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 bg-primary-50 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors mt-2">
                <Plus size={16} /> Book Your First Test
              </Link>
            )
          }}
        >
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <ZoomIn key={booking.id} delay={0.15 + (i * 0.05)}>
                <Link href={`/dashboard/soil-test/${booking.id}`} className="block group">
                  <Card hover className="bg-white border-slate-200/90 shadow-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 group-hover:scale-105 transition-transform shrink-0">
                          <FlaskConical size={22} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <p className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors text-base sm:text-lg">
                              {booking.labName}
                            </p>
                            <StatusBadge status={booking.status} size="sm" />
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1">
                            Crop: <strong className="text-slate-800 capitalize">{booking.cropType}</strong> · Parcel: {booking.landParcelDetails}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">Sample Collection: {formatDate(booking.collectionDate)}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 gap-1">
                        <span className="text-xs text-slate-400">Amount</span>
                        <span className="text-base sm:text-lg font-bold text-primary-700">{formatCurrency(booking.amountPaid)}</span>
                        <span className="text-xs font-semibold text-primary-700 group-hover:underline flex items-center gap-1 mt-0.5">
                          View Details <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Report parameter preview if available */}
                    {booking.report && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 sm:gap-6 flex-wrap bg-slate-50/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-primary-600" /> Report Ready:
                        </span>
                        {[
                          { label: 'pH', value: booking.report.testParameters.ph, unit: '', color: 'text-purple-700' },
                          { label: 'Nitrogen (N)', value: booking.report.testParameters.nitrogen, unit: 'mg/kg', color: 'text-primary-700' },
                          { label: 'Phosphorus (P)', value: booking.report.testParameters.phosphorus, unit: 'mg/kg', color: 'text-amber-700' },
                          { label: 'Potassium (K)', value: booking.report.testParameters.potassium, unit: 'mg/kg', color: 'text-sky-700' },
                        ].map(param => (
                          <div key={param.label} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 text-center">
                            <span className="text-[10px] text-slate-400 font-semibold">{param.label}: </span>
                            <span className={`text-xs font-bold ${param.color}`}>
                              {param.value} {param.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </Link>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </div>

      {/* ── Verified Labs Near You ── */}
      <div className="pt-2">
        <FadeIn delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Verified Testing Labs Near You</h2>
              <p className="text-xs text-slate-500">Government-certified and FarmHith-verified testing facilities</p>
            </div>
          </div>
        </FadeIn>

        <QueryState
          loading={loadingLabs}
          error={errorLabs}
          empty={labs.length === 0}
          emptyProps={{
            title: "No Verified Labs Currently Listed",
            description: "New laboratory partners are onboarded weekly."
          }}
          loadingFallback={<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab, i) => (
              <ZoomIn key={lab.id} delay={0.35 + (i * 0.08)}>
                <Card hover className="bg-white border-slate-200/90 shadow-card flex flex-col h-full group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shadow-xs">
                      <FlaskConical size={20} />
                    </div>
                    <Badge variant="success" size="sm">
                      <ShieldCheck size={12} className="inline mr-1" /> Certified
                    </Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-primary-700 transition-colors">
                    {lab.labName}
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{lab.address || `${lab.district ?? 'District Lab'}, ${lab.state ?? 'India'}`}</span>
                  </div>

                  <div className="flex items-center justify-between mt-5 mb-4 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Testing Fee</p>
                      <p className="text-lg font-extrabold text-primary-700">{formatCurrency(lab.perTestPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Capacity</p>
                      <p className="text-xs font-bold text-slate-700">{lab.dailyCapacity} samples/day</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link
                      href={`/dashboard/soil-test/book?labId=${lab.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold bg-slate-900 hover:bg-primary-700 text-white py-2.5 rounded-xl transition-all shadow-xs"
                    >
                      Book with this Lab &rarr;
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

