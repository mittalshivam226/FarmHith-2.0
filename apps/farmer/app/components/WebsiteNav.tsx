'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Leaf, Menu, X, ArrowRight, Sparkles, Building2, Users, FlaskConical, ChevronDown } from 'lucide-react';

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
  const [portalDropdown, setPortalDropdown] = useState(false);

  const isLoggedIn = !isLoading && !!user;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-emerald-950/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-primary-700 to-emerald-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(46,125,50,0.3)] group-hover:scale-105 transition-transform duration-300">
            <Leaf size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              FarmHith
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                2.0
              </span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
              Digital Agri-Network
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
          {PUBLIC_NAV.map((n) => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-700 text-white shadow-[0_2px_8px_rgba(46,125,50,0.3)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Ecosystem Portals Menu */}
          <div className="relative">
            <button
              onClick={() => setPortalDropdown(!portalDropdown)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 flex items-center gap-1.5 transition-colors border border-transparent hover:border-slate-200"
            >
              <span>Other Portals</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${portalDropdown ? 'rotate-180' : ''}`} />
            </button>

            {portalDropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setPortalDropdown(false)}
              >
                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-slate-800 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold group-hover:text-amber-800">Soil-Mitra Expert</div>
                    <div className="text-[10px] text-slate-500">Agronomist Consultation</div>
                  </div>
                </a>
                <a
                  href="http://localhost:3003"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold group-hover:text-blue-800">Bio-Pellet Industry</div>
                    <div className="text-[10px] text-slate-500">Biomass Procurement</div>
                  </div>
                </a>
                <a
                  href="http://localhost:3004"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FlaskConical size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold group-hover:text-emerald-800">Testing Labs</div>
                    <div className="text-[10px] text-slate-500">NABL Sample Processing</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-700 to-emerald-600 hover:from-primary-800 hover:to-emerald-700 text-white font-bold text-sm shadow-[0_4px_14px_rgba(46,125,50,0.3)] hover:shadow-[0_6px_20px_rgba(46,125,50,0.4)] hover:-translate-y-0.5 transition-all"
            >
              <span>Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-700 to-emerald-600 hover:from-primary-800 hover:to-emerald-700 text-white font-bold text-sm shadow-[0_4px_14px_rgba(46,125,50,0.3)] hover:shadow-[0_6px_20px_rgba(46,125,50,0.4)] hover:-translate-y-0.5 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 mx-4 p-5 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
          <div className="flex flex-col gap-1">
            {PUBLIC_NAV.map((n) => {
              const isActive = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-bold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-800 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Ecosystem Portals</div>
            <div className="grid grid-cols-3 gap-2">
              <a href="http://localhost:3002" target="_blank" rel="noreferrer" className="text-center p-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold">
                Mitra
              </a>
              <a href="http://localhost:3003" target="_blank" rel="noreferrer" className="text-center p-2 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold">
                Bio-Pellet
              </a>
              <a href="http://localhost:3004" target="_blank" rel="noreferrer" className="text-center p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                Lab
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-primary-700 text-white text-center font-bold text-base shadow-md flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 text-center font-bold text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-primary-700 text-white text-center font-bold text-sm shadow-md"
                >
                  Create Free Farmer Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
