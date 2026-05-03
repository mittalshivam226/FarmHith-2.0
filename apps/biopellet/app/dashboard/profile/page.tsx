'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Textarea, useToast } from '@farmhith/ui';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '@farmhith/auth';
import { db, auth } from '@farmhith/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { BiopelletProfile } from '@farmhith/types';

export default function BiopelletProfile() {
  const { getToken } = useAuth();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    plantName: '',
    state: '',
    acceptedResidueTypes: [] as string[],
    procurementRatePerTon: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const snap = await getDoc(doc(db, 'biopelletProfiles', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data() as BiopelletProfile;
          setFormData({
            plantName: data.plantName || '',
            state: data.state || '',
            acceptedResidueTypes: data.acceptedResidueTypes || [],
            procurementRatePerTon: data.procurementRatePerTon?.toString() || '',
          });
        }
      } catch (e) {
        console.error('Failed to load biopellet profile:', e);
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
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          plantName: formData.plantName,
          state: formData.state,
          acceptedResidueTypes: formData.acceptedResidueTypes,
          procurementRatePerTon: parseFloat(formData.procurementRatePerTon) || 0,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save profile');
      }

      toast.show({ title: 'Profile Updated', message: 'Your plant profile has been saved.', type: 'success' });
    } catch (err: any) {
      toast.show({ title: 'Error', message: err.message ?? 'Failed to save profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResidueToggle = (type: string) => {
    setFormData(prev => {
      const isSelected = prev.acceptedResidueTypes.includes(type);
      return {
        ...prev,
        acceptedResidueTypes: isSelected 
          ? prev.acceptedResidueTypes.filter(t => t !== type)
          : [...prev.acceptedResidueTypes, type]
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Plant Profile</h1>
        <p className="text-slate-500">Manage your facility details and procurement preferences</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Facility Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plantName">Plant Name</Label>
              <Input
                id="plantName"
                value={formData.plantName}
                onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Procurement Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Accepted Feedstock</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['Paddy Straw', 'Wheat Straw', 'Sugarcane Bagasse', 'Cotton Stalks', 'Maize Stalks'].map((type) => (
                  <label key={type} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptedResidueTypes.includes(type)}
                      onChange={() => handleResidueToggle(type)}
                      className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="procurementRatePerTon">Default Procurement Rate (₹ / Ton)</Label>
              <Input
                id="procurementRatePerTon"
                type="number"
                value={formData.procurementRatePerTon}
                onChange={(e) => setFormData({ ...formData, procurementRatePerTon: e.target.value })}
                className="mt-1 max-w-xs"
                required
              />
              <p className="text-xs text-slate-500 mt-1">This is shown to farmers as your target buying price.</p>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => window.location.reload()}>Discard Changes</Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
