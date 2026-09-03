'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Avatar, Badge, Button, useToast } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import { User, Phone, MapPin, Wheat, LandPlot, Shield, Loader2, Pencil, X, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { db } from '@farmhith/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { FarmerProfile } from '@farmhith/types';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];

const CROP_OPTIONS = ['paddy', 'wheat', 'sugarcane', 'cotton', 'horticulture', 'other'];

export default function FarmerProfilePage() {
  const { user, logout, getToken } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    state: '',
    district: '',
    totalLandAcres: '',
    primaryCrop: '',
  });

  useEffect(() => {
    if (!user?.id) return;
    getDoc(doc(db, 'farmerProfiles', user.id)).then(snap => {
      if (snap.exists()) {
        const data = snap.data() as FarmerProfile;
        setProfile(data);
        setForm({
          fullName: data.fullName ?? '',
          state: data.state ?? '',
          district: data.district ?? '',
          totalLandAcres: String(data.totalLandAcres ?? ''),
          primaryCrop: data.primaryCrop ?? '',
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const idToken = await getToken();
      const res = await fetch('/api/farmer/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          fullName: form.fullName,
          state: form.state,
          district: form.district,
          totalLandAcres: parseFloat(form.totalLandAcres) || 0,
          primaryCrop: form.primaryCrop,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save profile');
      }

      setProfile(prev => prev ? {
        ...prev,
        fullName: form.fullName,
        state: form.state,
        district: form.district,
        totalLandAcres: parseFloat(form.totalLandAcres) || prev.totalLandAcres,
        primaryCrop: form.primaryCrop,
      } : null);

      setEditing(false);
      toast.show({ title: 'Profile Updated', message: 'Your profile has been saved successfully.', type: 'success' });
    } catch (err: any) {
      toast.show({ title: 'Error', message: err.message ?? 'Failed to save profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? '',
        state: profile.state ?? '',
        district: profile.district ?? '',
        totalLandAcres: String(profile.totalLandAcres ?? ''),
        primaryCrop: profile.primaryCrop ?? '',
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-primary-700" />
      </div>
    );
  }

  // Profile completion calculation
  const fields = [profile?.fullName, profile?.district, profile?.state, profile?.totalLandAcres, profile?.primaryCrop];
  const filledCount = fields.filter(Boolean).length;
  const completionPct = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-800">
      <SlideIn direction="left">
        <SectionHeader 
          title="Farmer Profile & Settings" 
          description="Manage your account identity, land parcel details, and primary crops" 
        />
      </SlideIn>

      {/* Completion Meter */}
      <FadeIn delay={0.05}>
        <div className="bg-gradient-to-r from-primary-50 via-emerald-50 to-teal-50 border border-primary-200/80 p-4 sm:p-5 rounded-2xl shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary-700" />
              <p className="font-bold text-slate-900 text-sm">Profile Health: {completionPct}% Complete</p>
            </div>
            <p className="text-xs text-slate-600">
              {completionPct === 100
                ? 'Your farmer account is fully verified for Soil Tests & Marketplace sales.'
                : 'Complete your land details to unlock instant buyer matching.'}
            </p>
            <div className="w-48 sm:w-64 h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary-700 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Avatar Header Card */}
      {profile && (
        <ZoomIn delay={0.1}>
          <Card className="bg-white border-slate-200/90 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl overflow-hidden border-2 border-primary-100 shadow-xs shrink-0">
                  <Avatar name={profile.fullName} size="xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{profile.fullName}</h2>
                    <Badge variant="success" size="sm">
                      <ShieldCheck size={12} className="inline mr-1" /> Verified Farmer
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    FarmHith Member since {formatDate(user?.createdAt ?? new Date().toISOString())}
                  </p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  <Pencil size={14} /> Edit Profile
                </button>
              )}
            </div>
          </Card>
        </ZoomIn>
      )}

      {/* Profile Details / Edit Form */}
      {profile ? (
        editing ? (
          <FadeIn delay={0.2}>
            <form onSubmit={handleSave} className="space-y-4">
              <Card className="bg-white border-slate-200/90 shadow-card">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                  Edit Farmer Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-900 shadow-xs"
                      value={form.fullName}
                      onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">State</label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-900 shadow-xs"
                        value={form.state}
                        onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                        required
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">District</label>
                      <input
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-900 shadow-xs"
                        value={form.district}
                        onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                        required
                        placeholder="e.g. Ludhiana"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Total Farmland (Acres)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-900 shadow-xs"
                        value={form.totalLandAcres}
                        onChange={e => setForm(p => ({ ...p, totalLandAcres: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Primary Crop</label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-900 shadow-xs"
                        value={form.primaryCrop}
                        onChange={e => setForm(p => ({ ...p, primaryCrop: e.target.value }))}
                        required
                      >
                        <option value="">Select Crop</option>
                        {CROP_OPTIONS.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <X size={15} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold bg-primary-700 hover:bg-primary-800 text-white rounded-xl transition-all shadow-xs disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </Card>
            </form>
          </FadeIn>
        ) : (
          <FadeIn delay={0.2}>
            <Card className="bg-white border-slate-200/90 shadow-card">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Registered Farm Profile</h3>
              <div className="space-y-4">
                {[
                  { icon: <Phone size={17} />, label: 'Registered Mobile', value: user?.phone ?? '—' },
                  { icon: <MapPin size={17} />, label: 'District & State', value: `${profile.district || '—'}, ${profile.state || '—'}` },
                  { icon: <LandPlot size={17} />, label: 'Total Farmland Area', value: `${profile.totalLandAcres ?? '—'} Acres` },
                  { icon: <Wheat size={17} />, label: 'Primary Crop', value: profile.primaryCrop ?? '—' },
                  { icon: <User size={17} />, label: 'App Language', value: user?.preferredLang === 'hi' ? 'Hindi (हिंदी)' : 'English' },
                ].map((item, i) => (
                  <SlideIn key={item.label} delay={0.25 + (i * 0.05)} direction="left">
                    <div className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                      <div className="h-9 w-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-bold text-slate-900 capitalize mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  </SlideIn>
                ))}
              </div>
            </Card>
          </FadeIn>
        )
      ) : (
        <Card className="bg-white border-slate-200/90 shadow-card">
          <div className="text-center py-8 text-slate-500">Profile data not found.</div>
        </Card>
      )}

      {/* Logout */}
      <ZoomIn delay={0.5}>
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-sm font-bold transition-all shadow-xs mt-2"
        >
          Sign Out of Account
        </button>
      </ZoomIn>
    </div>
  );
}

