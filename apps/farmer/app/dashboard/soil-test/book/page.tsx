'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useAvailableLabs } from '@farmhith/hooks';
import { Loader2, FlaskConical, CheckCircle2 } from 'lucide-react';

export default function BookSoilTestPage() {
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
    reportConsentToMitra: false,
  });

  const selectedLab = labs.find(l => l.id === form.labId);

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.labId) { setError('Please select a lab'); return; }
    if (!form.cropType.trim()) { setError('Please enter crop type'); return; }
    if (!form.collectionDate) { setError('Please select a collection date'); return; }
    if (!form.landParcelDetails.trim()) { setError('Please enter land parcel details'); return; }

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
          labId:                form.labId,   // lab.id === labProfile doc ID === userId
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <p className="text-lg font-semibold text-gray-900">Booking Confirmed!</p>
        <p className="text-sm text-gray-500">Redirecting to your booking details…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Book Soil Test"
        description="Schedule a soil sample collection with a verified lab near you."
      />

      <Card>
        {loadingLabs ? (
          <div className="flex justify-center py-10">
            <Loader2 size={22} className="animate-spin text-gray-400" />
          </div>
        ) : labs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FlaskConical size={32} className="mx-auto mb-3 opacity-30" />
            <p>No verified labs available yet.</p>
            <p className="text-sm mt-1">Check back later or contact admin.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Select Lab *"
              value={form.labId}
              onChange={(val) => setForm({ ...form, labId: val })}
              options={[
                { label: 'Select a lab…', value: '' },
                ...labs.map(lab => ({
                  label: `${lab.labName} — ${formatCurrency(lab.perTestPrice)}/test (${lab.district ?? ''})`,
                  value: lab.id,
                })),
              ]}
              required
            />

            {selectedLab && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <FlaskConical size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">{selectedLab.labName}</p>
                    <p className="text-xs text-blue-700 mt-0.5">{selectedLab.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-blue-700 font-bold">{formatCurrency(selectedLab.perTestPrice)} per test</span>
                      <span className="text-xs text-blue-500">Capacity: {selectedLab.dailyCapacity}/day</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Crop Type *"
              placeholder="e.g. Wheat, Paddy, Sugarcane"
              value={form.cropType}
              onChange={(e) => setForm({ ...form, cropType: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Land Parcel Details *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 resize-none"
                rows={3}
                placeholder="e.g. 5 Acres, North Field near village pond"
                value={form.landParcelDetails}
                onChange={(e) => setForm({ ...form, landParcelDetails: e.target.value })}
                required
              />
            </div>

            <Input
              type="date"
              label="Preferred Collection Date *"
              value={form.collectionDate}
              onChange={(e) => setForm({ ...form, collectionDate: e.target.value })}
              min={minDate}
              required
            />

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={form.reportConsentToMitra}
                onChange={(e) => setForm({ ...form, reportConsentToMitra: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Share report with Soil-Mitra</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Allow my Soil-Mitra to view this soil report for consultation purposes.
                </p>
              </div>
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-lg">{error}</p>
            )}

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                {selectedLab && (
                  <>
                    <p className="text-xs text-gray-500">Booking fee</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(selectedLab.perTestPrice)}</p>
                    <p className="text-xs text-gray-400">Payment collected on sample collection</p>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || !form.labId || !form.cropType || !form.collectionDate || !form.landParcelDetails}
                >
                  {submitting ? (
                    <><Loader2 size={14} className="animate-spin inline mr-1" />Booking…</>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
