'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, Avatar, Badge, Alert, EmptyState, Spinner } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import type { SoilmitraProfile, SoilTestBooking } from '@farmhith/types';
import { Loader2, CheckCircle2, Star, ShieldCheck, ArrowLeft, FileText, Video } from 'lucide-react';

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
    farmerConsentedReport: true,
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
      const tests = snap.docs.map(d => ({ id: d.id, ...d.data() } as SoilTestBooking & { id: string }));
      setCompletedTests(tests);
      if (tests.length > 0) {
        setForm(f => ({ ...f, linkedReportId: tests[0].id }));
      }
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
        <Loader2 size={28} className="animate-spin text-amber-700" />
      </div>
    );
  }

  if (notFound || !mitra) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-slate-500">
        <p className="font-semibold text-slate-800">Soil-Mitra profile not found.</p>
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<CheckCircle2 size={36} className="text-amber-700" />}
          title="Consultation Booked Successfully!"
          description="Your video consultation with the Soil-Mitra has been scheduled."
          action={
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <Spinner size="sm" /> Redirecting to session room...
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-800">
      <SectionHeader
        title="Book Soil-Mitra Consultation"
        description="Schedule a 1-on-1 expert video session for crop advice and soil diagnosis."
      />

      {/* Mitra profile summary */}
      <Card className="bg-white border-slate-200/90 shadow-card">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl overflow-hidden border-2 border-amber-200 shrink-0">
            <Avatar name={mitra.fullName} size="lg" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-lg">{mitra.fullName}</h3>
              <Badge variant="harvest" size="sm">
                <ShieldCheck size={12} className="inline mr-1" /> Verified
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-800">{mitra.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({mitra.totalSessions} sessions)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {mitra.specialisation.map(spec => (
                <Badge key={spec} variant="default" size="sm" className="bg-slate-100 text-slate-700">{spec}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">Consultation Fee:</span>
              <span className="text-lg font-extrabold text-amber-800">{formatCurrency(mitra.sessionFee)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Booking form */}
      <Card className="bg-white border-slate-200/90 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="Crop / Issue Under Discussion *"
            placeholder="e.g. Basmati Rice - Leaf Blight & Yellowing"
            value={form.cropType}
            onChange={(e) => setForm({ ...form, cropType: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Farm Details & Problem Description
            </label>
            <textarea
              className="w-full h-24 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none shadow-xs"
              placeholder="Describe your observations (e.g. yellow patches after recent rain, insect damage, fertilizer applied so far)..."
              value={form.farmDetails}
              onChange={(e) => setForm({ ...form, farmDetails: e.target.value })}
            />
          </div>

          {/* Report sharing consent */}
          <div className="space-y-3 p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.farmerConsentedReport}
                onChange={(e) => setForm({ ...form, farmerConsentedReport: e.target.checked, linkedReportId: '' })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-700 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Attach Soil Health Report</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Allows the Soil-Mitra to review your calibrated NPK & pH data during the video consultation.
                </p>
              </div>
            </label>

            {form.farmerConsentedReport && (
              <div className="pt-2">
                <Select
                  label="Select Report to Share"
                  value={form.linkedReportId}
                  onChange={(val) => setForm({ ...form, linkedReportId: val })}
                  options={[
                    { label: completedTests.length === 0 ? 'No completed soil tests found' : 'Select a completed soil report…', value: '' },
                    ...completedTests.map(test => ({
                      label: `${test.labName} — ${test.cropType} (${new Date(test.collectionDate).toLocaleDateString('en-IN')})`,
                      value: test.id,
                    })),
                  ]}
                />
              </div>
            )}
          </div>

          {error && (
            <Alert variant="error" title="Booking Issue">
              <p>{error}</p>
            </Alert>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Total Consultation Fee</p>
              <p className="text-2xl font-extrabold text-amber-800">{formatCurrency(mitra.sessionFee)}</p>
              <p className="text-[11px] text-slate-400">Direct online video consultation</p>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                disabled={submitting || !form.sessionDate || !form.sessionTime || !form.cropType}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Confirm Consultation
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

