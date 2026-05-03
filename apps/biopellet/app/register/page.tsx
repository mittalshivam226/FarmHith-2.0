'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, Eye, EyeOff } from 'lucide-react';
import { Card, Input, Select, Button } from '@farmhith/ui';
import { useAuth } from '@farmhith/auth';
import { auth, db } from '@farmhith/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { AuthUser } from '@farmhith/types';

const RESIDUE_OPTIONS = [
  { label: 'Paddy Straw', value: 'Paddy Straw' },
  { label: 'Wheat Straw', value: 'Wheat Straw' },
  { label: 'Sugarcane Trash', value: 'Sugarcane Trash' },
  { label: 'Cotton Stalks', value: 'Cotton Stalks' },
  { label: 'Maize Stalks', value: 'Maize Stalks' },
];

export default function BiopelletRegisterPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    plantName: '',
    email: '',
    password: '',
    state: '',
    primaryFeedstock: 'Paddy Straw',
    procurementRatePerTon: '',
  });

  useEffect(() => {
    if (!isLoading && firebaseUser && user?.role === 'BIOPELLET') {
      router.push('/dashboard');
    }
  }, [firebaseUser, user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.plantName || !form.email || !form.password || !form.state) {
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

      const biopelletProfile = {
        plantName: form.plantName,
        state: form.state,
        acceptedResidueTypes: [form.primaryFeedstock],
        procurementRatePerTon: parseFloat(form.procurementRatePerTon) || 0,
        isVerified: false,
      };

      // 1. Write /users/{uid} — base auth user doc matching Firestore rules
      await setDoc(doc(db, 'users', uid), {
        uid,
        role: 'BIOPELLET',
        preferredLang: 'en',
        createdAt: new Date().toISOString(),
      });

      // 2. Write /biopelletProfiles/{uid} — detailed profile
      await setDoc(doc(db, 'biopelletProfiles', uid), biopelletProfile);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700 text-center">
          <div className="mx-auto bg-green-900/50 h-16 w-16 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
            <Factory size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Your bio-pellet plant profile has been successfully submitted. It is currently <span className="font-semibold text-white">awaiting admin approval</span>.
            We will notify you once your account is verified and ready for procurement.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-gradient-to-br from-green-500 to-emerald-600 h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/40">
            <Factory size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Setup Plant Profile</h1>
          <p className="text-sm text-gray-400 mt-2">Start sourcing biomass directly from local farmers</p>
        </div>

        <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Plant / Company Name *</label>
              <input
                type="text"
                value={form.plantName}
                onChange={(e) => setForm({ ...form, plantName: e.target.value })}
                placeholder="e.g. Greenleaf Bio-Energy Ltd."
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ops@yourplant.in"
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">State *</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select State...</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Primary Feedstock</label>
                <select
                  value={form.primaryFeedstock}
                  onChange={(e) => setForm({ ...form, primaryFeedstock: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  {RESIDUE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Procurement Rate (₹/ton)</label>
                <input
                  type="number"
                  value={form.procurementRatePerTon}
                  onChange={(e) => setForm({ ...form, procurementRatePerTon: e.target.value })}
                  placeholder="e.g. 2500"
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading || !form.plantName || !form.email || !form.password || !form.state}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account…' : 'Register Plant Account'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
              >
                Already registered? Login here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
