'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Shield, Star, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '@farmhith/auth';
import { auth } from '@farmhith/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function FarmerLoginPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && firebaseUser) {
      if (user?.role === 'FARMER') router.push('/dashboard');
      else if (user === null) {
        import('firebase/auth').then(({ signOut }) => signOut(auth));
        setError('No farmer profile found. Please register.');
      }
    }
  }, [firebaseUser, user, isLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8faf5] flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfdfa] text-slate-900 flex">
      {/* ═══════════════ LEFT COLUMN: BRAND VISUAL & SOCIAL PROOF ═ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
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

        {/* Middle Value Prop */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Unified Farmer Portal
          </div>
          <h2 className="text-4xl font-black leading-tight text-white">
            Transforming Indian agriculture with precision science.
          </h2>
          <div className="space-y-3 text-slate-300 text-sm font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>5-Day certified soil diagnostic reports with custom NPK prescriptions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>1-on-1 private video consultations with verified Soil-Mitra agronomists</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>Guaranteed buyback prices for crop stubble with direct bank payout</span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl max-w-md">
          <div className="flex items-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <p className="text-xs sm:text-sm text-slate-200 italic mb-3">
            &ldquo;Maine paddy straw se ₹18,000 kamaye jo pehle main jala deta tha. FarmHith ne meri kheti badal di.&rdquo;
          </p>
          <div className="text-xs font-bold text-white">Ramesh Kumar • Ludhiana, Punjab</div>
        </div>
      </div>

      {/* ═══════════════ RIGHT COLUMN: AUTHENTICATION FORM ═════ */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          
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
              Welcome back, Farmer
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Sign in to manage your soil reports, consultations & stubble listings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 outline-none transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 via-primary-700 to-emerald-600 hover:from-emerald-900 hover:to-emerald-700 text-white font-extrabold text-sm shadow-[0_4px_14px_rgba(46,125,50,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              <span>Sign In to Farmer Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-sm font-medium">
            <span className="text-slate-600">Don&apos;t have a farmer profile yet? </span>
            <Link href="/register" className="font-bold text-primary-700 hover:text-primary-800">
              Register Free &rarr;
            </Link>
          </div>

          {/* Quick links to other portals */}
          <div className="pt-2 text-center text-xs text-slate-400 space-y-1.5">
            <p>Looking for a different portal?</p>
            <div className="flex justify-center gap-3 font-semibold text-primary-700">
              <a href="http://localhost:3002" target="_blank" rel="noreferrer" className="hover:underline">Soil-Mitra</a>
              <span>•</span>
              <a href="http://localhost:3003" target="_blank" rel="noreferrer" className="hover:underline">Bio-Pellet</a>
              <span>•</span>
              <a href="http://localhost:3004" target="_blank" rel="noreferrer" className="hover:underline">Testing Lab</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
