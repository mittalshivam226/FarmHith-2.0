'use client';
import React from 'react';
import { useAuth } from '@farmhith/auth';
import { SectionHeader, QueryState, CardSkeleton, Badge } from '@farmhith/ui';
import { formatRelativeTime } from '@farmhith/utils';
import { useNotifications, type Notification } from '@farmhith/hooks';
import { db } from '@farmhith/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Bell, CheckCheck, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { FadeIn, SlideIn, ZoomIn } from '../../components/Animations';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-primary-700 shrink-0 mt-0.5" />,
  info: <Info size={18} className="text-sky-700 shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />,
  error: <XCircle size={18} className="text-red-700 shrink-0 mt-0.5" />,
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
    <div className="max-w-2xl mx-auto space-y-6 text-slate-800">
      <SlideIn direction="left">
        <SectionHeader
          title="Notifications"
          description={loading ? 'Checking for updates…' : unread > 0 ? `You have ${unread} unread notifications` : 'You are all caught up!'}
          action={
            unread > 0 ? (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1.5 text-xs text-primary-700 hover:text-primary-800 font-bold bg-primary-50 border border-primary-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
              >
                <CheckCheck size={14} /> Mark all as read
              </button>
            ) : null
          }
        />
      </SlideIn>

      <FadeIn delay={0.1}>
        <QueryState
          loading={loading}
          error={error}
          empty={notifications.length === 0}
          emptyProps={{
            icon: <Bell size={28} className="text-slate-400" />,
            title: "No Notifications Yet",
            description: "Updates regarding your soil tests, agronomist sessions, and crop residue buyer orders will appear here."
          }}
          loadingFallback={<div className="space-y-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
        >
          <div className="space-y-3">
            {notifications.map((notification, i) => (
              <ZoomIn key={notification.id} delay={0.1 + (i * 0.04)}>
                <button
                  className={`w-full text-left flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                    notification.read
                      ? 'bg-white border-slate-200/80 hover:border-slate-300 opacity-75 hover:opacity-100 shadow-xs'
                      : 'bg-primary-50/40 border-primary-200 hover:border-primary-300 shadow-card'
                  }`}
                  onClick={() => markRead(notification.id)}
                >
                  <span className="shrink-0 mt-0.5">
                    {TYPE_ICONS[notification.type] ?? <Info size={18} className="text-slate-500" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${notification.read ? 'text-slate-800' : 'text-slate-950'}`}>
                      {notification.title}
                    </p>
                    <p className={`text-xs sm:text-sm mt-0.5 ${notification.read ? 'text-slate-500' : 'text-slate-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2 font-semibold">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-700 mt-1.5 shrink-0" />
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

