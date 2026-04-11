'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, SectionHeader, Input, Select, Button, useToast, Avatar, Badge } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { mockSoilMitras } from '../../../../../lib/mock-data';

export default function BookMitraPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const mitraId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sessionDate: '',
    sessionTime: '',
    cropType: '',
    problemDescription: '',
    durationMinutes: '30',
  });

  const mitra = mockSoilMitras.find(m => m.userId === mitraId);

  if (!mitra) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-gray-500">
        Soil-Mitra not found.
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  const durationOptions = [
    { label: '30 Minutes', value: '30' },
    { label: '45 Minutes', value: '45' },
    { label: '60 Minutes', value: '60' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate booking
    setTimeout(() => {
      setLoading(false);
      toast.show({
        title: 'Session Booked',
        message: `Your consultation with ${mitra.fullName} has been scheduled.`,
        type: 'success',
      });
      router.push('/dashboard/mitra');
    }, 1500);
  };

  const calculatedFee = mitra.sessionFee * (parseInt(form.durationMinutes) / 30);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Book Consultation"
        description="Schedule an expert session to resolve your crop issues."
      />

      <Card>
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
          <Avatar name={mitra.fullName} size="lg" />
          <div>
            <h3 className="font-bold text-gray-900">{mitra.fullName}</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mitra.specialisation.slice(0, 2).map((spec, idx) => (
                <Badge key={idx} variant="success" size="sm">{spec}</Badge>
              ))}
              {mitra.specialisation.length > 2 && (
                <Badge variant="default" size="sm">+{mitra.specialisation.length - 2}</Badge>
              )}
            </div>
            <p className="text-sm font-medium text-green-700 mt-2">
              {formatCurrency(mitra.sessionFee)} / 30 min
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Preferred Date"
              value={form.sessionDate}
              onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
              required
            />
            <Input
              type="time"
              label="Preferred Time"
              value={form.sessionTime}
              onChange={(e) => setForm({ ...form, sessionTime: e.target.value })}
              required
            />
          </div>

          <Select
            label="Session Duration"
            value={form.durationMinutes}
            onChange={(val) => setForm({ ...form, durationMinutes: val })}
            options={durationOptions}
            required
          />

          <Input
            label="Crop Type"
            placeholder="What crop are you growing?"
            value={form.cropType}
            onChange={(e) => setForm({ ...form, cropType: e.target.value })}
            required
          />

          {/* Fallback to Input for textarea to keep dependencies simple and use existing UI package */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Problem Description</label>
            <textarea
              className="w-full h-24 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
              placeholder="Briefly describe the issue (e.g. Yellowing leaves, pest attack)..."
              value={form.problemDescription}
              onChange={(e) => setForm({ ...form, problemDescription: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Consultation Fee</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(calculatedFee)}</p>
            </div>
            <div className="flex justify-end gap-3">
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
                disabled={loading || !form.sessionDate || !form.sessionTime || !form.cropType}
              >
                {loading ? 'Booking...' : 'Pay & Book'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
