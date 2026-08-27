'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Avatar } from './Avatar';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface PortalSidebarProps {
  portalName: string;
  portalColor: string;
  navItems: NavItem[];
  logoIcon?: React.ReactNode;
}

export function PortalSidebar({
  portalName,
  portalColor,
  navItems,
  logoIcon,
}: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`px-5 py-5 ${portalColor}`}>
        <div className="flex items-center gap-3">
          {logoIcon && (
            <div className="h-8 w-8 flex items-center justify-center text-white">
              {logoIcon}
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-white/70 leading-none">FarmHith</p>
            <p className="text-sm font-bold text-white leading-tight">{portalName}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                transition-colors duration-100 group
                ${
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <span
                className={`shrink-0 transition-colors ${
                  active ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto text-xs font-semibold bg-primary-50 text-primary-600 px-2 py-0.5 rounded-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
