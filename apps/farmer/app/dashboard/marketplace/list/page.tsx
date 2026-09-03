'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Input, Select, Button, useToast, Checkbox, Alert } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { ShieldCheck, ArrowLeft, Sparkles, Weight, IndianRupee, MapPin, Calendar } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    residueType: '',
    quantityTons: '',
    location: '',
    availableFrom: '',
    termsAccepted: true,
  });

  const pricePerTon = form.residueType ? (PRICING_MODEL[form.residueType] ?? 0) : 0;
  const estimatedPrice = pricePerTon && form.quantityTons
    ? pricePerTon * parseFloat(form.quantityTons)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.termsAccepted) return;
    
    if (parseFloat(form.quantityTons) <= 0) {
      setError('Quantity must be greater than 0 tons.');
      return;
    }
    
    setError(null);
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
        title: 'Listing Published!',
        message: `Your lot is now live for buyers. Assured rate: ${formatCurrency(data.farmhithPricePerTon)}/ton`,
        type: 'success',
      });
      router.push('/dashboard/marketplace');
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Failed to create listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-800">
      <SectionHeader
        title="List Crop Residue for Sale"
        description="Sell harvest biomass directly to verified bio-pellet plants at assured FarmHith rates."
        action={
          <Button variant="outline" onClick={() => router.back()} className="gap-1.5">
            <ArrowLeft size={16} /> Back to Marketplace
          </Button>
        }
      />

      <Card className="bg-white border-slate-200/90 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Select
              label="Select Crop Residue Type *"
              value={form.residueType}
              onChange={(val) => setForm({ ...form, residueType: val })}
              options={[
                { label: 'Select residue type…', value: '' },
                { label: 'Paddy Straw (₹2,500 / Ton Assured)', value: 'Paddy Straw' },
                { label: 'Wheat Straw (₹2,200 / Ton Assured)', value: 'Wheat Straw' },
                { label: 'Sugarcane Bagasse (₹1,800 / Ton Assured)', value: 'Sugarcane Bagasse' },
                { label: 'Cotton Stalks (₹1,600 / Ton Assured)', value: 'Cotton Stalks' },
                { label: 'Maize Stalks (₹1,400 / Ton Assured)', value: 'Maize Stalks' },
              ]}
              required
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Approximate Quantity (Tons) *"
                placeholder="e.g. 8.5"
                value={form.quantityTons}
                onChange={(e) => setForm({ ...form, quantityTons: e.target.value })}
                required
              />
              <Input
                type="date"
                label="Available For Pickup Date *"
                value={form.availableFrom}
                onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                required
              />
            </div>

            <Input
              label="Field Pickup Location / Village Landmark *"
              placeholder="e.g. North Canal Road, Village Samana, Patiala"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          {/* Real-Time Revenue Calculator */}
          <div className="bg-gradient-to-r from-emerald-50 via-primary-50 to-teal-50 border border-primary-200/80 p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-700">FarmHith Assured Rate</span>
              {form.residueType ? (
                <span className="font-extrabold text-primary-800">{formatCurrency(pricePerTon)} / Ton</span>
              ) : (
                <span className="text-xs text-slate-400">Select residue type above</span>
              )}
            </div>
            <div className="flex items-center justify-between pt-2.5 border-t border-primary-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">Estimated Total Farmer Revenue</p>
                <p className="text-[11px] text-slate-500">Paid directly to your bank upon weighing</p>
              </div>
              <span className="text-2xl font-black text-primary-700">{formatCurrency(estimatedPrice)}</span>
            </div>
          </div>

          {/* Guarantee & Terms */}
          <label className="flex items-start gap-3 p-4 rounded-2xl border border-primary-100 bg-primary-50/40 hover:bg-primary-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-500"
            />
            <div className="text-xs sm:text-sm text-slate-600">
              <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-0.5">
                <ShieldCheck size={16} className="text-primary-700" /> Guaranteed Fair Weighing & Logistics Support
              </p>
              I confirm the approximate weight and dry quality of this residue. FarmHith coordinates verified weighbridge pickups and prompt payment upon collection.
            </div>
          </label>

          {error && (
            <Alert variant="error" title="Input Issue">
              <p>{error}</p>
            </Alert>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              loading={submitting}
              disabled={submitting || !form.residueType || !form.quantityTons || !form.availableFrom || !form.location || !form.termsAccepted}
            >
              Publish Marketplace Listing
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

