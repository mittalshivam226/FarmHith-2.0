'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Select } from '@farmhith/ui';
import { Factory, Leaf, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function BiopelletRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    plantName: '',
    state: '',
    district: '',
    address: '',
    acceptedResidueTypes: '',
    procurementRatePerTon: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/marketplace');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Factory className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Setup Plant Profile
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Start sourcing biomass directly from local farmers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="plantName">Plant / Company Name</Label>
                <Input
                  id="plantName"
                  required
                  value={formData.plantName}
                  onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
                  placeholder="e.g. Greenleaf Bio-Energy Ltd."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    id="state"
                    required
                    value={formData.state}
                    onValueChange={(val) => setFormData({ ...formData, state: val })}
                    className="mt-1"
                    options={[
                      { label: 'Punjab', value: 'Punjab' },
                      { label: 'Haryana', value: 'Haryana' },
                    ]}
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Patiala"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Full Facility Address</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Industrial Zone, etc."
                  className="mt-1"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Label htmlFor="acceptedResidueTypes">Primary Feedstock Needed</Label>
                <Select
                  id="acceptedResidueTypes"
                  value={formData.acceptedResidueTypes}
                  onValueChange={(val) => setFormData({ ...formData, acceptedResidueTypes: val })}
                  className="mt-1"
                  options={[
                    { label: 'Paddy Straw', value: 'Paddy Straw' },
                    { label: 'Wheat Straw', value: 'Wheat Straw' },
                    { label: 'Sugarcane Trash', value: 'Sugarcane Trash' },
                    { label: 'Cotton Stalks', value: 'Cotton Stalks' },
                  ]}
                />
              </div>

              <div>
                <Label htmlFor="procurementRatePerTon">Default Procurement Rate (₹ / Ton)</Label>
                <Input
                  id="procurementRatePerTon"
                  type="number"
                  required
                  value={formData.procurementRatePerTon}
                  onChange={(e) => setFormData({ ...formData, procurementRatePerTon: e.target.value })}
                  placeholder="e.g. 2500"
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">You can negotiate this per order.</p>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <Link href="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                Cancel
              </Link>
              <Button type="submit" isLoading={loading} className="gap-2 w-1/2 justify-center">
                <Leaf className="w-4 h-4" />
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
