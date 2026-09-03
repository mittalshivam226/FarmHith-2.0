'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface PortalSidebarProps {
  portalName: string;
  portalColor?: string;
  navItems: NavItem[];
  logoIcon?: React.ReactNode;
}

export function PortalSidebar({
  portalName,
  portalColor = 'bg-primary-700',
  navItems,
  logoIcon,
}: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Header */}
      <div className={`px-5 py-5 ${portalColor} text-white shadow-sm`}>
        <div className="flex items-center gap-3">
          {logoIcon && (
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0 backdrop-blur-sm">
              {logoIcon}
            </div>
          )}
          <div>
            <p className="text-[11px] font-bold text-white/80 tracking-widest uppercase leading-none">FarmHith 2.0</p>
            <p className="text-base font-bold text-white leading-tight mt-0.5">{portalName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${
                  active
                    ? 'bg-primary-50 text-primary-800 font-semibold border border-primary-200/80 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }
              `}
            >
              <span
                className={`shrink-0 transition-colors ${
                  active ? 'text-primary-700' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto text-xs font-bold bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Support Info */}
      <div className="p-4 m-3 bg-slate-50 border border-slate-200/80 rounded-xl">
        <p className="text-xs font-bold text-slate-800">Need Assistance?</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Toll-free Kisan Helpline</p>
        <p className="text-xs font-bold text-primary-700 mt-1">1800-FARM-HITH</p>
      </div>
    </div>
  );
}

