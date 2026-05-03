'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FlaskConical, Eye, EyeOff, Upload } from 'lucide-react';
import { Card, Input, Select, Button } from '@farmhith/ui';
import { useAuth } from '@farmhith/auth';
import { auth, db } from '@farmhith/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LabRegisterPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    labName: '',
    email: '',
    password: '',
    address: '',
    state: '',
    district: '',
    perTestPrice: '',
    dailyCapacity: '',
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && firebaseUser && user?.role === 'LAB') {
      router.push('/dashboard');
    }
  }, [firebaseUser, user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.labName || !form.email || !form.password || !form.state) {
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
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = result.user.uid;

      // 1. Write /users/{uid} — base auth user doc matching Firestore rules
      await setDoc(doc(db, 'users', uid), {
        uid,
        role: 'LAB',
        preferredLang: 'en',
        createdAt: serverTimestamp(),
      });

      // 2. Write /labProfiles/{uid} — detailed profile
      await setDoc(doc(db, 'labProfiles', uid), {
        labName: form.labName.trim(),
        address: form.address.trim(),
        state: form.state,
        district: form.district.trim(),
        perTestPrice: parseFloat(form.perTestPrice) || 0,
        dailyCapacity: parseInt(form.dailyCapacity) || 0,
        isVerified: false, // Requires admin verification
      });

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="mx-auto bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
            <FlaskConical size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your lab profile has been successfully submitted. It is currently <span className="font-semibold text-gray-900">awaiting admin approval</span>.
            We will notify you once your account is verified and ready to receive bookings.
          </p>
          <Button variant="primary" onClick={() => router.push('/login')} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-blue-600 h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
            <FlaskConical size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register Your Lab</h1>
          <p className="text-sm text-gray-500 mt-2">Soil Testing Lab Portal — Setup Profile</p>
        </div>

        <Card padding="lg" className="shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Lab / Organization Name *"
              placeholder="e.g. AgriTest Punjab Labs"
              value={form.labName}
              onChange={(e) => setForm({ ...form, labName: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Address *"
                type="email"
                placeholder="info@yourlab.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            </div>

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
                ]}
              />
              <Input
                label="District"
                placeholder="e.g. Ludhiana"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>

            <Input
              label="Full Lab Address"
              placeholder="Street, Plot No, Area, City"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <Input
                label="Price Per Test (₹)"
                type="number"
                placeholder="e.g. 299"
                value={form.perTestPrice}
                onChange={(e) => setForm({ ...form, perTestPrice: e.target.value })}
              />
              <Input
                label="Daily Test Capacity"
                type="number"
                placeholder="e.g. 50"
                value={form.dailyCapacity}
                onChange={(e) => setForm({ ...form, dailyCapacity: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-700 border border-blue-100">
              <Upload size={14} />
              <span>NABL / Government accreditation certificate can be uploaded after registration from your profile.</span>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
              disabled={loading || !form.labName || !form.email || !form.password || !form.state}
            >
              {loading ? 'Creating Account…' : 'Register Lab Account'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Already registered? Login here
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
