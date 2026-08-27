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
  green:  { icon: 'bg-success-500/10 text-success-400 border border-success-500/20 shadow-glow-sm' },
  blue:   { icon: 'bg-info-500/10 text-info-400 border border-info-500/20 shadow-glow-sm' },
  amber:  { icon: 'bg-warning-500/10 text-warning-400 border border-warning-500/20 shadow-glow-sm' },
  purple: { icon: 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-glow-sm' },
  rose:   { icon: 'bg-error-500/10 text-error-400 border border-error-500/20 shadow-glow-sm' },
  teal:   { icon: 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-glow-sm' },
};

export function StatCard({ label, value, icon, trend, accent = 'teal', className = '' }: StatCardProps) {
  const { icon: iconCls } = accentMap[accent];
  return (
    <div className={`bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-700 shadow-sm p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-50 tabular-nums">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.positive ? 'text-success-600' : 'text-error-500'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-md ${iconCls}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
