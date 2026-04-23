'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@farmhith/auth';
import { SectionHeader, useToast } from '@farmhith/ui';
import { db } from '@farmhith/firebase';
import {
  collection, query, where, getDocs, onSnapshot,
  type QueryDocumentSnapshot, type DocumentData,
} from 'firebase/firestore';
import { CheckCircle2, ShieldCheck, Loader2, UserCheck, Star } from 'lucide-react';

interface MitraProfile {
  id: string;
  fullName: string;
  specialisation: string[];
  languagesSpoken: string[];
  sessionFee: number;
  rating: number;
  totalSessions: number;
  isVerified: boolean;
}

function toMitraProfile(doc: QueryDocumentSnapshot<DocumentData>): MitraProfile {
  const d = doc.data();
  return {
    id: doc.id,
    fullName: d.fullName ?? '—',
    specialisation: d.specialisation ?? [],
    languagesSpoken: d.languagesSpoken ?? [],
    sessionFee: d.sessionFee ?? 0,
    rating: d.rating ?? 0,
    totalSessions: d.totalSessions ?? 0,
    isVerified: Boolean(d.isVerified),
  };
}

export default function AdminMitrasPage() {
  const { getToken } = useAuth();
  const toast = useToast();

  const [unverified, setUnverified] = useState<MitraProfile[]>([]);
  const [verified, setVerified] = useState<MitraProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'soilmitraProfiles'), where('isVerified', '==', false));
    const unsub = onSnapshot(q, (snap) => {
      setUnverified(snap.docs.map(toMitraProfile));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    const fetchVerified = async () => {
      const vq = query(collection(db, 'soilmitraProfiles'), where('isVerified', '==', true));
      const vSnap = await getDocs(vq);
      setVerified(vSnap.docs.map(toMitraProfile));
    };
    fetchVerified();

    return () => unsub();
  }, []);

  const handleVerify = async (mitraId: string) => {
    setVerifying(mitraId);
    try {
      const idToken = await getToken();
      const res = await fetch(`/api/verify/soilmitra/${mitraId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ isVerified: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to verify mitra');
      }
      const mitra = unverified.find(m => m.id === mitraId);
      if (mitra) {
        setUnverified(prev => prev.filter(m => m.id !== mitraId));
        setVerified(prev => [{ ...mitra, isVerified: true }, ...prev]);
      }
      toast.show({ title: 'Mitra Verified', message: `${mitra?.fullName} is now approved`, type: 'success' });
    } catch (err: any) {
      toast.show({ title: 'Error', message: err.message, type: 'error' });
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        title="Soil-Mitra Management"
        description="Verify and manage agricultural consultation experts on the platform"
      />

      {/* Pending Verification */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
          Pending Verification
          <span className="text-xs font-normal text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full ml-1">
            {unverified.length}
          </span>
        </h2>

        {unverified.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
            <CheckCircle2 className="mx-auto mb-2 text-green-400" size={32} />
            <p className="font-medium text-gray-600">All Mitras are verified</p>
            <p className="text-sm mt-1">No pending Soil-Mitra verifications at this time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee/Session</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unverified.map(mitra => (
                  <tr key={mitra.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                          {mitra.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{mitra.fullName}</p>
                          <p className="text-xs text-gray-400 font-mono">{mitra.id.slice(0, 10)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {mitra.specialisation.slice(0, 3).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full capitalize">
                            {s}
                          </span>
                        ))}
                        {mitra.specialisation.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                            +{mitra.specialisation.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {mitra.languagesSpoken.map(l => (
                          <span key={l} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{mitra.sessionFee.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleVerify(mitra.id)}
                        disabled={verifying === mitra.id}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                      >
                        {verifying === mitra.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <ShieldCheck size={12} />}
                        {verifying === mitra.id ? 'Verifying…' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Verified Mitras */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
          Verified Soil-Mitras
          <span className="text-xs font-normal text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full ml-1">
            {verified.length}
          </span>
        </h2>

        {verified.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            <p className="text-sm">No verified Soil-Mitras yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {verified.map(mitra => (
                  <tr key={mitra.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                          {mitra.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{mitra.fullName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {mitra.specialisation.slice(0, 2).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full capitalize">
                            {s}
                          </span>
                        ))}
                        {mitra.specialisation.length > 2 && (
                          <span className="text-xs text-gray-400">+{mitra.specialisation.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-amber-600 font-semibold">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        {mitra.rating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{mitra.totalSessions}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                        <UserCheck size={11} /> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
