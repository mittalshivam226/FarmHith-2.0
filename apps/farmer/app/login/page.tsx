'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@farmhith/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) { setError('Please enter your phone number'); return; }
    setError('');
    setLoading(true);
    try {
      await login('FARMER', {});
      router.push('/dashboard');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg mb-4">
            <Sprout size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FarmHith</h1>
          <p className="text-gray-500 mt-1">Farmer Portal — किसान पोर्टल</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">अपने खाते में लॉगिन करें</h2>
          <p className="text-sm text-gray-500 mb-6">Login with your registered phone number</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mobile Number / मोबाइल नंबर
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Logging in…</>
              ) : (
                <>Login <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-green-600 font-medium hover:underline">
                Register here
              </a>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-4 bg-amber-50 rounded-xl px-4 py-3 text-xs text-amber-700 border border-amber-100">
            <strong>Demo mode:</strong> Enter any phone number and tap Login to enter as Ramesh Kumar (mock farmer)
          </div>
        </div>
      </div>
    </div>
  );
}
