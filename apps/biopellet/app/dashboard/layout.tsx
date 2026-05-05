'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { PageShell, PortalSidebar, PageLoader } from '@farmhith/ui';
import { LayoutDashboard, Search, ShoppingCart, User, Factory } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard',           icon: <LayoutDashboard size={18} /> },
  { label: 'Browse Listings', href: '/dashboard/listings', icon: <Search size={18} /> },
  { label: 'My Orders', href: '/dashboard/orders',    icon: <ShoppingCart size={18} /> },
  { label: 'Profile',   href: '/dashboard/profile',  icon: <User size={18} /> },
];

export default function BiopelletDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) return <PageLoader label="Loading plant dashboard…" />;
  if (!isAuthenticated || !user) return null;

  return (
    <PageShell
      sidebar={
        <PortalSidebar
          portalName="Bio-Pellet Plant"
          portalColor="from-gray-800 to-green-800"
          navItems={navItems}
          user={{ name: user.name, role: user.role }}
          logoIcon={<Factory size={22} />}
          onLogout={handleLogout}
        />
      }
    >
      {children}
    </PageShell>
  );
}
