'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, useToast } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useAvailableLabs } from '@farmhith/hooks';
import { db } from '@farmhith/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function BookSoilTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { data: labs, loading: loadingLabs } = useAvailableLabs();

  const [form, setForm] = useState({
    labId: searchParams?.get('labId') ?? '',
    cropType: '',
    landParcelDetails: '',
    collectionDate: '',
  });

  const selectedLab = labs.find(l => l.userId === form.labId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedLab) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'soilTestBookings'), {
        farmerId: user.id,
        farmerName: user.name,
        labId: selectedLab.userId,
        labName: selectedLab.labName,
        cropType: form.cropType,
        landParcelDetails: form.landParcelDetails,
        collectionDate: form.collectionDate,
        status: 'PENDING',
        amountPaid: selectedLab.perTestPrice,
        reportConsentToMitra: false,   // required by SoilTestBooking type
        report: null,
        createdAt: new Date().toISOString(),
      });

      toast.show({
        title: 'Booking Confirmed',
        message: `Your soil test with ${selectedLab.labName} has been booked.`,
        type: 'success',
      });
      router.push('/dashboard/soil-test');
    } catch (err) {
      console.error(err);
      toast.show({ title: 'Error', message: 'Failed to book. Please try again.', type: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Book Soil Test"
        description="Schedule a sample collection with a verified lab near you."
      />

      <Card>
        {loadingLabs ? (
          <div className="flex justify-center py-10">
            <Loader2 size={22} className="animate-spin text-gray-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Select Lab"
              value={form.labId}
              onChange={(val) => setForm({ ...form, labId: val })}
              options={[
                { label: 'Select a lab...', value: '' },
                ...labs.map(lab => ({
                  label: `${lab.labName} — ${formatCurrency(lab.perTestPrice)}/test`,
                  value: lab.userId,
                })),
              ]}
              required
            />

            {selectedLab && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
                <p className="font-semibold">{selectedLab.labName}</p>
                <p className="text-xs mt-0.5 text-blue-600">{selectedLab.address} · Capacity: {selectedLab.dailyCapacity}/day</p>
                <p className="font-bold mt-1">{formatCurrency(selectedLab.perTestPrice)} per test</p>
              </div>
            )}

            <Input
              label="Crop Type"
              placeholder="e.g. Wheat, Paddy, Sugarcane"
              value={form.cropType}
              onChange={(e) => setForm({ ...form, cropType: e.target.value })}
              required
            />

            <Input
              label="Land Parcel Details / Area"
              placeholder="e.g. 5 Acres, North Field"
              value={form.landParcelDetails}
              onChange={(e) => setForm({ ...form, landParcelDetails: e.target.value })}
              required
            />

            <Input
              type="date"
              label="Preferred Collection Date"
              value={form.collectionDate}
              onChange={(e) => setForm({ ...form, collectionDate: e.target.value })}
              required
            />

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !form.labId || !form.cropType || !form.collectionDate}
              >
                {submitting ? <><Loader2 size={14} className="animate-spin mr-2 inline" />Booking…</> : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
