'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import type { MitraBooking } from '@farmhith/types';
import {
  Video, User, CalendarDays, CheckCircle2, Star,
  Loader2, FileText, Phone, MessageSquare, ExternalLink,
} from 'lucide-react';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'COMPLETED'] as const;

function StatusTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Session Cancelled
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status as typeof STATUS_STEPS[number]);
  return (
    <div className="flex items-center">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'
              } ${active ? 'ring-4 ring-teal-100' : ''}`}>
                {done ? <CheckCircle2 size={14} /> : idx + 1}
              </div>
              <p className={`text-xs mt-1.5 font-medium whitespace-nowrap ${done ? 'text-teal-700' : 'text-gray-400'}`}>
                {step}
              </p>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${idx < currentIdx ? 'bg-teal-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function MitraSessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [session, setSession] = useState<MitraBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const bookingId = id as string;

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
        if (data.farmerRating) {
          setRating(data.farmerRating);
          setRatingSubmitted(true);
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

  const handleSubmitRating = async () => {
    if (!session || rating === 0) return;
    setSubmittingRating(true);
    setRatingError(null);
    try {
      await updateDoc(doc(db, 'mitraBookings', bookingId), { farmerRating: rating });
      setRatingSubmitted(true);
    } catch (err: any) {
      setRatingError('Could not submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-500">
          <p className="font-medium">{error ?? 'Session not found'}</p>
          <div className="mt-4">
            <Button onClick={() => router.back()} variant="outline">Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const canJoin = session.status === 'CONFIRMED' && !!session.videoRoomUrl;
  const isCompleted = session.status === 'COMPLETED';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SectionHeader
        title={`Session with ${session.mitraName}`}
        description={`Booking #${session.id.slice(0, 8).toUpperCase()}`}
        action={<Button variant="outline" onClick={() => router.push('/dashboard/mitra')}>Back to Sessions</Button>}
      />

      {/* Status timeline */}
      <Card>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Session Status</p>
        <StatusTimeline status={session.status} />
      </Card>

      {/* Hero card */}
      <div className="bg-white flex items-center justify-between p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xl">
            {session.mitraName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{session.mitraName}</h2>
            <div className="flex items-center text-sm text-slate-500 gap-4 mt-1 flex-wrap">
              <span className="flex items-center gap-1"><User size={14} /> Soil-Mitra Expert</span>
              <span className="flex items-center gap-1">
                <CalendarDays size={14} /> {formatDate(session.sessionDatetime)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={session.status} size="sm" />
          {canJoin && (
            <a
              href={session.videoRoomUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Video size={14} /> Join Session
            </a>
          )}
          {session.status === 'CONFIRMED' && !session.videoRoomUrl && (
            <div className="text-xs text-teal-700 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200">
              Video link will be shared by Mitra
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Session details */}
        <Card>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
            <div className="h-9 w-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <FileText size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Session Details</p>
              <p className="text-xs text-gray-500">What you submitted at booking</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Date & Time', value: formatDate(session.sessionDatetime) },
              { label: 'Crop Type', value: session.cropType ?? '—' },
              { label: 'Farm Details', value: session.farmDetails ?? '—' },
              { label: 'Session Fee', value: formatCurrency(session.amountPaid) },
              { label: 'Consent Given', value: session.farmerConsentedReport ? 'Report shared with Mitra' : 'No' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start text-sm border-b border-gray-50 pb-2 last:border-0">
                <span className="text-gray-500 shrink-0">{label}</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%] text-xs">{value}</span>
              </div>
            ))}
          </div>

          {/* Linked report */}
          {session.farmerConsentedReport && session.linkedReportUrl && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Shared Report</p>
              <a
                href={session.linkedReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink size={14} /> View Shared Report
              </a>
            </div>
          )}
        </Card>

        {/* Mitra notes or instructions */}
        {isCompleted ? (
          <Card>
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <div className="h-9 w-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Mitra's Notes</p>
                <p className="text-xs text-gray-500">Agronomist recommendations</p>
              </div>
            </div>

            {session.mitraNotes ? (
              <p className="text-sm text-gray-700 leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-100">
                {session.mitraNotes}
              </p>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No notes provided by Mitra.</p>
            )}

            {/* Rating section */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-3">Rate this Session</p>
              {ratingSubmitted ? (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 size={16} /> You rated this session {rating}/5 — thank you!
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                      >
                        <Star
                          size={30}
                          className={(hoveredRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                        />
                      </button>
                    ))}
                  </div>
                  {ratingError && <p className="text-xs text-red-600">{ratingError}</p>}
                  <Button
                    onClick={handleSubmitRating}
                    disabled={rating === 0 || submittingRating}
                    variant="primary"
                    className="w-full"
                  >
                    {submittingRating
                      ? <><Loader2 size={14} className="animate-spin mr-2 inline" />Submitting…</>
                      : 'Submit Rating'
                    }
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <div className="h-9 w-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Session Instructions</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              {session.status === 'PENDING' && (
                <p className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                  ⏳ Awaiting confirmation from the Soil-Mitra.
                </p>
              )}
              {session.status === 'CONFIRMED' && (
                <p className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-sm">
                  ✅ Session confirmed! Your Mitra will share the video call link before the session.
                </p>
              )}
              <p>• Make sure your camera and microphone are enabled before joining.</p>
              <p>• Join from a stable internet connection for the best experience.</p>
              <p>• Contact us at support@farmhith.com if you have any issues.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
