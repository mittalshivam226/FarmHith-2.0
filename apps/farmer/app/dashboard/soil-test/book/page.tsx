'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, useToast } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { useAvailableLabs } from '@farmhith/hooks';
import { Loader2, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookSoilTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, getToken } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { data: labs, loading: loadingLabs } = useAvailableLabs();

  const [form, setForm] = useState({
    labId: searchParams?.get('labId') ?? '',
    cropType: '',
    landParcelDetails: '',
    collectionDate: '',
    reportConsentToMitra: false,
  });

  const selectedLab = labs.find(l => l.userId === form.labId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedLab) return;
    setSubmitting(true);

    try {
      const idToken = await getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      };

      // 1. Create soil test booking via server API
      const bookRes = await fetch('/api/soil-test/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          labId:              selectedLab.userId,
          cropType:           form.cropType,
          landParcelDetails:  form.landParcelDetails,
          collectionDate:     form.collectionDate,
          reportConsentToMitra: form.reportConsentToMitra,
        }),
      });

      if (!bookRes.ok) {
        const err = await bookRes.json();
        throw new Error(err.error ?? 'Failed to create booking');
      }
      const { bookingId, amountPaid } = await bookRes.json();

      // 2. Create Razorpay order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount:       amountPaid ?? selectedLab.perTestPrice,
          serviceType:  'SOIL_TEST',
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
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      paise,
        currency:    'INR',
        name:        'FarmHith',
        description: `Soil Test — ${selectedLab.labName}`,
        order_id:    razorpayOrderId,
        handler: async (response: any) => {
          // 4. Verify payment
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              serviceType:       'SOIL_TEST',
              serviceRefId:      bookingId,
              amount:            amountPaid ?? selectedLab.perTestPrice,
              payeeUid:          selectedLab.userId,
            }),
          });

          if (verifyRes.ok) {
            toast.show({ title: 'Booking Confirmed!', message: `Soil test with ${selectedLab.labName} booked.`, type: 'success' });
            router.push('/dashboard/soil-test');
          } else {
            toast.show({ title: 'Payment Verification Failed', message: 'Please contact support.', type: 'error' });
          }
        },
        prefill: {
          name:    user.name,
          email:   user.email,
          contact: user.phone,
        },
        theme: { color: '#2563eb' }, // blue-600
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Booking Failed', message: err.message ?? 'Please try again.', type: 'error' });
    } finally {
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

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.reportConsentToMitra}
                onChange={(e) => setForm({ ...form, reportConsentToMitra: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 leading-snug">
                I consent to share my soil report with Soil-Mitras for consultation purposes.
              </span>
            </label>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                {selectedLab && (
                  <>
                    <p className="text-xs text-gray-500">Amount to Pay</p>
                    <p className="text-lg font-bold text-blue-700">{formatCurrency(selectedLab.perTestPrice)}</p>
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
                  disabled={submitting || !form.labId || !form.cropType || !form.collectionDate}
                  className="flex items-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={14} className="animate-spin inline mr-1" />Processing…</>
                    : <><CreditCard size={14} className="inline mr-1" />Pay & Book</>
                  }
                </Button>
              </div>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
