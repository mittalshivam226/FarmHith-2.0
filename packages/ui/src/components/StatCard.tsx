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
  green:  { icon: 'bg-success-50 text-success-600' },
  blue:   { icon: 'bg-info-50 text-info-600' },
  amber:  { icon: 'bg-warning-50 text-warning-600' },
  purple: { icon: 'bg-purple-50 text-purple-600' },
  rose:   { icon: 'bg-error-50 text-error-600' },
  teal:   { icon: 'bg-primary-50 text-primary-500' },
};

export function StatCard({ label, value, icon, trend, accent = 'teal', className = '' }: StatCardProps) {
  const { icon: iconCls } = accentMap[accent];
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
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
