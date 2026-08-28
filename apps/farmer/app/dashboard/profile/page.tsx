'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Avatar, Badge, Button, useToast } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import { User, Phone, MapPin, Wheat, LandPlot, Shield, Loader2, Pencil, X, Save, CheckCircle2 } from 'lucide-react';
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
      toast.show({ title: 'Profile Updated', message: 'Your profile has been saved.', type: 'success' });
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
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-100">
      <SlideIn direction="left">
        <div className="[&_h2]:!text-white [&_p]:!text-slate-400">
          <SectionHeader 
            title="My Profile" 
            description="View and edit your farmer account details" 
          />
        </div>
      </SlideIn>

      {/* Avatar card */}
      {profile && (
        <ZoomIn delay={0.1}>
          <Card className="bg-slate-900 border-slate-800 shadow-glow-sm hud-element">
            <div className="flex items-center gap-5">
              <div className="shadow-glow-sm rounded-full">
                <Avatar name={profile.fullName} size="xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-100">{profile.fullName}</h2>
                <Badge variant="success" className="mt-2 bg-success-500/10 text-success-400 border border-success-500/20">Farmer</Badge>
                <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-wider">
                  Member since {formatDate(user?.createdAt ?? new Date().toISOString())}
                </p>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 border border-slate-700 hover:border-primary-400 hover:text-primary-400 px-4 py-2 rounded-xl transition-colors bg-slate-950"
                >
                  <Pencil size={14} /> Edit
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
              <Card className="bg-slate-900 border-slate-800 hud-element">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 pb-3 border-b border-slate-800">Edit Profile</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-white"
                      value={form.fullName}
                      onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">State</label>
                      <select
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-white"
                        value={form.state}
                        onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                        required
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">District</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-white"
                        value={form.district}
                        onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                        required
                        placeholder="e.g. Ludhiana"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Total Land (Acres)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-white"
                        value={form.totalLandAcres}
                        onChange={e => setForm(p => ({ ...p, totalLandAcres: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Primary Crop</label>
                      <select
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-white"
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

                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-primary-500 hover:bg-primary-400 text-slate-950 rounded-xl transition-all shadow-glow-sm disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </Card>
            </form>
          </FadeIn>
        ) : (
          <FadeIn delay={0.2}>
            <Card className="bg-slate-900 border-slate-800 hud-element">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Profile Details</h3>
              <div className="space-y-6">
                {[
                  { icon: <Phone size={18} />, label: 'Mobile Number', value: user?.phone ?? 'N/A' },
                  { icon: <MapPin size={18} />, label: 'Location', value: `${profile.district}, ${profile.state}` },
                  { icon: <LandPlot size={18} />, label: 'Total Land', value: `${profile.totalLandAcres} acres` },
                  { icon: <Wheat size={18} />, label: 'Primary Crop', value: profile.primaryCrop },
                  { icon: <User size={18} />, label: 'Preferred Language', value: user?.preferredLang === 'hi' ? 'Hindi' : 'English' },
                ].map((item, i) => (
                  <SlideIn key={item.label} delay={0.3 + (i * 0.1)} direction="left">
                    <div className="flex items-center gap-5">
                      <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-primary-400 shrink-0 shadow-glow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-base font-semibold text-slate-100 capitalize mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  </SlideIn>
                ))}
              </div>
            </Card>
          </FadeIn>
        )
      ) : (
        <Card className="bg-slate-900 border-slate-800 hud-element">
          <div className="text-center py-8 text-slate-500">Profile data not found.</div>
        </Card>
      )}

      {/* Logout */}
      <ZoomIn delay={0.8}>
        <button
          onClick={logout}
          className="w-full py-4 rounded-2xl border border-red-500/30 text-red-400 bg-red-500/10 text-sm font-bold hover:bg-red-500 hover:text-white transition-all shadow-glow-sm mt-4"
        >
          Sign Out
        </button>
      </ZoomIn>
    </div>
  );
}
