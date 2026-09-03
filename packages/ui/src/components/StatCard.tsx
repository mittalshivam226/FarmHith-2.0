'use client';
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: 'green' | 'blue' | 'amber' | 'purple' | 'rose' | 'teal';
  className?: string;
}

const accentMap = {
  green:  { icon: 'bg-primary-50 text-primary-700 border border-primary-200/80' },
  blue:   { icon: 'bg-sky-50 text-sky-700 border border-sky-200/80' },
  amber:  { icon: 'bg-amber-50 text-amber-700 border border-amber-200/80' },
  purple: { icon: 'bg-purple-50 text-purple-700 border border-purple-200/80' },
  rose:   { icon: 'bg-rose-50 text-rose-700 border border-rose-200/80' },
  teal:   { icon: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' },
};

export function StatCard({ label, value, icon, trend, accent = 'green', className = '' }: StatCardProps) {
  const { icon: iconCls } = accentMap[accent] ?? accentMap.green;
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{value}</p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend.positive ? 'text-primary-600' : 'text-rose-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl shrink-0 ${iconCls}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

