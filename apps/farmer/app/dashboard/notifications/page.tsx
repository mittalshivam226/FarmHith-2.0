'use client';
import React from 'react';
import { Card, SectionHeader, StatusBadge } from '@farmhith/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@farmhith/utils';
import { Bell, CheckCheck } from 'lucide-react';
import { mockNotifications } from '../../../lib/mock-data';

const TYPE_ICONS: Record<string, string> = {
  success: '✅',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const unread = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Notifications"
        description={unread > 0 ? `${unread} unread` : 'All caught up!'}
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
        {notifications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p>No notifications yet.</p>
          </div>
        )}
        {notifications.map(notification => (
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
        ))}
      </div>
    </div>
  );
}
