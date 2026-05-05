'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { PageShell, PortalSidebar, PageLoader } from '@farmhith/ui';
import { LayoutDashboard, ClipboardList, Calendar, DollarSign, User, FlaskConical } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',  href: '/dashboard',            icon: <LayoutDashboard size={18} /> },
  { label: 'Bookings',   href: '/dashboard/bookings',   icon: <ClipboardList size={18} /> },
  { label: 'Calendar',   href: '/dashboard/calendar',   icon: <Calendar size={18} /> },
  { label: 'Earnings',   href: '/dashboard/earnings',   icon: <DollarSign size={18} /> },
  { label: 'Profile',    href: '/dashboard/profile',    icon: <User size={18} /> },
];

export default function LabDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) return <PageLoader label="Loading lab dashboard…" />;
  if (!isAuthenticated || !user) return null;

  return (
    <PageShell
      sidebar={
        <PortalSidebar
          portalName="Lab Portal"
          portalColor="from-blue-600 to-blue-700"
          navItems={navItems}
          user={{ name: user.name, role: user.role }}
          logoIcon={<FlaskConical size={22} />}
          onLogout={handleLogout}
        />
      }
    >
      {children}
    </PageShell>
  );
}
