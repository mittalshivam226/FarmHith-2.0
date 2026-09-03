'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button, Badge } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import type { MitraBooking } from '@farmhith/types';
import {
  Video, User, CalendarDays, CheckCircle2, Star,
  Loader2, FileText, Phone, MessageSquare, ExternalLink, ArrowLeft, ShieldCheck
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Requested', desc: 'Awaiting Mitra confirmation' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Session scheduled & ready' },
  { key: 'COMPLETED', label: 'Finished', desc: 'Consultation concluded' },
] as const;

function StatusTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-sm font-semibold">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Session Cancelled
      </div>
    );
  }
  const stepKeys = STATUS_STEPS.map(s => s.key);
  const currentIdx = stepKeys.indexOf(status as any);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <div
            key={step.key}
            className={`p-3.5 rounded-2xl border transition-all ${
              active
                ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                : done
                ? 'bg-slate-50/80 border-slate-200'
                : 'bg-white border-slate-100 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                done ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {done ? <CheckCircle2 size={13} /> : idx + 1}
              </div>
              <span className={`text-xs font-bold ${done ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight pl-8.5">{step.desc}</p>
          </div>
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-slate-500">
        <p className="font-semibold text-slate-800">{error ?? 'Session not found'}</p>
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft size={15} className="inline mr-1" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const canJoin = session.status === 'CONFIRMED' && !!session.videoRoomUrl;
  const isCompleted = session.status === 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-800">
      <SectionHeader
        title={`Consultation with ${session.mitraName}`}
        description={`Session Reference #${session.id.slice(0, 8).toUpperCase()}`}
        action={
          <Button variant="outline" onClick={() => router.push('/dashboard/mitra')} className="gap-1.5">
            <ArrowLeft size={16} /> Back to Directory
          </Button>
        }
      />

      {/* Status timeline */}
      <Card className="bg-white border-slate-200/90 shadow-card">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Live Session Progression</p>
        <StatusTimeline status={session.status} />
      </Card>

      {/* Hero consultation card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center text-amber-800 font-extrabold text-xl shrink-0 shadow-xs">
            {session.mitraName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{session.mitraName}</h2>
              <Badge variant="harvest" size="sm">
                <ShieldCheck size={12} className="inline mr-1" /> Verified Agronomist
              </Badge>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-slate-500 gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <CalendarDays size={14} className="text-amber-600" /> {formatDate(session.sessionDatetime)}
              </span>
              <span>·</span>
              <span>{session.durationMinutes ?? 30} Minutes Video Call</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={session.status} size="md" />
          {canJoin && (
            <a
              href={session.videoRoomUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-all shadow-xs active:scale-95 animate-pulse"
            >
              <Video size={16} /> Join Video Room
            </a>
          )}
          {session.status === 'CONFIRMED' && !session.videoRoomUrl && (
            <div className="text-xs font-semibold text-amber-800 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200">
              Video room link will open shortly before time
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Session details */}
        <Card className="bg-white border-slate-200/90 shadow-card">
          <div className="flex items-center gap-3.5 mb-4 border-b border-slate-100 pb-3.5">
            <div className="h-10 w-10 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center text-sky-700">
              <FileText size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Consultation Information</p>
              <p className="text-xs text-slate-500">Submitted farm & crop details</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start border-b border-slate-50 pb-2">
              <span className="text-slate-500 text-xs">Date & Time</span>
              <span className="font-bold text-slate-800 text-right text-xs">{formatDate(session.sessionDatetime)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-slate-500 text-xs">Crop / Issue</span>
              <span className="font-bold text-slate-900 text-xs capitalize">{session.cropType ?? '—'}</span>
            </div>
            {session.farmDetails && (
              <div className="flex justify-between items-start border-b border-slate-50 pb-2 gap-4">
                <span className="text-slate-500 text-xs shrink-0">Field Details</span>
                <span className="font-medium text-slate-700 text-right text-xs leading-tight">{session.farmDetails}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 text-xs">Fee Paid</span>
              <span className="font-extrabold text-amber-800 text-base">{formatCurrency(session.amountPaid)}</span>
            </div>
          </div>

          {/* Linked report */}
          {session.farmerConsentedReport && session.linkedReportUrl && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-2">Attached Soil Report</p>
              <a
                href={session.linkedReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <ExternalLink size={13} /> View Shared Soil Report
              </a>
            </div>
          )}
        </Card>

        {/* Mitra notes or instructions */}
        {isCompleted ? (
          <Card className="bg-white border-slate-200/90 shadow-card">
            <div className="flex items-center gap-3.5 mb-4 border-b border-slate-100 pb-3.5">
              <div className="h-10 w-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Mitra's Prescription & Advice</p>
                <p className="text-xs text-slate-500">Expert recommendations after consultation</p>
              </div>
            </div>

            {session.mitraNotes ? (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70">
                {session.mitraNotes}
              </p>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No written prescription provided for this session.</p>
            )}

            {/* Rating section */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Rate Your Agronomist</p>
              {ratingSubmitted ? (
                <div className="flex items-center gap-2 text-primary-700 text-xs sm:text-sm font-bold bg-primary-50 p-3 rounded-xl border border-primary-100">
                  <CheckCircle2 size={16} /> You rated this session {rating} / 5 stars — thank you!
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-1.5 items-center justify-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform hover:scale-125 p-1"
                        title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                      >
                        <Star
                          size={28}
                          className={(hoveredRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                        />
                      </button>
                    ))}
                  </div>
                  {ratingError && <p className="text-xs text-red-600 font-semibold">{ratingError}</p>}
                  <Button
                    onClick={handleSubmitRating}
                    disabled={rating === 0 || submittingRating}
                    variant="primary"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    {submittingRating ? (
                      <><Loader2 size={14} className="animate-spin mr-2 inline" />Submitting…</>
                    ) : (
                      'Submit Agronomist Rating'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="bg-white border-slate-200/90 shadow-card">
            <div className="flex items-center gap-3.5 mb-4 border-b border-slate-100 pb-3.5">
              <div className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Consultation Guidelines</p>
                <p className="text-xs text-slate-500">How to prepare for your session</p>
              </div>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              {session.status === 'PENDING' && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  ⏳ <strong>Awaiting Confirmation:</strong> The Soil-Mitra will confirm availability shortly.
                </div>
              )}
              {session.status === 'CONFIRMED' && (
                <div className="p-3.5 bg-primary-50 border border-primary-200 rounded-xl text-primary-900 text-xs">
                  ✅ <strong>Consultation Confirmed:</strong> Keep your field or crop samples handy to show on video!
                </div>
              )}
              <ul className="space-y-2 text-xs text-slate-500 list-disc list-inside pt-1">
                <li>Check your camera and microphone beforehand.</li>
                <li>Connect from an area with good internet connectivity.</li>
                <li>Have your crop photos or fertilizer bags ready for advice.</li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

