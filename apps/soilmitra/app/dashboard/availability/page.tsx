'use client';
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Toggle, useToast } from '@farmhith/ui';
import { Clock, Calendar as CalendarIcon, Check, Copy } from 'lucide-react';
import { useAuth } from '@farmhith/auth';

const DAYS = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false,
  });

  const [activeSlots, setActiveSlots] = useState<Record<string, string[]>>({
    mon: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    tue: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    wed: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    thu: ['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    fri: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    sat: [],
    sun: [],
  });

  const toggleDay = (dayId: string) => {
    setActiveDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const toggleSlot = (dayId: string, slot: string) => {
    setActiveSlots(prev => {
      const daySlots = prev[dayId] || [];
      if (daySlots.includes(slot)) {
        return { ...prev, [dayId]: daySlots.filter(s => s !== slot) };
      }
      return { ...prev, [dayId]: [...daySlots, slot].sort() }; // Simplified sorting for mock
    });
  };

  const copyToAll = (sourceDayId: string) => {
    const sourceSlots = activeSlots[sourceDayId] || [];
    setActiveSlots(prev => {
      const newSlots = { ...prev };
      Object.keys(activeDays).forEach(day => {
        if (activeDays[day]) {
          newSlots[day] = [...sourceSlots];
        }
      });
      return newSlots;
    });
    toast.show({
      title: 'Schedule Copied',
      message: `Copied ${sourceSlots.length} slots to all active days.`,
      type: 'info',
    });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.show({
        title: 'Availability Saved',
        message: 'Your consultation schedule has been updated successfully.',
        type: 'success',
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title="My Availability"
        description="Set the days and times you are available for farmer consultations."
        action={
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Schedule'}
          </Button>
        }
      />

      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
           <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
             <CalendarIcon size={20} />
           </div>
           <div>
             <h3 className="text-base font-bold text-gray-900">Weekly Schedule</h3>
             <p className="text-xs text-gray-500">Farmers can only book you during these selected time slots.</p>
           </div>
        </div>

        <div className="space-y-6">
          {DAYS.map((day) => (
            <div key={day.id} className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Day Toggle Column */}
              <div className="w-full sm:w-40 flex items-center justify-between sm:justify-start gap-3 shrink-0 py-1">
                <Toggle 
                  checked={activeDays[day.id]} 
                  onChange={() => toggleDay(day.id)} 
                />
                <span className={`font-medium text-sm ${activeDays[day.id] ? 'text-gray-900' : 'text-gray-400'}`}>
                  {day.label}
                </span>
              </div>

              {/* Time Slots Column */}
              <div className="flex-1">
                {activeDays[day.id] ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                       {TIME_SLOTS.map(slot => {
                         const isSelected = activeSlots[day.id]?.includes(slot);
                         return (
                           <button
                             key={slot}
                             onClick={() => toggleSlot(day.id, slot)}
                             className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 border ${
                               isSelected 
                                 ? 'bg-teal-50 border-teal-200 text-teal-700' 
                                 : 'bg-white border-gray-200 text-gray-600 hover:border-teal-300'
                             }`}
                           >
                             {isSelected && <Check size={12} />}
                             {slot}
                           </button>
                         );
                       })}
                    </div>
                    {/* Utility actions for the day */}
                    <div className="flex justify-end border-t border-gray-50 pt-2">
                       <button
                         onClick={() => copyToAll(day.id)}
                         className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-600 transition-colors"
                         title="Copy these time slots to all other active days"
                       >
                         <Copy size={12} />
                         Copy to all active
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-sm text-gray-400 italic bg-gray-50 rounded-lg px-4 border border-gray-100">
                    Unavailable
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sync Note */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
         <Clock className="text-blue-600 mt-0.5 shrink-0" size={18} />
         <div>
            <p className="text-sm font-semibold text-gray-900">Timezone Context</p>
            <p className="text-xs text-gray-600 mt-1">
              All times are shown in your local timezone (IST). Bookings are automatically adjusted for farmers if they are in a different region.
            </p>
         </div>
      </div>
    </div>
  );
}
