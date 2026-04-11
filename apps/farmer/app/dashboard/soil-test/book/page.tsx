'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, SectionHeader, Input, Select, Button, useToast } from '@farmhith/ui';
import { mockLabs } from '../../../../lib/mock-data';

export default function BookSoilTestPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    labId: '',
    cropType: '',
    landParcelDetails: '',
    collectionDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate booking
    setTimeout(() => {
      setLoading(false);
      toast.show({
        title: 'Booking Confirmed',
        message: 'Your soil test has been successfully booked.',
        type: 'success',
      });
      router.push('/dashboard/soil-test');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Book Soil Test"
        description="Schedule a sample collection with a verified lab near you."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Lab"
            value={form.labId}
            onChange={(val) => setForm({ ...form, labId: val })}
            options={[
              { label: 'Select a lab...', value: '' },
              ...mockLabs.map(lab => ({ label: `${lab.labName} (₹${lab.perTestPrice}/test)`, value: lab.userId }))
            ]}
            required
          />

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
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !form.labId || !form.cropType}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
