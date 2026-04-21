'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, SectionHeader, StatCard, Button, useToast } from '@farmhith/ui';
import { AlertCircle, FileText, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@farmhith/auth';

interface Dispute {
  id: string;
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  raisedByName: string;
  againstName: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  createdAt: any;
  resolutionNote?: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-600',
  HIGH: 'bg-amber-100 text-amber-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  LOW: 'bg-gray-100 text-gray-500',
};

const STATUS_STYLES: Record<string, string> = {
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INVESTIGATING: 'bg-amber-50 text-amber-700 border-amber-200',
  OPEN: 'bg-red-50 text-red-700 border-red-200',
};

export default function DisputesHub() {
  const { getToken } = useAuth();
  const toast = useToast();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDisputes = useCallback(async () => {
    try {
      const idToken = await getToken();
      const res = await fetch('/api/disputes', {
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load disputes');
      const data = await res.json();
      setDisputes(data.disputes ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { fetchDisputes(); }, [fetchDisputes]);

  const updateStatus = async (disputeId: string, status: Dispute['status']) => {
    setUpdatingId(disputeId);
    try {
      const idToken = await getToken();
      const res = await fetch(`/api/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update dispute');
      toast.show({ title: 'Dispute Updated', message: `Status changed to ${status}`, type: 'success' });
      setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status } : d));
    } catch {
      toast.show({ title: 'Error', message: 'Could not update dispute.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const openCount        = disputes.filter(d => d.status === 'OPEN').length;
  const investigatingCount = disputes.filter(d => d.status === 'INVESTIGATING').length;
  const resolvedCount    = disputes.filter(d => d.status === 'RESOLVED').length;
  const criticalCount    = disputes.filter(d => d.priority === 'CRITICAL' && d.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <SectionHeader title="Resolution Hub" description="Manage support tickets and cross-party disputes" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open"         value={openCount}          icon={<AlertCircle size={20} />}   accent="rose" />
        <StatCard label="Investigating" value={investigatingCount} icon={<FileText size={20} />}      accent="amber" />
        <StatCard label="Resolved"     value={resolvedCount}      icon={<CheckCircle size={20} />}   accent="green" />
        <StatCard label="Critical"     value={criticalCount}      icon={<AlertTriangle size={20} />} accent="purple" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : disputes.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-400">
            <CheckCircle size={40} className="mx-auto mb-3" />
            <p className="font-medium text-gray-600">No disputes found</p>
            <p className="text-sm mt-1">The platform is dispute-free right now.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${PRIORITY_STYLES[dispute.priority] ?? PRIORITY_STYLES.LOW}`}>
                    <AlertCircle size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 font-mono">{dispute.id.slice(0, 8)}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_STYLES[dispute.status] ?? ''}`}>
                        {dispute.status}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {dispute.priority}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">{dispute.type}</h3>
                    <div className="mt-1.5 text-sm text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong>Raised by:</strong> {dispute.raisedByName}</span>
                      {dispute.againstName && <span><strong>Against:</strong> {dispute.againstName}</span>}
                    </div>
                    {dispute.resolutionNote && (
                      <p className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        Resolution: {dispute.resolutionNote}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {dispute.status === 'OPEN' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === dispute.id}
                      onClick={() => updateStatus(dispute.id, 'INVESTIGATING')}
                    >
                      {updatingId === dispute.id ? <Loader2 size={12} className="animate-spin" /> : 'Investigate'}
                    </Button>
                  )}
                  {dispute.status === 'INVESTIGATING' && (
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={updatingId === dispute.id}
                      onClick={() => updateStatus(dispute.id, 'RESOLVED')}
                    >
                      {updatingId === dispute.id ? <Loader2 size={12} className="animate-spin" /> : 'Mark Resolved'}
                    </Button>
                  )}
                  {dispute.status === 'RESOLVED' && (
                    <span className="text-xs text-emerald-600 font-medium">✓ Closed</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
