'use client';
import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';

export type TimelineStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TimelineStep {
  label: string;
  description?: string;
  status: TimelineStatus;
  timestamp?: string;
}

const stepConfig: Record<TimelineStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  PENDING:     { icon: <Clock size={14} />,        color: 'text-amber-600',  bg: 'bg-amber-100' },
  ACCEPTED:    { icon: <CheckCircle size={14} />,  color: 'text-blue-600',   bg: 'bg-blue-100' },
  IN_PROGRESS: { icon: <Loader2 size={14} className="animate-spin" />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  COMPLETED:   { icon: <CheckCircle size={14} />,  color: 'text-green-600',  bg: 'bg-green-100' },
  CANCELLED:   { icon: <XCircle size={14} />,      color: 'text-red-600',    bg: 'bg-red-100' },
};

interface BookingTimelineProps {
  steps: TimelineStep[];
  currentStatus: TimelineStatus;
}

const order: TimelineStatus[] = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

export function BookingTimeline({ steps, currentStatus }: BookingTimelineProps) {
  const activeIndex = currentStatus === 'CANCELLED' ? -1 : order.indexOf(currentStatus);

  return (
    <ol className="relative space-y-0">
      {steps.map((step, i) => {
        const cfg = stepConfig[step.status];
        const isLast = i === steps.length - 1;
        const isDone =
          step.status === 'COMPLETED' ||
          (currentStatus !== 'CANCELLED' && order.indexOf(step.status) <= activeIndex);

        return (
          <li key={i} className="flex gap-4">
            {/* Line + dot column */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  z-10 flex items-center justify-center h-7 w-7 rounded-full flex-shrink-0
                  ${isDone ? `${cfg.bg} ${cfg.color}` : 'bg-gray-100 text-gray-400'}
                `}
              >
                {cfg.icon}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 my-1 ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
            {/* Content */}
            <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-medium ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              )}
              {step.timestamp && (
                <p className="text-xs text-gray-400 mt-0.5">{step.timestamp}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
