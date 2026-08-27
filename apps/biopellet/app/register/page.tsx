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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto bg-amber-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
              <Factory size={32} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              Your bio-pellet plant profile has been successfully submitted. It is currently <span className="font-semibold text-slate-900">awaiting admin approval</span>.
              We will notify you once your account is verified and ready for procurement.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-amber-700 mb-4 shadow-sm">
          <Factory size={24} className="text-white" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Setup Plant Profile
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Start sourcing biomass directly from local farmers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plant / Company Name *</label>
              <input
                type="text"
                value={form.plantName}
                onChange={(e) => setForm({ ...form, plantName: e.target.value })}
                placeholder="e.g. Greenleaf Bio-Energy Ltd."
                className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2.5 border px-3"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ops@yourplant.in"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2.5 border px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="block w-full pr-10 sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2.5 border px-3"
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
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2.5 border px-3 bg-white"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Feedstock</label>
                <select
                  value={form.primaryFeedstock}
                  onChange={(e) => setForm({ ...form, primaryFeedstock: e.target.value })}
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2.5 border px-3 bg-white"
                >
                  {RESIDUE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Procurement Rate (₹/ton)</label>
                <input
                  type="number"
                  value={form.procurementRatePerTon}
                  onChange={(e) => setForm({ ...form, procurementRatePerTon: e.target.value })}
                  placeholder="e.g. 2500"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2.5 border px-3"
                />
              </div>
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md text-sm mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.plantName || !form.email || !form.password || !form.state}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Creating Account…' : 'Register Plant Account'}
            </button>

            <div className="mt-4 text-center text-sm">
              <span className="text-slate-600">Already registered? </span>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-amber-700 hover:text-amber-600"
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
