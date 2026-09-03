'use client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, Alert, EmptyState, Spinner } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useAvailableLabs } from '@farmhith/hooks';
import { Loader2, FlaskConical, CheckCircle2 } from 'lucide-react';

// Inner component uses useSearchParams — must be inside <Suspense>
function BookSoilTestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, getToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: labs, loading: loadingLabs } = useAvailableLabs();

  const [form, setForm] = useState({
    labId: searchParams?.get('labId') ?? '',
    cropType: '',
    landParcelDetails: '',
    collectionDate: '',
    reportConsentToMitra: true,
  });

  const selectedLab = labs.find(l => l.id === form.labId);

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.labId) { setError('Please select a testing lab from the list.'); return; }
    if (!form.cropType.trim()) { setError('Please enter the type of crop you are growing.'); return; }
    if (!form.collectionDate) { setError('Please select a preferred date for the sample collection.'); return; }
    if (form.landParcelDetails.trim().length < 5) { setError('Land parcel details must be at least 5 characters long to help the collector locate your field.'); return; }

    setError(null);
    setSubmitting(true);

    try {
      const idToken = await getToken();
      const res = await fetch('/api/soil-test/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          labId:                form.labId,
          cropType:             form.cropType.trim(),
          landParcelDetails:    form.landParcelDetails.trim(),
          collectionDate:       form.collectionDate,
          reportConsentToMitra: form.reportConsentToMitra,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to create booking');
      }

      const { bookingId } = await res.json();
      setSuccess('Booking created successfully!');
      setTimeout(() => router.push(`/dashboard/soil-test/${bookingId}`), 800);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<CheckCircle2 size={36} className="text-primary-700" />}
          title="Soil Test Scheduled Successfully!"
          description="Your sample pickup has been confirmed with the testing laboratory."
          action={
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <Spinner size="sm" /> Redirecting to booking tracking...
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-800">
      <SectionHeader
        title="Book Certified Soil Test"
        description="Schedule a doorstep soil sample collection with a verified testing lab."
      />

      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-xs font-semibold">
        <div className="flex items-center gap-2 text-primary-800">
          <span className="h-5 w-5 rounded-full bg-primary-700 text-white flex items-center justify-center text-[10px]">1</span>
          <span>Choose Lab</span>
        </div>
        <span className="text-slate-300">→</span>
        <div className="flex items-center gap-2 text-primary-800">
          <span className="h-5 w-5 rounded-full bg-primary-700 text-white flex items-center justify-center text-[10px]">2</span>
          <span>Farm Details</span>
        </div>
        <span className="text-slate-300">→</span>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">3</span>
          <span>Doorstep Pickup</span>
        </div>
      </div>

      <Card className="bg-white border-slate-200/90 shadow-card">
        {loadingLabs ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-primary-700" />
          </div>
        ) : labs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <FlaskConical size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-slate-700">No verified labs available right now.</p>
            <p className="text-xs mt-1">Please check back shortly or contact FarmHith support.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Select Testing Laboratory *"
              value={form.labId}
              onChange={(val) => setForm({ ...form, labId: val })}
              options={[
                { label: 'Select a certified lab…', value: '' },
                ...labs.map(lab => ({
                  label: `${lab.labName} — ${formatCurrency(lab.perTestPrice)}/test (${lab.district ?? 'Local'})`,
                  value: lab.id,
                })),
              ]}
              required
            />

            {selectedLab && (
              <div className="p-4 bg-primary-50/70 border border-primary-100 rounded-2xl text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-700 flex items-center justify-center shrink-0 text-white shadow-xs">
                    <FlaskConical size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{selectedLab.labName}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{selectedLab.address || `${selectedLab.district ?? ''}, ${selectedLab.state ?? ''}`}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-primary-800 font-extrabold text-sm">{formatCurrency(selectedLab.perTestPrice)} per sample</span>
                      <span className="text-xs text-slate-500">Daily Capacity: {selectedLab.dailyCapacity} tests</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Primary Crop Growing *"
              placeholder="e.g. Paddy (Basmati), Wheat, Cotton, Sugarcane"
              value={form.cropType}
              onChange={(e) => setForm({ ...form, cropType: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Land Parcel Details & Field Location *
              </label>
              <textarea
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-900 resize-none shadow-xs"
                rows={3}
                placeholder="e.g. 4.5 Acres, East side near village canal pump"
                value={form.landParcelDetails}
                onChange={(e) => setForm({ ...form, landParcelDetails: e.target.value })}
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Provide clear landmarks to help the technician collect the sample.</p>
            </div>

            <Input
              type="date"
              label="Preferred Sample Collection Date *"
              value={form.collectionDate}
              onChange={(e) => setForm({ ...form, collectionDate: e.target.value })}
              min={minDate}
              required
            />

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl border border-primary-100 bg-primary-50/50 hover:bg-primary-50 transition-colors">
              <input
                type="checkbox"
                checked={form.reportConsentToMitra}
                onChange={(e) => setForm({ ...form, reportConsentToMitra: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-500"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Share Report with Soil-Mitra (Recommended)</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Allows agricultural experts to automatically inspect your soil parameters when you book consultations.
                </p>
              </div>
            </label>

            {error && (
              <Alert variant="error" title="Submission Issue">
                <p>{error}</p>
              </Alert>
            )}

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                {selectedLab && (
                  <div>
                    <p className="text-xs text-slate-500">Assured Testing Fee</p>
                    <p className="text-2xl font-extrabold text-primary-700">{formatCurrency(selectedLab.perTestPrice)}</p>
                    <p className="text-[11px] text-slate-400">Payment collected on doorstep sample collection</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  disabled={submitting || !form.labId || !form.cropType || !form.collectionDate || !form.landParcelDetails}
                >
                  Confirm & Schedule Pickup
                </Button>
              </div>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

// Page wrapper — required so Next.js can statically render the route boundary
// while the inner form waits for searchParams to resolve
export default function BookSoilTestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <BookSoilTestForm />
    </Suspense>
  );
}
