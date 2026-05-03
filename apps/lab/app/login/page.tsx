'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FlaskConical, Mail, Lock, ArrowRight, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@farmhith/auth';
import { auth, db } from '@farmhith/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LabLoginPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pending verification state
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const checkVerification = async () => {
      if (firebaseUser && user?.role === 'LAB') {
        try {
          const profileSnap = await getDoc(doc(db, 'labProfiles', firebaseUser.uid));
          if (profileSnap.exists()) {
            const profile = profileSnap.data();
            if (profile.isVerified) {
              router.push('/dashboard');
            } else {
              setIsPending(true);
            }
          } else {
            setError('Lab profile not found. Please contact support.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch lab profile');
        }
      } else if (firebaseUser && user !== undefined) {
        // Logged in but not a LAB or user doc not found
        if (user && user.role !== 'LAB') {
          // the auth provider already signs out and alerts, but just in case
          logout();
        }
      }
    };

    checkVerification();
  }, [firebaseUser, user, isLoading, router, logout]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the useEffect handle the redirection/pending state
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    await signOut(auth);
    setIsPending(false);
    setEmail('');
    setPassword('');
  };

  if (isLoading) return null;

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="mx-auto bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
            <FlaskConical size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Awaiting Verification</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your lab profile is currently under review by our administration team. 
            You will be able to access the dashboard once your account is approved.
          </p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg mb-4">
            <FlaskConical size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FarmHith</h1>
          <p className="text-gray-500 mt-1">Soil Testing Lab Portal</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Lab Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">Access your lab dashboard and booking inbox</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@yourlab.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              New lab?{' '}
              <a href="/register" className="text-blue-600 font-medium hover:underline">Register your lab</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
