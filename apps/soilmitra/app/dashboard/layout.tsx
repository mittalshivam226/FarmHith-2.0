'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { PageShell, PortalSidebar, TopBar, PageLoader } from '@farmhith/ui';
import { LayoutDashboard, CalendarDays, IndianRupee, User, Leaf, Clock } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',                icon: <LayoutDashboard size={18} /> },
  { label: 'My Bookings',  href: '/dashboard/bookings',      icon: <CalendarDays size={18} /> },
  { label: 'Availability', href: '/dashboard/availability',  icon: <Clock size={18} /> },
  { label: 'Earnings',     href: '/dashboard/earnings',      icon: <IndianRupee size={18} /> },
  { label: 'Profile',      href: '/dashboard/profile',       icon: <User size={18} /> },
];

export default function SoilmitraDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <PageLoader label="Loading expert dashboard…" />;
  if (!isAuthenticated || !user) return null;

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
          portalName="Soil-Mitra Portal"
          portalColor="bg-teal-700"
          navItems={navItems}
          logoIcon={<Leaf size={22} />}
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
          onProfileClick={() => router.push('/dashboard/profile')}
        />
      }
    >
      {children}
    </PageShell>
  );
}
