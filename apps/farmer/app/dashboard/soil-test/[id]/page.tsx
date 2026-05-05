'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { FlaskConical, Calendar, Info, FileText, Loader2, CheckCircle2, Download } from 'lucide-react';
import type { SoilTestBooking } from '@farmhith/types';

interface SoilReport {
  reportUrl?: string;
  // New: PDF stored as base64 in Firestore (no Firebase Storage)
  pdfBase64?: string;
  pdfFileName?: string;
  pdfMimeType?: string;
  hasPdf?: boolean;
  testParameters: { ph: number; nitrogen: number; phosphorus: number; potassium: number; moisture?: number; organicCarbon?: number; ec?: number };
  technicianNotes?: string;
  recommendation?: string;
  generatedAt?: string;
}

const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'] as const;

function StatusTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Booking Cancelled
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status as typeof STATUS_STEPS[number]);
  return (
    <div className="flex items-center">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              } ${active ? 'ring-4 ring-green-100' : ''}`}>
                {done ? <CheckCircle2 size={14} /> : idx + 1}
              </div>
              <p className={`text-xs mt-1.5 font-medium whitespace-nowrap ${done ? 'text-green-700' : 'text-gray-400'}`}>
                {step.replace('_', ' ')}
              </p>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${idx < currentIdx ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
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

  // Listen to soil report in real-time (separate listener so it reacts instantly when lab uploads)
  useEffect(() => {
    if (!bookingId) return;
    setReportLoading(true);
    const unsub = onSnapshot(
      doc(db, 'soilReports', bookingId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          // Normalize testParameters — API may use 'pH' or 'ph' — merge both
          const params = data.testParameters ?? {};
          const normalized: SoilReport = {
            ...data,
            testParameters: {
              ph:         params.ph         ?? params.pH         ?? 0,
              nitrogen:   params.nitrogen   ?? params.N          ?? 0,
              phosphorus: params.phosphorus ?? params.P          ?? 0,
              potassium:  params.potassium  ?? params.K          ?? 0,
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
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        {error ?? 'Booking not found.'}
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader
        title={`Booking #${booking.id.slice(0, 8)}`}
        description="Soil test details and live status updates"
        action={
          <Button variant="outline" onClick={() => router.back()}>
            Back to List
          </Button>
        }
      />

      {/* Status Timeline */}
      <Card>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Live Status</p>
        <StatusTimeline status={booking.status} />
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Lab Info */}
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <FlaskConical size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{booking.labName}</p>
              <p className="text-xs text-gray-500">Testing Laboratory</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <Calendar size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs">Collection Date</p>
                <p className="font-medium text-gray-900">{formatDate(booking.collectionDate)}</p>
              </div>
            </div>
            <div>
              <StatusBadge status={booking.status} size="sm" />
            </div>
          </div>
        </Card>

        {/* Crop & Area Details */}
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Info size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Crop & Area Details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-500">Crop Type</span>
              <span className="font-medium text-gray-900 capitalize">{booking.cropType}</span>
            </div>
            <div className="flex justify-between items-start text-sm border-b border-gray-50 pb-2 gap-4">
              <span className="text-gray-500 shrink-0">Land Details</span>
              <span className="font-medium text-gray-900 text-right text-xs">{booking.landParcelDetails}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-green-700">{formatCurrency(booking.amountPaid)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Section */}
      {booking.status === 'COMPLETED' ? (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Soil Analysis Report</p>
                <p className="text-xs text-gray-500">Your field's soil health data</p>
              </div>
            </div>
            {/* Download PDF — supports both legacy Storage URL and new Firestore base64 */}
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
                  a.download = report.pdfFileName || 'soil-report.pdf';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-purple-700 border border-purple-200 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Download size={14} /> Download PDF
              </button>
            ) : report?.reportUrl ? (
              <a
                href={report.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-purple-700 border border-purple-200 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Download size={14} /> Download Report
              </a>
            ) : null}
          </div>

          {reportLoading ? (
            <div className="text-center py-6">
              <Loader2 size={20} className="animate-spin mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Loading report data…</p>
            </div>
          ) : report ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                   { label: 'pH',            value: report.testParameters.ph,         unit: '',       color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Nitrogen (N)',   value: report.testParameters.nitrogen,    unit: 'kg/ha', color: 'text-blue-600',  bg: 'bg-blue-50' },
                  { label: 'Phosphorus (P)', value: report.testParameters.phosphorus,  unit: 'kg/ha', color: 'text-red-500',   bg: 'bg-red-50' },
                  { label: 'Potassium (K)',  value: report.testParameters.potassium,   unit: 'kg/ha', color: 'text-green-600', bg: 'bg-green-50' },
                ].map(p => (
                  <div key={p.label} className={`${p.bg} p-4 rounded-xl text-center border border-white/50`}>
                    <p className="text-xs text-gray-500 font-medium mb-1">{p.label}</p>
                    <p className={`text-2xl font-bold ${p.color}`}>
                      {p.value}
                    </p>
                    {p.unit && <p className="text-xs text-gray-400 mt-0.5">{p.unit}</p>}
                  </div>
                ))}
              </div>

              {report.technicianNotes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Technician Notes</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{report.technicianNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Loader2 size={20} className="animate-spin mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Loading report data…</p>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <div className="text-center py-8">
            <FileText size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-900">Report Pending</p>
            <p className="text-sm text-gray-500 mt-1">
              {booking.status === 'PENDING' ? 'Lab has not accepted this booking yet.' :
               booking.status === 'ACCEPTED' ? 'Lab has accepted. Sample collection scheduled.' :
               booking.status === 'IN_PROGRESS' ? 'Lab is currently analyzing the sample.' :
               'Report will be available here when completed.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
