'use client';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface PageShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  className?: string;
}

export function PageShell({ children, sidebar, topbar, className = '' }: PageShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      {sidebar && (
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 z-20">
          {sidebar}
        </aside>
      )}

      {/* Mobile sidebar overlay */}
      {sidebar && mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 transition-opacity" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50 animate-in fade-in slide-in-from-left-4 duration-200">
            <div className="flex justify-end p-2 border-b border-slate-100">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* The actual sidebar content */}
            <div className="h-[calc(100%-49px)] overflow-y-auto">
              {sidebar}
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar Wrapper */}
        {(topbar || sidebar) && (
          <header className="bg-white border-b border-slate-200 z-10 shrink-0 h-14 md:h-16 flex items-center">
            <div className="flex items-center gap-3 px-4 w-full h-full">
              {sidebar && (
                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation menu"
                  className="md:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <Menu size={20} />
                </button>
              )}
              {topbar && <div className="flex-1 h-full">{topbar}</div>}
            </div>
          </header>
        )}
        
        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${className}`}>
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
