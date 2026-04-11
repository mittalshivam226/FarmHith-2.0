'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { PageShell, PortalSidebar, PageLoader } from '@farmhith/ui';
import { LayoutDashboard, CalendarDays, DollarSign, User, Leaf, Clock } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',                icon: <LayoutDashboard size={18} /> },
  { label: 'My Sessions',  href: '/dashboard/sessions',      icon: <CalendarDays size={18} /> },
  { label: 'Availability', href: '/dashboard/availability',  icon: <Clock size={18} /> },
  { label: 'Earnings',     href: '/dashboard/earnings',      icon: <DollarSign size={18} /> },
  { label: 'Profile',      href: '/dashboard/profile',       icon: <User size={18} /> },
];

export default function SoilmitraDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <PageLoader label="Loading expert dashboard…" />;
  if (!isAuthenticated || !user) return null;

  return (
    <PageShell
      sidebar={
        <PortalSidebar
          portalName="Soil-Mitra Portal"
          portalColor="from-teal-600 to-teal-700"
          navItems={navItems}
          user={{ name: user.name, role: user.role }}
          logoIcon={<Leaf size={22} />}
        />
      }
    >
      {children}
    </PageShell>
  );
}
