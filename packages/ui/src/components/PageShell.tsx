'use client';
import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  className?: string;
}

export function PageShell({ children, sidebar, topbar, className = '' }: PageShellProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      {sidebar && (
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100">
          {sidebar}
        </aside>
      )}
      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {topbar && (
          <header className="bg-white border-b border-gray-100 z-10">
            {topbar}
          </header>
        )}
        <main className={`flex-1 overflow-y-auto p-6 ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
