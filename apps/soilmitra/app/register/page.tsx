'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { Card, Input, Select, Button } from '@farmhith/ui';
import { useAuth } from '@farmhith/auth';
import { auth, db } from '@farmhith/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { AuthUser } from '@farmhith/types';

const LANGUAGE_OPTIONS = [
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Punjabi', value: 'Punjabi' },
  { label: 'English', value: 'English' },
  { label: 'Marathi', value: 'Marathi' },
];

export default function SoilmitraRegisterPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    specialisation: [] as string[],
    languagesSpoken: [] as string[],
    sessionFee: '',
  });

  useEffect(() => {
    if (!isLoading && firebaseUser && user?.role === 'SOILMITRA') {
      router.push('/dashboard');
    }
  }, [firebaseUser, user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || form.specialisation.length === 0 || form.languagesSpoken.length === 0) {
      setError('Please fill in all required fields and select at least one specialisation and language.');
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

      const mitraProfile = {
        fullName: form.fullName,
        bio: form.bio,
        specialisation: form.specialisation,
        languagesSpoken: form.languagesSpoken,
        sessionFee: parseFloat(form.sessionFee) || 0,
        rating: 0,
        totalSessions: 0,
        isVerified: false,
      };

      // 1. Write /users/{uid} — base auth user doc matching Firestore rules
      await setDoc(doc(db, 'users', uid), {
        uid,
        role: 'SOILMITRA',
        preferredLang: 'en',
        createdAt: new Date().toISOString(),
      });

      // 2. Write /soilmitraProfiles/{uid} — detailed profile
      await setDoc(doc(db, 'soilmitraProfiles', uid), mitraProfile);

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

  const handleCheckbox = (field: 'specialisation' | 'languagesSpoken', value: string) => {
    setForm(prev => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(value) ? list.filter(item => item !== value) : [...list, value]
      };
    });
  };

  if (isLoading) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto bg-teal-100 h-16 w-16 rounded-full flex items-center justify-center mb-6 text-teal-600">
              <Leaf size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              Your Soil-Mitra profile is currently <span className="font-semibold text-slate-900">pending admin approval</span>.
              You will be able to set your availability and accept sessions once verified.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors"
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
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-teal-600 mb-4 shadow-sm">
          <Leaf size={24} className="text-white" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Become a Soil-Mitra
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Set up your expert profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Dr. Harpreet Kaur"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 py-2.5 border px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="expert@farmhith.in"
                  className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 py-2.5 border px-3"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="block w-full pr-10 sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 py-2.5 border px-3"
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Professional Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell farmers about your agronomy experience..."
                rows={3}
                className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 py-2 border px-3 resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">Specialisations *</label>
              <div className="flex flex-wrap gap-2">
                {['Paddy', 'Wheat', 'Sugarcane', 'Horticulture', 'Vegetables', 'Fruits'].map(spec => (
                  <label key={spec} className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.specialisation.includes(spec)}
                      onChange={() => handleCheckbox('specialisation', spec)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-slate-300"
                    />
                    <span className="text-sm text-slate-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">Languages Spoken *</label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'].map(lang => (
                  <label key={lang} className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.languagesSpoken.includes(lang)}
                      onChange={() => handleCheckbox('languagesSpoken', lang)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-slate-300"
                    />
                    <span className="text-sm text-slate-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee (₹ / 30 min)</label>
              <input
                type="number"
                value={form.sessionFee}
                onChange={(e) => setForm({ ...form, sessionFee: e.target.value })}
                placeholder="e.g. 499"
                className="block w-full sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 py-2.5 border px-3"
                required
              />
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.fullName || !form.email || !form.password || form.specialisation.length === 0 || form.languagesSpoken.length === 0}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? 'Creating Account…' : 'Register as Soil-Mitra'}
            </button>

            <div className="mt-4 text-center text-sm">
              <span className="text-slate-600">Already registered? </span>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-teal-600 hover:text-teal-500"
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
