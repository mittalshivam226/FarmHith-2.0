'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import WebsiteNav from '../components/WebsiteNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    // Role guard — only farmers allowed in this section
    if (!isLoading && user && user.role !== 'FARMER') {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="app-shell">
      <WebsiteNav />
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} FarmHith Technologies Pvt. Ltd.</p>
        <div className="app-footer-links">
          <a href="/">Home</a>
          <a href="/features">Features</a>
          <a href="/about">About</a>
        </div>
      </footer>
    </div>
  );
}
