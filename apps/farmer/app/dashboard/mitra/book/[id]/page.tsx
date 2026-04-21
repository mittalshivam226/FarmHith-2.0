'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, useToast, Avatar, Badge } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { SoilmitraProfile } from '@farmhith/types';
import { Loader2, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DURATION_OPTIONS = [
  { label: '30 Minutes', value: '30' },
  { label: '45 Minutes', value: '45' },
  { label: '60 Minutes', value: '60' },
];

export default function BookMitraPage() {
  const router = useRouter();
  const params = useParams();
  const { user, getToken } = useAuth();
  const toast = useToast();
  const mitraId = params?.id as string;

  const [mitra, setMitra] = useState<(SoilmitraProfile & { id: string }) | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    sessionDate: '',
    sessionTime: '',
    cropType: '',
    farmDetails: '',
    durationMinutes: '30',
  });

  useEffect(() => {
    if (!mitraId) return;
    (async () => {
      const snap = await getDoc(doc(db, 'soilmitraProfiles', mitraId));
      if (!snap.exists()) {
        setNotFound(true);
      } else {
        setMitra({ id: snap.id, ...snap.data() } as SoilmitraProfile & { id: string });
      }
      setFetchLoading(false);
    })();
  }, [mitraId]);

  const calculatedFee = mitra ? Math.round(mitra.sessionFee * (parseInt(form.durationMinutes) / 30)) : 0;

  const handleBookAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !mitra) return;
    setSubmitting(true);

    try {
      const idToken = await getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      };

      // 1. Create mitra booking via server API
      const bookRes = await fetch('/api/mitra/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mitraId: mitra.userId,
          sessionDatetime: `${form.sessionDate}T${form.sessionTime}:00`,
          cropType: form.cropType,
          farmDetails: form.farmDetails,
          durationMinutes: parseInt(form.durationMinutes),
          farmerConsentedReport: false,
        }),
      });

      if (!bookRes.ok) {
        const err = await bookRes.json();
        throw new Error(err.error ?? 'Failed to create booking');
      }
      const { bookingId, amount } = await bookRes.json();

      // 2. Create Razorpay order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: amount ?? calculatedFee,
          serviceType: 'MITRA_SESSION',
          serviceRefId: bookingId,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error ?? 'Failed to create payment order');
      }
      const { razorpayOrderId, amount: paise } = await orderRes.json();

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paise,
        currency: 'INR',
        name: 'FarmHith',
        description: `Consultation with ${mitra.fullName}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          // 4. Verify payment on server
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              serviceType:       'MITRA_SESSION',
              serviceRefId:      bookingId,
              amount:            calculatedFee,
              payeeUid:          mitra.userId,
            }),
          });

          if (verifyRes.ok) {
            toast.show({ title: 'Booking Confirmed!', message: `Session with ${mitra.fullName} booked.`, type: 'success' });
            router.push('/dashboard/mitra');
          } else {
            toast.show({ title: 'Payment Verification Failed', message: 'Please contact support.', type: 'error' });
          }
        },
        prefill: {
          name:  user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#0d9488' }, // teal-600
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Booking Failed', message: err.message ?? 'Please try again.', type: 'error' });
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

        <form onSubmit={handleBookAndPay} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Preferred Date" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} required />
            <Input type="time" label="Preferred Time" value={form.sessionTime} onChange={(e) => setForm({ ...form, sessionTime: e.target.value })} required />
          </div>

          <Select
            label="Session Duration"
            value={form.durationMinutes}
            onChange={(val) => setForm({ ...form, durationMinutes: val })}
            options={DURATION_OPTIONS}
            required
          />

          <Input label="Crop Type" placeholder="What crop are you growing?" value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })} required />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Farm Details / Problem Description</label>
            <textarea
              className="w-full h-24 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
              placeholder="Describe the issue (e.g. Yellowing leaves, pest attack)..."
              value={form.farmDetails}
              onChange={(e) => setForm({ ...form, farmDetails: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Consultation Fee</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(calculatedFee)}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>Cancel</Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !form.sessionDate || !form.sessionTime || !form.cropType}
                className="flex items-center gap-2"
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin mr-1 inline" />Processing…</>
                  : <><CreditCard size={14} className="inline mr-1" />Pay & Book</>
                }
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
