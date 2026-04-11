'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ChevronRight } from 'lucide-react';
import { Avatar } from './Avatar';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface PortalSidebarProps {
  portalName: string;
  portalColor: string;   // Tailwind gradient class e.g. "from-green-600 to-emerald-700"
  navItems: NavItem[];
  user: { name: string; role: string; avatar?: string };
  onLogout?: () => void;
  logoIcon?: React.ReactNode;
}

export function PortalSidebar({
  portalName,
  portalColor,
  navItems,
  user,
  onLogout,
  logoIcon,
}: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`px-5 py-5 bg-gradient-to-br ${portalColor}`}>
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
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${
                  active
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <span
                className={`shrink-0 transition-colors ${
                  active ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {active && <ChevronRight size={14} className="text-green-500 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Avatar name={user.name} src={user.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
