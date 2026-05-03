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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-teal-100 text-center">
          <div className="mx-auto bg-teal-100 h-16 w-16 rounded-full flex items-center justify-center mb-6 text-teal-600">
            <Leaf size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your Soil-Mitra profile is currently <span className="font-semibold text-gray-900">pending admin approval</span>.
            You will be able to set your availability and accept sessions once verified.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-teal-700 transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-teal-600 h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-600/30">
            <Leaf size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Become a Soil-Mitra</h1>
          <p className="text-sm text-gray-500 mt-2">Set up your expert profile and start guiding farmers</p>
        </div>

        <Card padding="lg" className="shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="Dr. Harpreet Kaur"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="expert@farmhith.in"
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
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell farmers about your agronomy experience..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialisations *</label>
              <div className="flex flex-wrap gap-2">
                {['Paddy', 'Wheat', 'Sugarcane', 'Horticulture', 'Vegetables', 'Fruits'].map(spec => (
                  <label key={spec} className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={form.specialisation.includes(spec)}
                      onChange={() => handleCheckbox('specialisation', spec)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Languages Spoken *</label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'].map(lang => (
                  <label key={lang} className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={form.languagesSpoken.includes(lang)}
                      onChange={() => handleCheckbox('languagesSpoken', lang)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <Input
                label="Consultation Fee (₹ / 30 min)"
                type="number"
                placeholder="e.g. 499"
                value={form.sessionFee}
                onChange={(e) => setForm({ ...form, sessionFee: e.target.value })}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 bg-teal-600 hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? 'Creating Account…' : 'Register as Soil-Mitra'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
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
