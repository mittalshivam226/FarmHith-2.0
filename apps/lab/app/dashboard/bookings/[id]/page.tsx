'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button, Input, useToast, Avatar } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { SoilTestBooking } from '@farmhith/types';
import { MapPin, UploadCloud, FlaskConical, Loader2 } from 'lucide-react';

export default function LabBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, getToken } = useAuth();
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
    technicianNotes: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleStatusChange = async (newStatus: 'ACCEPTED' | 'IN_PROGRESS' | 'CANCELLED') => {
    if (!bookingId) return;
    setStatusUpdating(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }

      setBooking(prev => prev ? { ...prev, status: newStatus } : prev);
      toast.show({ title: 'Status Updated', message: `Booking marked as ${newStatus}`, type: 'success' });
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Error', message: err.message || 'Could not update status.', type: 'error' });
    }
    setStatusUpdating(false);
  };

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    setSubmitting(true);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('bookingId', bookingId);
      formData.append('ph', reportData.ph);
      formData.append('nitrogen', reportData.nitrogen);
      formData.append('phosphorus', reportData.phosphorus);
      formData.append('potassium', reportData.potassium);
      formData.append('technicianNotes', reportData.technicianNotes);
      // PDF is optional — stored as base64 in Firestore (no Firebase Storage needed)
      if (selectedFile) formData.append('file', selectedFile);

      const res = await fetch('/api/reports/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload report');
      }

      toast.show({
        title: 'Report Uploaded',
        message: 'The soil analysis report has been sent to the farmer.',
        type: 'success',
      });
      setBooking(prev => prev ? { ...prev, status: 'COMPLETED' } : prev);
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Error', message: err.message || 'Failed to upload report.', type: 'error' });
    } finally {
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

  if (booking.status === 'CANCELLED') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <SectionHeader
          title={`Booking #${booking.id.slice(0, 8)}`}
          description="Process soil sample and upload test results"
          action={<Button variant="outline" onClick={() => router.back()}>Back to Inbox</Button>}
        />
        <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
          <p className="text-red-500 text-lg font-semibold">This booking was cancelled</p>
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
                <>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange('ACCEPTED')}
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? <Loader2 size={14} className="animate-spin mr-2 inline" /> : null}
                    Accept Booking
                  </Button>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
                    onClick={() => handleStatusChange('CANCELLED')}
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? <Loader2 size={14} className="animate-spin mr-2 inline" /> : null}
                    Decline Booking
                  </Button>
                </>
              )}
              {booking.status === 'ACCEPTED' && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  disabled={statusUpdating}
                >
                  {statusUpdating ? <Loader2 size={14} className="animate-spin mr-2 inline" /> : null}
                  Mark Sample Collected
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
                    <Input type="number" step="0.1" label="Nitrogen (N)" placeholder="mg/kg" value={reportData.nitrogen} onChange={(e) => setReportData({ ...reportData, nitrogen: e.target.value })} required />
                  </div>
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <Input type="number" step="0.1" label="Phosphorus (P)" placeholder="mg/kg" value={reportData.phosphorus} onChange={(e) => setReportData({ ...reportData, phosphorus: e.target.value })} required />
                  </div>
                  <div className="p-3 bg-green-50/50 rounded-xl border border-green-100">
                    <Input type="number" step="0.1" label="Potassium (K)" placeholder="mg/kg" value={reportData.potassium} onChange={(e) => setReportData({ ...reportData, potassium: e.target.value })} required />
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <Input type="number" step="0.1" label="pH Level" placeholder="e.g. 6.5" value={reportData.ph} onChange={(e) => setReportData({ ...reportData, ph: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Technician Notes</label>
                  <textarea
                    className="w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Provide fertilizer and pH leveling recommendations based on these results..."
                    value={reportData.technicianNotes}
                    onChange={(e) => setReportData({ ...reportData, technicianNotes: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-2 items-center px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors relative">
                    <UploadCloud size={16} />
                    <span>{selectedFile ? selectedFile.name : 'Attach PDF (Optional, max 900KB)'}</span>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting || booking.status !== 'IN_PROGRESS' || !reportData.nitrogen || !reportData.phosphorus || !reportData.potassium || !reportData.ph || !reportData.technicianNotes}
                  >
                    {submitting
                      ? <><Loader2 size={14} className="animate-spin mr-2 inline" />Uploading…</>
                      : 'Submit Report'}
                  </Button>
                </div>

                {booking.status === 'PENDING' && (
                  <p className="text-xs text-amber-600 text-center">Accept the booking first before uploading results.</p>
                )}
                {booking.status === 'ACCEPTED' && (
                  <p className="text-xs text-amber-600 text-center">Mark sample as collected before uploading results.</p>
                )}
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
