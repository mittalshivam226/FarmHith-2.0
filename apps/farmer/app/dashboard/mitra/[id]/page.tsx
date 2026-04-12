'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Button, Textarea } from '@farmhith/ui';
import { Video, Phone, CheckCircle2, FileText, CalendarDays, User, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function MitraSessionLiveView() {
  const { id } = useParams();
  const [status, setStatus] = useState<'UPCOMING' | 'ACTIVE' | 'COMPLETED'>('UPCOMING');
  const [rating, setRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex bg-white items-center justify-between p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
            HK
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dr. Harpreet Kaur</h1>
            <div className="flex items-center text-sm text-slate-500 gap-4 mt-1">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> Agronomy Expert</span>
              <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Today, 10:00 AM (30 mins)</span>
            </div>
          </div>
        </div>
        <div>
          {status === 'UPCOMING' && (
            <div className="text-right">
              <p className="text-sm text-amber-600 font-medium mb-2">Starts in 10 mins</p>
              <Button onClick={() => setStatus('ACTIVE')} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Video className="w-4 h-4" /> Join Video Call
              </Button>
            </div>
          )}
          {status === 'ACTIVE' && (
            <Button variant="destructive" onClick={() => setStatus('COMPLETED')} className="gap-2">
              <Phone className="w-4 h-4" /> End Call
            </Button>
          )}
          {status === 'COMPLETED' && (
            <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" /> Session Completed
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Details provided by You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Crop Type</p>
              <p className="font-medium text-slate-900">Wheat (Triticum aestivum)</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Your Query Notes</p>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100 italic">
                "Yellowing of leaves visible across the entire north field for the last 5 days. Want to know if it's nutrient deficiency or disease."
              </p>
            </div>
          </CardContent>
        </Card>

        {status === 'COMPLETED' ? (
          <Card>
            <CardHeader>
              <CardTitle>Rate this Session</CardTitle>
            </CardHeader>
            <CardContent>
              {isRatingSubmitted ? (
                <div className="text-center py-6 space-y-2">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Thank you for your feedback!</h3>
                  <p className="text-sm text-slate-500">Your review helps improve the community.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                        <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea placeholder="Leave a review for Dr. Harpreet Kaur..." rows={3} />
                  <Button onClick={() => setIsRatingSubmitted(true)} disabled={rating === 0} className="w-full">
                    Submit Feedback
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle>Session Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-slate-500">
                You can rate and review this session after it has been completed.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
