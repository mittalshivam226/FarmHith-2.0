'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button, useToast } from '@farmhith/ui';
import { formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { MitraBooking } from '@farmhith/types';
import {
  Video, CalendarDays, CheckCircle2, FileText,
  Loader2, MessageSquare, Clock,
} from 'lucide-react';

export default function SoilmitraSessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, getToken } = useAuth();
  const toast = useToast();

  const bookingId = id as string;

  const [session, setSession] = useState<MitraBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  // Countdown state
  const [canJoin, setCanJoin] = useState(false);
  const [secondsUntilJoin, setSecondsUntilJoin] = useState(0);

  useEffect(() => {
    if (!bookingId) return;

    const unsub = onSnapshot(
      doc(db, 'mitraBookings', bookingId),
      (snap) => {
        if (!snap.exists()) {
          setError('Session not found');
          setLoading(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() } as MitraBooking;
        setSession(data);
        if (data.mitraNotes) {
          setNotes(data.mitraNotes);
          setNotesSaved(true);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [bookingId]);

  // Check if within 15 minutes of session
  useEffect(() => {
    if (!session || session.status !== 'CONFIRMED') return;

    const check = () => {
      let sessionTime: number;
      // Handle Firestore Timestamp or plain date
      const sd = session.sessionDatetime as any;
      if (sd?.toDate) {
        sessionTime = sd.toDate().getTime();
      } else {
        sessionTime = new Date(sd).getTime();
      }

      const now = Date.now();
      const diffSeconds = Math.floor((sessionTime - now) / 1000);
      const fifteenMinutes = 15 * 60;

      if (diffSeconds <= fifteenMinutes) {
        setCanJoin(true);
      } else {
        setCanJoin(false);
        setSecondsUntilJoin(diffSeconds - fifteenMinutes);
      }
    };

    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [session]);

  const handleSaveNotes = async () => {
    if (!bookingId || !notes.trim()) return;
    setSavingNotes(true);
    try {
      const idToken = await getToken();
      const res = await fetch(`/api/mitra/bookings/${bookingId}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ mitraNotes: notes }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save notes');
      }
      setNotesSaved(true);
      toast.show({ title: 'Notes Saved', message: 'Session notes have been recorded.', type: 'success' });
    } catch (err: any) {
      toast.show({ title: 'Error', message: err.message, type: 'error' });
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        {error ?? 'Session not found.'}
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  let sessionDateDisplay = '—';
  try {
    const sd = session.sessionDatetime as any;
    sessionDateDisplay = formatDate(sd?.toDate ? sd.toDate().toISOString() : sd);
  } catch {}

  const isCompleted = session.status === 'COMPLETED';
  const isConfirmed = session.status === 'CONFIRMED';

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title={`Session with ${session.farmerName}`}
        description={`Booking #${session.id.slice(0, 8)}`}
        action={<Button variant="outline" onClick={() => router.back()}>Back to Sessions</Button>}
      />

      {/* Hero Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xl shrink-0">
            {session.farmerName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{session.farmerName}</h2>
            <div className="flex items-center text-sm text-slate-500 gap-4 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <CalendarDays size={14} /> {sessionDateDisplay}
              </span>
              <StatusBadge status={session.status} size="sm" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConfirmed && session.videoRoomUrl && (
            <div className="flex flex-col items-end gap-1">
              {!canJoin && secondsUntilJoin > 0 && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={11} /> Joins in {formatCountdown(secondsUntilJoin)}
                </span>
              )}
              <a
                href={canJoin ? session.videoRoomUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  canJoin
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                <Video size={15} />
                {canJoin ? 'Join Session' : 'Join Session (Soon)'}
              </a>
            </div>
          )}
          {isConfirmed && !session.videoRoomUrl && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              Video room link pending
            </p>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 text-sm">
              <CheckCircle2 size={16} /> Completed
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Session Context */}
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-9 w-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <FileText size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Session Context</p>
              <p className="text-xs text-gray-500">Farmer's booking details</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start text-sm gap-4 pb-2 border-b border-gray-50">
              <span className="text-gray-500 shrink-0">Session Date</span>
              <span className="font-medium text-gray-900 text-right">{sessionDateDisplay}</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
              <span className="text-gray-500">Session Fee</span>
              <span className="font-bold text-green-700">₹{(session.amountPaid ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
              <span className="text-gray-500">Consent to Share Report</span>
              <span className={`font-medium ${session.farmerConsentedReport ? 'text-green-600' : 'text-gray-400'}`}>
                {session.farmerConsentedReport ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Status</span>
              <StatusBadge status={session.status} size="sm" />
            </div>
          </div>
        </Card>

        {/* Linked Soil Report */}
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-9 w-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <FileText size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Linked Soil Report</p>
              <p className="text-xs text-gray-500">Shared by farmer for this session</p>
            </div>
          </div>

          {session.farmerConsentedReport && session.linkedReportUrl ? (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
                <p className="font-medium">Farmer has shared their soil report for this session.</p>
              </div>
              <a
                href={session.linkedReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors"
              >
                <FileText size={14} /> View Report
              </a>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <FileText size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                {session.farmerConsentedReport
                  ? 'No report linked to this session.'
                  : 'Farmer has not shared a soil report.'}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Notes — only for completed sessions */}
      {isCompleted && (
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-9 w-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Session Notes</p>
              <p className="text-xs text-gray-500">Your consultation recommendations for the farmer</p>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              className="w-full h-32 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all"
              placeholder="Enter your agronomic recommendations, observations, and next steps for the farmer…"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesSaved(false);
              }}
            />
            <div className="flex items-center justify-between">
              {notesSaved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 size={13} /> Notes saved
                </span>
              )}
              {!notesSaved && <span />}
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes || !notes.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {savingNotes ? (
                  <><Loader2 size={13} className="animate-spin" /> Saving…</>
                ) : (
                  'Save Notes'
                )}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Pending / Upcoming info */}
      {session.status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm text-amber-800">
          <p className="font-medium">Booking Pending Confirmation</p>
          <p className="text-xs mt-1 text-amber-600">
            This booking is awaiting confirmation. You can confirm or manage it from your bookings list.
          </p>
        </div>
      )}
    </div>
  );
}
