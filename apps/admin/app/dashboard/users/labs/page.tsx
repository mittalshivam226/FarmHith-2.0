'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@farmhith/auth';
import { SectionHeader, useToast } from '@farmhith/ui';
import { db } from '@farmhith/firebase';
import {
  collection, query, where, getDocs, onSnapshot,
  type QueryDocumentSnapshot, type DocumentData,
} from 'firebase/firestore';
import { CheckCircle2, ShieldCheck, Loader2, FlaskConical, MapPin, IndianRupee } from 'lucide-react';

interface LabProfile {
  id: string;
  labName: string;
  address: string;
  state: string;
  district: string;
  perTestPrice: number;
  dailyCapacity: number;
  isVerified: boolean;
}

function toLabProfile(doc: QueryDocumentSnapshot<DocumentData>): LabProfile {
  const d = doc.data();
  return {
    id: doc.id,
    labName: d.labName ?? '—',
    address: d.address ?? '—',
    state: d.state ?? '—',
    district: d.district ?? '—',
    perTestPrice: d.perTestPrice ?? 0,
    dailyCapacity: d.dailyCapacity ?? 0,
    isVerified: Boolean(d.isVerified),
  };
}

export default function AdminLabsPage() {
  const { getToken } = useAuth();
  const toast = useToast();

  const [unverified, setUnverified] = useState<LabProfile[]>([]);
  const [verified, setVerified] = useState<LabProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    // Real-time listener for unverified labs
    const q = query(collection(db, 'labProfiles'), where('isVerified', '==', false));
    const unsub = onSnapshot(q, (snap) => {
      setUnverified(snap.docs.map(toLabProfile));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    // One-time fetch for verified labs
    const fetchVerified = async () => {
      const vq = query(collection(db, 'labProfiles'), where('isVerified', '==', true));
      const vSnap = await getDocs(vq);
      setVerified(vSnap.docs.map(toLabProfile));
    };
    fetchVerified();

    return () => unsub();
  }, []);

  const handleVerify = async (labId: string) => {
    setVerifying(labId);
    try {
      const idToken = await getToken();
      const res = await fetch(`/api/verify/lab/${labId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ isVerified: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to verify lab');
      }
      // Optimistic: remove from unverified list, add to verified
      const lab = unverified.find(l => l.id === labId);
      if (lab) {
        setUnverified(prev => prev.filter(l => l.id !== labId));
        setVerified(prev => [{ ...lab, isVerified: true }, ...prev]);
      }
      toast.show({ title: 'Lab Verified', message: `${lab?.labName} is now approved`, type: 'success' });
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
        title="Lab Management"
        description="Verify and manage soil testing laboratories on the platform"
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
            <p className="font-medium text-gray-600">All labs are verified</p>
            <p className="text-sm mt-1">No pending lab verifications at this time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity/Day</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unverified.map(lab => (
                  <tr key={lab.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                          <FlaskConical size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{lab.labName}</p>
                          <p className="text-xs text-gray-400 font-mono">{lab.id.slice(0, 10)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        {lab.district}, {lab.state}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5 text-sm font-semibold text-gray-900">
                        <IndianRupee size={13} />
                        {lab.perTestPrice.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lab.dailyCapacity} tests/day</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleVerify(lab.id)}
                        disabled={verifying === lab.id}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                      >
                        {verifying === lab.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <ShieldCheck size={12} />}
                        {verifying === lab.id ? 'Verifying…' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Verified Labs */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
          Verified Labs
          <span className="text-xs font-normal text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full ml-1">
            {verified.length}
          </span>
        </h2>

        {verified.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            <p className="text-sm">No verified labs yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {verified.map(lab => (
                  <tr key={lab.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                          <FlaskConical size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{lab.labName}</p>
                          <p className="text-xs text-gray-400 font-mono">{lab.id.slice(0, 10)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lab.district}, {lab.state}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{lab.perTestPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lab.dailyCapacity}/day</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                        <CheckCircle2 size={11} /> Verified
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
