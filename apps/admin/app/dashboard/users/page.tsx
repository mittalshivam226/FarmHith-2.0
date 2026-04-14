'use client';
import React from 'react';
import { DataTable, type Column, SectionHeader, StatusBadge } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import type { User } from '@farmhith/types';
import { useAllUsers } from '@farmhith/hooks';
import { getRoleLabel } from '@farmhith/utils';
import { ShieldCheck, XCircle, Loader2 } from 'lucide-react';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type LiveUser = User & { id: string; createdAt: string };

const ROLE_TABS = ['ALL', 'FARMER', 'LAB', 'SOILMITRA', 'BIOPELLET'] as const;

function RolePill({ role }: { role: string }) {
  const cls =
    role === 'FARMER' ? 'bg-green-100 text-green-700' :
    role === 'LAB' ? 'bg-blue-100 text-blue-700' :
    role === 'SOILMITRA' ? 'bg-teal-100 text-teal-700' :
    role === 'BIOPELLET' ? 'bg-gray-100 text-gray-700' :
    'bg-purple-100 text-purple-700';
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cls}`}>
      {getRoleLabel(role as any)}
    </span>
  );
}

export default function AdminUsersPage() {
  const [tab, setTab] = React.useState<typeof ROLE_TABS[number]>('ALL');
  const { data: users, loading } = useAllUsers();

  const filtered = tab === 'ALL'
    ? users
    : users.filter(u => u.role === tab);

  // Role counts derived from live data
  const countByRole = (role: string) => users.filter(u => u.role === role).length;

  const columns: Column<LiveUser>[] = [
    { key: 'id', header: 'ID', render: (u) => <span className="text-xs font-mono text-gray-400">{u.id.slice(0, 10)}</span> },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone' },
    { key: 'role', header: 'Role', sortable: true, render: (u) => <RolePill role={u.role} /> },
    { key: 'createdAt', header: 'Joined', sortable: true, render: (u) => u.createdAt ? formatDate(u.createdAt) : '—' },
    {
      key: 'id', header: 'Actions',
      render: (u) => (
        <div className="flex items-center gap-1">
          <button
            title="Verify"
            onClick={() => updateDoc(doc(db, 'users', u.id), { isVerified: true }).catch(console.error)}
            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
          >
            <ShieldCheck size={14} />
          </button>
          <button
            title="Suspend"
            onClick={() => updateDoc(doc(db, 'users', u.id), { isSuspended: true }).catch(console.error)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <XCircle size={14} />
          </button>
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
          <div key={item.label} className={`border rounded-2xl p-4 ${item.color}`}>
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
            {t === 'ALL' ? 'All Users' : getRoleLabel(t)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(u) => u.id}
          emptyTitle="No users found"
          emptyDescription="No users match the selected filter."
        />
      )}
    </div>
  );
}
