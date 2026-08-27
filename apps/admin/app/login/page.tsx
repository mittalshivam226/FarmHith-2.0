'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@farmhith/auth';
import { auth } from '@farmhith/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && firebaseUser) {
      if (user?.role === 'ADMIN') {
        router.push('/dashboard');
      } else if (user === null) {
        // Authenticated but no admin profile — sign out, show error
        import('firebase/auth').then(({ signOut }) => signOut(auth));
        setError('No admin account found for this email. Contact a super-admin.');
      }
    }
  }, [firebaseUser, user, isLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter admin email'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError(`Auth Failed: ${err.code || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-600 mb-4 shadow-sm">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          FarmHith Admin
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Restricted Access — Platform Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Warning banner */}
        <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-700/50 rounded-md px-4 py-3 mb-6 mx-4 sm:mx-0">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-200">This portal is for FarmHith administrators only. Unauthorized access is prohibited.</p>
        </div>

        <div className="bg-slate-800 py-8 px-4 shadow-sm border border-slate-700 sm:rounded-lg sm:px-10 mx-4 sm:mx-0">
          <h2 className="text-xl font-semibold text-white mb-1">Admin Sign In</h2>
          <p className="text-sm text-slate-400 mb-6">Enter your administrator credentials</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Admin Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@farmhith.in"
                  className="block w-full pl-10 sm:text-sm border-slate-600 rounded-md shadow-sm bg-slate-900 text-white placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500 py-2.5 border px-3"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 sm:text-sm border-slate-600 rounded-md shadow-sm bg-slate-900 text-white placeholder-slate-500 focus:ring-emerald-500 focus:border-emerald-500 py-2.5 border px-3"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
