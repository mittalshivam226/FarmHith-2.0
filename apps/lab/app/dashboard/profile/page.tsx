'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Button, useToast } from '@farmhith/ui';
import { db, auth } from '@farmhith/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Save, Loader2, CheckCircle2, Lock } from 'lucide-react';

interface LabProfile {
  labName: string;
  address: string;
  state: string;
  district: string;
  perTestPrice: number;
  dailyCapacity: number;
  isVerified: boolean;
}

export default function LabProfilePage() {
  const { getToken } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState<LabProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    labName: '',
    address: '',
    perTestPrice: '',
    dailyCapacity: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const snap = await getDoc(doc(db, 'labProfiles', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data() as LabProfile;
          setProfile(data);
          setForm({
            labName: data.labName ?? '',
            address: data.address ?? '',
            perTestPrice: String(data.perTestPrice ?? ''),
            dailyCapacity: String(data.dailyCapacity ?? ''),
          });
        }
      } catch (e) {
        console.error('Failed to load lab profile:', e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const idToken = await getToken();
      const res = await fetch('/api/lab/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          labName: form.labName,
          address: form.address,
          perTestPrice: parseFloat(form.perTestPrice),
          dailyCapacity: parseInt(form.dailyCapacity, 10),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save profile');
      }

      setProfile(prev => prev ? {
        ...prev,
        labName: form.labName,
        address: form.address,
        perTestPrice: parseFloat(form.perTestPrice) || prev.perTestPrice,
        dailyCapacity: parseInt(form.dailyCapacity, 10) || prev.dailyCapacity,
      } : null);

      setSaved(true);
      toast.show({ title: 'Profile Updated', message: 'Your lab profile has been saved.', type: 'success' });
    } catch (err: any) {
      toast.show({ title: 'Error', message: err.message ?? 'Failed to save profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader
        title="Lab Profile"
        description="Manage your organisation details and operational capacity"
      />

      {/* Verification Status */}
      {profile && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          profile.isVerified
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          {profile.isVerified ? (
            <>
              <CheckCircle2 size={18} className="text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Lab Verified</p>
                <p className="text-xs text-green-600">Your lab is approved and visible to farmers.</p>
              </div>
            </>
          ) : (
            <>
              <Loader2 size={18} className="text-amber-500 animate-spin shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Awaiting Admin Verification</p>
                <p className="text-xs text-amber-600">Your account is under review. You cannot accept bookings yet.</p>
              </div>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Organisation Details */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">Organisation Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                value={form.labName}
                onChange={e => { setForm(p => ({ ...p, labName: e.target.value })); setSaved(false); }}
                required
                placeholder="e.g. AgriTest Labs Pvt Ltd"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 resize-none"
                rows={2}
                value={form.address}
                onChange={e => { setForm(p => ({ ...p, address: e.target.value })); setSaved(false); }}
                required
                placeholder="Street, Area, City"
              />
            </div>

            {/* State & District — read-only, set at registration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Lock size={11} /> State (fixed)
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-50">
                  {profile?.state ?? '—'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Lock size={11} /> District (fixed)
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-50">
                  {profile?.district ?? '—'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Operations & Pricing */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">Operations & Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Test Price (₹)</label>
              <input
                type="number"
                min="0"
                step="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                value={form.perTestPrice}
                onChange={e => { setForm(p => ({ ...p, perTestPrice: e.target.value })); setSaved(false); }}
                required
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Test Capacity</label>
              <input
                type="number"
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                value={form.dailyCapacity}
                onChange={e => { setForm(p => ({ ...p, dailyCapacity: e.target.value })); setSaved(false); }}
                required
                placeholder="e.g. 20"
              />
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-between">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle2 size={13} /> Saved successfully
            </span>
          )}
          {!saved && <span />}
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <><Loader2 size={13} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={13} /> Save Changes</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
