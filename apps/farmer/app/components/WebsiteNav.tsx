'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import {
  Leaf, Menu, X, LayoutDashboard, FlaskConical,
  Users, ShoppingBasket, History, User, LogOut,
  Bell, ChevronDown,
} from 'lucide-react';

const APP_NAV = [
  { label: 'Dashboard',   href: '/dashboard',             icon: <LayoutDashboard size={16} /> },
  { label: 'Soil Tests',  href: '/dashboard/soil-test',   icon: <FlaskConical size={16} /> },
  { label: 'Soil-Mitra',  href: '/dashboard/mitra',       icon: <Users size={16} /> },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: <ShoppingBasket size={16} /> },
  { label: 'History',     href: '/dashboard/history',     icon: <History size={16} /> },
];

const PUBLIC_NAV = [
  { label: 'Features', href: '/features' },
  { label: 'About',    href: '/about' },
  { label: 'FAQ',      href: '/faq' },
  { label: 'Blog',     href: '/blog' },
  { label: 'Contact',  href: '/contact' },
];

export default function WebsiteNav() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLoggedIn = !isLoading && !!user;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.profile-menu-wrap')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <nav className={`wsnav ${scrolled ? 'wsnav-scrolled' : ''}`}>
      <div className="wsnav-inner">
        {/* Logo */}
        <Link href={isLoggedIn ? '/dashboard' : '/'} className="logo">
          <div className="logo-icon"><Leaf size={18} /></div>
          <span className="logo-text">FarmHith</span>
          {isLoggedIn && <span className="logo-badge">Farmer</span>}
        </Link>

        {/* Desktop nav links */}
        <div className="wsnav-links">
          {isLoggedIn
            ? APP_NAV.map(n => (
                <Link key={n.href} href={n.href}
                  className={`wsnav-link ${isActive(n.href) ? 'wsnav-link-active' : ''}`}>
                  {n.icon}{n.label}
                </Link>
              ))
            : PUBLIC_NAV.map(n => (
                <Link key={n.href} href={n.href} className="wsnav-link-pub">{n.label}</Link>
              ))}
        </div>

        {/* Right side */}
        <div className="wsnav-right">
          {isLoggedIn ? (
            <>
              {/* Notification bell */}
              <button className="wsnav-icon-btn" title="Notifications">
                <Bell size={18} />
              </button>
              {/* Profile dropdown */}
              <div className="profile-menu-wrap">
                <button
                  className="wsnav-profile-btn"
                  onClick={() => setProfileOpen(v => !v)}
                >
                  <div className="wsnav-avatar">
                    {(user.name?.[0] ?? 'F').toUpperCase()}
                  </div>
                  <span className="wsnav-username">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={profileOpen ? 'rotate-180' : ''} style={{ transition: 'transform .2s' }} />
                </button>
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <p className="pd-name">{user.name}</p>
                      <p className="pd-email">{user.email}</p>
                    </div>
                    <Link href="/dashboard/profile" className="pd-item" onClick={() => setProfileOpen(false)}>
                      <User size={15} /> My Profile
                    </Link>
                    <Link href="/dashboard/history" className="pd-item" onClick={() => setProfileOpen(false)}>
                      <History size={15} /> History
                    </Link>
                    <button className="pd-item pd-logout" onClick={handleLogout}>
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Log in</Link>
              <Link href="/register" className="btn-primary-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer">
          {isLoggedIn
            ? APP_NAV.map(n => (
                <Link key={n.href} href={n.href} className="mobile-link"
                  onClick={() => setMenuOpen(false)}>
                  {n.icon}{n.label}
                </Link>
              ))
            : PUBLIC_NAV.map(n => (
                <Link key={n.href} href={n.href} className="mobile-link"
                  onClick={() => setMenuOpen(false)}>{n.label}</Link>
              ))}
          {isLoggedIn ? (
            <>
              <Link href="/dashboard/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <User size={16} /> Profile
              </Link>
              <button className="mobile-link pd-logout" onClick={handleLogout}>
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link href="/register" className="btn-primary-full" onClick={() => setMenuOpen(false)}>
                Create Free Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
