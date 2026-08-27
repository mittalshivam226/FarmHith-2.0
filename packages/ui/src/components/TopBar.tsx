'use client';
import React, { useState, useEffect, useRef } from 'react';
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
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button aria-label="Notifications" className="relative p-1.5 md:p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-full transition-colors shrink-0">
          <Bell size={18} className="md:w-5 md:h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 h-2 w-2 rounded-full bg-error-500 ring-2 ring-slate-800" />
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-700" />

        {/* User Dropdown */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 md:gap-2.5 p-1 pr-1.5 md:pr-2 rounded-full hover:bg-slate-700 transition-colors shrink-0"
            >
              <Avatar name={user.name} src={user.avatar} size="sm" />
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-semibold text-slate-200 leading-tight">
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider leading-tight">
                  {user.role}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 hidden md:block ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
                  {user.email && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                  )}
                </div>
                <div className="py-1">
                  {onProfileClick && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onProfileClick();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <LogOut size={16} className="text-error-500" />
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
