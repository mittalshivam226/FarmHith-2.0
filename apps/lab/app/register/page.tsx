'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Select } from '@farmhith/ui';
import { Upload, FileCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function LabRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    labName: '',
    address: '',
    state: '',
    district: '',
    perTestPrice: '',
    dailyCapacity: '',
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to register lab profile
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/bookings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Setup Your Lab Profile
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Step {step} of 2
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="labName">Lab Name / Organization</Label>
                  <Input
                    id="labName"
                    required
                    value={formData.labName}
                    onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                    placeholder="e.g. AgriTest Punjab Labs"
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
                      placeholder="e.g. Ludhiana"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, Plot No, etc."
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link href="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                  Cancel
                </Link>
                <Button type="submit">
                  Continue Form
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <Label>Accreditation / Certification Upload</Label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <span className="relative rounded-md font-medium text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                          Upload NABL/Govt Certificate
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="perTestPrice">Price per Standard Test (₹)</Label>
                    <Input
                      id="perTestPrice"
                      type="number"
                      required
                      value={formData.perTestPrice}
                      onChange={(e) => setFormData({ ...formData, perTestPrice: e.target.value })}
                      placeholder="e.g. 299"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyCapacity">Daily Test Capacity</Label>
                    <Input
                      id="dailyCapacity"
                      type="number"
                      required
                      value={formData.dailyCapacity}
                      onChange={(e) => setFormData({ ...formData, dailyCapacity: e.target.value })}
                      placeholder="e.g. 50"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" isLoading={loading} className="gap-2">
                  <FileCheck className="w-4 h-4" />
                  Complete Registration
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
