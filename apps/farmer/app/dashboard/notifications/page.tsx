'use client';
import React from 'react';
import { useAuth } from '@farmhith/auth';
import { SectionHeader, QueryState, CardSkeleton } from '@farmhith/ui';
import { formatRelativeTime } from '@farmhith/utils';
import { useNotifications, type Notification } from '@farmhith/hooks';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Bell, CheckCheck, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-success-400 shrink-0 mt-0.5" />,
  info: <Info size={18} className="text-info-400 shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={18} className="text-warning-400 shrink-0 mt-0.5" />,
  error: <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />,
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
    <div className="max-w-2xl mx-auto space-y-6 text-slate-100">
      <SlideIn direction="left">
        <div className="[&_h2]:!text-white [&_p]:!text-slate-400">
          <SectionHeader
            title="Notifications"
            description={loading ? 'Loading…' : unread > 0 ? `${unread} unread` : 'All caught up!'}
            action={
              unread > 0 ? (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-bold bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              ) : null
            }
          />
        </div>
      </SlideIn>

      <FadeIn delay={0.1}>
        <QueryState
          loading={loading}
          error={error}
          empty={notifications.length === 0}
          emptyProps={{
            icon: <Bell size={24} className="text-slate-500" />,
            title: "No notifications yet",
            description: "We'll let you know when something important happens."
          }}
          loadingFallback={<div className="space-y-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="space-y-3">
            {notifications.map((notification, i) => (
              <ZoomIn key={notification.id} delay={0.2 + (i * 0.05)}>
                <button
                  className={`w-full text-left flex items-start gap-4 p-5 rounded-xl border transition-all hud-element ${
                    notification.read
                      ? 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                      : 'bg-slate-950 border-primary-500/30 shadow-glow-sm hover:border-primary-500/50'
                  }`}
                  onClick={() => markRead(notification.id)}
                >
                  <span className="shrink-0 mt-0.5">{TYPE_ICONS[notification.type] ?? <Info size={18} className="text-slate-500" />}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${notification.read ? 'text-slate-300' : 'text-slate-100'}`}>
                      {notification.title}
                    </p>
                    <p className={`text-sm mt-0.5 ${notification.read ? 'text-slate-500' : 'text-slate-400'}`}>{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2 font-semibold uppercase tracking-wider">{formatRelativeTime(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-500 mt-1.5 shrink-0 shadow-glow-sm" />
                  )}
                </button>
              </ZoomIn>
            ))}
          </div>
        </QueryState>
      </FadeIn>
    </div>
  );
}
