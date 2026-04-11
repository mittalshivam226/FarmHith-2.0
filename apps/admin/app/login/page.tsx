'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@farmhith/auth';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter admin email'); return; }
    setError('');
    setLoading(true);
    try {
      await login('ADMIN', { email, password });
      router.push('/dashboard');
    } catch {
      setError('Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mb-4">
            <ShieldCheck size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">FarmHith Admin</h1>
          <p className="text-slate-400 mt-1">Restricted Access — Platform Administration</p>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 mb-6">
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-400">This portal is for FarmHith administrators only. Unauthorized access is prohibited.</p>
        </div>

        <div className="bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8">
          <h2 className="text-xl font-semibold text-white mb-1">Admin Sign In</h2>
          <p className="text-sm text-slate-400 mb-6">Enter your administrator credentials</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail size={16} className="text-slate-500" /></div>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@farmhith.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock size={16} className="text-slate-500" /></div>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
            </div>
            {error && <p className="text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}
            <button id="admin-login-btn" type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-green-500/20">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Authenticating…</> : <>Access Admin Panel <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-4 bg-green-900/20 rounded-xl px-4 py-3 text-xs text-green-400 border border-green-800/50">
            <strong>Demo mode:</strong> Enter any email to access the admin dashboard
          </div>
        </div>
      </div>
    </div>
  );
}
