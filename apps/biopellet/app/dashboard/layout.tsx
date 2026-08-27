'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { PageShell, PortalSidebar, TopBar, PageLoader } from '@farmhith/ui';
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
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <PageLoader label="Loading plant dashboard…" />;
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
          portalName="Bio-Pellet Plant Portal"
          portalColor="bg-amber-700"
          navItems={navItems}
          logoIcon={<Factory size={22} />}
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
