'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Phone, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@farmhith/auth';
import { auth } from '@farmhith/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { firebaseUser, user, isLoading } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in and profile exists
  useEffect(() => {
    if (!isLoading && firebaseUser) {
      if (user?.role === 'FARMER') {
        router.push('/dashboard');
      } else if (user === null) {
        // They are authenticated in Firebase, but missing a Firestore profile
        router.push('/register');
      }
    }
  }, [firebaseUser, user, isLoading, router]);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || phone.length < 10) { 
      setError('Please enter a valid phone number with country code (e.g. +91...)'); 
      return; 
    }
    
    setError('');
    setLoading(true);

    try {
      // Ensure phone starts with +
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      window.confirmationResult = confirmationResult;
      setStep('OTP');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim() || otp.length < 6) { 
      setError('Please enter the 6-digit OTP'); 
      return; 
    }
    
    setError('');
    setLoading(true);

    try {
      await window.confirmationResult.confirm(otp);
      // AuthContext will automatically detect the user change and redirect
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg mb-4">
            <Sprout size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FarmHith</h1>
          <p className="text-gray-500 mt-1">Farmer Portal — किसान पोर्टल</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {step === 'PHONE' ? 'अपने खाते में लॉगिन करें' : 'OTP दर्ज करें'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {step === 'PHONE' ? 'Login with your registered phone number' : `We've sent a 6-digit code to ${phone}`}
          </p>

          <form onSubmit={step === 'PHONE' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
            
            {step === 'PHONE' ? (
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
            ) : (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                  6-Digit OTP / ओटीपी
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all tracking-widest text-center"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              id="submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> {step === 'PHONE' ? 'Sending OTP...' : 'Verifying...'}</>
              ) : (
                <>{step === 'PHONE' ? 'Get OTP' : 'Verify & Login'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {step === 'OTP' && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => setStep('PHONE')}
                className="text-sm text-green-600 font-medium hover:underline"
              >
                Change Phone Number
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-green-600 font-medium hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Hidden reCAPTCHA container required for Firebase Auth */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
