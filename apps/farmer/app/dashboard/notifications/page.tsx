'use client';
import React from 'react';
import { useAuth } from '@farmhith/auth';
import { SectionHeader } from '@farmhith/ui';
import { formatRelativeTime } from '@farmhith/utils';
import { useNotifications, type Notification } from '@farmhith/hooks';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';

const TYPE_ICONS: Record<string, string> = {
  success: '✅',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { data: notifications, loading } = useNotifications(user?.id);

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

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map(notification => (
            <button
              key={notification.id}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                notification.read
                  ? 'bg-white border-gray-100 opacity-70'
                  : 'bg-green-50 border-green-200 shadow-sm'
              }`}
              onClick={() => markRead(notification.id)}
            >
              <span className="text-xl" aria-hidden>{TYPE_ICONS[notification.type] ?? 'ℹ️'}</span>
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
          ))
        )}
      </div>
    </div>
  );
}
