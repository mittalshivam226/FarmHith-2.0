'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, useToast, Checkbox } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

const PRICING_MODEL: Record<string, number> = {
  'Paddy Straw': 2500,
  'Wheat Straw': 2200,
  'Sugarcane Bagasse': 1800,
  'Cotton Stalks': 1600,
  'Maize Stalks': 1400,
};

export default function CreateListingPage() {
  const router = useRouter();
  const { user, getToken } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    residueType: '',
    quantityTons: '',
    location: '',
    availableFrom: '',
    termsAccepted: false,
  });

  const pricePerTon = form.residueType ? (PRICING_MODEL[form.residueType] ?? 0) : 0;
  const estimatedPrice = pricePerTon && form.quantityTons
    ? pricePerTon * parseFloat(form.quantityTons)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.termsAccepted) return;
    setSubmitting(true);

    try {
      const idToken = await getToken();
      const res = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          residueType:   form.residueType,
          quantityTons:  parseFloat(form.quantityTons),
          location:      form.location,
          availableFrom: form.availableFrom,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to create listing');
      }
      const data = await res.json();

      toast.show({
        title: 'Listing Created',
        message: `Your crop residue is now visible to bio-pellet plants. FarmHith price: ${formatCurrency(data.farmhithPricePerTon)}/ton`,
        type: 'success',
      });
      router.push('/dashboard/marketplace');
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Error', message: err.message ?? 'Failed to create listing. Please try again.', type: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Create Marketplace Listing"
        description="Sell your crop residue to verified bio-pellet manufacturing plants."
        action={
          <Button variant="outline" onClick={() => router.back()} className="gap-2">
            <ArrowLeft size={16} /> Back
          </Button>
        }
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Select
              label="Crop Residue Type"
              value={form.residueType}
              onChange={(val) => setForm({ ...form, residueType: val })}
              options={[
                { label: 'Select residue type...', value: '' },
                { label: 'Paddy Straw (₹2,500/ton)', value: 'Paddy Straw' },
                { label: 'Wheat Straw (₹2,200/ton)', value: 'Wheat Straw' },
                { label: 'Sugarcane Bagasse (₹1,800/ton)', value: 'Sugarcane Bagasse' },
                { label: 'Cotton Stalks (₹1,600/ton)', value: 'Cotton Stalks' },
                { label: 'Maize Stalks (₹1,400/ton)', value: 'Maize Stalks' },
              ]}
              required
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Estimated Quantity (Tons)"
                placeholder="e.g. 5.5"
                value={form.quantityTons}
                onChange={(e) => setForm({ ...form, quantityTons: e.target.value })}
                required
              />
              <Input
                type="date"
                label="Available For Pickup From"
                value={form.availableFrom}
                onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                required
              />
            </div>

            <Input
              label="Pickup Location / Village"
              placeholder="e.g. Ludhiana, Punjab"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          {/* Price summary */}
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">FarmHith Assured Rate</span>
              {form.residueType ? (
                <span className="text-sm font-medium text-green-700">{formatCurrency(pricePerTon)} / ton</span>
              ) : (
                <span className="text-xs text-gray-400">Select residue type</span>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-green-200/50 text-base">
              <span className="font-semibold text-gray-900">Estimated Total Value</span>
              <span className="font-bold text-lg text-green-700">{formatCurrency(estimatedPrice)}</span>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50">
            <div className="mt-0.5">
              <Checkbox
                checked={form.termsAccepted}
                onChange={(checked) => setForm({ ...form, termsAccepted: checked as boolean })}
              />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 flex items-center gap-1.5 mb-1">
                <ShieldCheck size={16} className="text-green-600" /> Platform Guarantee
              </p>
              I confirm the quality and approximate quantity of the residue. I understand FarmHith will arrange logistics and payment upon successful collection.
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              disabled={submitting || !form.residueType || !form.quantityTons || !form.availableFrom || !form.location || !form.termsAccepted}
            >
              {submitting ? <><Loader2 size={14} className="animate-spin mr-2 inline" />Publishing…</> : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
