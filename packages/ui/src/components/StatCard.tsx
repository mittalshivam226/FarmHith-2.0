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
  green:  { icon: 'bg-green-50 text-green-600',  border: 'border-green-100' },
  blue:   { icon: 'bg-blue-50 text-blue-600',    border: 'border-blue-100' },
  amber:  { icon: 'bg-amber-50 text-amber-600',  border: 'border-amber-100' },
  purple: { icon: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  rose:   { icon: 'bg-rose-50 text-rose-600',    border: 'border-rose-100' },
  teal:   { icon: 'bg-teal-50 text-teal-600',    border: 'border-teal-100' },
};

export function StatCard({ label, value, icon, trend, accent = 'green', className = '' }: StatCardProps) {
  const { icon: iconCls } = accentMap[accent];
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl ${iconCls}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
