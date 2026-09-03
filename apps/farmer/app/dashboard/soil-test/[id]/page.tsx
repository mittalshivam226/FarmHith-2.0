'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button, Badge } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { FlaskConical, Calendar, Info, FileText, Loader2, CheckCircle2, Download, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import type { SoilTestBooking } from '@farmhith/types';

interface SoilReport {
  reportUrl?: string;
  pdfBase64?: string;
  pdfFileName?: string;
  pdfMimeType?: string;
  hasPdf?: boolean;
  testParameters: { ph: number; nitrogen: number; phosphorus: number; potassium: number; moisture?: number; organicCarbon?: number; ec?: number };
  technicianNotes?: string;
  recommendation?: string;
  generatedAt?: string;
}

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Booking Placed', desc: 'Awaiting lab acceptance' },
  { key: 'ACCEPTED', label: 'Sample Scheduled', desc: 'Doorstep pickup date confirmed' },
  { key: 'IN_PROGRESS', label: 'Lab Analysis', desc: 'Sample under chemical testing' },
  { key: 'COMPLETED', label: 'Report Ready', desc: 'Soil health analysis available' },
] as const;

function StatusTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-sm font-semibold">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        Booking Cancelled
      </div>
    );
  }
  const stepKeys = STATUS_STEPS.map(s => s.key);
  const currentIdx = stepKeys.indexOf(status as any);

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const active = idx === currentIdx;
          return (
            <div
              key={step.key}
              className={`p-3.5 rounded-2xl border transition-all ${
                active
                  ? 'bg-primary-50 border-primary-300 shadow-xs'
                  : done
                  ? 'bg-slate-50/80 border-slate-200'
                  : 'bg-white border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  done ? 'bg-primary-700 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {done ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                <span className={`text-xs font-bold ${done ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight pl-8.5">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SoilTestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<SoilTestBooking | null>(null);
  const [report, setReport] = useState<SoilReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen to booking status changes in real-time
  useEffect(() => {
    if (!bookingId) return;
    const unsub = onSnapshot(
      doc(db, 'soilTestBookings', bookingId),
      (snap) => {
        if (!snap.exists()) {
          setError('Booking not found');
          setLoading(false);
          return;
        }
        setBooking({ id: snap.id, ...snap.data() } as SoilTestBooking);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [bookingId]);

  // Listen to soil report in real-time
  useEffect(() => {
    if (!bookingId) return;
    setReportLoading(true);
    const unsub = onSnapshot(
      doc(db, 'soilReports', bookingId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          const params = data.testParameters ?? {};
          const normalized: SoilReport = {
            ...data,
            testParameters: {
              ph:         params.ph         ?? params.pH         ?? 0,
              nitrogen:   params.nitrogen   ?? params.N          ?? 0,
              phosphorus: params.phosphorus ?? params.P          ?? 0,
              potassium:  params.potassium  ?? params.K          ?? 0,
              moisture:   params.moisture,
              organicCarbon: params.organicCarbon,
              ec:         params.ec,
            },
          };
          setReport(normalized);
        } else {
          setReport(null);
        }
        setReportLoading(false);
      },
      (err) => {
        console.error('Failed to load soil report:', err);
        setReportLoading(false);
      }
    );
    return () => unsub();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-primary-700" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-slate-500">
        <p className="font-semibold text-slate-800">{error ?? 'Booking record not found.'}</p>
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft size={16} className="mr-1 inline" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Farmer interpretation helpers
  const ph = report?.testParameters.ph ?? 7;
  const n = report?.testParameters.nitrogen ?? 0;
  const p = report?.testParameters.phosphorus ?? 0;
  const k = report?.testParameters.potassium ?? 0;

  const phStatus = ph < 6.0 ? { label: 'Acidic', color: 'text-amber-700', desc: 'Lime application recommended' } :
                   ph > 7.8 ? { label: 'Alkaline', color: 'text-purple-700', desc: 'Gypsum treatment helpful' } :
                              { label: 'Neutral (Optimal)', color: 'text-primary-700', desc: 'Ideal for most Indian crops' };

  const nStatus = n > 250 ? { label: 'High', color: 'text-primary-800', desc: 'Reduce urea dosage' } :
                  n >= 120 ? { label: 'Adequate / Good', color: 'text-primary-700', desc: 'Maintain current organic/fertilizer regimen' } :
                             { label: 'Low / Deficient', color: 'text-red-700', desc: 'Nitrogen replenishment needed' };

  const pStatus = p > 35 ? { label: 'High', color: 'text-amber-800', desc: 'Good root strength' } :
                  p >= 15 ? { label: 'Moderate / Good', color: 'text-primary-700', desc: 'Optimum for flowering and root formation' } :
                            { label: 'Low', color: 'text-red-700', desc: 'DAP or phosphate fertilizer advised' };

  const kStatus = k > 250 ? { label: 'High', color: 'text-sky-800', desc: 'High pest & drought resistance' } :
                  k >= 120 ? { label: 'Good', color: 'text-primary-700', desc: 'Healthy grain filling and stem strength' } :
                             { label: 'Low', color: 'text-red-700', desc: 'Potash supplementation recommended' };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-800">
      <SectionHeader
        title={`Soil Test Booking #${booking.id.slice(0, 8).toUpperCase()}`}
        description="Live sample collection and soil analysis status"
        action={
          <Button variant="outline" onClick={() => router.push('/dashboard/soil-test')} className="gap-1.5">
            <ArrowLeft size={16} /> Back to Soil Tests
          </Button>
        }
      />

      {/* Status Timeline */}
      <Card className="bg-white border-slate-200/90 shadow-card">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Live Progress Timeline</p>
        <StatusTimeline status={booking.status} />
      </Card>

      {/* Lab & Field Details */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Lab Info */}
        <Card className="bg-white border-slate-200/90 shadow-card">
          <div className="flex items-center gap-3.5 mb-4 border-b border-slate-100 pb-3.5">
            <div className="h-10 w-10 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center text-primary-700">
              <FlaskConical size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{booking.labName}</p>
              <p className="text-xs text-slate-500">Certified Soil Testing Laboratory</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Calendar size={16} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase">Doorstep Sample Collection</p>
                <p className="font-bold text-slate-800">{formatDate(booking.collectionDate)}</p>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Current Status:</span>
              <StatusBadge status={booking.status} size="sm" />
            </div>
          </div>
        </Card>

        {/* Crop & Field Details */}
        <Card className="bg-white border-slate-200/90 shadow-card">
          <div className="flex items-center gap-3.5 mb-4 border-b border-slate-100 pb-3.5">
            <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
              <Info size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Crop & Land Details</p>
              <p className="text-xs text-slate-500">Submitted field information</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-slate-500 text-xs">Crop Type</span>
              <span className="font-bold text-slate-900 capitalize">{booking.cropType}</span>
            </div>
            <div className="flex justify-between items-start border-b border-slate-50 pb-2 gap-4">
              <span className="text-slate-500 text-xs shrink-0">Field Location</span>
              <span className="font-medium text-slate-800 text-right text-xs">{booking.landParcelDetails}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 text-xs">Testing Fee</span>
              <span className="font-extrabold text-primary-700 text-base">{formatCurrency(booking.amountPaid)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Soil Health Analysis Report */}
      {booking.status === 'COMPLETED' ? (
        <Card className="bg-white border-slate-200/90 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center text-primary-700 shadow-xs">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">🌱 Soil Health & Nutrient Analysis</h3>
                <p className="text-xs text-slate-500">Official certified report for your field</p>
              </div>
            </div>

            {/* Download Action */}
            {report?.pdfBase64 ? (
              <button
                onClick={() => {
                  const blob = new Blob(
                    [Uint8Array.from(atob(report.pdfBase64!), c => c.charCodeAt(0))],
                    { type: report.pdfMimeType || 'application/pdf' }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = report.pdfFileName || 'FarmHith-Soil-Report.pdf';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 rounded-xl transition-colors shadow-xs"
              >
                <Download size={15} /> Download PDF Report
              </button>
            ) : report?.reportUrl ? (
              <a
                href={report.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 rounded-xl transition-colors shadow-xs"
              >
                <Download size={15} /> Download Report
              </a>
            ) : null}
          </div>

          {reportLoading ? (
            <div className="text-center py-8">
              <Loader2 size={24} className="animate-spin mx-auto text-primary-700 mb-2" />
              <p className="text-xs text-slate-500">Loading soil report parameters…</p>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Farmer Interpretation Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* pH */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Soil pH (Reaction)</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">{report.testParameters.ph}</p>
                  <Badge variant="default" size="sm" className="mt-2 font-bold">{phStatus.label}</Badge>
                  <p className="text-[11px] text-slate-500 mt-2 leading-tight">{phStatus.desc}</p>
                </div>

                {/* Nitrogen */}
                <div className="p-4 rounded-2xl bg-primary-50/50 border border-primary-100 text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nitrogen (N)</p>
                  <p className="text-3xl font-extrabold text-primary-700 mt-1">
                    {report.testParameters.nitrogen} <span className="text-xs text-slate-400 font-normal">kg/ha</span>
                  </p>
                  <Badge variant="success" size="sm" className="mt-2 font-bold">{nStatus.label}</Badge>
                  <p className="text-[11px] text-slate-500 mt-2 leading-tight">{nStatus.desc}</p>
                </div>

                {/* Phosphorus */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phosphorus (P)</p>
                  <p className="text-3xl font-extrabold text-amber-700 mt-1">
                    {report.testParameters.phosphorus} <span className="text-xs text-slate-400 font-normal">kg/ha</span>
                  </p>
                  <Badge variant="harvest" size="sm" className="mt-2 font-bold">{pStatus.label}</Badge>
                  <p className="text-[11px] text-slate-500 mt-2 leading-tight">{pStatus.desc}</p>
                </div>

                {/* Potassium */}
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Potassium (K)</p>
                  <p className="text-3xl font-extrabold text-sky-700 mt-1">
                    {report.testParameters.potassium} <span className="text-xs text-slate-400 font-normal">kg/ha</span>
                  </p>
                  <Badge variant="info" size="sm" className="mt-2 font-bold">{kStatus.label}</Badge>
                  <p className="text-[11px] text-slate-500 mt-2 leading-tight">{kStatus.desc}</p>
                </div>
              </div>

              {/* Technician Notes & Recommendations */}
              {(report.technicianNotes || report.recommendation) && (
                <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  {report.technicianNotes && (
                    <div>
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Laboratory Technician Observations</p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{report.technicianNotes}</p>
                    </div>
                  )}
                  {report.recommendation && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <p className="text-xs font-bold text-primary-800 uppercase tracking-wider mb-1">Recommended Soil Management</p>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{report.recommendation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <p className="text-sm">Report parameters are being processed by the lab.</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="bg-white border-slate-200/90 shadow-card">
          <div className="text-center py-8">
            <FileText size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-800">Report In Progress</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {booking.status === 'PENDING' ? 'The lab has received your booking request and will confirm the sample collection date shortly.' :
               booking.status === 'ACCEPTED' ? 'The lab has accepted your request. A technician will visit your field on the scheduled date.' :
               booking.status === 'IN_PROGRESS' ? 'Sample collected! The laboratory is conducting calibrated chemical testing.' :
               'Your comprehensive soil health analysis will appear here once finalized.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

