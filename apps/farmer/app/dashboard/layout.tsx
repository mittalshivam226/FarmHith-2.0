'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { useNotifications } from '@farmhith/hooks';
import { PageShell, PortalSidebar, PageLoader } from '@farmhith/ui';
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  ShoppingBasket,
  History,
  Bell,
  User,
  Sprout,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: notifications } = useNotifications(user?.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Dashboard',     href: '/dashboard',              icon: <LayoutDashboard size={18} /> },
    { label: 'Soil Tests',    href: '/dashboard/soil-test',    icon: <FlaskConical size={18} /> },
    { label: 'Soil-Mitra',    href: '/dashboard/mitra',        icon: <Users size={18} /> },
    { label: 'Marketplace',   href: '/dashboard/marketplace',  icon: <ShoppingBasket size={18} /> },
    { label: 'History',       href: '/dashboard/history',      icon: <History size={18} /> },
    { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell size={18} />, badge: unreadCount || undefined },
    { label: 'Profile',       href: '/dashboard/profile',      icon: <User size={18} /> },
  ];

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <PageLoader label="Loading your dashboard…" />;
  if (!isAuthenticated || !user) return null;

  return (
    <PageShell
      sidebar={
        <PortalSidebar
          portalName="Farmer Portal"
          portalColor="from-green-600 to-emerald-700"
          navItems={navItems}
          user={{ name: user.name, role: user.role }}
          logoIcon={<Sprout size={22} />}
        />
      }
    >
      {children}
    </PageShell>
  );
}
