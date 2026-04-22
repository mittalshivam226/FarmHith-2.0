'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, Avatar, Badge } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import { User, Phone, MapPin, Wheat, LandPlot, Shield, Loader2 } from 'lucide-react';
import { db } from '@farmhith/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { FarmerProfile } from '@farmhith/types';

export default function FarmerProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getDoc(doc(db, 'farmerProfiles', user.id)).then(snap => {
      if (snap.exists()) setProfile(snap.data() as FarmerProfile);
      setLoading(false);
    });
  }, [user?.id]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader title="My Profile" description="Manage your farmer account" />

      {loading ? (
        <Card><div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-400" /></div></Card>
      ) : profile ? (
        <>
          {/* Avatar card */}
          <Card>
            <div className="flex items-center gap-5">
              <Avatar name={profile.fullName} size="xl" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
                <Badge variant="success" className="mt-1">Farmer</Badge>
                <p className="text-xs text-gray-400 mt-2">Member since {formatDate(user?.createdAt || new Date().toISOString())}</p>
              </div>
            </div>
          </Card>

          {/* Details */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Profile Details</h3>
            <div className="space-y-4">
              {[
                { icon: <Phone size={16} />, label: 'Mobile Number', value: user?.phone || 'N/A' },
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
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-8 text-gray-500">Profile data not found.</div>
        </Card>
      )}

      {/* KYC status */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Shield size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">KYC Status</p>
            <p className="text-xs text-gray-500">Aadhaar verification pending</p>
          </div>
          <button className="ml-auto text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            Verify Now
          </button>
        </div>
      </Card>

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
