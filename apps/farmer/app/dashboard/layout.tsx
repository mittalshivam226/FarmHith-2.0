'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { PageShell, PortalSidebar, TopBar, PageLoader } from '@farmhith/ui';
import {
  LayoutDashboard, FlaskConical, Users, ShoppingBasket, History, Leaf
} from 'lucide-react';
import { FadeIn } from '../components/Animations';

const navItems = [
  { label: 'Dashboard',   href: '/dashboard',             icon: <LayoutDashboard size={18} /> },
  { label: 'Soil Tests',  href: '/dashboard/soil-test',   icon: <FlaskConical size={18} /> },
  { label: 'Soil-Mitra',  href: '/dashboard/mitra',       icon: <Users size={18} /> },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: <ShoppingBasket size={18} /> },
  { label: 'History',     href: '/dashboard/history',     icon: <History size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    // Role guard — only farmers allowed in this section
    if (!isLoading && user && user.role !== 'FARMER') {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return <PageLoader label="Loading your dashboard…" />;
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
          portalName="Farmer Portal"
          portalColor="bg-primary-700"
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
      <FadeIn delay={0.05} duration={0.3}>
        {children}
      </FadeIn>
    </PageShell>
  );
}
