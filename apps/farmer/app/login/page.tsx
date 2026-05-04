'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
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
    <div className="auth-page"><div className="app-loading-spinner" /></div>
  );

  return (
    <div className="auth-page">
      <div className="orb orb-1" /><div className="orb orb-2" />

      {/* Back to home */}
      <Link href="/" className="auth-back">
        <div className="logo-icon" style={{ width: 32, height: 32, borderRadius: 8 }}><Leaf size={16} /></div>
        <span className="logo-text">FarmHith</span>
      </Link>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap"><Leaf size={22} /></div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">अपने खाते में लॉगिन करें</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-input"
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button id="login-btn" type="submit" disabled={loading} className="auth-submit">
            {loading
              ? <><Loader2 size={16} className="spin" /> Signing in…</>
              : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="auth-switch-link">Create one free →</Link>
        </p>
      </div>
    </div>
  );
}
