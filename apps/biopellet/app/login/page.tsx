'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@farmhith/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email'); return; }
    setError('');
    setLoading(true);
    try {
      await login('BIOPELLET', { email, password });
      router.push('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-4">
            <Factory size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">FarmHith</h1>
          <p className="text-gray-400 mt-1">Bio-Pellet Plant Portal</p>
        </div>

        <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-8">
          <h2 className="text-xl font-semibold text-white mb-1">Plant Sign In</h2>
          <p className="text-sm text-gray-400 mb-6">Access listings, orders and procurement dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail size={16} className="text-gray-500" /></div>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="ops@yourplant.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock size={16} className="text-gray-500" /></div>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
            </div>
            {error && <p className="text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}
            <button id="login-btn" type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">New plant? <a href="/register" className="text-green-400 font-medium hover:underline">Register here</a></p>
          </div>
          <div className="mt-4 bg-green-900/30 rounded-xl px-4 py-3 text-xs text-green-400 border border-green-800">
            <strong>Demo mode:</strong> Enter any email and click Sign In
          </div>
        </div>
      </div>
    </div>
  );
}
