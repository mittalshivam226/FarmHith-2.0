'use client';
import React, { useState } from 'react';
import { Card, SectionHeader, Input, Select, Button, useToast, Badge } from '@farmhith/ui';
import { Radio, Users, Target, Send, Megaphone } from 'lucide-react';

const MOCK_BROADCASTS = [
  { id: '1', title: 'New Soil Testing Subsidy', target: 'FARMERS', date: '2026-04-10', status: 'SENT' },
  { id: '2', title: 'Platform Maintenance Alert', target: 'ALL_USERS', date: '2026-04-05', status: 'SENT' },
  { id: '3', title: 'Update Lab Capacity Settings', target: 'LABS', date: '2026-03-28', status: 'SENT' },
];

export default function AdminBroadcastsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    targetAudience: 'ALL_USERS',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setForm({ title: '', message: '', targetAudience: 'ALL_USERS' });
      toast.show({
        title: 'Broadcast Sent',
        message: `Notification dispatched successfully to selected audience.`,
        type: 'success',
      });
    }, 1500);
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
                 <p className="text-xs text-gray-500">This will appear in the user's notification bell.</p>
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

              {/* Textarea substitute */}
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
                  <Send size={16} />
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
             <div className="space-y-3">
               {MOCK_BROADCASTS.map(b => (
                 <div key={b.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="default" size="sm">{b.target.replace('_', ' ')}</Badge>
                      <span className="text-xs text-gray-400">{b.date}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{b.title}</p>
                 </div>
               ))}
               <div className="p-3 border border-dashed border-gray-200 rounded-xl text-center">
                 <button className="text-xs text-purple-600 font-medium hover:underline">View All History →</button>
               </div>
             </div>
          </Card>

          <div className="bg-gray-100 border border-gray-200 p-4 rounded-xl flex items-start gap-3">
             <Target className="text-gray-500 mt-0.5 shrink-0" size={18} />
             <div>
                <p className="text-sm font-semibold text-gray-900">Pro Tip</p>
                <p className="text-xs text-gray-600 mt-1">
                  Keep broadcast titles under 40 characters for best visibility on mobile devices.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
