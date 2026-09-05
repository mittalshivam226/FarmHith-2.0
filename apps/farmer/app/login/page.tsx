'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles, Building2, Users } from 'lucide-react';
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
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8faf5] flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-primary-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8faf5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="bg-pattern" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Leaf size={22} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">FarmHith</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, Farmer
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          अपने किसान खाते में लॉगिन करें
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              Sign In to FarmHith
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm">
            <span className="text-slate-600">New to FarmHith? </span>
            <Link href="/register" className="font-bold text-primary-700 hover:text-primary-800">
              Create free account &rarr;
            </Link>
          </div>
        </div>

        {/* Other Portals Navigation */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>Looking for other portals?</p>
          <div className="flex justify-center gap-4 font-semibold text-primary-700">
            <a href="http://localhost:3002" target="_blank" rel="noreferrer" className="hover:underline">
              Soil-Mitra Login
            </a>
            <span>•</span>
            <a href="http://localhost:3003" target="_blank" rel="noreferrer" className="hover:underline">
              Bio-Pellet Login
            </a>
            <span>•</span>
            <a href="http://localhost:3004" target="_blank" rel="noreferrer" className="hover:underline">
              Testing Lab Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
