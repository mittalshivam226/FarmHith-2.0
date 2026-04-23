'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Avatar, Badge, Button, useToast } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import { User, Phone, MapPin, Wheat, LandPlot, Shield, Loader2, Pencil, X, Save, CheckCircle2 } from 'lucide-react';
import { db } from '@farmhith/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { FarmerProfile } from '@farmhith/types';

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
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader title="My Profile" description="View and edit your farmer account details" />

      {/* Avatar card */}
      {profile && (
        <Card>
          <div className="flex items-center gap-5">
            <Avatar name={profile.fullName} size="xl" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
              <Badge variant="success" className="mt-1">Farmer</Badge>
              <p className="text-xs text-gray-400 mt-2">
                Member since {formatDate(user?.createdAt ?? new Date().toISOString())}
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 hover:border-green-400 hover:text-green-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Profile Details / Edit Form */}
      {profile ? (
        editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                    value={form.fullName}
                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 bg-white"
                      value={form.state}
                      onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                      required
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                      value={form.district}
                      onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                      required
                      placeholder="e.g. Ludhiana"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Land (Acres)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                      value={form.totalLandAcres}
                      onChange={e => setForm(p => ({ ...p, totalLandAcres: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Crop</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 bg-white"
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

              <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </Card>
          </form>
        ) : (
          <Card>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Profile Details</h3>
            <div className="space-y-4">
              {[
                { icon: <Phone size={16} />, label: 'Mobile Number', value: user?.phone ?? 'N/A' },
                { icon: <MapPin size={16} />, label: 'Location', value: `${profile.district}, ${profile.state}` },
                { icon: <LandPlot size={16} />, label: 'Total Land', value: `${profile.totalLandAcres} acres` },
                { icon: <Wheat size={16} />, label: 'Primary Crop', value: profile.primaryCrop },
                { icon: <User size={16} />, label: 'Preferred Language', value: user?.preferredLang === 'hi' ? 'Hindi' : 'English' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      ) : (
        <Card>
          <div className="text-center py-8 text-gray-500">Profile data not found.</div>
        </Card>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
