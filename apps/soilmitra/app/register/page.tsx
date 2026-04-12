'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Textarea, Select } from '@farmhith/ui';
import { CheckCircle2, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function MitraRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    sessionFee: '',
    specialty1: '',
    specialty2: '',
    language: 'Hindi',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/sessions');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <UserCheck className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Become a Soil-Mitra
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Set up your expert profile and start guiding farmers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Dr. Harpreet Kaur"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell farmers about your agronomy experience..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty1">Primary Specialty</Label>
                  <Input
                    id="specialty1"
                    required
                    value={formData.specialty1}
                    onChange={(e) => setFormData({ ...formData, specialty1: e.target.value })}
                    placeholder="e.g. Wheat Diseases"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty2">Secondary Specialty</Label>
                  <Input
                    id="specialty2"
                    value={formData.specialty2}
                    onChange={(e) => setFormData({ ...formData, specialty2: e.target.value })}
                    placeholder="e.g. Soil Fertility"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <Label htmlFor="sessionFee">Consultation Fee (₹ / 30 mins)</Label>
                  <Input
                    id="sessionFee"
                    type="number"
                    required
                    value={formData.sessionFee}
                    onChange={(e) => setFormData({ ...formData, sessionFee: e.target.value })}
                    placeholder="e.g. 499"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="language">Primary Language</Label>
                  <Select
                    id="language"
                    required
                    value={formData.language}
                    onValueChange={(val) => setFormData({ ...formData, language: val })}
                    className="mt-1"
                    options={[
                      { label: 'Hindi', value: 'Hindi' },
                      { label: 'Punjabi', value: 'Punjabi' },
                      { label: 'English', value: 'English' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <Link href="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                Cancel
              </Link>
              <Button type="submit" isLoading={loading} className="gap-2 w-1/2 justify-center">
                <CheckCircle2 className="w-4 h-4" />
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
