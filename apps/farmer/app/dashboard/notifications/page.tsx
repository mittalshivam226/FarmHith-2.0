'use client';
import React from 'react';
import { useAuth } from '@farmhith/auth';
import { SectionHeader, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatRelativeTime } from '@farmhith/utils';
import { useNotifications, type Notification } from '@farmhith/hooks';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Bell, CheckCheck, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />,
  info: <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />,
  error: <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />,
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { data: notifications, loading, error } = useNotifications(user?.id);

  const unread = notifications.filter(n => !n.read).length;

  async function markRead(id: string) {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) { console.error(e); }
  }

  async function markAllRead() {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n =>
          updateDoc(doc(db, 'notifications', n.id), { read: true })
        )
      );
    } catch (e) { console.error(e); }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Notifications"
        description={loading ? 'Loading…' : unread > 0 ? `${unread} unread` : 'All caught up!'}
        action={
          unread > 0 ? (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          ) : null
        }
      />

      <QueryState
        loading={loading}
        error={error}
        empty={notifications.length === 0}
        emptyProps={{
          icon: <Bell size={24} />,
          title: "No notifications yet",
          description: "We'll let you know when something important happens."
        }}
        loadingFallback={<div className="space-y-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      >
        <div className="space-y-3">
          {notifications.map(notification => (
            <button
              key={notification.id}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-lg border transition-all ${
                notification.read
                  ? 'bg-white border-gray-100 opacity-70'
                  : 'bg-green-50 border-green-200 shadow-sm'
              }`}
              onClick={() => markRead(notification.id)}
            >
              <span className="shrink-0 mt-0.5">{TYPE_ICONS[notification.type] ?? <Info size={18} className="text-slate-400" />}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1.5">{formatRelativeTime(notification.createdAt)}</p>
              </div>
              {!notification.read && (
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </QueryState>
    </div>
  );
}
