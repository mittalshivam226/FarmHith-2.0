'use client';
import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle = 'No results',
  emptyDescription,
  loading = false,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = (a as any)[sortKey] ?? '';
      const bv = (b as any)[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  if (!loading && data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap
                  ${col.sortable ? 'cursor-pointer select-none hover:text-slate-700' : ''}
                  ${col.className ?? ''}
                `}
                onClick={() => col.sortable && toggleSort(String(col.key))}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-slate-400">
                      {sortKey === String(col.key) ? (
                        sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : (
                        <ChevronsUpDown size={12} />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`
                transition-colors duration-100
                ${onRowClick ? 'cursor-pointer hover:bg-primary-50/50' : 'hover:bg-slate-50/50'}
              `}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 text-sm text-slate-700 whitespace-nowrap ${col.className ?? ''}`}
                >
                  {col.render
                    ? col.render(row)
                    : String((row as any)[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
