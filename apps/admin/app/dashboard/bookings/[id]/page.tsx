'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@farmhith/firebase';
import {
  doc, onSnapshot, collection, getDocs,
  type DocumentData,
} from 'firebase/firestore';
import { SectionHeader, StatusBadge, Button } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import type { SoilTestBooking } from '@farmhith/types';
import {
  FlaskConical, Calendar, MapPin, User, Leaf,
  FileText, Download, ChevronRight, Loader2, CheckCircle2,
} from 'lucide-react';

interface SoilReport {
  reportUrl: string;
  testParameters: { pH: number; nitrogen: number; phosphorus: number; potassium: number };
  technicianNotes: string;
  uploadedAt: DocumentData;
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
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
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

export default function AdminBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<SoilTestBooking | null>(null);
  const [report, setReport] = useState<SoilReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const unsub = onSnapshot(
      doc(db, 'soilTestBookings', bookingId),
      async (snap) => {
        if (!snap.exists()) {
          setError('Booking not found');
          setLoading(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() } as SoilTestBooking;
        setBooking(data);

        // If completed, fetch report sub-collection
        if (data.status === 'COMPLETED') {
          try {
            const reportsSnap = await getDocs(
              collection(db, 'soilTestBookings', bookingId, 'reports')
            );
            if (!reportsSnap.empty) {
              setReport(reportsSnap.docs[0].data() as SoilReport);
            }
          } catch (e) {
            console.error('Failed to load report:', e);
          }
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-600">
          <p className="font-medium">Something went wrong</p>
          <p className="text-sm mt-1">{error ?? 'Booking not found'}</p>
          <Button variant="outline" onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title={`Booking #${booking.id.slice(0, 8)}`}
        description="Full soil test booking details — read-only admin view"
        action={<Button variant="outline" onClick={() => router.back()}>Back to Bookings</Button>}
      />

      {/* Status Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Booking Progress</p>
        <StatusTimeline status={booking.status} />
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Farmer Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="h-9 w-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <User size={16} />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Farmer</p>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{booking.farmerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Farmer ID</dt>
              <dd className="font-mono text-xs text-gray-400">{booking.farmerId.slice(0, 16)}…</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Consent to Mitra</dt>
              <dd className={`font-medium ${booking.reportConsentToMitra ? 'text-green-600' : 'text-gray-400'}`}>
                {booking.reportConsentToMitra ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Lab Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="h-9 w-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <FlaskConical size={16} />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Testing Lab</p>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Lab Name</dt>
              <dd className="font-medium text-gray-900">{booking.labName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Lab ID</dt>
              <dd className="font-mono text-xs text-gray-400">{booking.labId.slice(0, 16)}…</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd><StatusBadge status={booking.status} size="sm" /></dd>
            </div>
          </dl>
        </div>

        {/* Crop & Sample */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="h-9 w-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Leaf size={16} />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Sample Details</p>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Crop Type</dt>
              <dd className="font-medium text-gray-900 capitalize">{booking.cropType}</dd>
            </div>
            <div className="flex justify-between items-start gap-4">
              <dt className="text-gray-500 shrink-0">Land Details</dt>
              <dd className="font-medium text-gray-900 text-right text-xs">{booking.landParcelDetails}</dd>
            </div>
          </dl>
        </div>

        {/* Dates & Payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="h-9 w-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <Calendar size={16} />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Dates & Payment</p>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Collection Date</dt>
              <dd className="font-medium text-gray-900">{formatDate(booking.collectionDate)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created At</dt>
              <dd className="font-medium text-gray-900">{formatDate(booking.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Amount Paid</dt>
              <dd className="font-bold text-green-700">₹{(booking.amountPaid ?? 0).toLocaleString('en-IN')}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Report Section — only when COMPLETED */}
      {booking.status === 'COMPLETED' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <FileText size={16} />
              </div>
              <p className="font-semibold text-gray-900">Soil Test Report</p>
            </div>
            {report?.reportUrl && (
              <a
                href={report.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Download size={12} /> Download PDF
              </a>
            )}
          </div>

          {report ? (
            <div className="space-y-4">
              {/* Parameters Table */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'pH', value: report.testParameters.pH, unit: '', color: 'text-amber-700 bg-amber-50' },
                  { label: 'Nitrogen (N)', value: report.testParameters.nitrogen, unit: 'kg/ha', color: 'text-blue-700 bg-blue-50' },
                  { label: 'Phosphorus (P)', value: report.testParameters.phosphorus, unit: 'kg/ha', color: 'text-red-700 bg-red-50' },
                  { label: 'Potassium (K)', value: report.testParameters.potassium, unit: 'kg/ha', color: 'text-green-700 bg-green-50' },
                ].map(p => (
                  <div key={p.label} className={`${p.color} rounded-xl p-4 text-center border border-white/80`}>
                    <p className="text-xs text-gray-500 font-medium mb-1">{p.label}</p>
                    <p className={`text-2xl font-bold`}>{p.value}</p>
                    {p.unit && <p className="text-xs text-gray-400 mt-0.5">{p.unit}</p>}
                  </div>
                ))}
              </div>

              {/* Technician Notes */}
              {report.technicianNotes && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Technician Notes</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{report.technicianNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading report data…</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
