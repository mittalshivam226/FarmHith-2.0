'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { auth, db } from '@farmhith/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@farmhith/auth';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];

const PRIMARY_CROPS = [
  { label: 'Paddy', value: 'paddy' },
  { label: 'Wheat', value: 'wheat' },
  { label: 'Sugarcane', value: 'sugarcane' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Horticulture', value: 'horticulture' },
  { label: 'Other', value: 'other' },
];

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
    phone: '',
    state: '',
    district: '',
    totalLandAcres: '',
    primaryCrop: '',
    aadhaarNumber: '',
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

      // 2. Write /users/{uid} — role document (EXACT schema from security rules)
      await setDoc(doc(db, 'users', uid), {
        uid,
        id:           uid,       // explicit id field so AuthUser.id resolves correctly
        role:         'FARMER',
        preferredLang:'en',
        isVerified:   true,
        createdAt:    serverTimestamp(),
      });

      // 3. Write /farmerProfiles/{uid} — profile document
      await setDoc(doc(db, 'farmerProfiles', uid), {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        state: form.state,
        district: form.district.trim(),
        totalLandAcres: parseFloat(form.totalLandAcres) || 0,
        primaryCrop: form.primaryCrop,
        ...(form.aadhaarNumber ? { aadhaarNumber: form.aadhaarNumber.trim() } : {}),
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary-600 mb-4 shadow-sm">
          <Sprout size={24} className="text-white" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Join FarmHith
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Farmer Portal Registration — किसान पोर्टल
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Ramesh Kumar"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="farmer@example.com"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="block w-full pr-10 sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3"
              />
            </div>

            {/* State + District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3 bg-white"
                  required
                >
                  <option value="">Select State…</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="e.g. Ludhiana"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3"
                />
              </div>
            </div>

            {/* Land + Crop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Land (Acres)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.totalLandAcres}
                  onChange={(e) => setForm({ ...form, totalLandAcres: e.target.value })}
                  placeholder="e.g. 10.5"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Crop</label>
                <select
                  value={form.primaryCrop}
                  onChange={(e) => setForm({ ...form, primaryCrop: e.target.value })}
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3 bg-white"
                >
                  <option value="">Select Crop…</option>
                  {PRIMARY_CROPS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Number (optional)</label>
              <input
                type="text"
                value={form.aadhaarNumber}
                onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                placeholder="0000 0000 0000"
                maxLength={14}
                className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 border px-3"
              />
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.fullName || !form.email || !form.password || !form.state}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-medium py-2.5 px-4 rounded-md shadow-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Creating Account…</>
              ) : (
                <><CheckCircle2 size={16} /> Create Farmer Account</>
              )}
            </button>

            <div className="mt-4 text-center text-sm">
              <span className="text-slate-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Login here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
