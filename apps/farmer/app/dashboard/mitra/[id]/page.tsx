'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@farmhith/auth';
import { Card, SectionHeader, StatusBadge, Button, useToast } from '@farmhith/ui';
import { formatCurrency, formatDate } from '@farmhith/utils';
import { db } from '@farmhith/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { MitraBooking } from '@farmhith/types';
import {
  Video, User, CalendarDays, CheckCircle2, Star,
  Loader2, FileText, Phone, MessageSquare,
} from 'lucide-react';

export default function MitraSessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, getToken } = useAuth();
  const toast = useToast();

  const [session, setSession] = useState<MitraBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  const [joiningRoom, setJoiningRoom] = useState(false);

  const bookingId = id as string;

  useEffect(() => {
    if (!bookingId) return;
    (async () => {
      const snap = await getDoc(doc(db, 'mitraBookings', bookingId));
      if (!snap.exists()) {
        setNotFound(true);
      } else {
        const data = { id: snap.id, ...snap.data() } as MitraBooking;
        setSession(data);
        if (data.farmerRating) {
          setRating(data.farmerRating);
          setRatingSubmitted(true);
        }
      }
      setLoading(false);
    })();
  }, [bookingId]);

  const handleJoinCall = async () => {
    if (!session || !user) return;
    if (session.videoRoomUrl) {
      window.open(session.videoRoomUrl, '_blank');
      return;
    }
    // Request room creation via farmer API
    setJoiningRoom(true);
    try {
      const idToken = await getToken();
      const res = await fetch('/api/mitra/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) throw new Error('Failed to create room');
      const { videoRoomUrl } = await res.json();
      window.open(videoRoomUrl, '_blank');
      setSession(s => s ? { ...s, videoRoomUrl } : s);
    } catch {
      toast.show({ title: 'Error', message: 'Could not create video room. Try again.', type: 'error' });
    } finally {
      setJoiningRoom(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!session || rating === 0) return;
    setSubmittingRating(true);
    try {
      await updateDoc(doc(db, 'mitraBookings', bookingId), { farmerRating: rating });
      setRatingSubmitted(true);
      toast.show({ title: 'Rating Submitted', message: 'Thank you for your feedback!', type: 'success' });
    } catch {
      toast.show({ title: 'Error', message: 'Could not submit rating.', type: 'error' });
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Loader2 size={28} className="animate-spin text-gray-400" /></div>;
  if (notFound || !session) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Session not found.
        <div className="mt-4"><Button onClick={() => router.back()} variant="outline">Go Back</Button></div>
      </div>
    );
  }

  const canJoin = session.status === 'CONFIRMED';
  const isCompleted = session.status === 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title={`Session with ${session.mitraName}`}
        description={`Booking #${session.id.slice(0, 8)}`}
        action={<Button variant="outline" onClick={() => router.back()}>Back to Sessions</Button>}
      />

      {/* Hero status card */}
      <div className="flex bg-white items-center justify-between p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
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
            <Button
              onClick={handleJoinCall}
              disabled={joiningRoom}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 !text-white"
            >
              {joiningRoom ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
              {joiningRoom ? 'Setting up…' : session.videoRoomUrl ? 'Join Call' : 'Start Video Call'}
            </Button>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 text-sm">
              <CheckCircle2 size={16} /> Completed
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
              { label: 'Crop Type', value: session.cropType ?? '—' },
              { label: 'Farm Details', value: session.farmDetails ?? '—' },
              { label: 'Duration', value: `${session.durationMinutes ?? 30} minutes` },
              { label: 'Session Fee', value: formatCurrency(session.amountPaid) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start text-sm border-b border-gray-50 pb-2 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Mitra notes or rating */}
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
              <p className="text-sm text-gray-400 text-center py-4">No notes provided.</p>
            )}

            {/* Rating section */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-3">Rate this Session</p>
              {ratingSubmitted ? (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 size={16} /> Rating submitted — thank you!
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                        <Star
                          size={28}
                          className={rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                        />
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleSubmitRating}
                    disabled={rating === 0 || submittingRating}
                    variant="primary"
                    className="w-full"
                  >
                    {submittingRating ? <><Loader2 size={14} className="animate-spin mr-2 inline" /> Submitting…</> : 'Submit Rating'}
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
              <p>• Make sure your camera and microphone are enabled before joining.</p>
              <p>• The video room link will be generated when you click <strong>"Start Video Call"</strong>.</p>
              <p>• The room expires 4 hours after creation.</p>
              <p>• Join from a stable internet connection for the best experience.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
