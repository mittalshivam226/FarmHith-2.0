'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { PageShell, PortalSidebar, PageLoader, TopBar } from '@farmhith/ui';
import {
  LayoutDashboard, Users, ClipboardList, CalendarDays,
  ShoppingBasket, ShoppingCart, CreditCard, BarChart2,
  Bell, AlertOctagon, ShieldCheck, FlaskConical, UserCheck,
} from 'lucide-react';

const navItems = [
  { label: 'Overview',    href: '/dashboard',                  icon: <LayoutDashboard size={18} /> },
  { label: 'All Users',   href: '/dashboard/users',            icon: <Users size={18} /> },
  { label: 'Labs',        href: '/dashboard/users/labs',       icon: <FlaskConical size={18} /> },
  { label: 'Soil-Mitras', href: '/dashboard/users/mitras',     icon: <UserCheck size={18} /> },
  { label: 'Bookings',    href: '/dashboard/bookings',         icon: <ClipboardList size={18} /> },
  { label: 'Sessions',    href: '/dashboard/sessions',         icon: <CalendarDays size={18} /> },
  { label: 'Listings',    href: '/dashboard/listings',         icon: <ShoppingBasket size={18} /> },
  { label: 'Orders',      href: '/dashboard/orders',           icon: <ShoppingCart size={18} /> },
  { label: 'Payments',    href: '/dashboard/payments',         icon: <CreditCard size={18} /> },
  { label: 'Analytics',   href: '/dashboard/analytics',        icon: <BarChart2 size={18} /> },
  { label: 'Broadcast',   href: '/dashboard/broadcasts',       icon: <Bell size={18} /> },
  { label: 'Disputes',    href: '/dashboard/disputes',         icon: <AlertOctagon size={18} /> },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <PageLoader label="Authenticating admin…" />;
  if (!isAuthenticated || !user) return null;

  // Generate simple breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
      href: index === pathSegments.length - 1 ? undefined : href,
    };
  });

  return (
    <PageShell
      sidebar={
        <PortalSidebar
          portalName="Admin Panel"
          portalColor="bg-slate-900"
          navItems={navItems}
          logoIcon={<ShieldCheck size={22} />}
        />
      }
      topbar={
        <TopBar
          breadcrumbs={breadcrumbs}
          user={user}
          onLogout={async () => {
            await logout();
            router.push('/');
          }}
        />
      }
    >
      {children}
    </PageShell>
  );
}
