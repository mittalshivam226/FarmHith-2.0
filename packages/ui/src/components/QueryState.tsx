import React from 'react';
import { CardSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { Alert } from './Alert';
import { Button } from './Button';
import { RotateCcw } from 'lucide-react';

export interface QueryStateProps {
  loading: boolean;
  error?: string | null;
  empty: boolean;
  emptyProps: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
  };
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function QueryState({
  loading,
  error,
  empty,
  emptyProps,
  children,
  loadingFallback,
}: QueryStateProps) {
  if (error) {
    return (
      <div className="py-4">
        <Alert variant="error" title="Failed to load data">
          <div className="space-y-3">
            <p className="text-sm">The data couldn't be loaded. This might be a temporary network issue.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="bg-white hover:bg-red-50 text-red-600 border-red-200"
            >
              <RotateCcw size={14} className="mr-1.5" /> Try Again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (loading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (empty) {
    return <EmptyState {...emptyProps} />;
  }

  return <>{children}</>;
}
