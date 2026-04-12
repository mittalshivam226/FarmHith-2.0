'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Select, Button, useToast } from '@farmhith/ui';
import { Sprout, KeyRound } from 'lucide-react';
import { useAuth } from '@farmhith/auth';
import { auth, db } from '@farmhith/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { AuthUser } from '@farmhith/types';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

export default function FarmerRegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const { firebaseUser, user, isLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [otp, setOtp] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    aadhaar: '',
    state: '',
    district: '',
    landSize: '',
    primaryCrop: '',
  });

  // Init Recaptcha
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim() || form.phone.length < 10) { 
      toast.show({ title: 'Error', message: 'Valid phone number required', type: 'error' });
      return; 
    }
    
    setLoading(true);
    try {
      const formattedPhone = form.phone.startsWith('+') ? form.phone : `+91${form.phone.replace(/\D/g, '')}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      window.confirmationResult = confirmationResult;
      setStep('OTP');
      toast.show({ title: 'OTP Sent', message: `Code sent to ${formattedPhone}`, type: 'success' });
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Auth Error', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length < 6) return;
    
    setLoading(true);
    try {
      // 1. Verify OTP
      const result = await window.confirmationResult.confirm(otp);
      const uid = result.user.uid;

      // 2. Build explicit User profile payload
      const newUser: AuthUser = {
        id: uid,
        email: '',
        phone: result.user.phoneNumber || form.phone,
        role: 'FARMER',
        name: form.fullName,
        isVerified: true,
        profile: {
          id: `fp-${uid}`,
          userId: uid,
          fullName: form.fullName,
          state: form.state,
          district: form.district,
          totalLandAcres: parseFloat(form.landSize),
          primaryCrop: form.primaryCrop,
          aadhaarNumber: form.aadhaar,
        }
      };

      // 3. Save to Firestore
      await setDoc(doc(db, 'users', uid), newUser);

      toast.show({ title: 'Welcome!', message: 'Account created successfully', type: 'success' });
      // AuthContext detects the change and we can manually push or wait for effect
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.show({ title: 'Verification Failed', message: 'Invalid OTP or network error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-green-600 h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/30">
            <Sprout size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join FarmHith</h1>
          <p className="text-sm text-gray-500 mt-2">
            {step === 'DETAILS' ? 'Farmer Portal Registration' : 'Verify your Phone Number'}
          </p>
        </div>

        <Card padding="lg" className="shadow-xl">
          {step === 'DETAILS' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Ramesh Kumar" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                <Input label="Mobile Number" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <Input label="Aadhaar Number" placeholder="0000 0000 0000" value={form.aadhaar} onChange={(e) => setForm({ ...form, aadhaar: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Select label="State" value={form.state} onChange={(val) => setForm({ ...form, state: val })} required options={[
                    { label: 'Select State...', value: '' },
                    { label: 'Punjab', value: 'Punjab' },
                    { label: 'Haryana', value: 'Haryana' },
                  ]} />
                <Input label="District" placeholder="e.g. Ludhiana" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Total Land (Acres)" type="number" placeholder="e.g. 10.5" value={form.landSize} onChange={(e) => setForm({ ...form, landSize: e.target.value })} required />
                <Input label="Primary Crop" placeholder="e.g. Wheat" value={form.primaryCrop} onChange={(e) => setForm({ ...form, primaryCrop: e.target.value })} required />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading || !form.fullName || !form.phone || !form.state}>
                {loading ? 'Sending OTP...' : 'Continue to Phone Verification'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">6-Digit OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all tracking-widest text-center"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading || otp.length < 6}>
                {loading ? 'Verifying & Creating...' : 'Verify & Register'}
              </Button>
              <div className="text-center mt-2">
                <button type="button" onClick={() => setStep('DETAILS')} className="text-sm font-semibold text-green-700 hover:underline">
                  Back to Details
                </button>
              </div>
            </form>
          )}
          
          {step === 'DETAILS' && (
            <div className="text-center mt-6">
              <button type="button" onClick={() => router.push('/login')} className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors">
                Already have an account? Login here
              </button>
            </div>
          )}
        </Card>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
