'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, Input, Select, Button } from '@farmhith/ui';
import { useAuth } from '@farmhith/auth';
import { auth, db } from '@farmhith/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { AuthUser } from '@farmhith/types';

export default function FarmerRegisterPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    aadhaar: '',
    state: '',
    district: '',
    landSize: '',
    primaryCrop: '',
  });

  // Redirect if already logged in with correct role
  useEffect(() => {
    if (!isLoading && firebaseUser && user?.role === 'FARMER') {
      router.push('/dashboard');
    }
  }, [firebaseUser, user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.state) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Create Firebase Auth account
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = result.user.uid;

      // 2. Build the AuthUser payload
      const newUser: AuthUser = {
        id: uid,
        email: form.email,
        phone: '',
        role: 'FARMER',
        name: form.fullName,
        isVerified: true,
        profile: {
          id: `fp-${uid}`,
          userId: uid,
          fullName: form.fullName,
          state: form.state,
          district: form.district,
          totalLandAcres: parseFloat(form.landSize) || 0,
          primaryCrop: form.primaryCrop,
          aadhaarNumber: form.aadhaar,
        },
      };

      // 3. Write to Firestore: users/{uid} and farmerProfiles/{uid}
      await Promise.all([
        setDoc(doc(db, 'users', uid), newUser),
        setDoc(doc(db, 'farmerProfiles', uid), newUser.profile!),
      ]);

      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

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
                label="Full Name *"
                placeholder="Ramesh Kumar"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="farmer@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Input
              label="Aadhaar Number"
              placeholder="0000 0000 0000"
              value={form.aadhaar}
              onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="State *"
                value={form.state}
                onChange={(val) => setForm({ ...form, state: val })}
                required
                options={[
                  { label: 'Select State...', value: '' },
                  { label: 'Punjab', value: 'Punjab' },
                  { label: 'Haryana', value: 'Haryana' },
                  { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
                  { label: 'Maharashtra', value: 'Maharashtra' },
                  { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
                ]}
              />
              <Input
                label="District"
                placeholder="e.g. Ludhiana"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Total Land (Acres)"
                type="number"
                placeholder="e.g. 10.5"
                value={form.landSize}
                onChange={(e) => setForm({ ...form, landSize: e.target.value })}
              />
              <Input
                label="Primary Crop"
                placeholder="e.g. Wheat"
                value={form.primaryCrop}
                onChange={(e) => setForm({ ...form, primaryCrop: e.target.value })}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              disabled={loading || !form.fullName || !form.email || !form.password || !form.state}
            >
              {loading ? 'Creating Account…' : 'Create Farmer Account'}
            </Button>

            <div className="text-center">
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
