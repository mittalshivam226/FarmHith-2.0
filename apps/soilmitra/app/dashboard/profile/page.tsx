'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Button, useToast } from '@farmhith/ui';
import { db } from '@farmhith/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@farmhith/firebase';
import { Star, Loader2, CheckCircle2, Save } from 'lucide-react';

const SPECIALISATIONS = ['paddy', 'wheat', 'sugarcane', 'horticulture', 'vegetables', 'fruits'];
const LANGUAGES = ['en', 'hi', 'ta', 'te', 'kn'];
const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada',
};

interface MitraProfile {
  fullName: string;
  specialisation: string[];
  languagesSpoken: string[];
  sessionFee: number;
  rating: number;
  totalSessions: number;
}

export default function SoilmitraProfilePage() {
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState<MitraProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    specialisation: [] as string[],
    languagesSpoken: [] as string[],
    sessionFee: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const snap = await getDoc(doc(db, 'soilmitraProfiles', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data() as MitraProfile;
          setProfile(data);
          setForm({
            fullName: data.fullName ?? '',
            specialisation: data.specialisation ?? [],
            languagesSpoken: data.languagesSpoken ?? [],
            sessionFee: String(data.sessionFee ?? ''),
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const toggleSpec = (spec: string) => {
    setForm(prev => ({
      ...prev,
      specialisation: prev.specialisation.includes(spec)
        ? prev.specialisation.filter(s => s !== spec)
        : [...prev.specialisation, spec],
    }));
    setSaved(false);
  };

  const toggleLang = (lang: string) => {
    setForm(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(lang)
        ? prev.languagesSpoken.filter(l => l !== lang)
        : [...prev.languagesSpoken, lang],
    }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const updates = {
        fullName: form.fullName.trim(),
        specialisation: form.specialisation,
        languagesSpoken: form.languagesSpoken,
        sessionFee: parseFloat(form.sessionFee) || 0,
      };
      await updateDoc(doc(db, 'soilmitraProfiles', user.id), updates);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      setSaved(true);
      toast.show({ title: 'Profile Updated', message: 'Your profile has been saved.', type: 'success' });
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
        title="My Profile"
        description="Manage your public expert profile shown to farmers"
      />

      {/* Rating (read-only) */}
      {profile && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={18}
                  className={s <= Math.round(profile.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-2xl font-bold text-teal-800 mt-1">{profile.rating.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-teal-800">Platform Rating</p>
            <p className="text-xs text-teal-600 mt-0.5">Based on {profile.totalSessions} completed sessions</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Personal Details */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">Personal Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                value={form.fullName}
                onChange={e => { setForm(prev => ({ ...prev, fullName: e.target.value })); setSaved(false); }}
                required
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Fee (₹)</label>
              <input
                type="number"
                min="0"
                step="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                value={form.sessionFee}
                onChange={e => { setForm(prev => ({ ...prev, sessionFee: e.target.value })); setSaved(false); }}
                required
                placeholder="e.g. 300"
              />
            </div>
          </div>
        </Card>

        {/* Specialisations */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">Specialisations</h3>
          <div className="flex flex-wrap gap-2">
            {SPECIALISATIONS.map(spec => {
              const selected = form.specialisation.includes(spec);
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpec(spec)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all capitalize ${
                    selected
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
          {form.specialisation.length === 0 && (
            <p className="text-xs text-amber-600 mt-2">Select at least one specialisation</p>
          )}
        </Card>

        {/* Languages */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">Languages Spoken</h3>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => {
              const selected = form.languagesSpoken.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLang(lang)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {LANGUAGE_LABELS[lang]}
                </button>
              );
            })}
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
            disabled={saving || form.specialisation.length === 0}
            className="gap-2"
          >
            {saving ? (
              <><Loader2 size={13} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={13} /> Save Profile</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
