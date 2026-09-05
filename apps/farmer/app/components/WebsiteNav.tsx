'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';

const PUBLIC_NAV = [
  { label: 'Features', href: '/features' },
  { label: 'About Us', href: '/about' },
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
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`wsnav ${scrolled ? 'wsnav-scrolled' : 'bg-transparent'}`}>
      <div className="wsnav-inner">
        {/* Logo */}
        <Link href="/" className="logo group">
          <div className="logo-icon group-hover:scale-105 transition-transform shadow-sm">
            <Leaf size={18} />
          </div>
          <span className="logo-text">FarmHith</span>
        </Link>

        {/* Desktop nav links */}
        <div className="wsnav-links">
          {PUBLIC_NAV.map(n => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`wsnav-link-pub transition-colors ${
                  isActive ? 'text-primary-700 font-bold bg-primary-50' : 'text-slate-700 hover:text-primary-700'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        {/* Right side CTAs */}
        <div className="wsnav-right">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary-sm flex items-center gap-2 shadow-sm">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost font-semibold text-slate-700 hover:text-slate-900">
                Log in
              </Link>
              <Link href="/register" className="btn-primary-sm shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="menu-toggle md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer animate-in fade-in">
          {PUBLIC_NAV.map(n => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`mobile-link ${isActive ? 'text-primary-700 font-bold' : 'text-slate-700'}`}
                onClick={() => setMenuOpen(false)}
              >
                {n.label}
              </Link>
            );
          })}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="btn-primary-full flex items-center justify-center gap-2 mt-4"
              onClick={() => setMenuOpen(false)}
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg bg-white"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="btn-primary-full"
                onClick={() => setMenuOpen(false)}
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
