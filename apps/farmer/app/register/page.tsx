'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Select, Button, useToast } from '@farmhith/ui';
import { Sprout } from 'lucide-react';
import { useAuth } from '@farmhith/auth';

export default function FarmerRegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    aadhaar: '',
    state: '',
    district: '',
    landSize: '',
    primaryCrop: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      // Auto-login the new user using our mock auth helper
      login('FARMER');
      toast.show({
        title: 'Account Created',
        message: 'Welcome to FarmHith!',
        type: 'success',
      });
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-green-600 h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/30">
            <Sprout size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join FarmHith</h1>
          <p className="text-sm text-gray-500 mt-2">Farmer Portal Registration</p>
        </div>

        <Card padding="lg" className="shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Ramesh Kumar"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <Input
                label="Mobile Number"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <Input
              label="Aadhaar Number"
              placeholder="0000 0000 0000"
              value={form.aadhaar}
              onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="State"
                value={form.state}
                onChange={(val) => setForm({ ...form, state: val })}
                options={[
                  { label: 'Select State...', value: '' },
                  { label: 'Punjab', value: 'pb' },
                  { label: 'Haryana', value: 'hr' },
                  { label: 'Uttar Pradesh', value: 'up' },
                ]}
                required
              />
              <Input
                label="District"
                placeholder="e.g. Ludhiana"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Total Land (Acres)"
                type="number"
                placeholder="e.g. 10.5"
                value={form.landSize}
                onChange={(e) => setForm({ ...form, landSize: e.target.value })}
                required
              />
              <Input
                label="Primary Crop"
                placeholder="e.g. Wheat"
                value={form.primaryCrop}
                onChange={(e) => setForm({ ...form, primaryCrop: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              disabled={loading || !form.fullName || !form.phone || !form.state}
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </Button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
              >
                Already have an account? Login here
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
