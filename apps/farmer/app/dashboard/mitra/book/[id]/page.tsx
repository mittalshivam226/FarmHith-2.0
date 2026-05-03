'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, Avatar, Badge } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import type { SoilmitraProfile, SoilTestBooking } from '@farmhith/types';
import { Loader2, CheckCircle2, Star } from 'lucide-react';

export default function BookMitraPage() {
  const router = useRouter();
  const params = useParams();
  const { user, getToken } = useAuth();
  const mitraId = params?.id as string;

  const [mitra, setMitra] = useState<(SoilmitraProfile & { id: string }) | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Farmer's completed soil tests (for report sharing)
  const [completedTests, setCompletedTests] = useState<(SoilTestBooking & { id: string })[]>([]);

  const [form, setForm] = useState({
    sessionDate: '',
    sessionTime: '',
    cropType: '',
    farmDetails: '',
    farmerConsentedReport: false,
    linkedReportId: '',
  });

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (!mitraId) return;
    getDoc(doc(db, 'soilmitraProfiles', mitraId)).then(snap => {
      if (!snap.exists()) {
        setNotFound(true);
      } else {
        setMitra({ id: snap.id, ...snap.data() } as SoilmitraProfile & { id: string });
      }
      setFetchLoading(false);
    });
  }, [mitraId]);

  // Load completed soil tests for report sharing
  useEffect(() => {
    if (!user?.id) return;
    const q = query(
      collection(db, 'soilTestBookings'),
      where('farmerId', '==', user.id),
      where('status', '==', 'COMPLETED')
    );
    getDocs(q).then(snap => {
      setCompletedTests(snap.docs.map(d => ({ id: d.id, ...d.data() } as SoilTestBooking & { id: string })));
    }).catch(console.error);
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !mitra) return;
    if (!form.sessionDate) { setError('Please select a session date'); return; }
    if (!form.sessionTime) { setError('Please select a session time'); return; }
    if (!form.cropType.trim()) { setError('Please enter crop type'); return; }

    setError(null);
    setSubmitting(true);

    try {
      const idToken = await getToken();
      const sessionDatetime = `${form.sessionDate}T${form.sessionTime}:00`;

      const res = await fetch('/api/mitra/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          mitraId: mitra.id,
          sessionDatetime,
          cropType: form.cropType.trim(),
          farmDetails: form.farmDetails.trim() || undefined,
          farmerConsentedReport: form.farmerConsentedReport,
          soilReportId: form.farmerConsentedReport && form.linkedReportId ? form.linkedReportId : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to create booking');
      }

      const { bookingId } = await res.json();
      setSuccess('Session booked successfully!');
      setTimeout(() => router.push(`/dashboard/mitra/${bookingId}`), 800);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
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

  if (notFound || !mitra) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-gray-500">
        Soil-Mitra not found.
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <p className="text-lg font-semibold text-gray-900">Session Booked!</p>
        <p className="text-sm text-gray-500">Redirecting to your session details…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Book Consultation"
        description="Schedule an expert session with this Soil-Mitra."
      />

      {/* Mitra profile summary */}
      <Card>
        <div className="flex items-start gap-4">
          <Avatar name={mitra.fullName} size="lg" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{mitra.fullName}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-700">{mitra.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({mitra.totalSessions} sessions)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {mitra.specialisation.map(spec => (
                <Badge key={spec} variant="success" size="sm">{spec}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-lg font-bold text-green-700">{formatCurrency(mitra.sessionFee)}</span>
              <span className="text-sm text-gray-400">per session</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Booking form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Session Date *"
              value={form.sessionDate}
              onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
              min={minDate}
              required
            />
            <Input
              type="time"
              label="Session Time *"
              value={form.sessionTime}
              onChange={(e) => setForm({ ...form, sessionTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Crop Type *"
            placeholder="What crop are you growing?"
            value={form.cropType}
            onChange={(e) => setForm({ ...form, cropType: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm Details / Problem Description
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the issue (e.g. yellowing leaves, pest attack, nutrient deficiency)..."
              value={form.farmDetails}
              onChange={(e) => setForm({ ...form, farmDetails: e.target.value })}
            />
          </div>

          {/* Report sharing consent */}
          <div className="space-y-3 p-4 bg-teal-50 border border-teal-100 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.farmerConsentedReport}
                onChange={(e) => setForm({ ...form, farmerConsentedReport: e.target.checked, linkedReportId: '' })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Share soil report with Mitra</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Allow this Mitra to view one of your completed soil test reports for better advice.
                </p>
              </div>
            </label>

            {form.farmerConsentedReport && (
              <Select
                label="Select which report to share"
                value={form.linkedReportId}
                onChange={(val) => setForm({ ...form, linkedReportId: val })}
                options={[
                  { label: completedTests.length === 0 ? 'No completed tests yet' : 'Select a report…', value: '' },
                  ...completedTests.map(test => ({
                    label: `${test.labName} — ${test.cropType} (${new Date(test.collectionDate).toLocaleDateString('en-IN')})`,
                    value: test.id,
                  })),
                ]}
              />
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-lg">{error}</p>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Session fee</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(mitra.sessionFee)}</p>
              <p className="text-xs text-gray-400">Collected by Mitra on session day</p>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !form.sessionDate || !form.sessionTime || !form.cropType}
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin mr-1 inline" />Booking…</>
                  : 'Confirm Booking'
                }
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
