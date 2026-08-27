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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
              <FlaskConical size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              Your lab profile has been successfully submitted. It is currently <span className="font-semibold text-slate-900">awaiting admin approval</span>.
              We will notify you once your account is verified and ready to receive bookings.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 mb-4 shadow-sm">
          <FlaskConical size={24} className="text-white" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Register Your Lab
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Soil Testing Lab Portal — Setup Profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lab / Organization Name *</label>
              <input
                type="text"
                value={form.labName}
                onChange={(e) => setForm({ ...form, labName: e.target.value })}
                placeholder="e.g. AgriTest Punjab Labs"
                className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
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
                  placeholder="info@yourlab.in"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
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
                    className="block w-full pr-10 sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3 bg-white"
                  required
                >
                  <option value="">Select State...</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="e.g. Ludhiana"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Lab Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, Plot No, Area, City"
                className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price Per Test (₹)</label>
                <input
                  type="number"
                  value={form.perTestPrice}
                  onChange={(e) => setForm({ ...form, perTestPrice: e.target.value })}
                  placeholder="e.g. 299"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Daily Test Capacity</label>
                <input
                  type="number"
                  value={form.dailyCapacity}
                  onChange={(e) => setForm({ ...form, dailyCapacity: e.target.value })}
                  placeholder="e.g. 50"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 rounded-md px-4 py-3 text-xs text-blue-700 border border-blue-100 mt-2">
              <Upload size={14} className="flex-shrink-0" />
              <span>NABL / Government accreditation certificate can be uploaded after registration from your profile.</span>
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md text-sm mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.labName || !form.email || !form.password || !form.state}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Creating Account…' : 'Register Lab Account'}
            </button>

            <div className="mt-4 text-center text-sm">
              <span className="text-slate-600">Already registered? </span>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-blue-600 hover:text-blue-500"
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
