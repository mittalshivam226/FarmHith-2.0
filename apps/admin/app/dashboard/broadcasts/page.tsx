'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, SectionHeader, Input, Select, Button, useToast, Badge } from '@farmhith/ui';
import { Radio, Target, Send, Megaphone, Loader2 } from 'lucide-react';
import { useAuth } from '@farmhith/auth';

interface Broadcast {
  id: string;
  title: string;
  targetAudience: string;
  sentAt: any;
  status: string;
}

export default function AdminBroadcastsPage() {
  const toast = useToast();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [form, setForm] = useState({
    title: '',
    message: '',
    targetAudience: 'ALL_USERS',
  });

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const idToken = await getToken();
      const res = await fetch('/api/broadcasts', {
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setBroadcasts(data.broadcasts ?? []);
      }
    } catch { /* silent */ }
    setHistoryLoading(false);
  }, [getToken]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setLoading(true);

    try {
      const idToken = await getToken();
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to send broadcast');
      const data = await res.json();

      toast.show({
        title: 'Broadcast Sent',
        message: `Notification dispatched to ${data.notificationsSent} users.`,
        type: 'success',
      });

      setForm({ title: '', message: '', targetAudience: 'ALL_USERS' });
      fetchHistory(); // refresh history
    } catch {
      toast.show({ title: 'Error', message: 'Failed to send broadcast. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <SectionHeader
        title="Broadcast Center"
        description="Send push notifications and alerts to platform users."
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Col - Compose */}
        <div className="lg:col-span-3 space-y-4">
          <Card padding="lg">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
               <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                 <Megaphone size={20} />
               </div>
               <div>
                 <h3 className="text-base font-bold text-gray-900">Compose Message</h3>
                 <p className="text-xs text-gray-500">This will appear in each user&apos;s notification bell.</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Target Audience"
                value={form.targetAudience}
                onChange={(val) => setForm({ ...form, targetAudience: val })}
                options={[
                  { label: '@All Users (Platform-wide)', value: 'ALL_USERS' },
                  { label: '@Farmers Only', value: 'FARMERS' },
                  { label: '@Soil-Mitras Only', value: 'SOILMITRAS' },
                  { label: '@Testing Labs Only', value: 'LABS' },
                  { label: '@Bio-Pellet Plants Only', value: 'BIOPELLET' },
                ]}
                required
              />

              <Input
                label="Notification Title"
                placeholder="e.g. Action Required: Update Profile"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Message Body</label>
                <textarea
                  className="w-full h-32 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                  placeholder="Type the main notification content here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading || !form.title || !form.message}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 !text-white"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Transmitting...' : 'Send Broadcast'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Col - History */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
             <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
               <Radio size={16} className="text-gray-400" /> Recent Broadcasts
             </h3>
             {historyLoading ? (
               <div className="flex justify-center py-6">
                 <Loader2 size={18} className="animate-spin text-gray-400" />
               </div>
             ) : broadcasts.length === 0 ? (
               <p className="text-sm text-gray-400 text-center py-4">No broadcasts sent yet.</p>
             ) : (
               <div className="space-y-3">
                 {broadcasts.slice(0, 8).map(b => (
                   <div key={b.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="default" size="sm">{b.targetAudience.replace('_', ' ')}</Badge>
                        <span className="text-xs text-gray-400">
                          {b.sentAt?.toDate
                            ? new Date(b.sentAt.toDate()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                            : '—'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{b.title}</p>
                   </div>
                 ))}
               </div>
             )}
          </Card>

          <div className="bg-gray-100 border border-gray-200 p-4 rounded-xl flex items-start gap-3">
             <Target className="text-gray-500 mt-0.5 shrink-0" size={18} />
             <div>
                <p className="text-sm font-semibold text-gray-900">Pro Tip</p>
                <p className="text-xs text-gray-600 mt-1">
                  Keep broadcast titles under 40 characters for best visibility on mobile devices.
                  Use role-targeted broadcasts to reduce notification fatigue.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
