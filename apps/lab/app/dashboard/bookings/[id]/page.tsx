'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button, Input, useToast, Avatar } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { SoilTestBooking } from '@farmhith/types';
import { MapPin, UploadCloud, FlaskConical, Loader2 } from 'lucide-react';

export default function LabBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<SoilTestBooking | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [reportData, setReportData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    recommendation: '',
  });

  useEffect(() => {
    if (!bookingId) return;
    (async () => {
      const snap = await getDoc(doc(db, 'soilTestBookings', bookingId));
      if (!snap.exists()) {
        setNotFound(true);
      } else {
        setBooking({ id: snap.id, ...snap.data() } as SoilTestBooking);
      }
      setFetchLoading(false);
    })();
  }, [bookingId]);

  const handleStatusChange = async (newStatus: 'ACCEPTED' | 'IN_PROGRESS') => {
    if (!bookingId) return;
    setStatusUpdating(true);
    try {
      await updateDoc(doc(db, 'soilTestBookings', bookingId), { status: newStatus });
      setBooking(prev => prev ? { ...prev, status: newStatus } : prev);
      toast.show({ title: 'Status Updated', message: `Booking marked as ${newStatus}`, type: 'success' });
    } catch (err) {
      console.error(err);
      toast.show({ title: 'Error', message: 'Could not update status.', type: 'error' });
    }
    setStatusUpdating(false);
  };

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    setSubmitting(true);

    const report = {
      bookingId,
      labId: user?.id,
      testParameters: {
        nitrogen: parseFloat(reportData.nitrogen),
        phosphorus: parseFloat(reportData.phosphorus),
        potassium: parseFloat(reportData.potassium),
        ph: parseFloat(reportData.ph),
      },
      recommendation: reportData.recommendation,
      generatedAt: new Date().toISOString(),
    };

    try {
      // Write report to its own collection and embed in booking
      await setDoc(doc(db, 'soilReports', bookingId), { ...report, createdAt: serverTimestamp() });
      await updateDoc(doc(db, 'soilTestBookings', bookingId), {
        status: 'COMPLETED',
        report,
      });

      toast.show({
        title: 'Report Uploaded',
        message: 'The soil analysis report has been sent to the farmer.',
        type: 'success',
      });
      router.push('/dashboard/bookings');
    } catch (err) {
      console.error(err);
      toast.show({ title: 'Error', message: 'Failed to upload report.', type: 'error' });
      setSubmitting(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Booking not found.
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title={`Booking #${booking.id.slice(0, 8)}`}
        description="Process soil sample and upload test results"
        action={
          <Button variant="outline" onClick={() => router.back()}>
            Back to Inbox
          </Button>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Status</span>
              <StatusBadge status={booking.status} />
            </div>

            {/* Quick Status Actions */}
            <div className="space-y-2 mb-6">
              {booking.status === 'PENDING' && (
                <Button
                  className="w-full"
                  onClick={() => handleStatusChange('ACCEPTED')}
                  disabled={statusUpdating}
                >
                  {statusUpdating ? <Loader2 size={14} className="animate-spin mr-2 inline" /> : null}
                  Accept Booking
                </Button>
              )}
              {booking.status === 'ACCEPTED' && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  disabled={statusUpdating}
                >
                  {statusUpdating ? <Loader2 size={14} className="animate-spin mr-2 inline" /> : null}
                  Mark as In Progress
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Farmer</p>
                <div className="flex items-center gap-2">
                  <Avatar name={booking.farmerName} size="sm" />
                  <p className="text-sm font-medium text-gray-900">{booking.farmerName}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Sample Details</p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Crop:</span>
                    <span className="font-medium text-gray-900">{booking.cropType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium text-gray-900">{booking.landParcelDetails}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Collection</p>
                <div className="flex items-start gap-2 text-sm text-gray-900">
                  <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <span>Farm drop-off arranged for {formatDate(booking.collectionDate)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Payment</span>
                  <span className="font-bold text-green-700">{formatCurrency(booking.amountPaid)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Report Form */}
        <div className="md:col-span-2 space-y-4">
          {booking.status === 'COMPLETED' ? (
            <Card>
              <div className="text-center py-8">
                <FlaskConical size={32} className="mx-auto text-green-400 mb-3" />
                <p className="font-semibold text-gray-900">Report Already Submitted</p>
                <p className="text-sm text-gray-500 mt-1">The results have been sent to the farmer.</p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">Enter Lab Results</p>
                  <p className="text-xs text-gray-500">Fill in the NPK values to generate the digital report</p>
                </div>
              </div>

              <form onSubmit={handleUploadReport} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <Input label="Nitrogen (N)" placeholder="mg/kg" value={reportData.nitrogen} onChange={(e) => setReportData({ ...reportData, nitrogen: e.target.value })} required />
                  </div>
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <Input label="Phosphorus (P)" placeholder="mg/kg" value={reportData.phosphorus} onChange={(e) => setReportData({ ...reportData, phosphorus: e.target.value })} required />
                  </div>
                  <div className="p-3 bg-green-50/50 rounded-xl border border-green-100">
                    <Input label="Potassium (K)" placeholder="mg/kg" value={reportData.potassium} onChange={(e) => setReportData({ ...reportData, potassium: e.target.value })} required />
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <Input label="pH Level" placeholder="e.g. 6.5" value={reportData.ph} onChange={(e) => setReportData({ ...reportData, ph: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Agronomist Recommendation</label>
                  <textarea
                    className="w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Provide fertilizer and pH leveling recommendations based on these results..."
                    value={reportData.recommendation}
                    onChange={(e) => setReportData({ ...reportData, recommendation: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-2 items-center px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                    <UploadCloud size={16} />
                    <span>Attach Original PDF (Optional)</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting || booking.status === 'PENDING' || !reportData.nitrogen || !reportData.phosphorus || !reportData.potassium || !reportData.ph}
                  >
                    {submitting
                      ? <><Loader2 size={14} className="animate-spin mr-2 inline" />Submitting…</>
                      : 'Generate & Send Report'}
                  </Button>
                </div>

                {booking.status === 'PENDING' && (
                  <p className="text-xs text-amber-600 text-center">Accept the booking first before uploading results.</p>
                )}
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
