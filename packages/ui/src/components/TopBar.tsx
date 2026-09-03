'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { Avatar } from './Avatar';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

export interface TopBarProps {
  breadcrumbs?: BreadcrumbItem[];
  homeHref?: string;
  user?: {
    name: string;
    email?: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onProfileClick?: () => void;
  unreadNotifications?: number;
}

export function TopBar({
  breadcrumbs = [],
  homeHref = '/dashboard',
  user,
  onLogout,
  onProfileClick,
  unreadNotifications = 0,
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between w-full h-full">
      {/* Left side: Context & Breadcrumbs */}
      <div className="flex items-center min-w-0 flex-1 pr-4">
        <Breadcrumbs items={breadcrumbs} homeHref={homeHref} className="truncate" />
      </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          aria-label="Notifications"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0 border border-slate-200/80"
        >
          <Bell size={18} />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </Link>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Dropdown */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2.5 p-1 pr-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0 border border-transparent hover:border-slate-200"
            >
              <Avatar name={user.name} src={user.avatar} size="sm" />
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-[10px] font-semibold text-primary-700 uppercase tracking-wider leading-tight">
                  {user.role === 'FARMER' ? 'Kisan (Farmer)' : user.role}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-500 transition-transform duration-200 hidden md:block ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  {user.email && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                  )}
                </div>
                <div className="py-1">
                  {onProfileClick && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onProfileClick();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User size={16} className="text-slate-400" />
                      My Profile
                    </button>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="text-red-500" />
                      Log out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

