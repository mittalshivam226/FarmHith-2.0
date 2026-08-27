'use client';
import React from 'react';
import { Card, SectionHeader, StatusBadge, DataTable, type Column, useToast, QueryState } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import type { User } from '@farmhith/types';
import { useAllUsers } from '@farmhith/hooks';
import { useAuth } from '@farmhith/auth';
import { ShieldCheck, ShieldX, XCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type LiveUser = User & { id: string; createdAt: string };

const ROLE_TABS = ['ALL', 'FARMER', 'LAB', 'SOILMITRA', 'BIOPELLET'] as const;

const ROLE_TAB_LABELS: Record<string, string> = {
  ALL: 'All Users',
  FARMER: 'Farmer',
  LAB: 'Lab',
  SOILMITRA: 'Soil-Mitra',
  BIOPELLET: 'Bio-Pellet',
};

export default function AdminUsersPage() {
  const [tab, setTab] = React.useState<typeof ROLE_TABS[number]>('ALL');
  const { data: users, loading, error } = useAllUsers();
  const { getToken } = useAuth();
  const toast = useToast();
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const filtered = tab === 'ALL'
    ? users
    : users.filter(u => u.role === tab);

  const countByRole = (role: string) => users.filter(u => u.role === role).length;

  // Toggle isVerified on the /users/{id} document via direct Firestore write
  // (Profile-level verification is handled via /api/verify/:type/:id)
  const toggleUserVerified = async (userId: string, currentVal: boolean) => {
    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, 'users', userId), { isVerified: !currentVal });
      toast.show({ title: !currentVal ? 'User Verified' : 'Verification Removed', message: '', type: 'success' });
    } catch {
      toast.show({ title: 'Error', message: 'Could not update user.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const suspendUser = async (userId: string) => {
    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, 'users', userId), { isSuspended: true });
      toast.show({ title: 'User Suspended', message: '', type: 'success' });
    } catch {
      toast.show({ title: 'Error', message: 'Could not suspend user.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: Column<LiveUser>[] = [
    { key: 'id', header: 'ID', render: (u) => <span className="text-xs font-mono text-gray-400">{u.id.slice(0, 10)}</span> },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone' },
    { key: 'role', header: 'Role', sortable: true, render: (u) => <StatusBadge status={u.role} size="sm" /> },
    { key: 'createdAt', header: 'Joined', sortable: true, render: (u) => u.createdAt ? formatDate(u.createdAt) : '—' },
    {
      key: 'isVerified' as any, header: 'Verified',
      render: (u: any) => u.isVerified
        ? <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle2 size={12} /> Yes</span>
        : <span className="text-xs text-gray-400">No</span>,
    },
    {
      key: 'id', header: 'Actions',
      render: (u: any) => (
        <div className="flex items-center gap-1">
          {updatingId === u.id ? (
            <Loader2 size={14} className="animate-spin text-gray-400" />
          ) : (
            <>
              <button
                title={u.isVerified ? 'Revoke Verification' : 'Verify User'}
                onClick={() => toggleUserVerified(u.id, Boolean(u.isVerified))}
                className={`p-1.5 rounded-lg transition-colors ${
                  u.isVerified ? 'text-amber-500 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'
                }`}
              >
                {u.isVerified ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
              </button>
              <button
                title="Suspend"
                onClick={() => suspendUser(u.id)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <XCircle size={14} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader
        title="User Management"
        description="View, verify, and manage all platform users"
      />

      {/* Role counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Farmers', role: 'FARMER', color: 'bg-green-50 border-green-200 text-green-800' },
          { label: 'Labs', role: 'LAB', color: 'bg-blue-50 border-blue-200 text-blue-800' },
          { label: 'Soil-Mitras', role: 'SOILMITRA', color: 'bg-teal-50 border-teal-200 text-teal-800' },
          { label: 'Bio-Pellet Plants', role: 'BIOPELLET', color: 'bg-purple-50 border-purple-200 text-purple-800' },
        ].map(item => (
          <div key={item.label} className={`border rounded-lg p-4 ${item.color}`}>
            <p className="text-2xl font-bold">{loading ? '—' : countByRole(item.role).toLocaleString('en-IN')}</p>
            <p className="text-sm font-medium mt-0.5 opacity-80">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tab filter */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {ROLE_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'ALL' ? 'All Users' : ROLE_TAB_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      <QueryState
        loading={loading}
        error={error}
        empty={users.length === 0}
        emptyProps={{
          title: "No users found",
          description: "No users match the selected filter."
        }}
      >
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(u) => u.id}
          emptyTitle="No users found"
          emptyDescription="No users match the selected filter."
        />
      </QueryState>
    </div>
  );
}
