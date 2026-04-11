'use client';
import React from 'react';
import Link from 'next/link';
import { Card, SectionHeader, RatingStars, Badge, Avatar } from '@farmhith/ui';
import { formatCurrency } from '@farmhith/utils';
import { Users, Plus, Languages, Briefcase } from 'lucide-react';
import { mockSoilMitras, mockMitraBookings } from '../../../lib/mock-data';

export default function MitraPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Soil-Mitra Directory"
        description="Expert agronomists for personalised crop consultation"
        action={null}
      />

      {/* My upcoming sessions */}
      {mockMitraBookings.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Sessions</h2>
          <div className="space-y-3">
            {mockMitraBookings.map(session => (
              <Link key={session.id} href={`/dashboard/mitra/${session.id}`} className="block">
                <Card hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={session.mitraName} size="md" />
                      <div>
                        <p className="font-semibold text-gray-900">{session.mitraName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(session.sessionDatetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-400">{session.durationMinutes} min · {formatCurrency(session.amountPaid)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        session.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                        session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {session.status}
                      </span>
                      {session.farmerRating && <RatingStars value={session.farmerRating} size="sm" />}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Browse Mitras */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Find an Expert</h2>
        <div className="space-y-4">
          {mockSoilMitras.map(mitra => (
            <Card key={mitra.id} hover>
              <div className="flex items-start gap-4">
                <Avatar name={mitra.fullName} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{mitra.fullName}</h3>
                      <RatingStars value={mitra.rating} showValue count={mitra.totalSessions} size="sm" />
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-gray-500">Per session</p>
                      <p className="text-lg font-bold text-green-700">{formatCurrency(mitra.sessionFee)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{mitra.bio}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mitra.specialisation.map(spec => (
                      <Badge key={spec} variant="success" size="sm">{spec}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Languages size={12} />{mitra.languagesSpoken.join(', ')}</span>
                    <span className="flex items-center gap-1"><Briefcase size={12} />{mitra.totalSessions} sessions</span>
                  </div>

                  <Link
                    href={`/dashboard/mitra/book/${mitra.userId}`}
                    className="mt-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
                  >
                    <Users size={15} /> Book Session
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
