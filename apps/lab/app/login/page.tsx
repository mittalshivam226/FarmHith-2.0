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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
              <FlaskConical size={32} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Awaiting Verification</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Your lab profile is currently under review by our administration team. 
              You will be able to access the dashboard once your account is approved.
            </p>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-md hover:bg-slate-200 transition-all duration-200"
            >
              <LogOut size={16} /> Sign Out
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
          FarmHith
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Soil Testing Lab Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Lab Sign In</h2>
          <p className="text-sm text-slate-500 mb-6">Access your lab dashboard and booking inbox</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@yourlab.in"
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 sm:text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 border px-3"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm">
            <span className="text-slate-600">New lab? </span>
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register your lab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
