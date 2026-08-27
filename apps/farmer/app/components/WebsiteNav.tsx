'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';

const PUBLIC_NAV = [
  { label: 'Features', href: '/features' },
  { label: 'About',    href: '/about' },
  { label: 'FAQ',      href: '/faq' },
  { label: 'Blog',     href: '/blog' },
  { label: 'Contact',  href: '/contact' },
];

export default function WebsiteNav() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !isLoading && !!user;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`wsnav ${scrolled ? 'wsnav-scrolled' : ''}`}>
      <div className="wsnav-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <div className="logo-icon"><Leaf size={18} /></div>
          <span className="logo-text">FarmHith</span>
        </Link>

        {/* Desktop nav links */}
        <div className="wsnav-links">
          {PUBLIC_NAV.map(n => (
            <Link key={n.href} href={n.href} className="wsnav-link-pub">{n.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div className="wsnav-right">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary-sm flex items-center gap-2">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
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
          {PUBLIC_NAV.map(n => (
            <Link key={n.href} href={n.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {n.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary-full flex items-center justify-center gap-2" onClick={() => setMenuOpen(false)}>
              Go to Dashboard <ArrowRight size={16} />
            </Link>
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
