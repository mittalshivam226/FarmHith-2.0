'use client';
import React, { useState, useEffect } from 'react';
import { Card, SectionHeader, Button, useToast } from '@farmhith/ui';
import { Clock, Calendar as CalendarIcon, Check, Copy, Loader2, CheckCircle2 } from 'lucide-react';
import { db, auth } from '@farmhith/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

// Convert day+time to a canonical string stored in availableSlots array
// Format: "mon:09:00 AM"
function makeSlotKey(dayId: string, slot: string): string {
  return `${dayId}:${slot}`;
}

export default function AvailabilityPage() {
  const toast = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false,
  });

  const [activeSlots, setActiveSlots] = useState<Record<string, string[]>>({
    mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
  });

  // Load current availability from Firestore
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      setUid(firebaseUser.uid);
      try {
        const snap = await getDoc(doc(db, 'soilmitraProfiles', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          const storedSlots: string[] = data.availableSlots ?? [];

          // Re-hydrate UI state from flat slot keys
          const newDays: Record<string, boolean> = {
            mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false,
          };
          const newSlots: Record<string, string[]> = {
            mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
          };

          storedSlots.forEach(key => {
            const [dayId, ...timeParts] = key.split(':');
            const slot = timeParts.join(':');
            if (dayId && DAYS.find(d => d.id === dayId)) {
              newDays[dayId] = true;
              if (!newSlots[dayId]) newSlots[dayId] = [];
              newSlots[dayId].push(slot);
            }
          });

          setActiveDays(newDays);
          setActiveSlots(newSlots);
        }
      } catch (e) {
        console.error('Failed to load availability:', e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const toggleDay = (dayId: string) => {
    setActiveDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
    setSaved(false);
  };

  const toggleSlot = (dayId: string, slot: string) => {
    setActiveSlots(prev => {
      const daySlots = prev[dayId] ?? [];
      if (daySlots.includes(slot)) {
        return { ...prev, [dayId]: daySlots.filter(s => s !== slot) };
      }
      return { ...prev, [dayId]: [...daySlots, slot] };
    });
    setSaved(false);
  };

  const copyToAll = (sourceDayId: string) => {
    const sourceSlots = activeSlots[sourceDayId] ?? [];
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
    setSaved(false);
  };

  const handleSave = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      // Flatten to array of "dayId:slot" strings for Firestore
      const availableSlots: string[] = [];
      DAYS.forEach(({ id: dayId }) => {
        if (activeDays[dayId]) {
          (activeSlots[dayId] ?? []).forEach(slot => {
            availableSlots.push(makeSlotKey(dayId, slot));
          });
        }
      });

      await updateDoc(doc(db, 'soilmitraProfiles', uid), { availableSlots });
      setSaved(true);
      toast.show({
        title: 'Availability Saved',
        message: `${availableSlots.length} time slot(s) saved to your profile.`,
        type: 'success',
      });
    } catch (err: any) {
      toast.show({ title: 'Error', message: err.message ?? 'Failed to save.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const totalSlots = DAYS.reduce((sum, { id }) =>
    activeDays[id] ? sum + (activeSlots[id]?.length ?? 0) : sum, 0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title="My Availability"
        description="Set the days and times you are available for farmer consultations."
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 size={13} /> Saved
              </span>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <><Loader2 size={14} className="animate-spin mr-2 inline" /> Saving…</>
              ) : 'Save Schedule'}
            </Button>
          </div>
        }
      />

      {/* Summary Bar */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm text-teal-800 font-medium">
          {totalSlots} time slot{totalSlots !== 1 ? 's' : ''} across{' '}
          {DAYS.filter(d => activeDays[d.id]).length} active day{DAYS.filter(d => activeDays[d.id]).length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-teal-600">Farmers can only book during selected slots</p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Weekly Schedule</h3>
            <p className="text-xs text-gray-500">Toggle days and select your available time slots.</p>
          </div>
        </div>

        <div className="space-y-6">
          {DAYS.map((day) => (
            <div key={day.id} className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Day Toggle */}
              <div className="w-full sm:w-40 flex items-center justify-between sm:justify-start gap-3 shrink-0 py-1">
                <button
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${
                    activeDays[day.id] ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={activeDays[day.id]}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                    activeDays[day.id] ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className={`font-medium text-sm ${activeDays[day.id] ? 'text-gray-900' : 'text-gray-400'}`}>
                  {day.label}
                </span>
              </div>

              {/* Time Slots */}
              <div className="flex-1">
                {activeDays[day.id] ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map(slot => {
                        const isSelected = activeSlots[day.id]?.includes(slot) ?? false;
                        return (
                          <button
                            key={slot}
                            type="button"
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
                    <div className="flex justify-end border-t border-gray-50 pt-2">
                      <button
                        type="button"
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

      {/* Timezone Note */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <Clock className="text-blue-600 mt-0.5 shrink-0" size={18} />
        <div>
          <p className="text-sm font-semibold text-gray-900">Timezone</p>
          <p className="text-xs text-gray-600 mt-1">
            All times are in Indian Standard Time (IST). Changes are saved directly to your profile and visible to farmers immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
