'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, CheckCircle2, Loader2, ArrowRight, Shield, Sparkles, Star } from 'lucide-react';
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
  { label: 'Other Crops', value: 'other' },
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

  useEffect(() => {
    if (!isLoading && firebaseUser && user?.role === 'FARMER') {
      router.push('/dashboard');
    }
  }, [firebaseUser, user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.state) {
      setError('Please fill in all required fields marked with *.');
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
      <Loader2 size={32} className="animate-spin text-primary-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfdfa] text-slate-900 flex">
      {/* ═══════════════ LEFT COLUMN: BRAND SHOWCASE ═══════════════ */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595804368593-cc43ba2986f3?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Top Branding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-primary-500 flex items-center justify-center shadow-lg">
              <Leaf size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">FarmHith</span>
          </Link>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Free Farmer Registration
          </div>
          <h2 className="text-4xl font-black leading-tight text-white">
            Join 50,000+ Indian farmers growing smarter.
          </h2>
          <div className="space-y-3 text-slate-300 text-sm font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>Doorstep NABL lab testing with 5-day digital turnaround</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>Instant agronomist video consultations in your language</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>Assured stubble floor prices & direct bank payouts</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            Zero Platform Fees
          </div>
          <p className="text-xs text-slate-200">
            Account registration is 100% free with lifetime dashboard access.
          </p>
        </div>
      </div>

      {/* ═══════════════ RIGHT COLUMN: REGISTRATION FORM ═══════════ */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative overflow-y-auto">
        <div className="max-w-xl w-full mx-auto space-y-6">
          
          <div>
            <div className="lg:hidden mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-700 text-white flex items-center justify-center">
                  <Leaf size={20} />
                </div>
                <span className="text-xl font-black text-slate-900">FarmHith</span>
              </Link>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Create Your Farmer Account
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              किसान पंजीकरण — Register your farm to access all certified services.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="farmer@example.com"
                  className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full py-2.5 pl-3.5 pr-10 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* State & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                >
                  <option value="">Select State…</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
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
                  className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Total Land Acres & Primary Crop */}
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
                  placeholder="e.g. 12.5"
                  className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Crop
                </label>
                <select
                  value={form.primaryCrop}
                  onChange={(e) => setForm({ ...form, primaryCrop: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                >
                  <option value="">Select Crop…</option>
                  {PRIMARY_CROPS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aadhaar (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Aadhaar Number <span className="text-slate-400 font-normal">(Optional for KYC)</span>
              </label>
              <input
                type="text"
                maxLength={14}
                value={form.aadhaarNumber}
                onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                placeholder="0000 0000 0000"
                className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.fullName || !form.email || !form.password || !form.state}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 via-primary-700 to-emerald-600 hover:from-emerald-900 hover:to-emerald-700 text-white font-extrabold text-sm shadow-[0_4px_14px_rgba(46,125,50,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Creating Account…</>
              ) : (
                <><CheckCircle2 size={18} /> Complete Free Farmer Registration</>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-sm font-medium">
            <span className="text-slate-600">Already registered? </span>
            <Link href="/login" className="font-bold text-primary-700 hover:text-primary-800">
              Sign in to Dashboard &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
