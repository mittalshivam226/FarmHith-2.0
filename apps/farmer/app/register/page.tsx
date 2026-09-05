'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
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
  { label: 'Paddy / Rice (धान)', value: 'paddy' },
  { label: 'Wheat (गेहूं)', value: 'wheat' },
  { label: 'Sugarcane (गन्ना)', value: 'sugarcane' },
  { label: 'Cotton (कपास)', value: 'cotton' },
  { label: 'Mustard (सरसों)', value: 'mustard' },
  { label: 'Maize (मक्का)', value: 'maize' },
  { label: 'Horticulture & Vegetables', value: 'horticulture' },
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

      // 2. Write /users/{uid} — role document
      await setDoc(doc(db, 'users', uid), {
        uid,
        id:           uid,
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

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8faf5] flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-primary-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8faf5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="bg-pattern" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Leaf size={22} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">FarmHith</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Your Farmer Account
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          किसान पंजीकरण — Join 50,000+ farmers across India
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="block w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="farmer@example.com"
                  className="block w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="block w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mobile Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="block w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              />
            </div>

            {/* State + District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  required
                >
                  <option value="">Select State…</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="e.g. Ludhiana"
                  className="block w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Land + Crop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Total Land (Acres)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.totalLandAcres}
                  onChange={(e) => setForm({ ...form, totalLandAcres: e.target.value })}
                  placeholder="e.g. 10.5"
                  className="block w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Crop
                </label>
                <select
                  value={form.primaryCrop}
                  onChange={(e) => setForm({ ...form, primaryCrop: e.target.value })}
                  className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                >
                  <option value="">Select Crop…</option>
                  {PRIMARY_CROPS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Aadhaar Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.aadhaarNumber}
                onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                placeholder="0000 0000 0000"
                maxLength={14}
                className="block w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.fullName || !form.email || !form.password || !form.state}
              className="w-full flex items-center justify-center gap-2 bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Creating Your Account…</>
              ) : (
                <><CheckCircle2 size={18} /> Complete Farmer Registration</>
              )}
            </button>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm">
              <span className="text-slate-600">Already have an account? </span>
              <Link href="/login" className="font-bold text-primary-700 hover:text-primary-800">
                Log in here &rarr;
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
