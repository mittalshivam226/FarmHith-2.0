'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, FlaskConical, Users, ShoppingBasket, User } from 'lucide-react';

interface PageShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  className?: string;
}

const mobileBottomNav = [
  { label: 'Home', href: '/dashboard', icon: <Home size={20} /> },
  { label: 'Soil Test', href: '/dashboard/soil-test', icon: <FlaskConical size={20} /> },
  { label: 'Soil-Mitra', href: '/dashboard/mitra', icon: <Users size={20} /> },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: <ShoppingBasket size={20} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={20} /> },
];

export function PageShell({ children, sidebar, topbar, className = '' }: PageShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#F8FAF5] text-slate-800 overflow-hidden font-sans">
      {/* Desktop sidebar */}
      {sidebar && (
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200/90 z-20 shadow-xs">
          {sidebar}
        </aside>
      )}

      {/* Mobile sidebar overlay */}
      {sidebar && mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 animate-in fade-in slide-in-from-left-4 duration-200 flex flex-col">
            <div className="flex justify-end p-2.5 border-b border-slate-100 bg-slate-50">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* The actual sidebar content */}
            <div className="flex-1 overflow-y-auto">
              {sidebar}
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar Wrapper */}
        {(topbar || sidebar) && (
          <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-10 shrink-0 h-14 md:h-16 flex items-center shadow-xs">
            <div className="flex items-center gap-3 px-4 w-full h-full">
              {sidebar && (
                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation menu"
                  className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200/80"
                >
                  <Menu size={18} />
                </button>
              )}
              {topbar && <div className="flex-1 h-full">{topbar}</div>}
            </div>
          </header>
        )}
        
        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 ${className}`}>
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar for Farmers */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 flex items-center justify-around shadow-lg">
          {mobileBottomNav.map((item) => {
            const active = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-medium transition-all ${
                  active
                    ? 'text-primary-700 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className={`p-1 rounded-lg transition-transform ${active ? 'bg-primary-50 text-primary-700 scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className="mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

